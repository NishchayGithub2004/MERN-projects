import express from "express";

import { createOrder, getAllOrdersByUser, getOrderDetails, capturePayment } from "../../controllers/shop/order-controller";

const shopOrderRouter = express.Router();

shopOrderRouter.post("/create", createOrder);
shopOrderRouter.post("/capture", capturePayment);
shopOrderRouter.get("/list/:userId", getAllOrdersByUser);
shopOrderRouter.get("/details/:id", getOrderDetails);

module.exports = shopOrderRouter;