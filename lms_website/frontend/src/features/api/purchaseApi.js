import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // import createApi to define an RTK Query API slice and fetchBaseQuery for HTTP requests

const COURSE_PURCHASE_API = "http://localhost:8080/api/v1/purchase"; // define the base URL for all course purchase-related API requests

export const purchaseApi = createApi({ // define an RTK Query API slice named purchaseApi to manage purchase endpoints
    reducerPath: "purchaseApi", // set the unique reducer path in Redux store for this API slice

    baseQuery: fetchBaseQuery({ // configure the base query for all endpoints
        baseUrl: COURSE_PURCHASE_API, // set the base URL for all requests to COURSE_PURCHASE_API
        credentials: "include", // include cookies in requests for authentication
    }),

    endpoints: (builder) => ({ // define all API endpoints using the builder pattern
        createCheckoutSession: builder.mutation({ // define a mutation endpoint 'createCheckoutSession' to initiate checkout for a course
            query: (courseId) => ({ // query function takes courseId as input
                url: "/checkout/create-checkout-session", // endpoint path for creating checkout session
                method: "POST", // POST method to send courseId to the server
                body: { courseId }, // include courseId in request body
            }),
        }),

        getCourseDetailWithStatus: builder.query({ // define a query endpoint 'getCourseDetailWithStatus' to fetch course details with purchase status
            query: (courseId) => ({ // query function takes courseId as input
                url: `/course/${courseId}/detail-with-status`, // endpoint path includes courseId to fetch details
                method: "GET", // GET method to retrieve course detail and status
            }),
        }),

        getPurchasedCourses: builder.query({ // define a query endpoint 'getPurchasedCourses' to fetch all purchased courses
            query: () => ({ // query function requires no input
                url: `/`, // endpoint path to fetch all purchased courses
                method: "GET", // GET method to retrieve purchased courses
            }),
        }),
    }),
});

export const { // export auto-generated hooks for each endpoint to use in React components
    useCreateCheckoutSessionMutation, // hook to call createCheckoutSession mutation
    useGetCourseDetailWithStatusQuery, // hook to call getCourseDetailWithStatus query
    useGetPurchasedCoursesQuery, // hook to call getPurchasedCourses query
} = purchaseApi;
