import express from "express";
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const messageRoutes = express.Router();

messageRoutes.use(arcjetProtection, protectRoute); // use arcjet protection and user authentication middleware in all these routes before executing any middleware or functions that follow after

messageRoutes.get("/contacts", getAllContacts);
messageRoutes.get("/chats", getChatPartners);
messageRoutes.get("/:id", getMessagesByUserId);
messageRoutes.post("/send/:id", sendMessage);

export default messageRoutes;