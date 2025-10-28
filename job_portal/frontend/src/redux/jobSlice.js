import { createSlice } from "@reduxjs/toolkit"; // import createSlice from redux toolkit to simplify creation of a redux slice that handles job-related state and actions

const jobSlice = createSlice({ // create a redux slice named jobSlice to manage job data, admin jobs, applied jobs, and search functionality
    name: "job", // set the name of this slice as 'job' to represent the job-related section of the redux store
    initialState: { // define the default structure and initial values for the job state
        allJobs: [], // initialize allJobs as an empty array to store all available job listings once fetched
        allAdminJobs: [], // initialize allAdminJobs as an empty array to hold job postings managed by the admin user
        singleJob: null, // initialize singleJob as null to indicate that no specific job details are currently loaded
        searchJobByText: "", // initialize searchJobByText as an empty string to capture user input for job search filtering
        allAppliedJobs: [], // initialize allAppliedJobs as an empty array to track all jobs that the user has applied for
        searchedQuery: "", // initialize searchedQuery as an empty string to store the latest job search keyword entered by the user
    },
    reducers: { // define reducer functions to describe how job state properties should change in response to dispatched actions
        setAllJobs: (state, action) => { // define reducer setAllJobs which replaces allJobs with the data received in action payload
            state.allJobs = action.payload; // assign action.payload to allJobs to update the list of all job postings
        },
        setSingleJob: (state, action) => { // define reducer setSingleJob which updates singleJob with a specific job object from the payload
            state.singleJob = action.payload; // assign action.payload to singleJob to store currently selected job details
        },
        setAllAdminJobs: (state, action) => { // define reducer setAllAdminJobs which updates the admin job postings in the state
            state.allAdminJobs = action.payload; // assign action.payload to allAdminJobs to store jobs managed by the admin
        },
        setSearchJobByText: (state, action) => { // define reducer setSearchJobByText which updates the text used for live job search filtering
            state.searchJobByText = action.payload; // assign action.payload to searchJobByText to reflect current search bar input
        },
        setAllAppliedJobs: (state, action) => { // define reducer setAllAppliedJobs which updates the applied jobs array in the state
            state.allAppliedJobs = action.payload; // assign action.payload to allAppliedJobs to maintain the list of jobs user has applied for
        },
        setSearchedQuery: (state, action) => { // define reducer setSearchedQuery which records the most recent job search keyword
            state.searchedQuery = action.payload; // assign action.payload to searchedQuery to store the latest search phrase entered by user
        }
    }
});

export const { // destructure and export action creators to allow dispatching specific job-related updates from ui components
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery
} = jobSlice.actions;

export default jobSlice.reducer; // export reducer function as default to integrate jobSlice into the central redux store