import { MessageCircleIcon } from "lucide-react";
import { useChatStore } from "../store/useChatStore"; // import custom hook 'useChatStore' to access chat related states and functions

function NoChatsFound() { // create a functional component named 'NoChatsFound' to render message if no chats are made with anyone
    const { setActiveTab } = useChatStore(); // extract 'setActiveTab' function from 'useChatStore'

    return (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center">
                <MessageCircleIcon className="w-8 h-8 text-cyan-400" />
            </div>
            
            <div>
                <h4 className="text-slate-200 font-medium mb-1">No conversations yet</h4>
                <p className="text-slate-400 text-sm px-6">Start a new chat by selecting a contact from the contacts tab</p>
            </div>
            
            <button
                onClick={() => setActiveTab("contacts")} // clicking this button calls 'setActiveTab' function with 'contacts' as argument
                className="px-4 py-2 text-sm text-cyan-400 bg-cyan-500/10 rounded-lg hover:bg-cyan-500/20 transition-colors"
            >
                Find contacts
            </button>
        </div>
    );
}

export default NoChatsFound;