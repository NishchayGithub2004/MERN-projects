import { createSlice } from "@reduxjs/toolkit"; // from 'reduxjs' library, import 'createSlice' function to create a redux slice

const authSlice = createSlice({ // create a redux slice named 'authSlice' to handle user authentication related states
    name: "auth", // unique name of this slice is 'auth'
    initialState: { // this part contains the following properties related to user authentication with their initial values
        loading: false, // boolean variable called 'loading' to check if user authentication status is being fetched with initial value of false
        user: null // object called 'user' to store user data required to check authentication status with initial value of null
    },
    reducers: { /* this is the container of all functions/actions to change the value of states related to user authentication
        create functions to update values of states defined in 'initialState' part, they take two arguments: 'state' which is the 
        state to update and 'action' which contains the new value to update the state with in it's payload
        update the state the functions are supposed to update with the value contained by the 'payload' property of 'action' */
        
        setLoading: (state, action) => { 
            state.loading = action.payload; 
        },
        setUser: (state, action) => { 
            state.user = action.payload; 
        }
    }
});

export const { setLoading, setUser } = authSlice.actions; // export the functions defined in reducers to update values of state variables related to user authentication

export default authSlice.reducer; // export the reducer to be used in redux store