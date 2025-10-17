import express from "express"; // import express module to create a router for handling media-related requests
import upload from "../utils/multer.js"; // import multer configuration to handle file uploads, such as videos or images
import { uploadMedia } from "../utils/cloudinary.js"; // import function uploadMedia to upload files to Cloudinary cloud storage

const mediaRoute = express.Router(); // create an Express router instance to define media-related routes

mediaRoute.route("/upload-video") // define POST route for uploading a video file
    .post( // use POST method since file uploads involve sending data to the server
        upload.single("file"), // call multer's single method with argument "file" to accept a single file with field name "file" from the client
        async (req, res) => { // define an asynchronous callback function with parameters req (request) and res (response)
            try { // start try block to handle successful file upload
                const result = await uploadMedia(req.file.path); // call uploadMedia function with argument req.file.path to upload file from local path to Cloudinary and wait for result
                
                res.status(200).json({ // send HTTP 200 response to client if upload is successful
                    success: true, // indicate successful status in response
                    message: "File uploaded successfully.", // include success message
                    data: result // include result data (like URL or Cloudinary info) returned from uploadMedia
                });
            } catch (error) { // start catch block to handle any errors during upload
                console.log(error); // log error details to console for debugging
                
                res.status(500).json({ message: "Error uploading file" }); // send HTTP 500 response to client indicating internal server error
            }
        }
    );

export default mediaRoute; // export mediaRoute to make it available for use in the main application router