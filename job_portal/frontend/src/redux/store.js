import { combineReducers, configureStore } from "@reduxjs/toolkit"; // import combineReducers to merge multiple slice reducers and configureStore to create the redux store with middleware
import authSlice from "./authSlice"; // import authSlice reducer to manage authentication-related state
import jobSlice from "./jobSlice"; // import jobSlice reducer to manage all job-related state and actions
import {
    persistStore, // import persistStore to create a persistor instance controlling redux state persistence
    persistReducer, // import persistReducer to enhance a reducer so its state is persisted across sessions
    FLUSH, // import FLUSH action type to handle flushing persistence queue
    REHYDRATE, // import REHYDRATE action type to handle reloading persisted state into store
    PAUSE, // import PAUSE action type to temporarily halt persistence
    PERSIST, // import PERSIST action type to initiate persistence
    PURGE, // import PURGE action type to clear persisted data from storage
    REGISTER, // import REGISTER action type to register persistence setup
} from 'redux-persist'; // import persistence utilities and constants from redux-persist library
import storage from 'redux-persist/lib/storage'; // import local storage as the default persistence engine for redux state
import companySlice from "./companySlice"; // import companySlice reducer to handle company-related state logic
import applicationSlice from "./applicationSlice"; // import applicationSlice reducer to manage state related to job applications

const persistConfig = { // create persist configuration object defining how redux-persist should behave
    key: 'root', // set key under which redux state will be stored in local storage
    version: 1, // assign version number to handle possible migrations for persisted state
    storage, // specify local storage as persistence medium
};

const rootReducer = combineReducers({ // create root reducer by merging multiple slice reducers into a single reducer function
    auth: authSlice, // assign authSlice reducer to 'auth' key for authentication state management
    job: jobSlice, // assign jobSlice reducer to 'job' key for job data management
    company: companySlice, // assign companySlice reducer to 'company' key for company data management
    application: applicationSlice, // assign applicationSlice reducer to 'application' key for application-related state
});

const persistedReducer = persistReducer( // wrap rootReducer with persistence logic to maintain state across browser sessions
    persistConfig, // pass persistence configuration to control storage key, version, and engine
    rootReducer // pass combined root reducer to apply persistence over entire state tree
);

const store = configureStore({ // create redux store instance using configureStore with default middleware and persistence setup
    reducer: persistedReducer, // set persistedReducer as main reducer to ensure persistent state management
    middleware: (getDefaultMiddleware) => // define middleware configuration using default redux toolkit middleware
        getDefaultMiddleware({ // call getDefaultMiddleware to include redux toolkit's serializable and thunk middlewares
            serializableCheck: { // configure serializable check to ignore persistence-related redux-persist actions
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // ignore redux-persist actions to prevent unnecessary warnings about non-serializable values
            },
        }),
});

export default store; // export redux store as default so it can be provided to the app via <Provider> for global state access