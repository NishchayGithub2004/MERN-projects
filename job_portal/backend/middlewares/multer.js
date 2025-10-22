import multer from "multer"; // import the multer library to handle file uploads in Node.js

const storage = multer.memoryStorage(); // create a storage engine using multer's memoryStorage method to temporarily store uploaded files in memory as Buffer objects

export const singleUpload = multer({ storage }).single("file"); // create and export a middleware named 'singleUpload' by creating an object of 'multer'of name 'singleUpload'
// specify that this middleware takes only one upload file at a time using 'single' method, and it takes the file from form field named 'file'
