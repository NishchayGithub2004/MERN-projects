import Product from "../../models/Product"; // import Product model from models folder to interact with Product collection in database

const searchProducts = async (req, res) => { // define async function searchProducts with req and res as arguments
    try { // start try block to handle potential errors
        const { keyword } = req.params; // extract keyword from request parameters using object destructuring

        if (!keyword || typeof keyword !== "string") { // check if keyword is missing or not a string
            return res.status(400).json({ // send response with status 400 (bad request) if validation fails
                success: false, // indicate operation failed
                message: "Keyword is required and must be in string format", // include message for invalid keyword
            });
        }

        const regEx = new RegExp(keyword, "i"); // create case-insensitive regular expression from keyword for partial matching

        const createSearchQuery = { // construct MongoDB query object to search across multiple fields
            $or: [ // use $or operator to match any of the specified fields
                { title: regEx }, // match title field with regex
                { description: regEx }, // match description field with regex
                { category: regEx }, // match category field with regex
                { brand: regEx }, // match brand field with regex
            ],
        };

        const searchResults = await Product.find(createSearchQuery); // execute query asynchronously and store matching products in searchResults

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: searchResults, // include search results in response
        });
    } catch (error) { // catch any error that occurs in try block
        console.log(error); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

module.exports = { searchProducts }; // export searchProducts function as named export
