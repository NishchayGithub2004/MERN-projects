import express from "express"; // import express to define review-related routing
import isAuth from "../middlewares/isAuth.js"; // import authentication middleware to restrict review submission
import { addReview, getAllReviews } from "../controllers/reviewController.js"; // import review controllers for creation and retrieval

let reviewRouter = express.Router(); // create a router instance for review endpoints

reviewRouter.post("/givereview", isAuth, addReview); // allow authenticated users to submit a course review
reviewRouter.get("/allReview", getAllReviews); // expose all reviews for listing or moderation purposes

export default reviewRouter; // export review router for application-level mounting