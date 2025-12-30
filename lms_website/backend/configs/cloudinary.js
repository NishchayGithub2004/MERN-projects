import { v2 as cloudinary } from "cloudinary"; // import cloudinary v2 sdk to upload files to cloudinary cloud storage
import fs from "fs"; // import filesystem module to delete local files after upload

const uploadOnCloudinary = async (filePath) => { // define a function to upload a local file to cloudinary and return its public url that takes filePath to locate the file on the server filesystem
    cloudinary.config({ // configure cloudinary client with credentials to authenticate upload requests
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // set cloudinary cloud name from environment variables for account identification
        api_key: process.env.CLOUDINARY_API_KEY, // set api key from environment variables to authorize cloudinary requests
        api_secret: process.env.CLOUDINARY_API_SECRET // set api secret from environment variables to securely sign upload requests
    });

    try {
        if (!filePath) return null; // exit early if file path is missing because upload cannot be performed

        const uploadResult = await cloudinary.uploader.upload( // upload file to cloudinary using uploader api and wait for completion
            filePath, // pass local file path so cloudinary can read and upload the file
            { resource_type: "auto" } // allow cloudinary to automatically detect and handle file type
        );

        fs.unlinkSync(filePath); // delete local file after successful upload to prevent unnecessary disk usage

        return uploadResult.secure_url; // return secure hosted url so it can be stored or sent to client
    } catch (error) {
        fs.unlinkSync(filePath); // ensure local file is deleted even if upload fails to avoid orphan files
        console.log(error); // log error details to help debug cloudinary upload failures
    }
};

export default uploadOnCloudinary;