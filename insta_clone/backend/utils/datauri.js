import DataUriParser from "datauri/parser.js"; // import the DataUriParser class from the datauri library to help convert files into data URIs
import path from "path"; // import the built-in path module to handle and transform file paths

const getDataUri = (file) => { // define a function getDataUri to convert an uploaded file into a data URI, with 'file' as the argument representing the uploaded file object
    const parser = new DataUriParser(); // create a new instance of DataUriParser to handle file-to-data-URI conversion
    const extName = path.extname(file.originalname).toString(); // extract the file extension from the file’s original name using path.extname and convert it to a string
    return parser.format(extName, file.buffer); // call the format method on parser to create a data URI using the file extension and binary buffer data
}

export default getDataUri; // export the getDataUri function as the default export for use in other modules
