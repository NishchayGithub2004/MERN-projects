import { createSlice } from "@reduxjs/toolkit"; // import the createSlice function from Redux Toolkit to define a slice that groups related state logic and actions

const jobSlice = createSlice({ // define a constant named jobSlice by calling createSlice to create a Redux slice for job-related data
    name: "job", // specify the name of the slice as 'job' to label this section of the Redux state tree
    
    initialState: { // define the initial state object for the job slice
        allJobs: [], // initialize allJobs as an empty array to hold a list of all available jobs
        allAdminJobs: [], // initialize allAdminJobs as an empty array to store jobs managed by the admin
        singleJob: null, // initialize singleJob as null to represent no specific job is selected initially
        searchJobByText: "", // initialize searchJobByText as an empty string to hold text input for searching jobs
        allAppliedJobs: [], // initialize allAppliedJobs as an empty array to keep track of jobs the user has applied for
        searchedQuery: "", // initialize searchedQuery as an empty string to store the most recent search query used in job filtering
    },
    
    reducers: { // define an object containing reducer functions that determine how the state updates in response to actions
        setAllJobs: (state, action) => { // define a reducer function setAllJobs with arguments state (current job state) and action (object containing payload data)
            state.allJobs = action.payload; // update allJobs with the value provided in action.payload to store fetched job listings
        },
        setSingleJob: (state, action) => { // define a reducer function setSingleJob with arguments state (current job state) and action (object containing payload data)
            state.singleJob = action.payload; // update singleJob with the job object provided in action.payload to store selected job details
        },
        setAllAdminJobs: (state, action) => { // define a reducer function setAllAdminJobs with arguments state (current job state) and action (object containing payload data)
            state.allAdminJobs = action.payload; // update allAdminJobs with the array provided in action.payload to store admin-managed job postings
        },
        setSearchJobByText: (state, action) => { // define a reducer function setSearchJobByText with arguments state (current job state) and action (object containing payload data)
            state.searchJobByText = action.payload; // update searchJobByText with the value provided in action.payload to store the current search input
        },
        setAllAppliedJobs: (state, action) => { // define a reducer function setAllAppliedJobs with arguments state (current job state) and action (object containing payload data)
            state.allAppliedJobs = action.payload; // update allAppliedJobs with the array provided in action.payload to track all jobs applied by the user
        },
        setSearchedQuery: (state, action) => { // define a reducer function setSearchedQuery with arguments state (current job state) and action (object containing payload data)
            state.searchedQuery = action.payload; // update searchedQuery with the value provided in action.payload to store the latest search keyword
        }
    }
});

export const { // export the automatically generated action creators for dispatching specific actions to modify the job state
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery
} = jobSlice.actions;

export default jobSlice.reducer; // export the reducer function of jobSlice as the default export to integrate it into the Redux store
