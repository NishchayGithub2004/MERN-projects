import multer from "multer"; // import the multer library to handle file uploads in Node.js

const upload = multer( // call the multer function to create an upload middleware
    { dest: "uploads/" } // pass an options object with 'dest' set to "uploads/" to specify the directory where uploaded files will be stored
);

export default upload; // export the configured upload middleware as the default export so it can be used in other modules
