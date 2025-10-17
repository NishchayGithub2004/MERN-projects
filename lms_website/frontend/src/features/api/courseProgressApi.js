import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // import createApi to define an RTK Query API slice and fetchBaseQuery for HTTP requests

const COURSE_PROGRESS_API = "http://localhost:8080/api/v1/progress"; // define the base URL for all course progress-related API requests

export const courseProgressApi = createApi({ // define an RTK Query API slice named courseProgressApi to manage course progress endpoints
    reducerPath: "courseProgressApi", // set the unique reducer path in Redux store for this API slice
    
    baseQuery: fetchBaseQuery({ // configure the base query for all endpoints
        baseUrl: COURSE_PROGRESS_API, // set the base URL for all requests to COURSE_PROGRESS_API
        credentials: "include", // include cookies in requests for authentication
    }),
    
    endpoints: (builder) => ({ // define all API endpoints using the builder pattern
        getCourseProgress: builder.query({ // define a query endpoint 'getCourseProgress' to fetch progress of a course
            query: (courseId) => ({ // query function takes courseId as input
                url: `/${courseId}`, // endpoint path includes courseId
                method: "GET", // GET method to retrieve course progress
            }),
        }),
        
        updateLectureProgress: builder.mutation({ // define a mutation endpoint 'updateLectureProgress' to mark a lecture as viewed
            query: ({ courseId, lectureId }) => ({ // query function takes courseId and lectureId as input
                url: `/${courseId}/lecture/${lectureId}/view`, // endpoint path includes courseId and lectureId
                method: "POST" // POST method to update lecture progress
            }),
        }),

        completeCourse: builder.mutation({ // define a mutation endpoint 'completeCourse' to mark a course as completed
            query: (courseId) => ({ // query function takes courseId as input
                url: `/${courseId}/complete`, // endpoint path includes courseId and 'complete' action
                method: "POST" // POST method to update course completion
            })
        }),
        
        inCompleteCourse: builder.mutation({ // define a mutation endpoint 'inCompleteCourse' to mark a course as incomplete
            query: (courseId) => ({ // query function takes courseId as input
                url: `/${courseId}/incomplete`, // endpoint path includes courseId and 'incomplete' action
                method: "POST" // POST method to update course status to incomplete
            })
        }),
    }),
});

export const { // export auto-generated hooks for each endpoint to use in React components
    useGetCourseProgressQuery, // hook to call getCourseProgress query
    useUpdateLectureProgressMutation, // hook to call updateLectureProgress mutation
    useCompleteCourseMutation, // hook to call completeCourse mutation
    useInCompleteCourseMutation // hook to call inCompleteCourse mutation
} = courseProgressApi;
