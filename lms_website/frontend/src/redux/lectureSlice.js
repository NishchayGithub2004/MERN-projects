import { createSlice } from "@reduxjs/toolkit"; // import createSlice to generate a Redux slice with actions and reducer logic

const lectureSlice = createSlice({ // create a Redux slice to manage lecture-related state and actions
    name: "lecture", // define the slice name used as a key in the Redux store
    initialState: { // define the initial state structure for lecture-related data
        lectureData: [] // store the list of lectures associated with a course or module
    },
    reducers: { // define reducer functions to update lecture-related state
        setLectureData: ( // define a reducer to update lecture data in the store which takes the following arguments
            state, // access the current Redux state to apply updates to lecture data
            action // receive the dispatched action containing updated lecture information
        ) => {
            state.lectureData = action.payload // replace existing lecture data with the payload provided by the action
        }
    }
});

export const { setLectureData } = lectureSlice.actions; // export the action creator to allow updating lecture data from components or thunks
export default lectureSlice.reducer; // export the reducer to register it within the Redux store