import express from "express";

import { searchProducts } from "../../controllers/shop/search-controller";

const shopSearchRouter = express.Router();

shopSearchRouter.get("/:keyword", searchProducts);

module.exports = shopSearchRouter;