import { v2 as cloudinary } from "cloudinary"; // import the Cloudinary v2 SDK to manage media uploads, storage, and transformations
import { ENV } from "./env.js"; // import environment variables to securely access Cloudinary credentials

cloudinary.config({ // configure the Cloudinary SDK with account-specific credentials
    cloud_name: ENV.CLOUDINARY_CLOUD_NAME, // set the Cloudinary cloud name to identify the target account
    api_key: ENV.CLOUDINARY_API_KEY, // provide the API key to authenticate requests made to Cloudinary
    api_secret: ENV.CLOUDINARY_API_SECRET, // supply the API secret to authorize and sign Cloudinary operations
});

export default cloudinary;