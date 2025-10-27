import { v2 as cloudinary } from "cloudinary"; // import the v2 version of the cloudinary library and rename it locally to 'cloudinary' for easier use
import dotenv from "dotenv"; // import the dotenv library to load and use values of environment variables from a '.env' file
dotenv.config(); // call the config method of dotenv to load environment variables from the '.env' file into 'process.env'

cloudinary.config({ // call the 'config' method of the cloudinary object to set up authentication credentials
    cloud_name: process.env.CLOUD_NAME, // set the Cloudinary cloud name by reading it from the environment variable 'CLOUD_NAME', this specifies the name of cloud in cloudinary app this project will interact with
    api_key: process.env.API_KEY, // set the Cloudinary API key by reading it from the environment variable 'API_KEY', this API key will authenticate the request made to cloudinary
    api_secret: process.env.API_SECRET // set the Cloudinary API secret key by reading it from the environment variable 'API_SECRET', this secret key ensures that only authorized users can interact with contents of the Cloudinary account being used for the project
});

export default cloudinary; // export the configured cloudinary instance as the default export for use in other modules
