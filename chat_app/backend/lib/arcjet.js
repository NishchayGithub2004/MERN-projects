import arcjet from "@arcjet/node"; // import the arcjet client factory to initialize and configure Arcjet protections

import { 
    shield, // import shield to provide baseline protection against common attacks
    detectBot, // import detectBot to identify and control automated bot traffic
    slidingWindow // import slidingWindow to apply rate limiting using a sliding window algorithm
} from "@arcjet/node";

import { ENV } from "./env.js"; // import environment configuration to securely access runtime secrets

const aj = arcjet({ // create an Arcjet instance configured with security and traffic control rules
    key: ENV.ARCJET_KEY, // supply the Arcjet API key from environment variables to authenticate requests
    rules: [ // define an ordered list of protection rules to be applied to incoming requests
        shield({ mode: "LIVE" }), // enable real-time shield protection to actively block malicious traffic
        detectBot({
            mode: "LIVE", // run bot detection in live mode to enforce decisions immediately
            allow: [
                "CATEGORY:SEARCH_ENGINE", // allow legitimate search engine crawlers while blocking other bots
            ],
        }),
        slidingWindow({
            mode: "LIVE", // enforce rate limiting in live mode so limits are applied instantly
            max: 100, // allow a maximum of 100 requests within the defined time window
            interval: 60, // set the sliding window interval to 60 seconds for rate limit calculation
        }),
    ],
});

export default aj;