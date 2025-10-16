import multer from "multer"; // import the multer library to handle file uploads in Node.js

const storage = multer.memoryStorage(); // create a storage engine using multer's memoryStorage method to temporarily store uploaded files in memory as Buffer objects

export const singleUpload = multer({ storage }).single("file"); // create and export a middleware named singleUpload by calling multer with the storage configuration and using the single method to handle uploads of a single file under the field name "file"
