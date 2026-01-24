import express from "express";

import { addToCart, fetchCartItems, deleteCartItem, updateCartItemQty } from "../../controllers/shop/cart-controller";

const shopCartRouter = express.Router();

shopCartRouter.post("/add", addToCart);
shopCartRouter.get("/get/:userId", fetchCartItems);
shopCartRouter.put("/update-cart", updateCartItemQty);
shopCartRouter.delete("/:userId/:productId", deleteCartItem);

module.exports = shopCartRouter;