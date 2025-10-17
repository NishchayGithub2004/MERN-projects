import { setMessages } from "@/redux/chatSlice"; // import the setMessages action creator from the chatSlice to update the Redux state with chat messages
import axios from "axios"; // import axios library to make HTTP requests
import { useEffect } from "react"; // import useEffect hook from React to handle side effects like data fetching
import { useDispatch, useSelector } from "react-redux"; // import useDispatch and useSelector hooks to interact with the Redux store

const useGetAllMessage = () => { // define a custom hook useGetAllMessage to fetch all chat messages for the selected user
    const dispatch = useDispatch(); // initialize dispatch function to dispatch Redux actions

    const { selectedUser } = useSelector( // use useSelector to access a specific part of the Redux state
        store => store.auth // retrieve the selectedUser value from the auth slice in the Redux store
    );

    useEffect(() => { // use useEffect hook to run the message fetching logic when selectedUser changes
        const fetchAllMessage = async () => { // define an asynchronous function fetchAllMessage to fetch all chat messages from the server
            try { // start a try block to handle potential errors during the API call
                const res = await axios.get( // call axios.get to send a GET request to the backend server
                    `http://localhost:8080/api/v1/message/all/${selectedUser?._id}`, // dynamically build the API endpoint URL using the selectedUser’s _id
                    { withCredentials: true } // include credentials (like cookies) in the request for authentication
                );

                if (res.data.success) { // check if the response data contains a success property set to true
                    dispatch( // call dispatch to send an action to the Redux store
                        setMessages(res.data.messages) // call setMessages with messages array from the response to update Redux state
                    );
                }
            } catch (error) { // catch any error thrown during the request
                console.log(error); // log the error to the console for debugging
            }
        }

        fetchAllMessage(); // invoke fetchAllMessage to initiate fetching messages when the effect runs
    }, [selectedUser]); // include selectedUser as a dependency so the effect re-runs whenever selectedUser changes
};

export default useGetAllMessage; // export the custom hook useGetAllMessage as the default export for use in other components
