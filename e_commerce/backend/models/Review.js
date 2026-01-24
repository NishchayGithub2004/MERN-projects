import mongoose from "mongoose"; // import mongoose library to define schemas and interact with MongoDB

const ProductReviewSchema = new mongoose.Schema( // create a new mongoose schema named ProductReviewSchema to define the structure of product review documents
    { // define the fields for the ProductReview schema
        productId: String, // declare a 'productId' field of type String to store the ID of the product being reviewed
        userId: String, // declare a 'userId' field of type String to store the ID of the user who wrote the review
        userName: String, // declare a 'userName' field of type String to store the reviewer's display name
        reviewMessage: String, // declare a 'reviewMessage' field of type String to store the written feedback or comment about the product
        reviewValue: Number, // declare a 'reviewValue' field of type Number to store the numeric rating value (e.g., 1–5 stars)
    },
    { timestamps: true } // enable automatic creation of 'createdAt' and 'updatedAt' fields to track when reviews are created or updated
);

module.exports = mongoose.model("ProductReview", ProductReviewSchema); // create and export a mongoose model named 'ProductReview' using the ProductReviewSchema to interact with the 'productreviews' collection in MongoDB
