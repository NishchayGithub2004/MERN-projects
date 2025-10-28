import { createSlice } from "@reduxjs/toolkit"; // import createSlice from redux toolkit to simplify creation of a redux slice which bundles reducers and actions together

const applicationSlice = createSlice({ // create a redux slice named applicationSlice to handle application-related state and actions
    name: 'application', // set the unique name of this slice as 'application' to identify its section in the redux store
    initialState: { // define the initial structure and values for this slice of state
        applicants: null, // initialize applicants as null to indicate no applicant data is loaded initially
    },
    reducers: { // define a collection of reducer functions describing how the slice state should change in response to dispatched actions
        setAllApplicants: (state, action) => { // define reducer setAllApplicants which updates state based on provided action payload
            state.applicants = action.payload; // assign action.payload to applicants to store new list of applicants in the state
        }
    }
});

export const { setAllApplicants } = applicationSlice.actions; // extract and export setAllApplicants action creator for dispatching applicant updates from ui components
export default applicationSlice.reducer; // export reducer function as default to integrate applicationSlice into the redux store configuration