import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // import createApi to define an RTK Query API slice and fetchBaseQuery to make standard HTTP requests
import { userLoggedIn, userLoggedOut } from "../authSlice"; // import action creators from authSlice to update Redux state upon login/logout

const USER_API = "http://localhost:8080/api/v1/user/"; // define the base URL for all user-related API requests

export const authApi = createApi({ // define an RTK Query API slice named authApi to handle user authentication endpoints
    reducerPath: "authApi", // set the unique reducer path in the Redux store for this API slice
    
    baseQuery: fetchBaseQuery({ // configure the base query for all endpoints
        baseUrl: USER_API, // set the base URL for all requests to USER_API
        credentials: 'include' // include cookies in requests for authentication
    }),
    
    endpoints: (builder) => ({ // define all endpoints for this API slice using the builder pattern
        registerUser: builder.mutation({ // define a mutation endpoint 'registerUser' for user registration
            query: (inputData) => ({ // define the query function that receives 'inputData' containing registration details
                url: "register", // set the endpoint path for registration
                method: "POST", // use POST method to send data
                body: inputData // set the request body to the inputData object
            })
        }),
        
        loginUser: builder.mutation({ // define a mutation endpoint 'loginUser' for user login
            query: (inputData) => ({ // define the query function that receives 'inputData' containing login credentials
                url: "login", // set the endpoint path for login
                method: "POST", // use POST method to send data
                body: inputData // set the request body to the inputData object
            }),
            
            async onQueryStarted(_, { queryFulfilled, dispatch }) { // define an async lifecycle callback triggered when login mutation starts
                try {
                    const result = await queryFulfilled; // wait for the mutation to complete and get the result
                    dispatch(userLoggedIn({ user: result.data.user })); // dispatch the userLoggedIn action with the returned user data to update Redux state
                } catch (error) {
                    console.log(error); // log any error if the mutation fails
                }
            }
        }),

        logoutUser: builder.mutation({ // define a mutation endpoint 'logoutUser' for logging out
            query: () => ({ // define the query function with no input for logout
                url: "logout", // set the endpoint path for logout
                method: "GET" // use GET method to trigger logout
            }),
            
            async onQueryStarted(_, { queryFulfilled, dispatch }) { // define an async lifecycle callback triggered when logout mutation starts
                try {
                    dispatch(userLoggedOut()); // dispatch the userLoggedOut action immediately to reset Redux auth state
                } catch (error) {
                    console.log(error); // log any error if the dispatch fails
                }
            }
        }),

        loadUser: builder.query({ // define a query endpoint 'loadUser' to fetch currently logged-in user data
            query: () => ({ // define the query function with no input for fetching user profile
                url: "profile", // set the endpoint path to fetch the profile
                method: "GET" // use GET method to retrieve data
            }),
            
            async onQueryStarted(_, { queryFulfilled, dispatch }) { // define an async lifecycle callback triggered when loadUser query starts
                try {
                    const result = await queryFulfilled; // wait for the query to complete and get the result
                    dispatch(userLoggedIn({ user: result.data.user })); // dispatch userLoggedIn action to populate Redux state with the fetched user data
                } catch (error) {
                    console.log(error); // log any error if the query fails
                }
            }
        }),

        updateUser: builder.mutation({ // define a mutation endpoint 'updateUser' to update user profile
            query: (formData) => ({ // define the query function that receives 'formData' containing updated profile details
                url: "profile/update", // set the endpoint path to update profile
                method: "PUT", // use PUT method to update existing data
                body: formData, // set the request body to formData
                credentials: "include" // include cookies in request for authentication
            })
        })
    })
});

export const { // export the auto-generated hooks for each endpoint for use in React components
    useRegisterUserMutation, // hook to call registerUser mutation
    useLoginUserMutation, // hook to call loginUser mutation
    useLogoutUserMutation, // hook to call logoutUser mutation
    useLoadUserQuery, // hook to call loadUser query
    useUpdateUserMutation // hook to call updateUser mutation
} = authApi;
