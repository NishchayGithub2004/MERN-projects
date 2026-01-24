import Order from "../../models/Order"; // import Order model from models folder to interact with Order collection in database

const getAllOrdersOfAllUsers = async (_, res) => { // define async function getAllOrdersOfAllUsers with req (request object) and res (response object) as arguments
    try { // start try block to handle potential errors
        const orders = await Order.find({}); // fetch all orders from database asynchronously and store in orders

        if (!orders.length) { // check if no orders were found
            return res.status(404).json({ // send response with status 404 (not found) if orders array is empty
                success: false, // indicate operation failed
                message: "No orders found!", // include message for no orders
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

const getOrderDetailsForAdmin = async (req, res) => { // define async function getOrderDetailsForAdmin with req and res as arguments
    try { // start try block to handle potential errors
        const { id } = req.params; // extract id from request parameters using object destructuring

        const order = await Order.findById(id); // fetch order by id from database asynchronously and store in order

        if (!order) { // check if order does not exist
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

const updateOrderStatus = async (req, res) => { // define async function updateOrderStatus with req and res as arguments
    try { // start try block to handle potential errors
        const { id } = req.params; // extract id from request parameters using object destructuring
        
        const { orderStatus } = req.body; // extract orderStatus from request body using object destructuring

        const order = await Order.findById(id); // fetch order by id from database asynchronously and store in order

        if (!order) { // check if order does not exist
            return res.status(404).json({ // send response with status 404 (not found) if order is missing
                success: false, // indicate operation failed
                message: "Order not found!", // include message for missing order
            });
        }

        await Order.findByIdAndUpdate(id, { orderStatus }); // update orderStatus field of order document in database asynchronously

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            message: "Order status is updated successfully!", // include message confirming successful update
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging
        
        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured!", // include generic error message
        });
    }
};

module.exports = { getAllOrdersOfAllUsers, getOrderDetailsForAdmin, updateOrderStatus }; // export all functions as named exports
