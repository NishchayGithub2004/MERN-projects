import aj from "../lib/arcjet.js"; // import 'aj' instance from 'arcjet.js' file to perform various security checks using Arcjet API
import { isSpoofedBot } from "@arcjet/inspect"; // import 'isSpoofedBot' function from '@arcjet/inspect' library to check if a request is a spoofed bot

export const arcjetProtection = async (req, res, next) => { // define a middleware named 'arcjetProtection' that performs security checks before accessing backend API services
    // it takes request from user as object, backend response as object, and next function or middleware in flow as arguments
    try {
        const decision = await aj.protect(req); // perform security checks on user's request using 'protect' method of 'aj' instance and store result in 'decision' variable

        if (decision.isDenied()) { // if security checks are denied
            if (decision.reason.isRateLimit()) { // if rate limit is exceeded ie too many requests are made in a short period of time
                return res.status(429).json({ message: "Rate limit exceeded. Please try again later." });
                // return a 429 response with a JSON message that rate limit is exceeded, please try again later
            } else if (decision.reason.isBot()) { // if request is made by a bot
                return res.status(403).json({ message: "Bot access denied." });
                // return a 403 response with a JSON message that bot access is denied
            } else { // if any other reason for denial is found
                return res.status(403).json({ message: "Access denied by security policy." });
                // return a 403 response with a JSON message that access is denied by security policy
            }
        }

        // if request is made by a spoofed bot, return a 403 response with a JSON object containing error that spoofed bot is detected and a message that malicious bot activity is detected

        if (decision.results.some(isSpoofedBot)) {
            return res.status(403).json({
                error: "Spoofed bot detected",
                message: "Malicious bot activity detected.",
            });
        }

        next(); // if security checks are passed, pass control to the next middleware or route handler using 'next' function
    } catch (error) { // if any error occurs during security checks
        console.log("Arcjet Protection Error:", error); // log the error to console to know what error occured
        next(); // pass control to the next middleware or route handler using 'next' function
    }
};