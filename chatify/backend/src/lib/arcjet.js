import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node"; // import 'arcjet' function to configure and apply security rules to this project
// 'shield' function to block malicious traffic patterns, 'detectBot' function to detect and block bots, 'slidingWindow' function to limit the number of requests per IP address in a given time window
import { ENV } from "./env.js"; // import 'ENV' object from 'env.js' file to access and use environment variables

const aj = arcjet({ // configure 'arcjet' function with the following properties
    key: ENV.ARCJET_KEY, // provide the arcjet API key from the 'ENV' object's 'ARCJET_KEY' property to authenticate and authorize requests
    rules: [ // configure the following security rules to apply to incoming requests
        shield({ mode: "LIVE" }), // activate the 'shield' function in 'LIVE' mode to block malicious traffic patterns
        // activate the 'detectBot' function in 'LIVE' mode to detect and block bots, and allow search engines to access the app
        detectBot({
            mode: "LIVE",
            allow: ["CATEGORY:SEARCH_ENGINE"]
        }),
        // activate the 'slidingWindow' function in 'LIVE' mode to limit the number of requests per IP address in a given time window
        // allow up to 100 requests per minute from a single IP address
        slidingWindow({
            mode: "LIVE",
            max: 100,
            interval: 60,
        }),
    ],
});

export default aj; // export the configured 'arcjet' function to be used in other parts of the application