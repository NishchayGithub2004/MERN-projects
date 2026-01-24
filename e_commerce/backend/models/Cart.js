import mongoose from "mongoose"; // import mongoose library to define schemas and models for MongoDB

const CartSchema = new mongoose.Schema( // create a new schema instance named CartSchema to define the structure of cart documents
    { // define schema fields for the Cart collection
        userId: { // declare the 'userId' field to reference the user who owns the cart
            type: mongoose.Schema.Types.ObjectId, // set the field type as ObjectId since it references another document in MongoDB
            ref: "User", // specify the referenced model name 'User' to establish a relationship between Cart and User collections
            required: true, // make the field mandatory to ensure every cart is linked to a valid user
        },
        items: [ // define an array called 'items' to hold multiple product entries in the cart
            { // each item in the array represents a product entry
                productId: { // declare the 'productId' field to reference the product added to the cart
                    type: mongoose.Schema.Types.ObjectId, // set the type as ObjectId to reference another document from the Product collection
                    ref: "Product", // specify the referenced model name 'Product' to create a relationship between Cart and Product
                    required: true, // make this field mandatory to ensure each item corresponds to a valid product
                },
                quantity: { // declare a 'quantity' field to store how many units of a product are in the cart
                    type: Number, // set the field type as Number since quantity is numeric
                    required: true, // make this field mandatory to ensure quantity is always provided
                    min: 1, // enforce a minimum value of 1 to prevent invalid zero or negative quantities
                },
            },
        ],
    },
    { // define schema options
        timestamps: true, // enable automatic creation of 'createdAt' and 'updatedAt' fields to track when cart documents are created and modified
    }
);

module.exports = mongoose.model("Cart", CartSchema); // create and export a mongoose model named 'Cart' using CartSchema to interact with the 'carts' collection in MongoDB
