import { Request, Response } from "express"; // import Request and Response types from express to type the request and response objects
import { Restaurant } from "../models/restaurant.model"; // import the Restaurant model to interact with the restaurants collection in the database
import uploadImageOnCloudinary from "../utils/imageUpload"; // import the utility function to upload images to Cloudinary
import { Order } from "../models/order.model"; // import the Order model (not used in this function but imported for potential future use)

export const createRestaurant = async (req: Request, res: Response) => { // define an async function to create a new restaurant with typed req and res
    try { // start try block to catch and handle errors
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body; // destructure required fields from the request body

        const file = (req as any).file; // extract uploaded file from request, cast req as any to access file property

        const restaurant = await Restaurant.findOne({ user: (req as any).id }); // query the database to check if a restaurant already exists for this user using user ID from req

        if (restaurant) { // check if a restaurant already exists for this user
            return res.status(400).json({ // return HTTP 400 if restaurant exists
                success: false, // indicate operation was unsuccessful
                message: "Restaurant already exist for this user" // provide descriptive error message
            })
        }

        if (!file) { // check if no file was uploaded
            return res.status(400).json({ // return HTTP 400 if image is missing
                success: false, // indicate operation was unsuccessful
                message: "Image is required" // provide descriptive error message
            })
        }

        const imageUrl = await uploadImageOnCloudinary(file as any); // upload the file to Cloudinary and store the returned URL, cast file as any

        await Restaurant.create({ // create a new restaurant document in the database and specify the following fields
            user: (req as any).id, // user ID from the request
            restaurantName, // restaurant name from request body
            city, // city from request body
            country, // country from request body
            deliveryTime, // delivery time from request body
            cuisines: JSON.parse(cuisines), // cuisines array parsed from request body
            imageUrl // uploaded image URL
        });        

        return res.status(201).json({ // return HTTP 201 on successful creation
            success: true, // indicate operation was successful
            message: "Restaurant Added" // provide success message
        });
    } catch (error) { // catch any errors that occur in try block
        console.log(error); // log the error to console for debugging
        return res.status(500).json({ message: "Internal server error" }) // return HTTP 500 with generic error message
    }
}

export const getRestaurant = async (req: Request, res: Response) => { // define async function to fetch a restaurant for the current user
    try { // start try block to handle potential errors
        const restaurant = await Restaurant.findOne({ user: (req as any).id }).populate('menus'); // find restaurant by user ID and populate related menus

        if (!restaurant) { // check if restaurant was not found
            return res.status(404).json({ // return HTTP 404 if not found
                success: false, // indicate failure
                restaurant: [], // return empty array for consistency
                message: "Restaurant not found" // provide descriptive message
            })
        };

        return res.status(200).json({ success: true, restaurant }); // return HTTP 200 with restaurant data
    } catch (error) { // catch any errors that occur
        console.log(error); // log the error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}

export const updateRestaurant = async (req: Request, res: Response) => { // define async function to update restaurant details
    try { // start try block
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body; // destructure updated fields from request body

        const file = (req as any).file; // get uploaded image file if present

        const restaurant = await Restaurant.findOne({ user: (req as any).id }); // find restaurant by user ID

        if (!restaurant) { // check if restaurant does not exist
            return res.status(404).json({ // return HTTP 404 if not found
                success: false, // indicate failure
                message: "Restaurant not found" // provide descriptive message
            })
        };

        // update restaurant fields
        restaurant.restaurantName = restaurantName; // update name
        restaurant.city = city; // update city
        restaurant.country = country; // update country
        restaurant.deliveryTime = deliveryTime; // update delivery time
        restaurant.cuisines = JSON.parse(cuisines); // parse and update cuisines array

        if (file) { // check if new image was uploaded
            const imageUrl = await uploadImageOnCloudinary(file as any); // upload image to Cloudinary
            restaurant.imageUrl = imageUrl; // update image URL in restaurant
        }

        await restaurant.save(); // save updated restaurant document to database

        return res.status(200).json({ // return HTTP 200 on success
            success: true, // indicate success
            message: "Restaurant updated", // provide success message
            restaurant // include updated restaurant data
        })
    } catch (error) { // catch any errors
        console.log(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}

export const getRestaurantOrder = async (req: Request, res: Response) => { // define async function to fetch orders for a restaurant
    try { // start try block
        const restaurant = await Restaurant.findOne({ user: (req as any).id }); // find restaurant by user ID

        if (!restaurant) { // check if restaurant does not exist
            return res.status(404).json({ // return HTTP 404 if not found
                success: false, // indicate failure
                message: "Restaurant not found" // provide descriptive message
            })
        };

        const orders = await Order.find({ restaurant: restaurant._id }).populate('restaurant').populate('user'); // fetch all orders for this restaurant and populate related restaurant and user data

        return res.status(200).json({ // return HTTP 200 with orders
            success: true, // indicate success
            orders // include orders array
        });
    } catch (error) { // catch any errors
        console.log(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}

export const updateOrderStatus = async (req: Request, res: Response) => { // define async function to update order status
    try { // start try block
        const { orderId } = req.params; // extract order ID from request parameters

        const { status } = req.body; // extract new status from request body

        const order = await Order.findById(orderId); // find order by ID

        if (!order) { // check if order does not exist
            return res.status(404).json({ // return HTTP 404 if not found
                success: false, // indicate failure
                message: "Order not found" // provide descriptive message
            })
        }

        order.status = status; // update order status

        await order.save(); // save updated order document to database

        return res.status(200).json({ // return HTTP 200 on success
            success: true, // indicate success
            status: order.status, // return updated status
            message: "Status updated" // provide success message
        });
    } catch (error) { // catch any errors
        console.log(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}

export const searchRestaurant = async (req: Request, res: Response) => { // define async function to search restaurants based on text and cuisines
    try { // start try block to handle potential errors
        const searchText = req.params.searchText || ""; // get search text from URL parameters or default to empty string

        const searchQuery = req.query.searchQuery as string || ""; // get search query from query parameters or default to empty string

        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine); // parse selected cuisines from query string into an array, removing empty strings

        const query: any = {}; // initialize empty query object for MongoDB search

        console.log(selectedCuisines); // log selected cuisines for debugging

        if (searchText) { // if searchText is provided
            query.$or = [ // set $or condition to match restaurantName, city, or country
                { restaurantName: { $regex: searchText, $options: 'i' } }, // case-insensitive match on restaurant name
                { city: { $regex: searchText, $options: 'i' } }, // case-insensitive match on city
                { country: { $regex: searchText, $options: 'i' } }, // case-insensitive match on country
            ]
        }

        if (searchQuery) { // if searchQuery is provided
            query.$or = [ // set $or condition to match restaurantName or cuisines
                { restaurantName: { $regex: searchQuery, $options: 'i' } }, // case-insensitive match on restaurant name
                { cuisines: { $regex: searchQuery, $options: 'i' } } // case-insensitive match on cuisines
            ]
        }

        if (selectedCuisines.length > 0) { // if any cuisines are selected
            query.cuisines = { $in: selectedCuisines } // filter restaurants to include only those with selected cuisines
        }

        const restaurants = await Restaurant.find(query); // query the database with constructed query object

        return res.status(200).json({ // return HTTP 200 with search results
            success: true, // indicate success
            data: restaurants // return matched restaurants
        });
    } catch (error) { // catch any errors
        console.log(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}

export const getSingleRestaurant = async (req: Request, res: Response) => { // define async function to fetch a single restaurant by ID
    try { // start try block to handle potential errors
        const restaurantId = req.params.id; // extract restaurant ID from request parameters

        const restaurant = await Restaurant.findById(restaurantId).populate({ // find restaurant by ID and populate related menus
            path: 'menus', // specify the field to populate (menus)
            options: { createdAt: -1 } // sort menus in descending order by creation date
        });

        if (!restaurant) { // check if restaurant was not found
            return res.status(404).json({ // return HTTP 404 if restaurant does not exist
                success: false, // indicate failure
                message: "Restaurant not found" // provide descriptive message
            })
        };

        return res.status(200).json({ success: true, restaurant }); // return HTTP 200 with restaurant data
    } catch (error) { // catch any errors that occur
        console.log(error); // log error for debugging
        return res.status(500).json({ message: "Internal server error" }) // return generic HTTP 500 error
    }
}