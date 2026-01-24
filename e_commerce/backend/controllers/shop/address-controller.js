import Address from "../../models/Address"; // import Address model from models folder to interact with Address collection in database

const addAddress = async (req, res) => { // define async function addAddress with req and res as arguments
    try { // start try block to handle potential errors
        const { userId, address, city, pincode, phone, notes } = req.body; // extract all address fields from request body using object destructuring

        if (!userId || !address || !city || !pincode || !phone || !notes) { // check if any required field is missing
            return res.status(400).json({ // send response with status 400 (bad request) if validation fails
                success: false, // indicate operation failed
                message: "Invalid data provided!", // include message for invalid input
            });
        }

        const newlyCreatedAddress = new Address({ userId, address, city, pincode, notes, phone }); // create new Address instance with provided fields

        await newlyCreatedAddress.save(); // save newlyCreatedAddress document to database asynchronously

        res.status(201).json({ // send response with status 201 (created) and JSON data
            success: true, // indicate operation was successful
            data: newlyCreatedAddress, // include saved address in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

const fetchAllAddress = async (req, res) => { // define async function fetchAllAddress with req and res as arguments
    try { // start try block to handle potential errors
        const { userId } = req.params; // extract userId from request parameters using object destructuring

        if (!userId) { // check if userId is missing
            return res.status(400).json({ // send response with status 400 (bad request) if validation fails
                success: false, // indicate operation failed
                message: "User id is required!", // include message for missing userId
            });
        }

        const addressList = await Address.find({ userId }); // fetch all addresses for the given userId asynchronously and store in addressList

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: addressList, // include fetched addresses in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

const editAddress = async (req, res) => { // define async function editAddress with req and res as arguments
    try { // start try block to handle potential errors
        const { userId, addressId } = req.params; // extract userId and addressId from request parameters using object destructuring

        const formData = req.body; // store request body data in formData to update address fields

        if (!userId || !addressId) { // check if userId or addressId is missing
            return res.status(400).json({ // send response with status 400 (bad request) if validation fails
                success: false, // indicate operation failed
                message: "User and address id is required!", // include message for missing ids
            });
        }

        const address = await Address.findOneAndUpdate( // find address by id and userId and update with formData asynchronously
            {
                _id: addressId, // match address document by _id
                userId, // match address document by userId
            },
            formData, // update address document with formData
            { new: true } // return the updated document
        );

        if (!address) { // check if address was not found
            return res.status(404).json({ // send response with status 404 (not found) if address is missing
                success: false, // indicate operation failed
                message: "Address not found", // include message for missing address
            });
        }

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            data: address, // include updated address in response
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

const deleteAddress = async (req, res) => { // define async function deleteAddress with req and res as arguments
    try { // start try block to handle potential errors
        const { userId, addressId } = req.params; // extract userId and addressId from request parameters using object destructuring

        if (!userId || !addressId) { // check if userId or addressId is missing
            return res.status(400).json({ // send response with status 400 (bad request) if validation fails
                success: false, // indicate operation failed
                message: "User and address id is required!", // include message for missing ids
            });
        }

        const address = await Address.findOneAndDelete({ _id: addressId, userId }); // delete address document matching _id and userId asynchronously

        if (!address) { // check if address was not found
            return res.status(404).json({ // send response with status 404 (not found) if address is missing
                success: false, // indicate operation failed
                message: "Address not found", // include message for missing address
            });
        }

        res.status(200).json({ // send response with status 200 (OK) and JSON data
            success: true, // indicate operation was successful
            message: "Address deleted successfully", // include message confirming deletion
        });
    } catch (e) { // catch any error that occurs in try block
        console.log(e); // log error to console for debugging

        res.status(500).json({ // send response with status 500 (internal server error) and JSON data
            success: false, // indicate operation failed
            message: "Error", // include generic error message
        });
    }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress }; // export all functions as named exports
