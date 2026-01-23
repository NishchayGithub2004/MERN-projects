import { Resend } from "resend"; // import 'Resend' class from 'resend' library to programmatically send emails
import { ENV } from "./env.js"; // import 'ENV' object from 'env.js' file to access and use environment variables

export const resendClient = new Resend(ENV.RESEND_API_KEY); // create a new instance of 'Resend' class with the API key from the 'ENV' object
// for the project to know who is sending the email

// export an object called 'sender' that contains name and email address of the sender of the email
export const sender = {
    email: ENV.EMAIL_FROM,
    name: ENV.EMAIL_FROM_NAME,
};