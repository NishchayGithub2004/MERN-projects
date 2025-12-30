import express from "express"; // import express to create a modular router for AI-related endpoints
import { searchWithAi } from "../controllers/aiController.js"; // import controller to handle AI-powered search requests

let aiRouter = express.Router(); // initialize a router instance to group AI routes

aiRouter.post("/search", searchWithAi); // register POST endpoint to process search queries via AI logic

export default aiRouter; // export the router for integration into the main application