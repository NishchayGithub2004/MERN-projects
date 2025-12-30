import { createSlice } from "@reduxjs/toolkit"; // import createSlice to generate a Redux slice with actions and reducer logic

const courseSlice = createSlice({ // create a Redux slice to manage course-related state and actions
    name: "course", // define the slice name used as a key in the Redux store
    initialState: { // define the initial state structure for course-related data
        creatorCourseData: [], // store courses created by the logged-in creator for management and display
        courseData: [], // store all available course data fetched for listing and browsing
        selectedCourseData: null // store the currently selected course for detailed view or editing
    },
    reducers: { // define reducer functions to update specific parts of the course state
        setCreatorCourseData: ( // define a reducer to update creator-specific course data which takes the following arguments
            state, // access the current Redux state to apply immutable updates internally
            action // receive the dispatched action containing new creator course data
        ) => {
            state.creatorCourseData = action.payload // replace existing creator course data with the provided payload
        },
        setCourseData: ( // define a reducer to update general course data which takes the following arguments
            state, // access the current Redux state to modify the course list
            action // receive the dispatched action containing updated course data
        ) => {
            state.courseData = action.payload // assign the new list of courses from the action payload
        },
        setSelectedCourseData: ( // define a reducer to update the currently selected course which takes the following arguments
            state, // access the current Redux state to update the selected course reference
            action // receive the dispatched action containing the selected course data
        ) => {
            state.selectedCourseData = action.payload // store the selected course data for downstream usage
        }
    }
});

export const { setCreatorCourseData } = courseSlice.actions; // export the action creator to update creator-specific course data
export const { setCourseData } = courseSlice.actions; // export the action creator to update general course data
export const { setSelectedCourseData } = courseSlice.actions; // export the action creator to update selected course data
export default courseSlice.reducer; // export the reducer to register it in the Redux store