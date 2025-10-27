import cloudinary from "./cloudinary"; // import cloudinary configuration

const uploadImageOnCloudinary = async (file: any) => { // create a function to upload image on cloudinary that takes a file object as a parameter
    const base64Image = Buffer.from(file.buffer).toString("base64"); // extract content of file in buffer/binary form and perform base64 encoding to it
    
    const dataURI = `data:${file.mimetype};base64,${base64Image}`; // create a data URI that contains the file's MIME type (PNG, JPG etc.) and the base64-encoded content
    
    const uploadResponse = await cloudinary.uploader.upload(dataURI); // upload the data URI to Cloudinary using the uploader.upload method
    
    return uploadResponse.secure_url; // return the secure URL of the uploaded image
};

export default uploadImageOnCloudinary; // export the function to be used in different parts of the application