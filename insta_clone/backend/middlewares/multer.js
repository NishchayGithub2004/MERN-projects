import multer from "multer"; // import the multer library to handle multipart/form-data, typically used for file uploads

const upload = multer({ // define a multer instance named upload to configure file upload handling
    storage: multer.memoryStorage(), // set the storage option to memoryStorage so uploaded files are stored in memory as Buffer objects instead of being written to disk
});

export default upload; // export the configured multer instance as the default export for use in routes or controllers handling file uploads
