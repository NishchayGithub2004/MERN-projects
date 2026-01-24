import mongoose from "mongoose"; // import mongoose library to define schemas and interact with MongoDB

const ProductSchema = new mongoose.Schema( // create a new mongoose schema named ProductSchema to define the structure of product documents
    { // define the fields for the Product schema
        image: String, // declare an 'image' field of type String to store the URL or path of the product image
        title: String, // declare a 'title' field of type String to store the product name or title
        description: String, // declare a 'description' field of type String to store details or specifications of the product
        category: String, // declare a 'category' field of type String to categorize the product (e.g., electronics, clothing)
        brand: String, // declare a 'brand' field of type String to store the brand name of the product
        price: Number, // declare a 'price' field of type Number to store the regular price of the product
        salePrice: Number, // declare a 'salePrice' field of type Number to store the discounted price if applicable
        totalStock: Number, // declare a 'totalStock' field of type Number to store how many units of the product are available in stock
        averageReview: Number, // declare an 'averageReview' field of type Number to store the average rating given by users
    },
    { timestamps: true } // enable automatic creation of 'createdAt' and 'updatedAt' fields for tracking product creation and updates
);

module.exports = mongoose.model("Product", ProductSchema); // create and export a mongoose model named 'Product' using the ProductSchema to interact with the 'products' collection in MongoDB
