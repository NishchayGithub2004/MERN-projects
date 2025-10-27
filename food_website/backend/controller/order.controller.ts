import { Request, Response } from "express"; // import Request and Response types from express to type incoming requests and outgoing responses
import { Restaurant } from "../models/restaurant.model"; // import Restaurant model to access restaurant data if needed
import { Order } from "../models/order.model"; // import Order model to interact with the order collection in the database
import Stripe from "stripe"; // import Stripe library to handle payment-related operations

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // initialize a Stripe instance using the secret key from environment variables, asserting non-null with '!'

type CheckoutSessionRequest = { // define a TypeScript type representing the structure of a checkout session request
    // define the cartItems array containing details of each item in the user's cart, and specify the following fields
    cartItems: {
        menuId: string; // ID of the menu item in the database
        name: string; // name of the menu item
        image: string; // image URL of the menu item
        price: number; // unit price of the menu item
        quantity: number; // number of units ordered for this item
    }[],
    
    // define deliveryDetails object containing information about the delivery recipient, with the following fields
    deliveryDetails: {
        name: string; // recipient's full name
        email: string; // recipient's email address
        address: string; // street address for delivery
        city: string; // city where the order should be delivered
    },
    
    restaurantId: string // unique ID of the restaurant from which the order is placed
}

export const getOrders = async (req: Request, res: Response) => { // define an asynchronous function to retrieve all orders placed by the current user
    try { // begin try block to safely handle database and runtime errors
        const orders = await Order.find({ user: (req as any).id }) // find all orders associated with the authenticated user's ID
            .populate('user') // populate the user field to include full user details instead of just the ObjectId
            .populate('restaurant'); // populate the restaurant field with restaurant details for each order

        return res.status(200).json({ // return a 200 OK response when orders are successfully retrieved
            success: true, // indicate success in the response
            orders // include the list of orders in the response body
        });
    } catch (error) { // catch any errors during the query or execution
        console.log(error); // log the error to the console for debugging
        return res.status(500).json({ success: false, message: "Internal server error" }); // return a 500 Internal Server Error response if an error occurs
    }
}

export const createCheckoutSession = async (req: Request, res: Response) => { // define an asynchronous function to create a Stripe checkout session for an order
    try { // start try block to handle potential errors during the checkout process
        const checkoutSessionRequest: CheckoutSessionRequest = req.body; // extract and type the incoming checkout session data from the request body

        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId) // find the restaurant by its ID from the request
            .populate('menus'); // populate its menus to access full menu details for building line items

        if (!restaurant) { // check if the restaurant was not found in the database
            return res.status(404).json({ // return 404 Not Found if no restaurant exists for the provided ID
                success: false, // indicate failure in the response
                message: "Restaurant not found." // provide a descriptive error message
            })
        };

        // create a new order document to record the user's purchase intent
        const order: any = new Order({
            restaurant: restaurant._id, // reference to the restaurant from which the order is placed
            user: (req as any).id, // ID of the currently authenticated user placing the order
            deliveryDetails: checkoutSessionRequest.deliveryDetails, // delivery details from the client request
            cartItems: checkoutSessionRequest.cartItems, // items being purchased in the order
            status: "pending" // initial status of the order before payment confirmation
        });

        const menuItems = restaurant.menus; // store all the restaurant's menu items for easier access when building line items

        const lineItems = createLineItems(checkoutSessionRequest, menuItems); // call helper function to convert cart items into Stripe-compatible line item objects

        // create a new checkout session on Stripe to handle payment securely
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // allow only card payments in the checkout session
            shipping_address_collection: { // define allowed shipping destinations
                allowed_countries: ['GB', 'US', 'CA'] // list of countries where shipping is permitted
            },
            line_items: lineItems, // include prepared line items representing ordered menu items
            mode: 'payment', // specify payment mode to indicate a one-time transaction
            success_url: `${process.env.FRONTEND_URL}/order/status`, // redirect URL after successful payment
            cancel_url: `${process.env.FRONTEND_URL}/cart`, // redirect URL if payment is canceled
            metadata: { // attach metadata for backend reference after checkout completion
                orderId: order._id.toString(), // include order ID for identification after payment
                images: JSON.stringify(menuItems.map((item: any) => item.image)) // include JSON string of image URLs for Stripe dashboard display
            }
        });

        if (!session.url) { // check if Stripe session URL was not generated successfully
            return res.status(400).json({ success: false, message: "Error while creating session" }); // return a 400 Bad Request response if session creation failed
        }

        await order.save(); // save the newly created order document to the database

        return res.status(200).json({ // return a 200 OK response with the Stripe session object
            session // include the created session for frontend redirection to Stripe checkout
        });
    } catch (error) { // catch any unexpected errors during the process
        console.log(error); // log the error for debugging purposes
        return res.status(500).json({ message: "Internal server error" }) // return 500 Internal Server Error response
    }
}

export const stripeWebhook = async (req: Request, res: Response) => { // define an asynchronous function to handle incoming Stripe webhook events
    let event: Stripe.Event; // declare a variable to store the verified Stripe event after signature validation

    try { // start try block to verify the webhook event authenticity
        const signature = req.headers["stripe-signature"]; // extract the Stripe signature from incoming request headers for event verification

        const payloadString = JSON.stringify(req.body, null, 2); // stringify the incoming request body to match Stripe’s expected format for verification
        
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET!; // retrieve the webhook secret from environment variables and assert non-null

        // generate a Stripe test header using the payload and secret, for use in constructing the verified event
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString, // include the JSON payload for verification
            secret, // include the secret key for signature generation
        });

        event = stripe.webhooks.constructEvent(payloadString, header, secret); // construct and verify the Stripe event using payload, header, and secret
    } catch (error: any) { // catch errors that occur during verification
        console.error('Webhook error:', error.message); // log the specific webhook error for debugging
        return res.status(400).send(`Webhook error: ${error.message}`); // return 400 Bad Request if verification fails
    }

    if (event.type === "checkout.session.completed") { // check if the verified event corresponds to a successful checkout completion
        try { // start inner try block to handle post-payment operations
            const session = event.data.object as Stripe.Checkout.Session; // extract the checkout session object from the event data and cast its type

            const order = await Order.findById(session.metadata?.orderId); // find the order in the database using the order ID stored in session metadata

            if (!order) { // check if no corresponding order was found
                return res.status(404).json({ message: "Order not found" }); // return 404 Not Found response if the order does not exist
            }

            if (session.amount_total) { // check if total payment amount exists in the session
                order.totalAmount = session.amount_total; // update the order’s total amount field with the confirmed payment total
            }
            
            order.status = "confirmed"; // mark the order status as confirmed since payment was completed

            await order.save(); // save the updated order document to persist payment confirmation in the database
        } catch (error) { // catch errors during post-payment handling
            console.error('Error handling event:', error); // log the error for debugging
            return res.status(500).json({ message: "Internal Server Error" }); // return 500 Internal Server Error response if processing fails
        }
    }
    
    res.status(200).send(); // send a 200 OK response to acknowledge receipt of the webhook event
};

export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => { // define a function to generate Stripe line items from the cart items and restaurant menu
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => { // iterate over each item in the user's cart and transform it into a Stripe line item object
        const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId); // find the corresponding menu item from the restaurant's menu list by comparing menuId with item._id

        if (!menuItem) throw new Error(`Menu item id not found`); // if no matching menu item is found, throw an error to indicate invalid cart data

        // return a Stripe line item object representing one purchased menu item
        return {
            // define price_data for Stripe to calculate item cost and display details
            price_data: {
                currency: 'inr', // set transaction currency to Indian Rupees
                product_data: { // define metadata for the product being purchased
                    name: menuItem.name, // name of the menu item
                    images: [menuItem.image], // array containing the menu item's image URL
                },
                unit_amount: menuItem.price * 100 // specify price in the smallest currency unit (paise) since Stripe requires amounts in subunits
            },
            quantity: cartItem.quantity, // number of units of this menu item being purchased
        }
    })
    
    return lineItems; // return the array of formatted Stripe line items for checkout session creation
}
