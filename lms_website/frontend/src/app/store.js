import { configureStore } from "@reduxjs/toolkit"; // import configureStore to create and configure the Redux store
import rootRedcuer from "./rootReducer"; // import the combined root reducer to provide all slice reducers to the store
import { authApi } from "@/features/api/authApi"; // import authApi RTK Query slice to include its middleware in the store
import { courseApi } from "@/features/api/courseApi"; // import courseApi RTK Query slice to include its middleware in the store
import { purchaseApi } from "@/features/api/purchaseApi"; // import purchaseApi RTK Query slice to include its middleware in the store
import { courseProgressApi } from "@/features/api/courseProgressApi"; // import courseProgressApi RTK Query slice to include its middleware in the store

export const appStore = configureStore({ // create and export the Redux store as appStore
    reducer: rootRedcuer, // provide the combined root reducer for the store
    middleware: (defaultMiddleware) => defaultMiddleware().concat( // extend default middleware with RTK Query middleware for each API slice
        authApi.middleware, // include authApi middleware for caching, invalidation, and lifecycle handling
        courseApi.middleware, // include courseApi middleware for caching, invalidation, and lifecycle handling
        purchaseApi.middleware, // include purchaseApi middleware for caching, invalidation, and lifecycle handling
        courseProgressApi.middleware // include courseProgressApi middleware for caching, invalidation, and lifecycle handling
    )
});

const initializeApp = async () => { // define an async function to initialize app state on startup
    await appStore.dispatch( // dispatch an action using the store
        authApi.endpoints.loadUser.initiate({}, { forceRefetch: true }) // trigger loadUser query from authApi and force a refetch to populate user state immediately
    );
}

initializeApp(); // call the initializeApp function to load user data when the app starts
