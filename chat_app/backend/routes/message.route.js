import express from "express"; // import express to create a router instance for message-related routes
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from "../controllers/message.controller.js"; // import message controllers to handle contacts, chats, message retrieval, and message sending
import { protectRoute } from "../middleware/auth.middleware.js"; // import protectRoute middleware to ensure routes are accessed only by authenticated users
import { arcjetProtection } from "../middleware/arcjet.middleware.js"; // import arcjetProtection middleware to apply security and rate-limiting protections

const router = express.Router(); // create a new express router instance to group message-related routes

router.use(arcjetProtection, protectRoute); // apply Arcjet security and authentication middleware to all message routes

router.get("/contacts", getAllContacts); // define route to fetch all available contacts for the authenticated user
router.get("/chats", getChatPartners); // define route to fetch users the authenticated user has chatted with
router.get("/:id", getMessagesByUserId); // define route to fetch all messages exchanged with a specific user
router.post("/send/:id", sendMessage); // define route to send a new message to a specific user

export default router; // export the configured router for use in the main application