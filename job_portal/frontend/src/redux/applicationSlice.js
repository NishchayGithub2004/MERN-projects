import { createSlice } from "@reduxjs/toolkit"; // from 'reduxjs' library, import 'createSlice' function to create a redux slice

const applicationSlice = createSlice({ // create a redux slice named 'applicationSlice' to handle application related states
    name: 'application', // unique name of this slice is 'application'
    initialState: { // this part contains the following properties related to applications with their initial values
        applicants: null, // object called 'applicants' to store job applicants data with initial value of null
    },
    reducers: { /* this is the container of functions to change the value of state
        create functions to update values of states defined in 'initialState' part, they take two arguments: 'state' which is the 
        state to update and 'action' which contains the new value to update the state with in it's payload
        update the state the functions are supposed to update with the value contained by the 'payload' property of 'action' */
        
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        }
    }
});

export const { setAllApplicants } = applicationSlice.actions; // export the function defined in reducers to update the value of state variable related to applicants data

export default applicationSlice.reducer; // export the reducer to be used in redux store