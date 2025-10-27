import { useSelector } from "react-redux" // import 'useSelector' hook to access Redux store state
import { Navigate } from "react-router-dom"; // import 'Navigate' component from react-router-dom to programmatically redirect users

export const ProtectedRoute = ({ children }) => { // define a function named 'ProtectedRoute' that takes 'children' as prop
    const { isAuthenticated } = useSelector(store => store.auth); // extract 'isAuthenticated' from Redux auth slice using 'useSelector'

    if (!isAuthenticated) return <Navigate to="/login" /> // if 'isAuthenticated' is false ie user is not authenticated, navigate user to login page

    return children; // if user is authenticated, return 'children'
}

export const AuthenticatedUser = ({ children }) => { // define a function named 'AuthenticatedUser' that takes 'children' as prop
    const { isAuthenticated } = useSelector(store => store.auth); // extract 'isAuthenticated' from Redux auth slice using useSelector

    if (isAuthenticated) return <Navigate to="/" /> // if 'isAuthenticated' is true ie user is authenticated, redirect user to home page

    return children; // if not authenticated, render the nested children components
}

export const AdminRoute = ({ children }) => { // define a function AdminRoute to guard admin/instructor-specific routes, children are nested components
    const { user, isAuthenticated } = useSelector(store => store.auth); // extract 'user' and 'isAuthenticated' from Redux auth slice

    if (!isAuthenticated) return <Navigate to="/login" /> // if 'isAuthenticated' is false ie user is not authenticated, redirect to login page

    if (user?.role !== "instructor") return <Navigate to="/" /> // if value of 'role' property of 'user' object is not 'instructor' authenticated user is not an instructor, redirect to home page

    return children; // if user is authenticated and has instructor role, render nested children components
}
