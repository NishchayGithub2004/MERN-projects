import express from "express"; // import express to define payment-related routing
import { createOrder, verifyPayment } from "../controllers/orderController.js"; // import order controllers for payment creation and verification

let paymentRouter = express.Router(); // create a router instance for payment endpoints

paymentRouter.post("/create-order", createOrder); // initiate a payment order for a purchase
paymentRouter.post("/verify-payment", verifyPayment); // confirm payment status and trigger post-payment actions

export default paymentRouter; // export payment router for use in the main application