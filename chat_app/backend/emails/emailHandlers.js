import { resendClient, sender } from "../lib/resend.js"; // import resendClient to send transactional emails via the Resend service, sender to define the default from name and email address for outgoing emails
import { createWelcomeEmailTemplate } from "../emails/emailTemplates.js"; // import the function that generates the HTML template for the welcome email

export const sendWelcomeEmail = async (email, name, clientURL) => { // define an async function to send a welcome email to a newly registered user
    const { data, error } = await resendClient.emails.send({ // send an email using the Resend client and capture response data or errors
        from: `${sender.name} <${sender.email}>`, // set the sender name and email address displayed in the recipient's inbox
        to: email, // specify the recipient's email address
        subject: "Welcome to Chatify!", // define the email subject line shown to the user
        html: createWelcomeEmailTemplate(name, clientURL), // generate the email body HTML using user-specific data and client URL
    });

    if (error) { // check whether the email sending operation resulted in an error
        console.error("Error sending welcome email:", error); // log the error details to aid debugging and monitoring
        throw new Error("Failed to send welcome email"); // throw an error to propagate failure handling to the caller
    }

    console.log("Welcome Email sent successfully", data); // log a success message along with response data for confirmation
};