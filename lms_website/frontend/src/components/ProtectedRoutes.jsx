import { useSelector } from "react-redux"; // import useSelector hook from react-redux to read authentication data from Redux store
import { Navigate } from "react-router-dom"; // import Navigate component from react-router-dom to handle conditional route redirection

export const ProtectedRoute = ({ children }) => { // define a functional component named 'ProtectedRoute' to protect private routes, taking 'children' as prop
    const { isAuthenticated } = useSelector(store => store.auth); // retrieve authentication status from auth slice in Redux store

    if (!isAuthenticated) return <Navigate to="/login" />; // if user is not authenticated, redirect them to login page

    return children; // if user is authenticated, render protected child components
};

export const AuthenticatedUser = ({ children }) => { // define a functional component named 'AuthenticatedUser' to restrict access for logged-in users, taking 'children' as prop
    const { isAuthenticated } = useSelector(store => store.auth); // retrieve authentication status from auth slice in Redux store

    if (isAuthenticated) return <Navigate to="/" />; // if user is already authenticated, redirect to homepage to prevent accessing auth pages

    return children; // if user is not authenticated, render nested children components
};

export const AdminRoute = ({ children }) => { // define a functional component named 'AdminRoute' to protect instructor-only routes, taking 'children' as prop
    const { user, isAuthenticated } = useSelector(store => store.auth); // retrieve both user details and authentication status from auth slice

    if (!isAuthenticated) return <Navigate to="/login" />; // if user is not authenticated, redirect them to login page

    if (user?.role !== "instructor") return <Navigate to="/" />; // if authenticated user is not an instructor, redirect to homepage

    return children; // if authenticated and has instructor role, render the restricted content
};