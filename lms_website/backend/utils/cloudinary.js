import { v2 as cloudinary } from "cloudinary"; // import the v2 version of the cloudinary library and rename it locally as 'cloudinary'
import dotenv from "dotenv"; // import the dotenv package to manage environment variables
dotenv.config({}); // call the config() method of dotenv with an empty object to load environment variables from the .env file into process.env

cloudinary.config({ // call the config() method of cloudinary to configure its credentials
    api_key: process.env.API_KEY, // set the api_key by accessing the API_KEY variable from the environment
    api_secret: process.env.API_SECRET, // set the api_secret by accessing the API_SECRET variable from the environment
    cloud_name: process.env.CLOUD_NAME, // set the cloud_name by accessing the CLOUD_NAME variable from the environment
});

export const uploadMedia = async (file) => { // define an asynchronous function uploadMedia that takes 'file' as argument to upload media files to Cloudinary
    try { // start a try block to handle possible upload errors
        const uploadResponse = await cloudinary.uploader.upload( // call the upload() method of cloudinary.uploader using await to upload the given file
            file, // pass the 'file' argument received by the function to specify which file to upload
            { 
                resource_type: "auto", // set resource_type to "auto" to let Cloudinary automatically detect whether the file is an image, video, or other
            }
        ); 
        
        return uploadResponse; // return the uploadResponse object containing the upload details from Cloudinary
    } catch (error) { // catch block to handle any error that occurs during upload
        console.log(error); // log the error to the console for debugging
    }
};

export const deleteMediaFromCloudinary = async (publicId) => { // define an asynchronous function deleteMediaFromCloudinary that takes 'publicId' as argument to delete any media file from Cloudinary
    try { // start a try block to handle possible deletion errors
        await cloudinary.uploader.destroy( // call the destroy() method of cloudinary.uploader using await to delete the media file
            publicId // pass the 'publicId' argument to identify which file to delete
        );
    } catch (error) { // catch block to handle errors during deletion
        console.log(error); // log the error to the console for debugging
    }
};

export const deleteVideoFromCloudinary = async (publicId) => { // define an asynchronous function deleteVideoFromCloudinary that takes 'publicId' as argument to delete only video files from Cloudinary
    try { // start a try block to handle possible deletion errors
        await cloudinary.uploader.destroy( // call the destroy() method of cloudinary.uploader using await to delete a specific video file
            publicId, // pass the 'publicId' argument to specify which video to delete
            { resource_type: "video" } // pass an object with resource_type set to "video" to indicate that the target file is a video
        );
    } catch (error) { // catch block to handle errors during deletion
        console.log(error); // log the error to the console for debugging
    }
};
