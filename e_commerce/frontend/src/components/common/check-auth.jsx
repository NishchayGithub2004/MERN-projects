import { Navigate, useLocation } from "react-router-dom"; // import Navigate to redirect and useLocation to get current route

// create a component for checking user authentication and role-based access that takes these props: isAuthenticated (boolean), user (object), children (React nodes)
function CheckAuth({ isAuthenticated, user, children }) {
    const location = useLocation(); // get current route location

    console.log(location.pathname, isAuthenticated); // log current path and auth state for debugging

    if (location.pathname === "/") { // handle root path redirects
        if (!isAuthenticated) {
            return <Navigate to="/auth/login" />; // redirect unauthenticated users to login
        } else {
            if (user?.role === "admin") {
                return <Navigate to="/admin/dashboard" />; // redirect admin to dashboard
            } else {
                return <Navigate to="/shop/home" />; // redirect regular users to shop home
            }
        }
    }

    if (
        !isAuthenticated && // if user is not authenticated
        !(location.pathname.includes("/login") || location.pathname.includes("/register")) // and not already on login/register page
    ) {
        return <Navigate to="/auth/login" />; // redirect to login
    }

    if (
        isAuthenticated && // if user is authenticated
        (location.pathname.includes("/login") || location.pathname.includes("/register")) // and trying to access login/register
    ) {
        if (user?.role === "admin") {
            return <Navigate to="/admin/dashboard" />; // redirect admin to dashboard
        } else {
            return <Navigate to="/shop/home" />; // redirect regular user to shop home
        }
    }

    if (
        isAuthenticated && // if user is authenticated
        user?.role !== "admin" && // not an admin
        location.pathname.includes("admin") // trying to access admin route
    ) {
        return <Navigate to="/unauth-page" />; // redirect unauthorized users from admin pages
    }

    if (
        isAuthenticated && // if user is authenticated
        user?.role === "admin" && // admin user
        location.pathname.includes("shop") // trying to access shop route
    ) {
        return <Navigate to="/admin/dashboard" />; // redirect admin away from shop pages
    }

    return <>{children}</>; // allow access to child components if all checks pass
}

export default CheckAuth;
