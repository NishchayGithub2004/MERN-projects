import express from "express"; // import express to create a router for authentication-related endpoints
import { googleSignup, login, logOut, resetPassword, sendOtp, signUp, verifyOtp } from "../controllers/authController.js"; // import authentication controllers handling different auth flows

const authRouter = express.Router(); // create a router instance to group authentication routes

authRouter.post("/signup", signUp); // handle user registration with email and password
authRouter.post("/login", login); // handle user login with credentials
authRouter.get("/logout", logOut); // handle user logout and session cleanup
authRouter.post("/googlesignup", googleSignup); // handle authentication via Google OAuth
authRouter.post("/sendotp", sendOtp); // initiate OTP delivery for verification or password reset
authRouter.post("/verifyotp", verifyOtp); // validate submitted OTP against server records
authRouter.post("/resetpassword", resetPassword); // allow password update after successful verification

export default authRouter; // export auth router for mounting in the main application