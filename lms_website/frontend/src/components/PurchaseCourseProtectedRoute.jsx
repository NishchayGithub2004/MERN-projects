import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi"; // import custom RTK Query hook to fetch course details with purchase status
import { useParams, Navigate } from "react-router-dom"; // import useParams to access URL parameters and Navigate to redirect users

const PurchaseCourseProtectedRoute = ({ children }) => { // define a function PurchaseCourseProtectedRoute to guard purchased course routes, children are nested components
    const { courseId } = useParams(); // extract courseId parameter from URL using useParams

    const { data, isLoading } = useGetCourseDetailWithStatusQuery(courseId); // call RTK Query hook with courseId to fetch course details; data contains response, isLoading indicates fetch status

    if (isLoading) return <p>Loading...</p> // if data is still loading, show loading message

    return data?.purchased ? children : <Navigate to={`/course-detail/${courseId}`} /> // if course is purchased, render children; otherwise redirect to course detail page
}

export default PurchaseCourseProtectedRoute; // export PurchaseCourseProtectedRoute as default for use in other modules
