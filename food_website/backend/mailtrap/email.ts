import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail"; // import the HTML templates of emails from 'htmlEmail.ts' file
import { client, sender } from "./mailtrap"; // import 'client' and 'sender' objects from 'mailtrap.ts' file

export const sendVerificationEmail = async (email: string, verificationToken: string) => { // create an async function to send verification email which takes email content and verification token in string form
    const recipient = [{ email }]; // create an object named 'recipient' that contains 'email' property
    
    try { // try block to handle potential errors that may occur during email sending
        const res = await client.send({ // use 'send' function to send the email
            from: sender, // set the sender of email to 'sender' object
            to: recipient, // set the receiver of email to 'recipient' object
            subject: 'Verify your email', // set the subject of email to 'Verify your email'
            html: htmlContent.replace("{verificationToken}", verificationToken), // in the HTML template, replace the placeholder '{verificationToken}' with the actual verification token
            category: 'Email Verification' // set the category of email to 'Email Verification'
        });
    } catch (error) { // catch block to handle errors that occur during email sending
        console.log(error); // if there's an error, log it to the console for debugging purposes
        throw new Error("Failed to send email verification") // throw an error with a message indicating that email verification failed
    }
}

export const sendWelcomeEmail = async (email: string, name: string) => { // create an async function to send welcome email which takes email content and name in string form
    const recipient = [{ email }]; // create an object named 'recipient' that contains 'email' property
    
    const htmlContent = generateWelcomeEmailHtml(name); // generate HTML template of email using 'generateWelcomeEmailHtml' function and pass in 'name' as an argument
    
    try { // try block to handle potential errors that may occur during email sending
        const res = await client.send({ // use 'send' function to send the email
            from: sender, // set the sender of email to 'sender' object
            to: recipient, // set the receiver of email to 'recipient' object
            subject: 'Welcome to EatItUp', // set the subject of email to 'Welcome to EatItUp'
            html: htmlContent, // set the HTML content of email to the generated HTML template
            template_variables: { // pass the following variables to the email template
                company_info_name: "PatelEats", // set the name of the company to 'EatItUp'
                name: name // set the name of the receiver to the passed-in 'name' argument
            }
        });
    } catch (error) { // catch block to handle errors that occur during email sending
        console.log(error); // if an error occurs, log it to the console for debugging purposes
        throw new Error("Failed to send welcome email") // throw an error with a message indicating that sending the welcome email failed
    }
}

export const sendPasswordResetEmail = async (email: string, resetURL: string) => { // create an async function to send password reset email which takes email content and reset URL in string form
    const recipient = [{ email }]; // create an object named 'recipient' that contains 'email' property
    
    const htmlContent = generatePasswordResetEmailHtml(resetURL); // generate the HTML content of the email using the 'generatePasswordResetEmailHtml' function and passing in the 'resetURL' as an argument
    
    try { // try block to handle potential errors that may occur during email sending
        const res = await client.send({ // use 'send' function to send the email
            from: sender, // set the sender of the email to the 'sender' object
            to: recipient, // set the receiver of the email to the 'recipient' object
            subject: 'Reset your password', // set the subject of the email to 'Reset your password'
            html: htmlContent, // set the HTML content of the email to the generated HTML content
            category: "Reset Password" // set the category of the email to 'Reset Password'
        });
    } catch (error) { // catch block to handle errors that occur during email sending
        console.log(error); // if an error occurs, log it to the console for debugging purposes
        throw new Error("Failed to send password reset email") // throw an error with a message indicating that sending the password reset email failed
    }
}

export const sendResetSuccessEmail = async (email: string) => { // create an async function to send password reset success email which takes email content in string form
    const recipient = [{ email }]; // create an object named 'recipient' that contains 'email' property
    
    const htmlContent = generateResetSuccessEmailHtml(); // generate the HTML content of the email using the 'generateResetSuccessEmailHtml' function
    
    try { // try block to handle potential errors that may occur during email sending
        const res = await client.send({ // use'send' function to send the email
            from: sender, // set the sender of the email to the 'sender' object
            to: recipient, // set the receiver of the email to the 'recipient' object
            subject: 'Password Reset Successfully', // set the subject of the email to 'Password Reset Successfully'
            html: htmlContent, // set the HTML content of the email to the generated HTML content
            category: "Password Reset" // set the category of the email to 'Password Reset'
        });
    } catch (error) { // catch block to handle errors that occur during email sending
        console.log(error); // if an error occurs, log it to the console for debugging purposes
        throw new Error("Failed to send password reset success email"); // throw an error with a message indicating that sending the password reset success email failed
    }
}