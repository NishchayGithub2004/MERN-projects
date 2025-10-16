import { createSlice } from "@reduxjs/toolkit"; // import the createSlice function from Redux Toolkit to create a slice that combines state logic and actions together

const applicationSlice = createSlice({ // define a constant named applicationSlice by calling createSlice to create a Redux slice for application-related state
    name: 'application', // specify the name of the slice as 'application' to identify this part of the Redux state tree
    
    initialState: { // define the initial state object for this slice
        applicants: null, // initialize the applicants property with null to represent no applicants loaded initially
    },
    
    reducers: { // define an object containing reducer functions that specify how the state changes in response to actions
        setAllApplicants: (state, action) => { // define a reducer function setAllApplicants with arguments state (current slice state) and action (object containing type and payload)
            state.applicants = action.payload; // update the applicants property of state with the value passed in action.payload
        }
    }
});

export const { setAllApplicants } = applicationSlice.actions; // export the setAllApplicants action creator generated automatically by createSlice for dispatching this action in components
export default applicationSlice.reducer; // export the reducer function of applicationSlice as the default export to integrate it into the Redux store
