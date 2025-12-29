import aj from "../lib/arcjet.js"; // import the configured Arcjet client to apply security protections on incoming requests
import { isSpoofedBot } from "@arcjet/inspect"; // import isSpoofedBot to identify bots pretending to be legitimate clients

export const arcjetProtection = async (req, res, next) => { // define middleware to enforce Arcjet security checks before request handling
    try { // wrap Arcjet protection logic in a try block to safely handle runtime failures
        const decision = await aj.protect(req); // evaluate the incoming request against configured Arcjet rules

        if (decision.isDenied()) { // check whether the request is explicitly denied by Arcjet
            if (decision.reason.isRateLimit()) { // determine if the denial reason is rate limiting
                return res.status(429).json({ message: "Rate limit exceeded. Please try again later." }); // respond with 429 to signal too many requests
            } else if (decision.reason.isBot()) { // determine if the denial reason is bot detection
                return res.status(403).json({ message: "Bot access denied." }); // block automated traffic with a forbidden response
            } else { // handle all other security policy denial reasons
                return res.status(403).json({message: "Access denied by security policy." }); // return a generic forbidden response for unspecified denials
            }
        }

        if (decision.results.some(isSpoofedBot)) { // inspect decision results to detect bots spoofing legitimate identities
            return res.status(403).json({
                error: "Spoofed bot detected", // provide a specific error identifier for spoofed bot detection
                message: "Malicious bot activity detected.", // inform the client that malicious automation was blocked
            });
        }

        next(); // pass control to the next middleware or route handler if the request is allowed
    } catch (error) { // catch unexpected errors during Arcjet protection execution
        console.log("Arcjet Protection Error:", error); // log the error to aid debugging and monitoring
        next(); // continue request processing to avoid blocking due to internal middleware failure
    }
};