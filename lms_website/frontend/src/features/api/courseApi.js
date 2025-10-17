import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // import createApi to define an RTK Query API slice and fetchBaseQuery for standard HTTP requests

const COURSE_API = "http://localhost:8080/api/v1/course"; // define the base URL for all course-related API requests

export const courseApi = createApi({ // define an RTK Query API slice named courseApi to manage course endpoints
    reducerPath: "courseApi", // set the unique reducer path in Redux store for this API slice

    tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"], // define cache tags to enable automatic cache invalidation for certain queries/mutations

    baseQuery: fetchBaseQuery({ // configure the base query for all endpoints
        baseUrl: COURSE_API, // set the base URL for all requests to COURSE_API
        credentials: "include", // include cookies for authentication
    }),

    endpoints: (builder) => ({ // define all API endpoints using the builder pattern
        createCourse: builder.mutation({ // define a mutation endpoint 'createCourse' to create a new course
            query: ({ courseTitle, category }) => ({ // define the query function with courseTitle and category as input
                url: "", // empty string means the base URL is used directly
                method: "POST", // use POST method to send new course data
                body: { courseTitle, category }, // set request body with course title and category
            }),
            invalidatesTags: ["Refetch_Creator_Course"], // invalidate this cache tag to trigger refetch for creator courses
        }),

        getSearchCourse: builder.query({ // define a query endpoint 'getSearchCourse' for searching courses
            query: ({ searchQuery, categories, sortByPrice }) => { // define query function with searchQuery, categories, and sortByPrice
                let queryString = `/search?query=${encodeURIComponent(searchQuery)}` // encode search query into URL

                if (categories && categories.length > 0) { // check if categories array exists and is non-empty
                    const categoriesString = categories.map(encodeURIComponent).join(","); // encode each category and join with commas
                    queryString += `&categories=${categoriesString}`; // append categories to query string
                }

                if (sortByPrice) { // check if sorting by price is requested
                    queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`; // append sortByPrice to query string
                }

                return { // return the query configuration
                    url: queryString, // use constructed query string as URL
                    method: "GET", // use GET method to retrieve search results
                }
            }
        }),

        getPublishedCourse: builder.query({ // define a query endpoint 'getPublishedCourse' to get all published courses
            query: () => ({ // query function requires no input
                url: "/published-courses", // endpoint path to fetch published courses
                method: "GET", // GET method to retrieve data
            }),
        }),

        getCreatorCourse: builder.query({ // define a query endpoint 'getCreatorCourse' to get courses created by the logged-in user
            query: () => ({ // query function requires no input
                url: "", // empty string uses base URL directly
                method: "GET", // GET method to fetch creator courses
            }),
            providesTags: ["Refetch_Creator_Course"], // mark this query with tag for cache invalidation tracking
        }),

        editCourse: builder.mutation({ // define a mutation endpoint 'editCourse' to update a course
            query: ({ formData, courseId }) => ({ // query function receives formData and courseId
                url: `/${courseId}`, // endpoint path includes courseId
                method: "PUT", // PUT method to update course
                body: formData, // set request body to formData object
            }),
            invalidatesTags: ["Refetch_Creator_Course"], // invalidate creator course cache to refresh after editing
        }),

        getCourseById: builder.query({ // define a query endpoint 'getCourseById' to fetch a specific course
            query: (courseId) => ({ // query function takes courseId as input
                url: `/${courseId}`, // endpoint path includes courseId
                method: "GET", // GET method to retrieve course data
            }),
        }),

        createLecture: builder.mutation({ // define a mutation endpoint 'createLecture' to add a lecture to a course
            query: ({ lectureTitle, courseId }) => ({ // query function receives lectureTitle and courseId
                url: `/${courseId}/lecture`, // endpoint path includes courseId for adding lecture
                method: "POST", // POST method to create lecture
                body: { lectureTitle }, // request body includes lecture title
            }),
        }),

        getCourseLecture: builder.query({ // define a query endpoint 'getCourseLecture' to fetch lectures of a course
            query: (courseId) => ({ // query function takes courseId
                url: `/${courseId}/lecture`, // endpoint path includes courseId
                method: "GET", // GET method to fetch lectures
            }),
            providesTags: ["Refetch_Lecture"], // mark this query with lecture tag for cache tracking
        }),

        editLecture: builder.mutation({ // define a mutation endpoint 'editLecture' to update a lecture
            query: ({ // query function receives lecture details
                lectureTitle,
                videoInfo,
                isPreviewFree,
                courseId,
                lectureId,
            }) => ({
                url: `/${courseId}/lecture/${lectureId}`, // endpoint path includes courseId and lectureId
                method: "POST", // POST method to update lecture
                body: { lectureTitle, videoInfo, isPreviewFree }, // request body includes updated lecture info
            }),
        }),

        removeLecture: builder.mutation({ // define a mutation endpoint 'removeLecture' to delete a lecture
            query: (lectureId) => ({ // query function takes lectureId
                url: `/lecture/${lectureId}`, // endpoint path includes lectureId
                method: "DELETE", // DELETE method to remove lecture
            }),
            invalidatesTags: ["Refetch_Lecture"], // invalidate lecture cache to refresh after deletion
        }),

        getLectureById: builder.query({ // define a query endpoint 'getLectureById' to fetch a single lecture
            query: (lectureId) => ({ // query function takes lectureId
                url: `/lecture/${lectureId}`, // endpoint path includes lectureId
                method: "GET", // GET method to retrieve lecture data
            }),
        }),

        publishCourse: builder.mutation({ // define a mutation endpoint 'publishCourse' to publish a course
            query: ({ courseId, query }) => ({ // query function receives courseId and query (publish flag)
                url: `/${courseId}?publish=${query}`, // endpoint path includes courseId and publish query parameter
                method: "PATCH", // PATCH method to update publish status
            }),
        }),
    }),
});

export const { // export auto-generated hooks for each endpoint to use in React components
    useCreateCourseMutation, // hook to call createCourse mutation
    useGetSearchCourseQuery, // hook to call getSearchCourse query
    useGetPublishedCourseQuery, // hook to call getPublishedCourse query
    useGetCreatorCourseQuery, // hook to call getCreatorCourse query
    useEditCourseMutation, // hook to call editCourse mutation
    useGetCourseByIdQuery, // hook to call getCourseById query
    useCreateLectureMutation, // hook to call createLecture mutation
    useGetCourseLectureQuery, // hook to call getCourseLecture query
    useEditLectureMutation, // hook to call editLecture mutation
    useRemoveLectureMutation, // hook to call removeLecture mutation
    useGetLectureByIdQuery, // hook to call getLectureById query
    usePublishCourseMutation, // hook to call publishCourse mutation
} = courseApi;
