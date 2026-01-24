import express from "express";

import { getFilteredProducts, getProductDetails } from "../../controllers/shop/products-controller";

const shopProductsRouter = express.Router();

shopProductsRouter.get("/get", getFilteredProducts);
shopProductsRouter.get("/get/:id", getProductDetails);

module.exports = shopProductsRouter;