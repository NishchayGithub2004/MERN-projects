import { create } from "zustand"; // import create from zustand to define a global state store with actions and reactive state
import { axiosInstance } from "../lib/axios"; // import the preconfigured axios instance to make authenticated API requests
import toast from "react-hot-toast"; // import toast to show non-blocking success and error notifications to the user
import { io } from "socket.io-client"; // import io to establish and manage a realtime websocket connection with the backend

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"; // define backend base URL dynamically to use localhost in development and relative root in production

export const useAuthStore = create((set, get) => ({ // create and export an authentication store to manage auth state, async actions, and socket lifecycle
    authUser: null, // store the currently authenticated user object or null when not logged in
    isCheckingAuth: true, // track whether initial authentication check is in progress to control loading states
    isSigningUp: false, // track signup request state to disable UI actions during account creation
    isLoggingIn: false, // track login request state to disable UI actions during authentication
    socket: null, // store the active socket.io client instance for realtime communication
    onlineUsers: [], // store the list of user IDs currently online as reported by the server

    checkAuth: async () => { // define a function to verify existing authentication state when the app loads
        try {
            const res = await axiosInstance.get("/auth/check"); // call backend endpoint to validate session or token
            set({ authUser: res.data }); // update the store with authenticated user data returned by the server
            get().connectSocket(); // establish socket connection after successful authentication
        } catch (error) {
            console.log("Error in authCheck:", error); // log authentication check errors for debugging
            set({ authUser: null }); // explicitly clear auth user when authentication fails
        } finally {
            set({ isCheckingAuth: false }); // mark authentication check as completed regardless of outcome
        }
    },

    signup: async (data) => { // define a function to create a new user account using provided signup data
        set({ isSigningUp: true }); // set signup loading state to true before making API request
        
        try {
            const res = await axiosInstance.post("/auth/signup", data); // send signup data to backend to create a new account
            set({ authUser: res.data }); // store newly created and authenticated user data
            toast.success("Account created successfully!"); // notify user that account creation succeeded
            get().connectSocket(); // connect to socket server after successful signup
        } catch (error) {
            toast.error(error.response.data.message); // display backend-provided error message when signup fails
        } finally {
            set({ isSigningUp: false }); // reset signup loading state after request completes
        }
    },

    login: async (data) => { // define a function to authenticate an existing user with login credentials
        set({ isLoggingIn: true }); // set login loading state to true before making API request
        
        try {
            const res = await axiosInstance.post("/auth/login", data); // send login credentials to backend for authentication
            set({ authUser: res.data }); // update store with authenticated user data returned by backend
            toast.success("Logged in successfully"); // notify user of successful login
            get().connectSocket(); // establish socket connection after login
        } catch (error) {
            toast.error(error.response.data.message); // show backend-provided error message when login fails
        } finally {
            set({ isLoggingIn: false }); // reset login loading state after request completes
        }
    },

    logout: async () => { // define a function to log out the currently authenticated user
        try {
            await axiosInstance.post("/auth/logout"); // notify backend to invalidate session or authentication token
            set({ authUser: null }); // clear authenticated user data from the store
            toast.success("Logged out successfully"); // inform user that logout was successful
            get().disconnectSocket(); // disconnect socket connection after logout
        } catch (error) {
            toast.error("Error logging out"); // display a generic error message when logout fails
            console.log("Logout error:", error); // log detailed logout error for debugging
        }
    },

    updateProfile: async (data) => { // define a function to update authenticated user's profile information
        try {
            const res = await axiosInstance.put("/auth/update-profile", data); // send updated profile data to backend
            set({ authUser: res.data }); // update store with latest user profile data from server
            toast.success("Profile updated successfully"); // notify user that profile update succeeded
        } catch (error) {
            console.log("Error in update profile:", error); // log profile update error for debugging
            toast.error(error.response.data.message); // show backend-provided error message to the user
        }
    },

    connectSocket: () => { // define a function to initialize and manage socket connection for realtime features
        const { authUser } = get(); // read authenticated user data from the store
        
        if (!authUser || get().socket?.connected) return; // prevent socket connection if user is not authenticated or socket is already connected

        const socket = io(BASE_URL, { // create a new socket.io client instance pointing to backend server
            withCredentials: true, // allow cookies and auth headers to be sent with websocket handshake
        });

        socket.connect(); // explicitly initiate socket connection with the server

        set({ socket }); // store socket instance in global state for later access

        socket.on("getOnlineUsers", (userIds) => { // listen for server event that broadcasts currently online user IDs
            set({ onlineUsers: userIds }); // update store with latest list of online users
        });
    },

    disconnectSocket: () => { // define a function to cleanly disconnect socket connection
        if (get().socket?.connected) get().socket.disconnect(); // disconnect active socket only if a connection exists
    },
}));