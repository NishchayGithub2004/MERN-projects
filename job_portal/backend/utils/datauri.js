import DataUriParser from "datauri/parser.js"; // import the DataUriParser class from the datauri library to help convert files into data URIs
// data URIs are base64 encoded form of all contents of a file, this encoding is done to use files and their contents like images, fonts etc. in HTML CSS JS etc. directly without sending a request or expecting a response
import path from "path"; // import the built-in path module to work with and manipulate file paths

const getDataUri = (file) => { // define a function getDataUri to convert an uploaded file into a data URI, with 'file' as the argument representing the uploaded file object
    const parser = new DataUriParser(); // create a new instance of DataUriParser to handle file-to-data-URI conversion
    const extName = path.extname(file.originalname).toString(); // extract the file extension from the file’s original name using 'path.extname' and convert it to a string, the extension of file is necessary to properly create the data URI
    return parser.format(extName, file.buffer); // call the format method to create data URI, it takes name of file extension (PNG, JPG etc.) so that such data URI is created using which browsers will interpret contents of data URI correctly 
    // and it also takes contents of file in buffer/binary format as it will be what exists in data URI
}

export default getDataUri; // export the getDataUri function as the default export for use in other modules
