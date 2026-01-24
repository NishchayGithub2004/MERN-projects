import Feature from "../../models/Feature"; // import Feature model from models folder to interact with Feature collection in database

const addFeatureImage = async (req, res) => { // define async function addFeatureImage with req (request object) and res (response object) as arguments
    try { // start try block to handle potential errors
        const { image } = req.body; // extract image property from request body using object destructuring

        console.log(image, "image"); // log the received image to console for debugging purposes

        const featureImages = new Feature({ image }); // create new instance of Feature model with image field set to received image

        await featureImages.save(); // save the new featureImages document to the database asynchronously

        res.status(201).json({ // send response with status 201 (created) and JSON data
            success: true, // indicate operation was successful
            data: featureImages, // include the saved featureImages document in the response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log the error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured!", // include error message in response
        });
    }
};

const getFeatureImages = async (_, res) => { // define async function getFeatureImages with ignored first argument (_) and res (response object)
    try { // start try block to handle potential errors
        const images = await Feature.find({}); // fetch all documents from Feature collection asynchronously and store in images

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: images, // include the fetched images in the response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log the error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Some error occured!", // include error message in response
        });
    }
};

module.exports = { addFeatureImage, getFeatureImages }; // export addFeatureImage and getFeatureImages functions as named exports
