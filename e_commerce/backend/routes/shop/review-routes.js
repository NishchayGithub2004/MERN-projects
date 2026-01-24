import express from "express";

import { addProductReview, getProductReviews } from "../../controllers/shop/product-review-controller";

const shopReviewRouter = express.Router();

shopReviewRouter.post("/add", addProductReview);
shopReviewRouter.get("/:productId", getProductReviews);

module.exports = shopReviewRouter;