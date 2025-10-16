import { v2 as cloudinary } from "cloudinary"; // import the v2 version of the cloudinary library and rename it locally to 'cloudinary' for easier use
import dotenv from "dotenv"; // import the dotenv library to manage environment variables from a .env file
dotenv.config(); // call the config method of dotenv to load environment variables from the .env file into process.env

cloudinary.config({ // call the config method of the cloudinary object to set up authentication credentials
    cloud_name: process.env.CLOUD_NAME, // set the Cloudinary cloud name by reading it from the environment variable CLOUD_NAME
    api_key: process.env.API_KEY, // set the Cloudinary API key by reading it from the environment variable API_KEY
    api_secret: process.env.API_SECRET // set the Cloudinary API secret key by reading it from the environment variable API_SECRET
});

export default cloudinary; // export the configured cloudinary instance as the default export for use in other modules
