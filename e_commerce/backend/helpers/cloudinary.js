import { v2 as cloudinary } from "cloudinary"; // import the v2 version of cloudinary SDK and alias it as 'cloudinary' to access its API methods
import multer from "multer"; // import multer, a Node.js middleware used to handle multipart/form-data for file uploads

cloudinary.config({ // call the config() method to configure cloudinary with environment variables
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // assign the cloud name fetched from environment variables to identify the Cloudinary account
  api_key: process.env.CLOUDINARY_API_KEY, // assign the API key fetched from environment variables to authenticate API requests
  api_secret: process.env.CLOUDINARY_API_SECRET, // assign the API secret fetched from environment variables to secure API access
});

const storage = new multer.memoryStorage(); // create an in-memory storage engine using multer's memoryStorage() so uploaded files are stored temporarily in memory as buffers

async function imageUploadUtil(file) { // define an async function 'imageUploadUtil' that takes a 'file' argument representing the file buffer to upload
  const result = await cloudinary.uploader.upload(file, { // call cloudinary's uploader.upload() method to upload the file asynchronously to Cloudinary
    resource_type: "auto", // set 'resource_type' to 'auto' so Cloudinary automatically detects file type (image, video, etc.)
  });

  return result; // return the result object that contains metadata about the uploaded file such as URL, format, and public_id
}

const upload = multer({ storage }); // initialize a multer instance using the previously defined in-memory storage configuration to handle uploads in Express routes

module.exports = { upload, imageUploadUtil }; // export both 'upload' middleware and 'imageUploadUtil' function for use in other parts of the application
