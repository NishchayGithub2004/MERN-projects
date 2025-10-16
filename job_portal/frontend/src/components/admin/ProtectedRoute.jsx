import { useEffect } from "react"; // import useEffect hook to perform side effects after component renders
import { useSelector } from "react-redux"; // import useSelector to access Redux store state
import { useNavigate } from "react-router-dom"; // import useNavigate to programmatically navigate between routes

const ProtectedRoute = ({ children }) => { // define a function component ProtectedRoute that takes children as a prop to render protected content
    const { user } = useSelector(store => store.auth); // access the user object from the auth slice of Redux store by using useSelector hook

    const navigate = useNavigate(); // create a navigate function using useNavigate hook to handle redirection

    useEffect(() => { // define a useEffect hook to run side effects after component mounts
        if (user === null || user.role !== 'recruiter') { // check if user is null (not logged in) or user role is not 'recruiter'
            navigate("/"); // navigate to home page if user is unauthorized
        }
    }, []); // provide empty dependency array to run this effect only once after initial render

    return (
        <> 
            {children} {/* render protected child components only if user is authorized */}
        </>
    )
};

export default ProtectedRoute; // export the ProtectedRoute component for use in other parts of the app
