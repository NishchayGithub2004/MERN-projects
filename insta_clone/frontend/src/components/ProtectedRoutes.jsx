import React, { useEffect } from 'react' // import React and useEffect hook to handle side effects in the component
import { useSelector } from 'react-redux' // import useSelector hook to access the Redux store state
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically redirect users

const ProtectedRoutes = ({ children }) => { // define a component that receives 'children' prop representing nested components
    const { user } = useSelector(store => store.auth) // extract 'user' object from the 'auth' slice of Redux store to check authentication state

    const navigate = useNavigate() // initialize navigate function to enable route navigation

    useEffect(() => { // run side effect after component mount
        if (!user) { // check if 'user' is not present, meaning no active session
            navigate("/login") // redirect unauthenticated users to login page
        }
    }, []) // empty dependency array ensures this effect runs only once when the component mounts

    return <>{children}</> // render children components if user is authenticated
}

export default ProtectedRoutes;