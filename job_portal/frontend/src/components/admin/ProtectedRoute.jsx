import { useEffect } from "react" // import 'useEffect' hook to run side-effects
import { useSelector } from "react-redux" // import 'useSelector' hook from 'react-redux' library to access states and functions from redux slice of redux store
import { useNavigate } from "react-router-dom" // import 'useNavigate' hook from 'react-router-dom' library to navigate b/w different pages

const ProtectedRoute = ({ children }) => { // create a functional component named 'ProtectedRoute' to guard routes and render children only if user is authorized
    const { user } = useSelector(store => store.auth) // extract 'user' object from Redux store's auth slice using useSelector hook

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different pages

    // create a side-effect that runs only once (when the component mounts), if the user is not available or not a recruiter, redirect to home page

    useEffect(() => {
        if (user === null || user.role !== 'recruiter') navigate("/")
    }, [])

    return (
        <>
            {children} {/* render the JSX related to the recruiter */}
        </>
    )
}

export default ProtectedRoute