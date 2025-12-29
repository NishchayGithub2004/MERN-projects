import { create } from "zustand"; // import create from zustand to define a centralized chat state store with actions
import { axiosInstance } from "../lib/axios"; // import the preconfigured axios instance to communicate with message-related backend APIs
import toast from "react-hot-toast"; // import toast to display user-facing success and error notifications
import { useAuthStore } from "./useAuthStore"; // import auth store to access authenticated user and socket instance

export const useChatStore = create((set, get) => ({ // create and export a chat store to manage contacts, chats, messages, and realtime updates
    allContacts: [], // store all available contacts that the user can start conversations with
    chats: [], // store users with whom the current user already has existing chats
    messages: [], // store messages of the currently selected conversation
    activeTab: "chats", // track which UI tab is active to switch between chats and contacts
    selectedUser: null, // store the currently selected chat user
    isUsersLoading: false, // track loading state for contacts and chat partner requests
    isMessagesLoading: false, // track loading state for message fetch requests
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true, // initialize sound preference from localStorage to persist user choice

    toggleSound: () => { // define a function to toggle notification sound preference
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled); // persist updated sound preference to localStorage
        set({ isSoundEnabled: !get().isSoundEnabled }); // update sound preference state to trigger UI and logic changes
    },

    setActiveTab: (tab) => set({ activeTab: tab }), // update the currently active UI tab based on user interaction
    
    setSelectedUser: (selectedUser) => set({ selectedUser }), // update the selected chat user when a conversation is opened

    getAllContacts: async () => { // define a function to fetch all possible contacts from the backend
        set({ isUsersLoading: true }); // enable loading state while fetching contacts
        
        try {
            const res = await axiosInstance.get("/messages/contacts"); // request all contacts from the server
            set({ allContacts: res.data }); // store retrieved contacts in state
        } catch (error) {
            toast.error(error.response.data.message); // show backend error message if contacts fetch fails
        } finally {
            set({ isUsersLoading: false }); // disable loading state after request completes
        }
    },
    
    getMyChatPartners: async () => { // define a function to fetch users with existing chat history
        set({ isUsersLoading: true }); // enable loading state while fetching chat partners
        
        try {
            const res = await axiosInstance.get("/messages/chats"); // request existing chat partners from the server
            set({ chats: res.data }); // store chat partners in state
        } catch (error) {
            toast.error(error.response.data.message); // display backend error message if request fails
        } finally {
            set({ isUsersLoading: false }); // disable loading state after request completes
        }
    },

    getMessagesByUserId: async (userId) => { // define a function to fetch messages for a specific user conversation
        set({ isMessagesLoading: true }); // enable loading state while fetching messages
        
        try {
            const res = await axiosInstance.get(`/messages/${userId}`); // request conversation messages by user ID
            set({ messages: res.data }); // store fetched messages in state
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong"); // show safe fallback error message if request fails
        } finally {
            set({ isMessagesLoading: false }); // disable loading state after request completes
        }
    },

    sendMessage: async (messageData) => { // define a function to send a message with optimistic UI updates
        const { selectedUser, messages } = get(); // retrieve selected user and current messages from state
        
        const { authUser } = useAuthStore.getState(); // read authenticated user data directly from auth store

        const tempId = `temp-${Date.now()}`; // generate a temporary message ID for optimistic rendering

        const optimisticMessage = { // construct a temporary message object to show instantly in UI
            _id: tempId, // assign temporary ID to distinguish optimistic message
            senderId: authUser._id, // mark current user as message sender
            receiverId: selectedUser._id, // mark selected user as message receiver
            text: messageData.text, // include message text payload
            image: messageData.image, // include optional image payload
            createdAt: new Date().toISOString(), // set creation timestamp for UI ordering
            isOptimistic: true, // flag message as optimistic to differentiate from server-confirmed messages
        };
        
        set({ messages: [...messages, optimisticMessage] }); // immediately append optimistic message to message list

        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData); // send message payload to backend
            set({ messages: messages.concat(res.data) }); // append server-confirmed message data to state
        } catch (error) {
            set({ messages: messages }); // rollback message list to previous state if send fails
            toast.error(error.response?.data?.message || "Something went wrong"); // notify user that sending message failed
        }
    },

    subscribeToMessages: () => { // define a function to listen for realtime incoming messages
        const { selectedUser, isSoundEnabled } = get(); // retrieve selected user and sound preference from state
        
        if (!selectedUser) return; // prevent subscription if no chat user is selected

        const socket = useAuthStore.getState().socket; // access active socket connection from auth store

        socket.on("newMessage", (newMessage) => { // register socket listener for incoming messages
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id; // check if message belongs to current conversation
            
            if (!isMessageSentFromSelectedUser) return; // ignore messages not related to selected chat

            const currentMessages = get().messages; // read current messages from state
            
            set({ messages: [...currentMessages, newMessage] }); // append new incoming message to state

            if (isSoundEnabled) { // check if notification sound is enabled
                const notificationSound = new Audio("/sounds/notification.mp3"); // create audio object for message notification
                notificationSound.currentTime = 0; // reset playback position to allow rapid consecutive sounds
                notificationSound.play().catch((e) => console.log("Audio play failed:", e)); // attempt playback and log failures silently
            }
        });
    },

    unsubscribeFromMessages: () => { // define a function to stop listening for incoming messages
        const socket = useAuthStore.getState().socket; // retrieve active socket connection from auth store
        socket.off("newMessage"); // remove message listener to prevent duplicate handlers and memory leaks
    },
}));