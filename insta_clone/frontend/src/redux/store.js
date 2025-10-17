import { combineReducers, configureStore } from "@reduxjs/toolkit"; // import combineReducers and configureStore from Redux Toolkit to combine slices and create the Redux store
import authSlice from "./authSlice.js"; // import the authSlice reducer to manage authentication state
import postSlice from './postSlice.js'; // import the postSlice reducer to manage post-related state
import socketSlice from "./socketSlice.js" // import the socketSlice reducer to manage socket.io connection state
import chatSlice from "./chatSlice.js"; // import the chatSlice reducer to manage chat state
import rtnSlice from "./rtnSlice.js"; // import the rtnSlice reducer to manage real-time notification state

import { // import functions and constants from redux-persist to enable persistent storage of Redux state
    persistReducer, // import persistReducer to create a reducer that persists state to storage
    FLUSH, // import FLUSH constant used to ignore serialization checks for redux-persist actions
    REHYDRATE, // import REHYDRATE constant used when state is rehydrated from storage
    PAUSE, // import PAUSE constant used when persistence is paused
    PERSIST, // import PERSIST constant used when persistence is initiated
    PURGE, // import PURGE constant used when clearing persisted storage
    REGISTER, // import REGISTER constant used when persistence setup is completed
} from 'redux-persist'

import storage from 'redux-persist/lib/storage' // import default storage engine (localStorage) used by redux-persist for saving Redux state

const persistConfig = { // define a configuration object for redux-persist
    key: 'root', // set the key under which the persisted data will be stored in localStorage
    version: 1, // set a version number for persisted data to handle schema migrations
    storage, // specify the storage engine to be used, which is localStorage here
}

const rootReducer = combineReducers({ // combine all the individual slice reducers into a single root reducer
    auth: authSlice, // include authSlice to manage authentication state under the key 'auth'
    post: postSlice, // include postSlice to manage posts under the key 'post'
    socketio: socketSlice, // include socketSlice to manage socket connections under the key 'socketio'
    chat: chatSlice, // include chatSlice to manage chat data under the key 'chat'
    realTimeNotification: rtnSlice // include rtnSlice to manage notifications under the key 'realTimeNotification'
})

const persistedReducer = persistReducer( // call persistReducer to wrap rootReducer with persistence capability
    persistConfig, // pass persistConfig as the first argument to define how persistence should behave
    rootReducer // pass rootReducer as the second argument to persist the combined reducer's state
)

const store = configureStore({ // define a constant store by calling configureStore to create the Redux store
    reducer: persistedReducer, // assign persistedReducer as the store’s root reducer to enable persistence

    middleware: (getDefaultMiddleware) => // configure middleware using getDefaultMiddleware to include default Redux Toolkit middleware
        getDefaultMiddleware({ // call getDefaultMiddleware with options to customize its behavior
            serializableCheck: { // enable serializableCheck to prevent non-serializable values from being stored
                ignoredActions: [ // specify redux-persist actions to ignore during serializable checks
                    FLUSH, // ignore FLUSH as it handles flushing persistence
                    REHYDRATE, // ignore REHYDRATE as it deals with restoring persisted state
                    PAUSE, // ignore PAUSE to prevent errors when persistence pauses
                    PERSIST, // ignore PERSIST as it initializes persistence
                    PURGE, // ignore PURGE since it clears persisted data
                    REGISTER, // ignore REGISTER as it sets up persistence
                ],
            },
        }),
});

export default store; // export the configured Redux store as the default export for use throughout the app
