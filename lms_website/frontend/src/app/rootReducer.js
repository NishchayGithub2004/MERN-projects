import { combineReducers } from "@reduxjs/toolkit"; // import combineReducers to merge multiple slice reducers into a single root reducer
import authReducer from "../features/authSlice"; // import the auth slice reducer to handle authentication state
import { authApi } from "@/features/api/authApi"; // import authApi RTK Query slice to manage authentication API endpoints
import { courseApi } from "@/features/api/courseApi"; // import courseApi RTK Query slice to manage course-related API endpoints
import { purchaseApi } from "@/features/api/purchaseApi"; // import purchaseApi RTK Query slice to manage purchase-related API endpoints
import { courseProgressApi } from "@/features/api/courseProgressApi"; // import courseProgressApi RTK Query slice to manage course progress endpoints

const rootReducer = combineReducers({ // combine all reducers into a single root reducer for Redux store
    [authApi.reducerPath]: authApi.reducer, // attach authApi reducer at its unique reducerPath
    [courseApi.reducerPath]: courseApi.reducer, // attach courseApi reducer at its unique reducerPath
    [purchaseApi.reducerPath]: purchaseApi.reducer, // attach purchaseApi reducer at its unique reducerPath
    [courseProgressApi.reducerPath]: courseProgressApi.reducer, // attach courseProgressApi reducer at its unique reducerPath
    auth: authReducer, // attach auth slice reducer under 'auth' key to manage authentication state
});

export default rootReducer; // export the combined rootReducer as the default export to be used in the Redux store configuration