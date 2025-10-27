import { setMessages } from "@/redux/chatSlice"; // import the setMessages action creator from chatSlice to update Redux state with new messages
import { useEffect } from "react"; // import useEffect hook from React to handle side effects like socket event listening
import { useDispatch, useSelector } from "react-redux"; // import useDispatch and useSelector hooks to interact with the Redux store

const useGetRTM = () => { // define a custom hook useGetRTM to handle real-time message updates using socket.io
    const dispatch = useDispatch(); // initialize dispatch function to dispatch Redux actions

    const { socket } = useSelector(store => store.socketio); // using 'useSelector' hook, access 'socket' from 'socketio' store

    const { messages } = useSelector(store => store.chat); // using 'useSelector' hook, access 'messages' from 'chat' store

    useEffect(() => { // use useEffect hook to set up and clean up socket event listeners when dependencies change
        socket?.on( // call the on method of the socket object to listen for a specific event
            'newMessage', // specify the event name 'newMessage' to listen for incoming messages from the server
            (newMessage) => { // define a callback function to handle the new message received from the socket
                dispatch( // call dispatch to send an action to Redux store
                    setMessages([...messages, newMessage]) // call setMessages with a new array combining existing messages and the newly received message
                );
            }
        );

        return () => { // return a cleanup function to remove event listeners when the component unmounts or dependencies change
            socket?.off('newMessage'); // call the off method of the socket object to stop listening for the 'newMessage' event
        }
    }, [messages, setMessages]); // include messages and setMessages in dependency array so the listener updates when messages change
};

export default useGetRTM; // export the custom hook useGetRTM as the default export for reuse in components that need real-time messaging
