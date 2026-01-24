import Order from "../../models/Order"; // import Order model to interact with Order collection in database
import Product from "../../models/Product"; // import Product model to interact with Product collection in database
import ProductReview from "../../models/Review"; // import ProductReview model to interact with Review collection in database

const addProductReview = async (req, res) => { // define async function addProductReview with req and res as arguments
    try { // start try block to handle potential errors
        const { productId, userId, userName, reviewMessage, reviewValue } = req.body; // extract review details from request body using object destructuring

        const order = await Order.findOne({ // check if user has purchased and received the product by querying Order collection
            userId, // match orders with userId
            "cartItems.productId": productId, // check if product exists in cartItems
            orderStatus: "delivered", // ensure order status is delivered
        });

        if (!order) { // if no such order exists
            return res.status(403).json({ // send response with status 403 (forbidden)
                success: false, // indicate operation failed
                message: "You need to purchase product to review it.", // include message explaining restriction
            });
        }

        const checkExistinfReview = await ProductReview.findOne({ // check if user already submitted a review for this product
            productId, // match productId
            userId, // match userId
        });

        if (checkExistinfReview) { // if review already exists
            return res.status(400).json({ // send response with status 400 (bad request)
                success: false, // indicate operation failed
                message: "You already reviewed this product!", // include message explaining duplicate review
            });
        }

        const newReview = new ProductReview({ productId, userId, userName, reviewMessage, reviewValue }); // create new ProductReview instance with review details

        await newReview.save(); // save new review to database asynchronously

        const reviews = await ProductReview.find({ productId }); // fetch all reviews for the product

        const totalReviewsLength = reviews.length; // calculate total number of reviews

        const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewsLength; // calculate average review value

        await Product.findByIdAndUpdate(productId, { averageReview }); // update Product document with new averageReview value

        res.status(201).json({ // send response with status 201 (created) and JSON data
            success: true, // indicate operation was successful
            data: newReview, // include newly created review in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

const getProductReviews = async (req, res) => { // define async function getProductReviews with req and res as arguments
    try { // start try block to handle potential errors
        const { productId } = req.params; // extract productId from request parameters using object destructuring

        const reviews = await ProductReview.find({ productId }); // fetch all reviews for given productId asynchronously

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: reviews, // include fetched reviews in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

module.exports = { addProductReview, getProductReviews }; // export both functions as named exports
