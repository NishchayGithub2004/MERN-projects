import { createSlice } from "@reduxjs/toolkit"; // import createSlice from redux toolkit to simplify creation of a redux slice that manages authentication-related state and actions

const authSlice = createSlice({ // create a redux slice named authSlice to handle authentication-specific logic and state updates
    name: "auth", // assign the name 'auth' to this slice to represent the authentication section in the redux store
    initialState: { // define the default structure and values for the authentication state
        loading: false, // initialize loading as false to represent that no authentication request is currently being processed
        user: null // initialize user as null to indicate no authenticated user exists at application start
    },
    reducers: { // declare reducer functions to describe how state transitions occur when specific actions are dispatched
        setLoading: (state, action) => { // define reducer setLoading which modifies the loading property based on action payload
            state.loading = action.payload; // assign action.payload to loading to reflect whether authentication is in progress or complete
        },
        setUser: (state, action) => { // define reducer setUser which updates user data in state using the provided action payload
            state.user = action.payload; // assign action.payload to user to store current authenticated user details
        }
    }
});

export const { setLoading, setUser } = authSlice.actions; // extract and export setLoading and setUser action creators for dispatching authentication updates from ui components
export default authSlice.reducer; // export reducer function as default to integrate authSlice into the central redux store