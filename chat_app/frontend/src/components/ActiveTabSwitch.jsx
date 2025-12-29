import { useChatStore } from "../store/useChatStore"; // import chat store hook to read and update active chat tab state

function ActiveTabSwitch() { // define a functional component to switch between chats and contacts tabs
    const { activeTab, setActiveTab } = useChatStore(); // extract activeTab state and setter function from chat store

    return (
        <div className="tabs tabs-boxed bg-transparent p-2 m-2">
            <button
                onClick={() => setActiveTab("chats")} // update global active tab state to "chats" when button is clicked
                className={`tab ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`} // dynamically apply active or inactive styling based on current active tab value
            >
                Chats
            </button>

            <button
                onClick={() => setActiveTab("contacts")} // update global active tab state to "contacts" when button is clicked
                className={`tab ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`} // dynamically apply active or inactive styling based on current active tab value
            >
                Contacts
            </button>
        </div>
    );
}

export default ActiveTabSwitch;