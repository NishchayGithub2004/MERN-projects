import { useChatStore } from "../store/useChatStore"; // import chat store hook to access shared chat state
import BorderAnimatedContainer from "../components/BorderAnimatedContainer"; // import layout wrapper to provide animated border effect
import ProfileHeader from "../components/ProfileHeader"; // import header component to display user profile info
import ActiveTabSwitch from "../components/ActiveTabSwitch"; // import tab switch component to toggle between chats and contacts
import ChatsList from "../components/ChatsList"; // import component to render existing chat conversations
import ContactList from "../components/ContactList"; // import component to render all available contacts
import ChatContainer from "../components/ChatContainer"; // import component responsible for rendering active chat messages
import NoConversationPlaceholder from "../components/NoConversationPlaceholder"; // import placeholder component shown when no chat is selected

function ChatPage() { // define a functional component named 'ChatPage' to coordinate chat layout and conditional rendering
    const { activeTab, selectedUser } = useChatStore(); // extract active tab state and selected user to control visible content

    return (
        <div className="relative w-full max-w-6xl h-[800px]">
            <BorderAnimatedContainer>
                <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
                    <ProfileHeader />
                   
                    <ActiveTabSwitch />

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {activeTab === "chats" ? <ChatsList /> : <ContactList />} {/* conditionally render chats list or contacts list based on active tab */}
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
                    {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />} {/* render chat container when a user is selected, otherwise show empty-state placeholder */}
                </div>
            </BorderAnimatedContainer>
        </div>
    );
}

export default ChatPage;