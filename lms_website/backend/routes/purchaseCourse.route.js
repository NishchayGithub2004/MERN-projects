import express from "express"; // import express module to create a router for handling purchase-related routes
import isAuthenticated from "../middlewares/isAuthenticated.js"; // import middleware to verify if a user is logged in before accessing protected routes
import { // import multiple controller functions from coursePurchase.controller.js to handle purchase logic
    createCheckoutSession, // function to create a Stripe checkout session for course purchase
    getAllPurchasedCourse, // function to retrieve all courses purchased by the authenticated user
    getCourseDetailWithPurchaseStatus, // function to get course details along with the user's purchase status
    stripeWebhook // function to handle Stripe webhook events for payment confirmation
} from "../controllers/coursePurchase.controller.js";

const purchaseRoute = express.Router(); // create a new Express router instance for purchase-related routes

purchaseRoute.route("/checkout/create-checkout-session") // define route for creating a checkout session
    .post( // use POST method to send data for creating session
        isAuthenticated, // ensure the user is authenticated before initiating checkout
        createCheckoutSession // call createCheckoutSession controller to interact with Stripe API and generate checkout link
    );

purchaseRoute.route("/webhook") // define route for Stripe webhook endpoint
    .post( // use POST method because Stripe sends event data via POST
        express.raw({ type: "application/json" }), // use express.raw middleware with argument type set to application/json to read raw body for Stripe signature verification
        stripeWebhook // call stripeWebhook controller to handle incoming Stripe event notifications (e.g., payment success)
    );

purchaseRoute.route("/course/:courseId/detail-with-status") // define route with dynamic courseId parameter to fetch specific course details
    .get( // use GET method to retrieve course and its purchase status
        isAuthenticated, // ensure user is logged in before accessing
        getCourseDetailWithPurchaseStatus // call getCourseDetailWithPurchaseStatus controller to return course data along with purchase info
    );

purchaseRoute.route("/") // define route for fetching all purchased courses
    .get( // use GET method to retrieve list of purchases
        isAuthenticated, // ensure the user is authenticated
        getAllPurchasedCourse // call getAllPurchasedCourse controller to get all courses bought by user
    );

export default purchaseRoute; // export purchaseRoute so it can be used in main app routing