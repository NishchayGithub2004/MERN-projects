import { createSlice } from "@reduxjs/toolkit"; // import createSlice to generate a Redux slice with actions and reducer logic

const reviewSlice = createSlice({ // create a Redux slice to manage review-related state and actions
    name: "review", // define the slice name used as a key in the Redux store
    initialState: { // define the initial state structure for review-related data
        allReview: [] // store the list of all reviews associated with courses or content
    },
    reducers: { // define reducer functions to update review-related state
        setAllReview: ( // define a reducer to update all review data which takes the following arguments
            state, // access the current Redux state to apply updates to review data
            action // receive the dispatched action containing updated review information
        ) => {
            state.allReview = action.payload // replace existing review data with the payload provided by the action
        }
    }
});

export const { setAllReview } = reviewSlice.actions; // export the action creator to allow updating review data from components or async logic
export default reviewSlice.reducer; // export the reducer to register it within the Redux store