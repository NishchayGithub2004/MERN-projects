import { Company } from "../models/company.model.js"; // import the Company model to interact with the companies collection in the database
import getDataUri from "../utils/datauri.js"; // import the getDataUri utility to convert uploaded files into data URIs
import cloudinary from "../utils/cloudinary.js"; // import the configured cloudinary instance to handle image uploads

export const registerCompany = async (req, res) => { // define an asynchronous function registerCompany to handle new company registration
    try { // start a try block to handle errors during registration
        const { companyName } = req.body; // extract companyName from the request body

        if (!companyName) { // check if companyName is not provided
            return res.status(400).json({ // return a 400 Bad Request response
                message: "Company name is required.", // send an error message indicating the missing company name
                success: false // indicate failure
            });
        }

        let company = await Company.findOne({ name: companyName }); // query the database to check if a company with the same name already exists

        if (company) { // check if the company already exists
            return res.status(400).json({ // return a 400 Bad Request response
                message: "You can't register same company.", // send a message indicating duplicate company registration
                success: false // indicate failure
            });
        }

        company = await Company.create({ // create a new company document in the database
            name: companyName, // set the name field to the provided companyName
            userId: req.id // set the userId field to the authenticated user's ID
        });

        return res.status(201).json({ // return a 201 Created response indicating successful registration
            message: "Company registered successfully.", // send a success message
            company, // include the newly created company document in the response
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error to the console for debugging
    }
};

export const getCompany = async (req, res) => { // define an asynchronous function getCompany to fetch all companies created by the authenticated user
    try { // start a try block to handle errors
        const userId = req.id; // extract the authenticated user's ID from the request object

        const companies = await Company.find({ userId }); // query the database to find all companies associated with the user

        if (!companies) { // check if no companies are found
            return res.status(404).json({ // return a 404 Not Found response
                message: "Companies not found.", // send an error message
                success: false // indicate failure
            });
        }

        return res.status(200).json({ // return a 200 OK response with the user's companies
            companies, // include the fetched companies in the response
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};

export const getCompanyById = async (req, res) => { // define an asynchronous function getCompanyById to fetch a single company by its ID
    try { // start a try block to handle errors
        const companyId = req.params.id; // extract the company ID from the route parameters

        const company = await Company.findById(companyId); // query the database to find the company by its ID

        if (!company) { // check if the company does not exist
            return res.status(404).json({ // return a 404 Not Found response
                message: "Company not found.", // send an error message
                success: false // indicate failure
            });
        }

        return res.status(200).json({ // return a 200 OK response with the fetched company
            company, // include the company document in the response
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};

export const updateCompany = async (req, res) => { // define an asynchronous function updateCompany to update a company's information
    try { // start a try block to handle errors
        const { name, description, website, location } = req.body; // extract company details from the request body

        const file = req.file; // extract the uploaded file from the request object
        const fileUri = getDataUri(file); // convert the uploaded file to a data URI using getDataUri
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content); // upload the data URI content to Cloudinary
        const logo = cloudResponse.secure_url; // extract the secure URL of the uploaded image from Cloudinary's response

        const updateData = { name, description, website, location, logo }; // create an object containing the updated company fields

        const company = await Company.findByIdAndUpdate( // update the company document in the database by its ID
            req.params.id, // specify the company ID from route parameters
            updateData, // provide the updated data
            { new: true } // return the updated document after modification
        );

        if (!company) { // check if the company was not found
            return res.status(404).json({ // return a 404 Not Found response
                message: "Company not found.", // send an error message
                success: false // indicate failure
            });
        }

        return res.status(200).json({ // return a 200 OK response indicating successful update
            message: "Company information updated.", // send a success message
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};
