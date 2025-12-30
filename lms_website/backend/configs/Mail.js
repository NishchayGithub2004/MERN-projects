import nodemailer from "nodemailer"; // import nodemailer library to enable sending emails from the backend
import dotenv from "dotenv"; // import dotenv to load environment variables from .env file into process.env

dotenv.config(); // load environment variables so email credentials can be accessed securely

const transporter = nodemailer.createTransport({ // create a reusable email transporter configured to send emails via gmail smtp
  service: "Gmail", // specify gmail as the email service provider
  port: 465, // use secure smtp port required by gmail
  secure: true, // enable ssl to encrypt email communication
  auth: { // provide authentication credentials required by gmail smtp
    user: process.env.EMAIL, // read sender email address from environment variables
    pass: process.env.EMAIL_PASS, // read email password or app password from environment variables
  },
});

const sendMail = async ( // define a function to send otp email for password reset which takes the following arguments
  to, // accept recipient email address to know where the otp should be sent
  otp // accept one-time password value to include in the email content
) => {
  transporter.sendMail({ // send an email using the configured transporter
    from: process.env.EMAIL, // set sender email address from environment variables
    to: to, // specify recipient email address dynamically
    subject: "Reset Your Password", // define email subject to inform user about password reset
    html: `<p>Your OTP for Password Reset is <b>${otp}</b>. It expires in 5 minutes.</p>` // generate email body with dynamic otp value
  });
};

export default sendMail