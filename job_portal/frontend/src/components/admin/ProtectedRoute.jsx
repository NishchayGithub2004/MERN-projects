import { useEffect } from "react" // import useEffect hook to perform a side effect after component renders
import { useSelector } from "react-redux" // import useSelector hook to access user data from Redux store
import { useNavigate } from "react-router-dom" // import useNavigate hook to enable programmatic route navigation

const ProtectedRoute = ({ children }) => { // define a functional component named 'ProtectedRoute' to guard routes and render children only if user is authorized
    const { user } = useSelector(store => store.auth) // extract user object from Redux store's auth slice using useSelector hook

    const navigate = useNavigate() // call useNavigate to get navigation function used for redirecting unauthorized users

    useEffect(() => { // define side effect to check user authentication and role after component mounts
        if (user === null || user.role !== 'recruiter') navigate("/") // redirect to home page if no user is logged in or role is not recruiter
    }, []) // include empty dependency array to run the effect only once after initial render

    return ( // return child components wrapped inside fragment if authorization conditions are met
        <>
            {children} // render child components passed to ProtectedRoute when user passes authentication check
        </>
    )
}

export default ProtectedRoute // export ProtectedRoute component as default to use it for route protection elsewhere in app