import express from "express";
import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const authRoutes = express.Router();

authRoutes.use(arcjetProtection); // use arcjet protection middleware in all these routes before executing any middleware or functions

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.put("/update-profile", protectRoute, updateProfile);

export default authRoutes;