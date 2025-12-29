import express from "express"; // import express to create a router instance for defining authentication routes
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js"; // import auth controllers to handle signup, login, logout, and profile updates
import { protectRoute } from "../middleware/auth.middleware.js"; // import protectRoute middleware to restrict access to authenticated users
import { arcjetProtection } from "../middleware/arcjet.middleware.js"; // import arcjetProtection middleware to apply security and rate-limiting checks

const router = express.Router(); // create a new express router instance to group auth-related routes

router.use(arcjetProtection); // apply Arcjet security middleware to all authentication routes

router.post("/signup", signup); // define route to register a new user account
router.post("/login", login); // define route to authenticate an existing user
router.post("/logout", logout); // define route to log out the authenticated user
router.put("/update-profile", protectRoute, updateProfile); // define protected route to update the authenticated user's profile
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user)); // define protected route to verify authentication and return current user data

export default router; // export the configured router for use in the main application