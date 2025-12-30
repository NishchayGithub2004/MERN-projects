import { createSlice } from "@reduxjs/toolkit"; // import createSlice to generate a Redux slice with actions and reducer logic

const userSlice = createSlice({ // create a Redux slice to manage user-related state and actions
    name: "user", // define the slice name used as a key in the Redux store
    initialState: { // define the initial state structure for user-related data
        userData: null // store the authenticated user's data or profile information
    },
    reducers: { // define reducer functions to update user-related state
        setUserData: ( // define a reducer to update user data in the store which takes the following arguments
            state, // access the current Redux state to apply updates to user data
            action // receive the dispatched action containing updated user information
        ) => {
            state.userData = action.payload // replace existing user data with the payload provided by the action
        }
    }
});

export const { setUserData } = userSlice.actions; // export the action creator to allow updating user data from components or async logic
export default userSlice.reducer; // export the reducer to register it within the Redux store