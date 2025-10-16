import { Job } from "../models/job.model.js"; // import the Job model to interact with the jobs collection in the database

export const postJob = async (req, res) => { // define an asynchronous function postJob to create a new job posting
    try { // start a try block to handle errors during job creation
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body; // extract job details from the request body

        const userId = req.id; // get the authenticated user's ID from the request object

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) { // check if any required field is missing
            return res.status(400).json({ // return a 400 Bad Request response if any field is missing
                message: "Somethin is missing.", // send an error message indicating missing fields
                success: false // indicate failure
            });
        }

        const job = await Job.create({ // create a new job document in the database
            title, // set the job title
            description, // set the job description
            requirements: requirements.split(","), // split the comma-separated requirements string into an array
            salary: Number(salary), // convert the salary to a number
            location, // set the job location
            jobType, // set the type of job
            experienceLevel: experience, // set the experience level required for the job
            position, // set the number of open positions
            company: companyId, // associate the job with a specific company
            created_by: userId // set the creator of the job to the authenticated user
        });

        return res.status(201).json({ // return a 201 Created response indicating the job was created successfully
            message: "New job created successfully.", // send a success message
            job, // include the created job document in the response
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};

export const getAllJobs = async (req, res) => { // define an asynchronous function getAllJobs to fetch all jobs, optionally filtered by a search keyword
    try { // start a try block to handle errors
        const keyword = req.query.keyword || ""; // get the search keyword from query parameters or default to an empty string

        const query = { // construct a MongoDB query object for keyword search
            $or: [ // use $or to match either title or description
                { title: { $regex: keyword, $options: "i" } }, // match title case-insensitively
                { description: { $regex: keyword, $options: "i" } }, // match description case-insensitively
            ]
        };

        const jobs = await Job.find(query) // execute the query on the jobs collection
            .populate({ path: "company" }) // populate the company field with the associated company document
            .sort({ createdAt: -1 }); // sort jobs by creation date descending

        if (!jobs) { // check if no jobs were found
            return res.status(404).json({ // return a 404 Not Found response
                message: "Jobs not found.", // send an error message
                success: false // indicate failure
            });
        }

        return res.status(200).json({ // return a 200 OK response with the fetched jobs
            jobs, // include the fetched job documents
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};

export const getJobById = async (req, res) => { // define an asynchronous function getJobById to fetch a single job by its ID
    try { // start a try block to handle errors
        const jobId = req.params.id; // extract the job ID from route parameters

        const job = await Job.findById(jobId) // find the job document by ID
            .populate({ path: "applications" }); // populate the applications field with associated application documents

        if (!job) { // check if the job does not exist
            return res.status(404).json({ // return a 404 Not Found response
                message: "Jobs not found.", // send an error message
                success: false // indicate failure
            });
        }

        return res.status(200).json({ // return a 200 OK response with the job
            job, // include the job document
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};

export const getAdminJobs = async (req, res) => { // define an asynchronous function getAdminJobs to fetch all jobs created by the authenticated admin
    try { // start a try block to handle errors
        const adminId = req.id; // get the authenticated admin's user ID from the request object

        const jobs = await Job.find({ created_by: adminId }) // find all jobs where created_by matches the admin's ID
            .populate({ path: 'company', createdAt: -1 }); // populate the company field and attempt to sort by creation date (note: createdAt sorting inside populate is ignored by mongoose)

        if (!jobs) { // check if no jobs are found
            return res.status(404).json({ // return a 404 Not Found response
                message: "Jobs not found.", // send an error message
                success: false // indicate failure
            });
        }

        return res.status(200).json({ // return a 200 OK response with the admin's jobs
            jobs, // include the fetched job documents
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error for debugging
    }
};
