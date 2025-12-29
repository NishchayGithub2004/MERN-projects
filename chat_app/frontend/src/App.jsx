import { 
    Navigate, // import Navigate component to programmatically redirect users between routes
    Route, // import Route component to define individual application routes
    Routes // import Routes component to group and resolve route definitions
} from "react-router";

import ChatPage from "./pages/ChatPage"; // import main chat page component rendered after successful authentication
import LoginPage from "./pages/LoginPage"; // import login page component for user authentication
import SignUpPage from "./pages/SignUpPage"; // import signup page component for new user registration
import { useAuthStore } from "./store/useAuthStore"; // import auth store hook to access authentication state and actions
import { useEffect } from "react"; // import useEffect hook to run authentication check on app load
import PageLoader from "./components/PageLoader"; // import loader component to show while auth status is being verified
import { Toaster } from "react-hot-toast"; // import toaster component to globally render toast notifications

function App() { // define root application component responsible for routing and auth gating
    const { checkAuth, isCheckingAuth, authUser } = useAuthStore(); // extract auth check action, loading flag, and authenticated user data

    useEffect(() => { // run side effect when app mounts
        checkAuth(); // verify existing authentication session with backend or persisted state
    }, [checkAuth]); // re-run effect only if auth check function reference changes

    if (isCheckingAuth) return <PageLoader />; // block app rendering and show loader while auth verification is in progress

    return (
        <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px]" />
            <div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px]" />
            <div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

            <Routes>
                <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} /> // protect root route by redirecting unauthenticated users to login
                <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} /> // prevent logged-in users from accessing login page
                <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} /> // prevent logged-in users from accessing signup page
            </Routes>

            <Toaster /> // mount global toast notification handler for user feedback
        </div>
    );
}

export default App;