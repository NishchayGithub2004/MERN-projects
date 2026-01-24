import paypal from "paypal-rest-sdk"; // import PayPal SDK to create and manage PayPal payments
import Order from "../../models/Order"; // import Order model to interact with Order collection in database
import Cart from "../../models/Cart"; // import Cart model to interact with Cart collection in database
import Product from "../../models/Product"; // import Product model to interact with Product collection in database

const createOrder = async (req, res) => { // define async function createOrder with req and res as arguments
    try { // start try block to handle potential errors
        const { userId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId, cartId } = req.body; // extract all order details from request body using object destructuring

        const create_payment_json = { // define PayPal payment object
            intent: "sale", // set payment intent to sale
            payer: { // define payer information
                payment_method: "paypal", // payment method set to PayPal
            },
            redirect_urls: { // define URLs to redirect after payment
                return_url: "http://localhost:5173/shop/paypal-return", // redirect on successful payment
                cancel_url: "http://localhost:5173/shop/paypal-cancel", // redirect on payment cancellation
            },
            transactions: [ // define transaction details
                {
                    item_list: { // list of items in the transaction
                        items: cartItems.map((item) => ({ // map cartItems to PayPal format
                            name: item.title, // item title
                            sku: item.productId, // product ID as SKU
                            price: item.price.toFixed(2), // item price formatted to 2 decimal places
                            currency: "USD", // currency
                            quantity: item.quantity, // item quantity
                        })),
                    },
                    amount: { // define total amount for the transaction
                        currency: "USD", // currency
                        total: totalAmount.toFixed(2), // total amount formatted to 2 decimal places
                    },
                    description: "description", // transaction description
                },
            ],
        };

        paypal.payment.create(create_payment_json, async (error, paymentInfo) => { // create PayPal payment asynchronously
            if (error) { // check if error occurs during payment creation
                console.log(error); // log error for debugging

                return res.status(500).json({ // send response with status 500 (internal server error) if payment creation fails
                    success: false, // indicate operation failed
                    message: "Error while creating paypal payment", // include error message
                });
            } else { // if payment creation succeeds
                const newlyCreatedOrder = new Order({ userId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId }); // create new Order instance with extracted data

                await newlyCreatedOrder.save(); // save new order to database asynchronously

                const approvalURL = paymentInfo.links.find((link) => link.rel === "approval_url").href; // extract approval URL from PayPal response

                res.status(201).json({ // send response with status 201 (created) and JSON data
                    success: true, // indicate operation was successful
                    approvalURL, // include approval URL in response
                    orderId: newlyCreatedOrder._id, // include newly created order ID in response
                });
            }
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured!", // include generic error message
        });
    }
};

const capturePayment = async (req, res) => { // define async function capturePayment with req and res as arguments
    try { // start try block to handle potential errors
        const { paymentId, payerId, orderId } = req.body; // extract paymentId, payerId, and orderId from request body

        let order = await Order.findById(orderId); // fetch order by orderId asynchronously

        if (!order) { // check if order was not found
            return res.status(404).json({ // send response with status 404 (not found) if order is missing
                success: false, // indicate operation failed
                message: "Order can not be found", // include message for missing order
            });
        }

        order.paymentStatus = "paid"; // update order payment status to paid
        order.orderStatus = "confirmed"; // update order status to confirmed
        order.paymentId = paymentId; // store PayPal paymentId
        order.payerId = payerId; // store PayPal payerId

        for (let item of order.cartItems) { // iterate through all items in order
            let product = await Product.findById(item.productId); // fetch product by productId asynchronously

            if (!product) { // check if product was not found
                return res.status(404).json({ // send response with status 404 (not found) if product is missing
                    success: false, // indicate operation failed
                    message: `Not enough stock for this product ${product.title}`, // include message for missing stock
                });
            }

            product.totalStock -= item.quantity; // reduce product stock by quantity purchased

            await product.save(); // save updated product stock asynchronously
        }

        const getCartId = order.cartId; // store cartId from order

        await Cart.findByIdAndDelete(getCartId); // delete cart after order is confirmed asynchronously

        await order.save(); // save updated order details asynchronously

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            message: "Order confirmed", // include success message
            data: order, // include updated order in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured!", // include generic error message
        });
    }
};

const getAllOrdersByUser = async (req, res) => { // define async function getAllOrdersByUser with req and res as arguments
    try { // start try block to handle potential errors
        const { userId } = req.params; // extract userId from request parameters

        const orders = await Order.find({ userId }); // fetch all orders for given userId asynchronously

        if (!orders.length) { // check if no orders exist
            return res.status(404).json({ // send response with status 404 (not found) if no orders exist
                success: false, // indicate operation failed
                message: "No orders found!", // include message for missing orders
            });
        }

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: orders, // include fetched orders in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured!", // include generic error message
        });
    }
};

const getOrderDetails = async (req, res) => { // define async function getOrderDetails with req and res as arguments
    try { // start try block to handle potential errors
        const { id } = req.params; // extract order id from request parameters

        const order = await Order.findById(id); // fetch order by id asynchronously

        if (!order) { // check if order was not found
            return res.status(404).json({ // send response with status 404 (not found) if order is missing
                success: false, // indicate operation failed
                message: "Order not found!", // include message for missing order
            });
        }

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: order, // include fetched order in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured!", // include generic error message
        });
    }
};

module.exports = { createOrder, capturePayment, getAllOrdersByUser, getOrderDetails }; // export all functions as named exports
