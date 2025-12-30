import multer from "multer"; // import multer library to handle multipart form-data for file uploads

let storage = multer.diskStorage({ // create a disk storage configuration to control where and how uploaded files are stored
    destination: ( // define a callback to decide the upload directory for incoming files which takes the following arguments
        _, // ignore request object because destination logic does not depend on request data
        _, // ignore file metadata because destination path is static
        cb // receive callback function to pass the resolved destination path or an error
    ) => {
        cb(null, "./public"); // store uploaded files inside the public directory to make them accessible if needed
    },
    filename: ( // define a callback to decide the stored filename for uploaded files which takes the following arguments
        _, // ignore request object because filename logic does not depend on request data
        file, // receive uploaded file object to access original file metadata
        cb // receive callback function to pass the final filename or an error
    ) => {
        cb(null, file.originalname); // save file using its original name to preserve client-side naming
    }
});

export default upload = multer({ storage }); // create and export a multer instance configured with disk storage to handle file uploads