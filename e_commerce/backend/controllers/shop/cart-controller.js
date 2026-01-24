import Cart from "../../models/Cart"; // import Cart model to interact with Cart collection in database
import Product from "../../models/Product"; // import Product model to interact with Product collection in database

const addToCart = async (req, res) => { // define async function addToCart with req and res as arguments
    try { // start try block to handle potential errors
        const { userId, productId, quantity } = req.body; // extract userId, productId, and quantity from request body using object destructuring

        if (!userId || !productId || quantity <= 0) { // validate required data and quantity
            return res.status(400).json({ // send response with status 400 (bad request) if validation fails
                success: false, // indicate operation failed
                message: "Invalid data provided!", // include message explaining invalid input
            });
        }

        const product = await Product.findById(productId); // fetch product by productId asynchronously

        if (!product) { // check if product exists
            return res.status(404).json({ // send response with status 404 (not found) if product missing
                success: false, // indicate operation failed
                message: "Product not found", // include message explaining missing product
            });
        }

        let cart = await Cart.findOne({ userId }); // fetch cart for user by userId asynchronously

        if (!cart) cart = new Cart({ userId, items: [] }); // if cart doesn't exist, create new Cart instance

        const findCurrentProductIndex = cart.items.findIndex((item) => item.productId.toString() === productId); // find index of product in cart items

        if (findCurrentProductIndex === -1) cart.items.push({ productId, quantity }); // if product not in cart, add it
        else cart.items[findCurrentProductIndex].quantity += quantity; // if product exists, increment quantity

        await cart.save(); // save updated cart asynchronously

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: cart, // include updated cart in response
        });
    } catch (error) { // catch any error that occurs in try block
        console.log(error); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

const fetchCartItems = async (req, res) => { // define async function fetchCartItems with req and res as arguments
    try { // start try block to handle potential errors
        const { userId } = req.params; // extract userId from request parameters

        if (!userId) { // check if userId is missing
            return res.status(400).json({ // send response with status 400 (bad request) if validation fails
                success: false, // indicate operation failed
                message: "User id is manadatory!", // include message explaining missing userId
            });
        }

        const cart = await Cart.findOne({ userId }).populate({ // fetch cart and populate product details
            path: "items.productId", // populate productId in items
            select: "image title price salePrice", // select required product fields
        });

        if (!cart) { // check if cart exists
            return res.status(404).json({ // send response with status 404 (not found) if cart missing
                success: false, // indicate operation failed
                message: "Cart not found!", // include message explaining missing cart
            });
        }

        const validItems = cart.items.filter((productItem) => productItem.productId); // filter out items with missing products

        if (validItems.length < cart.items.length) { // check if any invalid items exist
            cart.items = validItems; // update cart items with valid items
            await cart.save(); // save updated cart asynchronously
        }

        const populateCartItems = validItems.map((item) => ({ // map valid items to response format
            productId: item.productId._id, // include product ID
            image: item.productId.image, // include product image
            title: item.productId.title, // include product title
            price: item.productId.price, // include product price
            salePrice: item.productId.salePrice, // include product sale price
            quantity: item.quantity, // include quantity
        }));

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: { // include cart data
                ...cart._doc, // spread original cart document fields
                items: populateCartItems, // override items with populated product details
            },
        });
    } catch (error) { // catch any error that occurs in try block
        console.log(error); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

const updateCartItemQty = async (req, res) => { // define async function updateCartItemQty with req and res as arguments
    try { // start try block to handle potential errors
        const { userId, productId, quantity } = req.body; // extract userId, productId, and quantity from request body

        if (!userId || !productId || quantity <= 0) { // validate required data and quantity
            return res.status(400).json({ // send response with status 400 (bad request) if validation fails
                success: false, // indicate operation failed
                message: "Invalid data provided!", // include message explaining invalid input
            });
        }

        const cart = await Cart.findOne({ userId }); // fetch cart for user by userId asynchronously

        if (!cart) { // check if cart exists
            return res.status(404).json({ // send response with status 404 (not found) if cart missing
                success: false, // indicate operation failed
                message: "Cart not found!", // include message explaining missing cart
            });
        }

        const findCurrentProductIndex = cart.items.findIndex((item) => item.productId.toString() === productId); // find index of product in cart items

        if (findCurrentProductIndex === -1) { // check if product is not in cart
            return res.status(404).json({ // send response with status 404 (not found)
                success: false, // indicate operation failed
                message: "Cart item not present !", // include message explaining missing item
            });
        }

        cart.items[findCurrentProductIndex].quantity = quantity; // update product quantity in cart

        await cart.save(); // save updated cart asynchronously

        await cart.populate({ // populate product details in cart items
            path: "items.productId", // populate productId in items
            select: "image title price salePrice", // select required product fields
        });

        const populateCartItems = cart.items.map((item) => ({ // map items to response format
            productId: item.productId ? item.productId._id : null, // include product ID or null if missing
            image: item.productId ? item.productId.image : null, // include product image or null if missing
            title: item.productId ? item.productId.title : "Product not found", // include product title or fallback
            price: item.productId ? item.productId.price : null, // include product price or null if missing
            salePrice: item.productId ? item.productId.salePrice : null, // include product sale price or null if missing
            quantity: item.quantity, // include quantity
        }));

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: { // include cart data
                ...cart._doc, // spread original cart document fields
                items: populateCartItems, // override items with populated product details
            },
        });
    } catch (error) { // catch any error that occurs in try block
        console.log(error); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

const deleteCartItem = async (req, res) => { // define async function deleteCartItem with req and res as arguments
    try { // start try block to handle potential errors
        const { userId, productId } = req.params; // extract userId and productId from request parameters

        if (!userId || !productId) { // validate required data
            return res.status(400).json({ // send response with status 400 (bad request) if validation fails
                success: false, // indicate operation failed
                message: "Invalid data provided!", // include message explaining invalid input
            });
        }

        const cart = await Cart.findOne({ userId }).populate({ // fetch cart and populate product details
            path: "items.productId", // populate productId in items
            select: "image title price salePrice", // select required product fields
        });

        if (!cart) { // check if cart exists
            return res.status(404).json({ // send response with status 404 (not found) if cart missing
                success: false, // indicate operation failed
                message: "Cart not found!", // include message explaining missing cart
            });
        }

        cart.items = cart.items.filter((item) => item.productId._id.toString() !== productId); // remove the product from cart items

        await cart.save(); // save updated cart asynchronously

        await cart.populate({ // repopulate product details in updated cart
            path: "items.productId", // populate productId in items
            select: "image title price salePrice", // select required product fields
        });

        const populateCartItems = cart.items.map((item) => ({ // map items to response format
            productId: item.productId ? item.productId._id : null, // include product ID or null if missing
            image: item.productId ? item.productId.image : null, // include product image or null if missing
            title: item.productId ? item.productId.title : "Product not found", // include product title or fallback
            price: item.productId ? item.productId.price : null, // include product price or null if missing
            salePrice: item.productId ? item.productId.salePrice : null, // include product sale price or null if missing
            quantity: item.quantity, // include quantity
        }));

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: { // include cart data
                ...cart._doc, // spread original cart document fields
                items: populateCartItems, // override items with populated product details
            },
        });
    } catch (error) { // catch any error that occurs in try block
        console.log(error); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

module.exports = { addToCart, updateCartItemQty, deleteCartItem, fetchCartItems }; // export all functions as named exports
