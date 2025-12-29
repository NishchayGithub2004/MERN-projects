import { Resend } from "resend"; // import the Resend SDK to send transactional and notification emails
import { ENV } from "./env.js"; // import environment configuration to access email-related credentials and settings

export const resendClient = new Resend(ENV.RESEND_API_KEY); // create and export a Resend client instance authenticated with the API key

export const sender = { // define and export a sender configuration object used as the default email sender
    email: ENV.EMAIL_FROM, // set the sender email address from environment variables
    name: ENV.EMAIL_FROM_NAME, // set the sender display name from environment variables
};