import Product from "../../models/Product"; // import Product model from models folder to interact with Product collection in database

const getFilteredProducts = async (req, res) => { // define async function getFilteredProducts with req and res as arguments
    try { // start try block to handle potential errors
        const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query; // extract category, brand, and sortBy from query params with default values

        let filters = {}; // initialize empty filters object

        if (category.length) filters.category = { $in: category.split(",") }; // if category query exists, split by comma and set $in filter for category

        if (brand.length) filters.brand = { $in: brand.split(",") }; // if brand query exists, split by comma and set $in filter for brand

        let sort = {}; // initialize empty sort object

        switch (sortBy) { // determine sorting order based on sortBy query
            case "price-lowtohigh": // if sortBy is price-lowtohigh
                sort.price = 1; // sort ascending by price
                break;
            
            case "price-hightolow": // if sortBy is price-hightolow
                sort.price = -1; // sort descending by price
                break;
            
            case "title-atoz": // if sortBy is title-atoz
                sort.title = 1; // sort ascending alphabetically by title
                break;

            case "title-ztoa": // if sortBy is title-ztoa
                sort.title = -1; // sort descending alphabetically by title
                break;

            default: // default sorting
                sort.price = 1; // default to ascending by price
                break;
        }

        const products = await Product.find(filters).sort(sort); // fetch products from database applying filters and sorting asynchronously

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: products, // include fetched products in response
        });
    } catch (error) { // catch any error that occurs in try block
        console.log(error); // log error to console for debugging
        
        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured", // include generic error message
        });
    }
};

const getProductDetails = async (req, res) => { // define async function getProductDetails with req and res as arguments
    try { // start try block to handle potential errors
        const { id } = req.params; // extract id from request parameters using object destructuring

        const product = await Product.findById(id); // fetch product by id from database asynchronously and store in product

        if (!product) // check if product was not found
            return res.status(404).json({ // send response with status 404 (not found) if product is missing
                success: false, // indicate operation failed
                message: "Product not found!", // include message for missing product
            });

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: product, // include fetched product in response
        });
    } catch (error) { // catch any error that occurs in try block
        console.log(error); // log error to console for debugging
        
        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured", // include generic error message
        });
    }
};

module.exports = { getFilteredProducts, getProductDetails }; // export both functions as named exports
