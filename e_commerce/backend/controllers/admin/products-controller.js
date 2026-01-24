import imageUploadUtil from "../../helpers/cloudinary"; // import imageUploadUtil function to upload images to Cloudinary
import Product from "../../models/Product"; // import Product model from models folder to interact with Product collection in database

const handleImageUpload = async (req, res) => { // define async function handleImageUpload with req and res as arguments
    try { // start try block to handle potential errors
        const b64 = Buffer.from(req.file.buffer).toString("base64"); // convert uploaded file buffer to base64 string and store in b64

        const url = "data:" + req.file.mimetype + ";base64," + b64; // create data URL string with mimetype and base64 content

        const result = await imageUploadUtil(url); // upload image to Cloudinary asynchronously using imageUploadUtil and store result

        res.json({ // send JSON response with uploaded image result
            success: true, // indicate operation was successful
            result, // include uploaded image result in response
        });
    } catch (error) { // catch any error that occurs in try block
        console.log(error); // log error to console for debugging
        
        res.json({ // send JSON response indicating failure
            success: false, // indicate operation failed
            message: "Error occured", // include generic error message
        });
    }
};

const addProduct = async (req, res) => { // define async function addProduct with req and res as arguments
    try { // start try block to handle potential errors
        const { image, title, description, category, brand, price, salePrice, totalStock, averageReview } = req.body; // extract all product fields from request body using object destructuring

        console.log(averageReview, "averageReview"); // log averageReview for debugging purposes

        const newlyCreatedProduct = new Product({ image, title, description, category, brand, price, salePrice, totalStock, averageReview }); // create new Product instance with provided fields

        await newlyCreatedProduct.save(); // save newlyCreatedProduct document to database asynchronously
        
        res.status(201).json({ // send response with status 201 (created) and JSON data
            success: true, // indicate operation was successful
            data: newlyCreatedProduct, // include saved product in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging
        
        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error occured", // include generic error message
        });
    }
};

const fetchAllProducts = async (_, res) => { // define async function fetchAllProducts with ignored first argument (_) and res as arguments
    try { // start try block to handle potential errors
        const listOfProducts = await Product.find({}); // fetch all products from database asynchronously and store in listOfProducts
        
        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: listOfProducts, // include fetched products in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging
        
        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error occured", // include generic error message
        });
    }
};

const editProduct = async (req, res) => { // define async function editProduct with req and res as arguments
    try { // start try block to handle potential errors
        const { id } = req.params; // extract id from request parameters using object destructuring
        
        const { image, title, description, category, brand, price, salePrice, totalStock, averageReview } = req.body; // extract product fields from request body

        let findProduct = await Product.findById(id); // fetch product by id asynchronously and store in findProduct
        
        if (!findProduct) { // check if product does not exist
            return res.status(404).json({ // send response with status 404 (not found) if product is missing
                success: false, // indicate operation failed
                message: "Product not found", // include message for missing product
            });
        }

        findProduct.title = title || findProduct.title; // update title if provided, else keep existing
        findProduct.description = description || findProduct.description; // update description if provided, else keep existing
        findProduct.category = category || findProduct.category; // update category if provided, else keep existing
        findProduct.brand = brand || findProduct.brand; // update brand if provided, else keep existing
        findProduct.price = price === "" ? 0 : price || findProduct.price; // update price, handle empty string as 0, else keep existing
        findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice; // update salePrice, handle empty string as 0, else keep existing
        findProduct.totalStock = totalStock || findProduct.totalStock; // update totalStock if provided, else keep existing
        findProduct.image = image || findProduct.image; // update image if provided, else keep existing
        findProduct.averageReview = averageReview || findProduct.averageReview; // update averageReview if provided, else keep existing

        await findProduct.save(); // save updated product to database asynchronously
        
        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: findProduct, // include updated product in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging
        
        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error occured", // include generic error message
        });
    }
};

const deleteProduct = async (req, res) => { // define async function deleteProduct with req and res as arguments
    try { // start try block to handle potential errors
        const { id } = req.params; // extract id from request parameters using object destructuring
        
        const product = await Product.findByIdAndDelete(id); // delete product by id asynchronously and store deleted document in product

        if (!product) { // check if product did not exist
            return res.status(404).json({ // send response with status 404 (not found) if product is missing
                success: false, // indicate operation failed
                message: "Product not found", // include message for missing product
            });
        }

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            message: "Product delete successfully", // include message confirming deletion
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging
        
        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error occured", // include generic error message
        });
    }
};

module.exports = { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct }; // export all functions as named exports
