import { Application } from "../models/application.model.js"; // import the Application model to interact with the applications collection in the database
import { Job } from "../models/job.model.js"; // import the Job model to interact with the jobs collection in the database

export const applyJob = async (req, res) => { // define an asynchronous function applyJob to handle job application requests, with req as the request object and res as the response object
    try { // start a try block to handle errors during the job application process
        const userId = req.id; // extract the authenticated user's ID from the request object

        const jobId = req.params.id; // extract the job ID from the route parameters

        if (!jobId) { // check if jobId is not provided
            return res.status(400).json({ // return a 400 Bad Request response if jobId is missing
                message: "Job id is required.", // send an error message indicating the job ID is required
                success: false // indicate failure
            });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: userId }); // query the database to check if the user has already applied for this job

        if (existingApplication) { // check if an existing application is found
            return res.status(400).json({ // return a 400 Bad Request response if the user already applied
                message: "You have already applied for this jobs", // send a message indicating duplicate application
                success: false // indicate failure
            });
        }

        const job = await Job.findById(jobId); // query the database to fetch the job by its ID

        if (!job) { // check if the job does not exist
            return res.status(404).json({ // return a 404 Not Found response if the job is missing
                message: "Job not found", // send a message indicating the job was not found
                success: false // indicate failure
            });
        }

        const newApplication = await Application.create({ // create a new application document in the database
            job: jobId, // set the job field to the jobId
            applicant: userId, // set the applicant field to the authenticated user's ID
        });

        job.applications.push(newApplication._id); // add the new application's ID to the job's applications array

        await job.save(); // save the updated job document to the database

        return res.status(201).json({ // return a 201 Created response indicating successful application
            message: "Job applied successfully.", // send a success message
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error to the console for debugging
    }
};

export const getAppliedJobs = async (req, res) => { // define an asynchronous function getAppliedJobs to fetch all jobs the authenticated user has applied for
    try { // start a try block to handle runtime errors
        const userId = req.id; // extract the authenticated user's ID from the request object

        const application = await Application.find({ applicant: userId }) // find all applications by this user
            .sort({ createdAt: -1 }) // sort the applications by creation date in descending order
            .populate({ // populate the job field of each application
                path: 'job', // specify the field to populate
                options: { sort: { createdAt: -1 } }, // sort the populated jobs by creation date descending
                populate: { // populate nested field inside job
                    path: 'company', // populate the company field of each job
                    options: { sort: { createdAt: -1 } } // sort the populated companies by creation date descending
                }
            });

        if (!application) { // check if no applications are found
            return res.status(404).json({ // return a 404 Not Found response
                message: "No Applications", // send a message indicating no applications exist
                success: false // indicate failure
            });
        }

        return res.status(200).json({ // return a 200 OK response with the applications
            application, // include the fetched applications in the response
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error to the console for debugging
    }
};

export const getApplicants = async (req, res) => { // define an asynchronous function getApplicants to fetch all applicants for a specific job
    try { // start a try block to handle errors
        const jobId = req.params.id; // extract the job ID from the route parameters

        const job = await Job.findById(jobId) // find the job by its ID
            .populate({ // populate the applications field of the job
                path: 'applications', // specify the field to populate
                options: { sort: { createdAt: -1 } }, // sort applications by creation date descending
                populate: { // populate nested applicant field in each application
                    path: 'applicant' // populate the applicant field
                }
            });

        if (!job) { // check if the job does not exist
            return res.status(404).json({ // return a 404 Not Found response
                message: 'Job not found.', // send an error message
                success: false // indicate failure
            });
        }

        return res.status(200).json({ // return a 200 OK response with the job and populated applicants
            job, // include the job with populated applications and applicants
            succees: true // indicate success (note: typo exists in original code, should be 'success')
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error to the console
    }
};

export const updateStatus = async (req, res) => { // define an asynchronous function updateStatus to update the status of a specific application
    try { // start a try block to handle errors
        const { status } = req.body; // extract the status field from the request body

        const applicationId = req.params.id; // extract the application ID from the route parameters

        if (!status) { // check if status is not provided
            return res.status(400).json({ // return a 400 Bad Request response
                message: 'status is required', // send an error message indicating missing status
                success: false // indicate failure
            });
        }

        const application = await Application.findOne({ _id: applicationId }); // find the application document by its ID

        if (!application) { // check if the application does not exist
            return res.status(404).json({ // return a 404 Not Found response
                message: "Application not found.", // send an error message
                success: false // indicate failure
            });
        }

        application.status = status.toLowerCase(); // update the application's status to the provided value in lowercase

        await application.save(); // save the updated application document to the database

        return res.status(200).json({ // return a 200 OK response indicating successful status update
            message: "Status updated successfully.", // send a success message
            success: true // indicate success
        });
    } catch (error) { // catch any errors thrown in the try block
        console.log(error); // log the error to the console for debugging
    }
};
