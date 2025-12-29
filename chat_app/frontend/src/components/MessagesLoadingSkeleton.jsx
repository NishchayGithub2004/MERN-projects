function MessagesLoadingSkeleton() { // define a functional component to render a placeholder skeleton while messages are loading
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {[...Array(6)].map(( // generate a fixed-length array to render a consistent number of skeleton chat bubbles
                _, // ignore the actual array value since only the index is needed for layout logic
                index // use index to alternate skeleton alignment between left and right
            ) => (
                <div
                    key={index} // use index as key because skeleton items are static and not reordered
                    className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`} // alternate chat alignment based on index parity and apply pulsing animation
                >
                    <div className={`chat-bubble bg-slate-800 text-white w-32`}></div>
                </div>
            ))}
        </div>
    );
}

export default MessagesLoadingSkeleton;