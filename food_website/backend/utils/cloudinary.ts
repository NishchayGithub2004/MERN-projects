import { v2 as cloudinary } from "cloudinary"; // import cloudinary library for uploading images to cloud
import dotenv from "dotenv"; // import dotenv library for loading environment variables from .env file

dotenv.config(); // load environment variables from .env file into process.env object

cloudinary.config({ // configure cloudinary as follows
    api_key: process.env.API_KEY, // set api_key to value of API_KEY environment variable to specify the cloudinary account to use
    api_secret: process.env.API_SECRET, // set api_secret to value of API_SECRET environment variable to authenticate the interaction with cloudinary
    cloud_name: process.env.CLOUD_NAME, // set cloud_name to value of CLOUD_NAME environment variable to specify the cloudinary account to use
});

export default cloudinary; // export cloudinary object with specified configuration