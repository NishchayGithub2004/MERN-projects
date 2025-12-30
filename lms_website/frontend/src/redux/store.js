import { configureStore } from "@reduxjs/toolkit"; // import configureStore to initialize and configure the Redux store

import userSlice from "./userSlice"; // import the user slice reducer to manage user-related state
import courseSlice from "./courseSlice"; // import the course slice reducer to manage course-related state
import lectureSlice from "./lectureSlice"; // import the lecture slice reducer to manage lecture-related state
import reviewSlice from "./reviewSlice"; // import the review slice reducer to manage review-related state

export const store = configureStore({ // create and export the Redux store to hold the global application state
    reducer: { // define the root reducer by mapping state keys to slice reducers
        user: userSlice, // attach the user reducer to manage user state in the store
        course: courseSlice, // attach the course reducer to manage course state in the store
        lecture: lectureSlice, // attach the lecture reducer to manage lecture state in the store
        review: reviewSlice // attach the review reducer to manage review state in the store
    }
});