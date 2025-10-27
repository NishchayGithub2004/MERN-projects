import express from "express" // import the express module to create routers and handle HTTP requests
import { isAuthenticated } from "../middlewares/isAuthenticated" // import middleware to check if the user is authenticated
import { createCheckoutSession, getOrders, stripeWebhook } from "../controller/order.controller" // import controller functions to create checkout session, get orders, and handle Stripe webhook

const orderRoute = express.Router() // create a new router instance to define order-related routes

orderRoute.route("/").get(isAuthenticated, getOrders) // define GET route at "/" with authentication and getOrders controller

orderRoute.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession) // define POST route for creating checkout session with authentication and createCheckoutSession controller

orderRoute.route("/webhook").post(express.raw({ type: 'application/json' }), stripeWebhook) // define POST route for Stripe webhook using express.raw middleware to parse JSON payload and stripeWebhook controller

export default orderRoute // export the router so it can be used in the main app
