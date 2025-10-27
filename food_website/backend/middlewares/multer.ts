import multer from "multer" // import 'multer' class from multer library to handle file uploads

const storage = multer.memoryStorage(); // create a memory storage engine to store uploaded files in memory temporarily

const upload  = multer({ // create an instance of 'multer' class named 'upload'
    storage:storage, // pass 'storage' storage engine to it
    limits:{ // implement following limits to file uploads
        fileSize: 5 * 1024 * 1024, // limit file size to 5MB
    }
})

export default upload; // export the 'upload' instance to use it in other parts of the application