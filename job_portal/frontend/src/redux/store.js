import { combineReducers, configureStore } from "@reduxjs/toolkit"; // import combineReducers to merge multiple reducers and configureStore to create the Redux store
import authSlice from "./authSlice"; // import the reducer from authSlice to manage authentication state
import jobSlice from "./jobSlice"; // import the reducer from jobSlice to manage job-related state

import { // import specific named exports from the redux-persist library to enable state persistence in Redux
    persistStore, // import persistStore to create a persistor object that controls persistence operations for the Redux store
    persistReducer, // import persistReducer to wrap a reducer with persistence logic so its state is saved and rehydrated automatically
    FLUSH, // import FLUSH constant to identify an action type that clears persistence queues
    REHYDRATE, // import REHYDRATE constant to identify an action type that restores persisted state into the store
    PAUSE, // import PAUSE constant to identify an action type that temporarily stops persistence
    PERSIST, // import PERSIST constant to identify an action type that starts persistence of the Redux store
    PURGE, // import PURGE constant to identify an action type that clears all persisted state from storage
    REGISTER, // import REGISTER constant to identify an action type that registers the persistence configuration
} from 'redux-persist' // specify the module path 'redux-persist' from which these functions and constants are imported

import storage from 'redux-persist/lib/storage' // import local storage as the default storage engine for persisting state
import companySlice from "./companySlice"; // import the reducer from companySlice to manage company-related state
import applicationSlice from "./applicationSlice"; // import the reducer from applicationSlice to manage application-related state

const persistConfig = { // define an object persistConfig to configure redux-persist settings
    key: 'root', // specify the key under which persisted data will be stored in local storage
    version: 1, // assign a version number to handle migrations if persist structure changes later
    storage, // assign storage engine (local storage) to store Redux state persistently
}

const rootReducer = combineReducers({ // define a constant rootReducer by calling combineReducers to merge multiple slice reducers into one root reducer
    auth: authSlice, // map the 'auth' key to authSlice reducer to handle authentication state
    job: jobSlice, // map the 'job' key to jobSlice reducer to handle job data
    company: companySlice, // map the 'company' key to companySlice reducer to handle company data
    application: applicationSlice // map the 'application' key to applicationSlice reducer to handle application-related state
})

const persistedReducer = persistReducer( // define a constant persistedReducer by calling persistReducer to wrap the root reducer with persistence logic
    persistConfig, // pass the persistence configuration object to specify how the state should be persisted
    rootReducer // pass the combined root reducer that manages all slices
)

const store = configureStore({ // define a constant store by calling configureStore to create the Redux store with middleware and reducer setup
    reducer: persistedReducer, // set the reducer of the store to the persistedReducer to enable state persistence
    middleware: (getDefaultMiddleware) => // define a middleware property that customizes Redux middleware behavior
        getDefaultMiddleware({ // call getDefaultMiddleware to include Redux Toolkit's default middleware set
            serializableCheck: { // define a configuration object for serializable state checks
                ignoredActions: [ // specify actions that should be ignored by the serializable check middleware to prevent unnecessary warnings
                    FLUSH, 
                    REHYDRATE, 
                    PAUSE, 
                    PERSIST, 
                    PURGE, 
                    REGISTER
                ],
            },
        }),
});

export default store; // export the configured Redux store as the default export to be used across the application
