import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth/auth-routes";
import adminProductsRouter from "./routes/admin/products-routes";
import adminOrderRouter from "./routes/admin/order-routes";
import shopProductsRouter from "./routes/shop/products-routes";
import shopCartRouter from "./routes/shop/cart-routes";
import shopAddressRouter from "./routes/shop/address-routes";
import shopOrderRouter from "./routes/shop/order-routes";
import shopSearchRouter from "./routes/shop/search-routes";
import shopReviewRouter from "./routes/shop/review-routes";
import commonFeatureRouter from "./routes/common/feature-routes";

mongoose // use mongoose object to handle MongoDB connection
  .connect(process.env.MONGO_URI) // connect to MongoDB using connection string stored in environment variable MONGO_URI
  .then(() => console.log("MongoDB connected")) // log success message if connection is established successfully
  .catch((error) => console.log(error)); // catch any connection error and log it

const app = express(); // create an instance of express application and store in variable app

const PORT = process.env.PORT || 3000; // set PORT from environment variable or fallback to 3000

app.use(
  cors({ // use CORS middleware to handle cross-origin requests
    origin: "http://localhost:5173", // allow requests only from this origin
    methods: ["GET", "POST", "DELETE", "PUT"], // allow only these HTTP methods
    allowedHeaders: [ // specify allowed headers in requests
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // allow cookies and authentication credentials to be sent
  })
);

app.use(cookieParser()); // use cookie-parser middleware to parse cookies from incoming requests
app.use(express.json()); // use express.json middleware to parse incoming JSON request bodies

app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`)); // start the express server on PORT and log message when running
