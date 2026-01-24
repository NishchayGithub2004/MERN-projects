import paypal from "paypal-rest-sdk"; // import the official PayPal REST SDK to handle PayPal API operations like payment creation and execution

paypal.configure({ // call the configure() method to initialize PayPal SDK with credentials and settings
    mode: process.env.PAYPAL_MODE, // set the mode from environment variables; can be 'sandbox' for testing or 'live' for production
    client_id: process.env.PAYPAL_CLIENT_ID, // set the PayPal client ID fetched from environment variables to identify the PayPal app
    client_secret: process.env.PAYPAL_CLIENT_SECRET, // set the PayPal client secret fetched from environment variables to authenticate secure API calls
});

module.exports = paypal; // export the configured PayPal instance so it can be used in other modules for making API requests
