import { resendClient, sender } from "../lib/resend.js"; // import 'resendClient' object to get access to resend's API key and use it to send emails
// and 'sender' object to know the sender's email and name
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js"; // umport 'createWelcomeEmailTemplate' function to use email template for the welcome email

export const sendWelcomeEmail = async (email, name, clientURL) => { // create a function called 'sendWelcomeEmail' to send welcome email to a new user
    // it takes in three parameters: email address of the new user, name of the new user, and clientURL to generate a link to the new user's app profile
    const { _, error } = await resendClient.emails.send({ // use resend's API to send the email
        from: `${sender.name} <${sender.email}>`, // set the sender's email and name
        to: email, // set the receiver's email address
        subject: "Welcome to Chatify!", // subject of the email
        html: createWelcomeEmailTemplate(name, clientURL), // render the email template using the 'createWelcomeEmailTemplate' function 
        // and pass in the new user's name and app profile URL as arguments to render the dynamic content
    });

    if (error) { // if any error occurs while sending the email
        console.error("Error sending welcome email:", error); // log the error to the console to know what error occurred
        throw new Error("Failed to send welcome email"); // throw an error to indicate that the email failed to send
    }

    console.log("Welcome Email sent successfully"); // if the email is sent successfully, log a success message to the console that email was sent successfully
};