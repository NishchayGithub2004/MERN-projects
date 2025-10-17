import { createSlice } from "@reduxjs/toolkit"; // import createSlice function from Redux Toolkit to create a slice of state with reducers and actions

const chatSlice = createSlice({ // define a constant chatSlice by calling createSlice to handle chat-related state management
    name: "chat", // assign the slice name 'chat' to identify it within the Redux store

    initialState: { // define the initial state object for chat data
        onlineUsers: [], // initialize onlineUsers as an empty array to store users currently online
        messages: [], // initialize messages as an empty array to store chat messages
    },

    reducers: { // define an object of reducer functions that modify specific parts of the chat state
        setOnlineUsers: (state, action) => { // define a reducer setOnlineUsers that takes state and action to update online user data
            state.onlineUsers = action.payload; // assign the payload array from the action to state.onlineUsers to update the list of online users
        },
        setMessages: (state, action) => { // define a reducer setMessages that takes state and action to update chat messages
            state.messages = action.payload; // assign the payload array from the action to state.messages to update the chat message list
        }
    }
});

export const { setOnlineUsers, setMessages } = chatSlice.actions; // export the auto-generated action creators for setting online users and messages

export default chatSlice.reducer; // export the reducer function created by createSlice to integrate into the Redux store
