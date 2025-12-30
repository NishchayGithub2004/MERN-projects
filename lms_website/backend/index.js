import express from "express"; // import express to create the HTTP server and routing layer
import dotenv from "dotenv"; // import dotenv to load environment variables from .env file
import connectDb from "./configs/db.js"; // import database connection utility to initialize persistence layer
import authRouter from "./routes/authRoute.js"; // import authentication routes
import cookieParser from "cookie-parser"; // import cookie-parser to read cookies from incoming requests
import cors from "cors"; // import cors to control cross-origin request behavior
import userRouter from "./routes/userRoute.js"; // import user-related routes
import courseRouter from "./routes/courseRoute.js"; // import course and lecture routes
import paymentRouter from "./routes/paymentRoute.js"; // import payment and order routes
import aiRouter from "./routes/aiRoute.js"; // import AI-powered search routes
import reviewRouter from "./routes/reviewRoute.js"; // import review-related routes

dotenv.config(); // load environment variables into process.env

let port = process.env.PORT; // read application port from environment configuration
let app = express(); // initialize express application instance

app.use(express.json()); // enable JSON request body parsing
app.use(cookieParser()); // enable cookie parsing for authentication and session handling
app.use(
  cors({
    origin: "http://localhost:5173", // allow requests only from the frontend origin
    credentials: true // allow cookies and auth headers in cross-origin requests
  })
);

app.use("/api/auth", authRouter); // mount authentication routes under /api/auth
app.use("/api/user", userRouter); // mount user routes under /api/user
app.use("/api/course", courseRouter); // mount course routes under /api/course
app.use("/api/payment", paymentRouter); // mount payment routes under /api/payment
app.use("/api/ai", aiRouter); // mount AI routes under /api/ai
app.use("/api/review", reviewRouter); // mount review routes under /api/review

app.get("/", (_, res) => {
  res.send("Hello From Server"); // provide a basic health-check response
});

app.listen(port, () => {
  console.log("Server Started"); // log server startup confirmation
  connectDb(); // establish database connection after server starts listening
});