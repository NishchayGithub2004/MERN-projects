import { useSelector } from "react-redux" // import useSelector hook to access Redux store state
import { Navigate } from "react-router-dom"; // import Navigate component to programmatically redirect users

export const ProtectedRoute = ({ children }) => { // define a function ProtectedRoute to guard routes, children are nested components
    const { isAuthenticated } = useSelector(store => store.auth); // extract isAuthenticated from Redux auth slice using useSelector

    if (!isAuthenticated) return <Navigate to="/login" /> // if user is not authenticated, redirect to login page

    return children; // if authenticated, render the nested children components
}

export const AuthenticatedUser = ({ children }) => { // define a function AuthenticatedUser to redirect logged-in users from auth pages
    const { isAuthenticated } = useSelector(store => store.auth); // extract isAuthenticated from Redux auth slice using useSelector

    if (isAuthenticated) return <Navigate to="/" /> // if user is authenticated, redirect to homepage

    return children; // if not authenticated, render the nested children components
}

export const AdminRoute = ({ children }) => { // define a function AdminRoute to guard admin/instructor-specific routes, children are nested components
    const { user, isAuthenticated } = useSelector(store => store.auth); // extract user object and isAuthenticated from Redux auth slice

    if (!isAuthenticated) return <Navigate to="/login" /> // if user is not authenticated, redirect to login page

    if (user?.role !== "instructor") return <Navigate to="/" /> // if authenticated user is not an instructor, redirect to homepage

    return children; // if user is authenticated and has instructor role, render nested children components
}
