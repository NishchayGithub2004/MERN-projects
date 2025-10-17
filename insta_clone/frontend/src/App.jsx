import { useEffect } from 'react' // import useEffect to handle side effects like socket connection
import ChatPage from './components/ChatPage' // import ChatPage component for chat UI
import EditProfile from './components/EditProfile' // import EditProfile component for editing user profile
import Home from './components/Home' // import Home component for main feed
import Login from './components/Login' // import Login component for authentication
import MainLayout from './components/MainLayout' // import MainLayout as a wrapper for authenticated pages
import Profile from './components/Profile' // import Profile component for user profiles
import Signup from './components/Signup' // import Signup component for new users
import { createBrowserRouter, RouterProvider } from 'react-router-dom' // import routing utilities from React Router
import { io } from "socket.io-client" // import io function to establish socket connection
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks for accessing and updating store
import { setSocket } from './redux/socketSlice' // import action to store socket instance in Redux
import { setOnlineUsers } from './redux/chatSlice' // import action to update list of online users
import { setLikeNotification } from './redux/rtnSlice' // import action to handle like notifications
import ProtectedRoutes from './components/ProtectedRoutes' // import component to guard private routes

const browserRouter = createBrowserRouter([ // define all application routes using React Router
    {
        path: "/", // root path of the app
        element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>, // wrap layout inside ProtectedRoutes to restrict access to authenticated users
        children: [ // nested routes rendered inside MainLayout
            {
                path: '/', 
                element: <ProtectedRoutes><Home /></ProtectedRoutes> // home feed route
            },
            {
                path: '/profile/:id',
                element: <ProtectedRoutes> <Profile /></ProtectedRoutes> // dynamic route for user profiles
            },
            {
                path: '/account/edit',
                element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> // edit profile route
            },
            {
                path: '/chat',
                element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> // chat page route
            },
        ]
    },
    {
        path: '/login',
        element: <Login /> // public login route
    },
    {
        path: '/signup',
        element: <Signup /> // public signup route
    },
])

function App() {
    const { user } = useSelector(store => store.auth) // get current authenticated user from Redux store
    const { socket } = useSelector(store => store.socketio) // get current socket instance from Redux store
    const dispatch = useDispatch() // create dispatch function to trigger Redux actions

    useEffect(() => { // handle socket connection lifecycle
        if (user) { // if user is logged in
            const socketio = io('http://localhost:8000', { // establish socket connection to backend
                query: { userId: user?._id }, // send user ID as query param for identification
                transports: ['websocket'] // specify WebSocket transport for real-time communication
            })
            
            dispatch(setSocket(socketio)) // store socket instance in Redux state

            socketio.on('getOnlineUsers', (onlineUsers) => { // listen for online users list from server
                dispatch(setOnlineUsers(onlineUsers)) // update Redux store with current online users
            })

            socketio.on('notification', (notification) => { // listen for like notifications
                dispatch(setLikeNotification(notification)) // store new notification in Redux state
            })

            return () => { // cleanup function runs on unmount
                socketio.close() // close socket connection to avoid leaks
                dispatch(setSocket(null)) // clear socket instance in Redux store
            }
        } else if (socket) { // if user logs out or socket exists without user
            socket.close() // close existing socket connection
            dispatch(setSocket(null)) // reset socket in Redux
        }
    }, [user, dispatch]) // re-run effect whenever user or dispatch changes

    return (
        <>
            <RouterProvider router={browserRouter} /> {/* initialize routing system with defined routes */}
        </>
    )
}

export default App