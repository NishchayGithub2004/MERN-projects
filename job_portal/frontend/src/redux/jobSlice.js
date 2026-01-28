import { createSlice } from "@reduxjs/toolkit"; // from 'reduxjs' library, import 'createSlice' function to create a redux slice

const jobSlice = createSlice({ // create a redux slice named 'jobSlice' to handle job related states
    name: "job", // unique name of this slice is 'job'
    initialState: { // this part contains the following properties related to jobs with their initial values
        allJobs: [], // array called 'allJobs' to store all jobs data with initial value of empty array
        allAdminJobs: [], // array called 'allAdminJobs' to store all admin jobs data with initial value of empty array
        singleJob: null, // object called 'singleJob' to store single job data that comes by searching for one with initial value of null
        searchJobByText: "", // string called 'searchJobByText' to store name of job that comes up by searching it in search bar
        allAppliedJobs: [], // array called 'allAppliedJobs' to store all applied jobs data with initial value of empty array
        searchedQuery: "", // string called 'searchedQuery' to store search string written in search bar to search for a job
    },
    reducers: { /* this is the container of all functions to change the value of states related to job data
        create functions to update values of states defined in 'initialState' part, they take two arguments: 'state' which is the 
        state to update and 'action' which contains the new value to update the state with in it's payload
        update the state the functions are supposed to update with the value contained by the 'payload' property of 'action' */
        
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        }
    }
});

// export the functions defined in reducers to update values of state variables related to job data
export const { setAllJobs, setSingleJob, setAllAdminJobs, setSearchJobByText, setAllAppliedJobs, setSearchedQuery } = jobSlice.actions;

export default jobSlice.reducer; // export the reducer to be used in redux store