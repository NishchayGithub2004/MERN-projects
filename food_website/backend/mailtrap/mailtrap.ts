import { MailtrapClient } from "mailtrap"; // import 'MailTrapClient' class from 'mailtrap' library to interact with MailTrap API to send and manage emails in a testing environment
import dotenv from "dotenv"; // import 'dotenv' library to load environment variables from a '.env' file

dotenv.config(); // this line loads the environment variables defined in the '.env' file into 'process.env' object

export const client = new MailtrapClient({ token: process.env.MAILTRAP_API_TOKEN! }); // create a new instance of 'MailtrapClient' class named 'client' to interact with MailTrap API
// pass the API token from the environment variable 'MAILTRAP_API_TOKEN' as an argument to the constructor to interact with MailTrap API through your own account

export const sender = { // define an object named 'sender' to specify the email address and name of the sender of the email
    email: "nishchaybackup@gmail.com", // email address of the sender
    name: "Nishchay Goswami", // name of the sender
};