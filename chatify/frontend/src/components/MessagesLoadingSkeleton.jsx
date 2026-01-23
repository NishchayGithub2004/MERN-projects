function MessagesLoadingSkeleton() { // create a functional component named 'MessagesLoadingSkeleton' that renders a loading skeleton for messages
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {[...Array(6)].map((_, index) => ( // create an array of 6 elements and iterate over each element
                <div
                    key={index} // index of current array element is the unique identifier of the container
                    className={`chat ${index % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`} // apply styles based on whether current index value is even or odd
                >
                    <div className={`chat-bubble bg-slate-800 text-white w-32`}></div>
                </div>
            ))}
        </div>
    );
}

export default MessagesLoadingSkeleton;