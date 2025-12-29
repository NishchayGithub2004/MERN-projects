import { useRef, useState } from "react"; // import react hooks to manage component state and mutable DOM references
import useKeyboardSound from "../hooks/useKeyboardSound"; // import custom hook to play keyboard sound effects
import { useChatStore } from "../store/useChatStore"; // import chat store to send messages and read sound preference
import toast from "react-hot-toast"; // import toast to show user-facing validation and error messages
import { ImageIcon, SendIcon, XIcon } from "lucide-react"; // import icons to represent image upload, send action, and remove image

function MessageInput() { // define a functional component to handle text and image message input
    const { playRandomKeyStrokeSound } = useKeyboardSound(); // extract function to play random keystroke sound
    
    const [text, setText] = useState(""); // manage message text input state
    
    const [imagePreview, setImagePreview] = useState(null); // manage selected image preview as base64 string

    const fileInputRef = useRef(null); // create a ref to imperatively reset the file input element

    const { sendMessage, isSoundEnabled } = useChatStore(); // extract sendMessage action and sound preference from chat store

    const handleSendMessage = (e) => { // define handler to validate and send message on form submit
        e.preventDefault(); // prevent default form submission behavior
        
        if (!text.trim() && !imagePreview) return; // block sending if both text and image are empty
        
        if (isSoundEnabled) playRandomKeyStrokeSound(); // play typing sound feedback when enabled

        sendMessage({ // send message payload to chat store for optimistic update and backend delivery
            text: text.trim(), // trim whitespace before sending text message
            image: imagePreview, // attach optional image preview data
        });
        
        setText(""); // reset text input after sending message
        
        setImagePreview(""); // clear image preview after sending message
        
        if (fileInputRef.current) fileInputRef.current.value = ""; // reset file input value to allow reselecting same file
    };

    const handleImageChange = (e) => { // define handler to process selected image file
        const file = e.target.files[0]; // read the first selected file from input
        
        if (!file.type.startsWith("image/")) { // validate that selected file is an image
            toast.error("Please select an image file"); // notify user when invalid file type is selected
            return;
        }

        const reader = new FileReader(); // create a FileReader to convert image file into base64 string
        
        reader.onloadend = () => setImagePreview(reader.result); // update image preview state once file reading completes
        
        reader.readAsDataURL(file); // start reading image file as data URL for preview and upload
    };

    const removeImage = () => { // define handler to remove selected image before sending
        setImagePreview(null); // clear image preview state
        
        if (fileInputRef.current) fileInputRef.current.value = ""; // reset file input to clear selected file
    };

    return (
        <div className="p-4 border-t border-slate-700/50">
            {imagePreview && ( // conditionally render image preview block only when an image is selected
                <div className="max-w-3xl mx-auto mb-3 flex items-center">
                    <div className="relative">
                        <img
                            src={imagePreview} // bind selected image preview data to image source for visual feedback
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                        />
                        
                        <button
                            onClick={removeImage} // invoke image removal logic to clear preview and file input
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
                            type="button"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4"> // handle message submission through controlled form submit
                <input
                    type="text"
                    value={text} // bind input value to message text state
                    onChange={(e) => { // update message text state and optionally play keystroke sound
                        setText(e.target.value); // store latest input value into local state
                        isSoundEnabled && playRandomKeyStrokeSound(); // play typing sound only when sound setting is enabled
                    }}
                    className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
                    placeholder="Type your message..."
                />

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef} // attach ref to allow programmatic triggering and resetting of file input
                    onChange={handleImageChange} // process selected image file and generate preview
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()} // programmatically open hidden file picker on button click
                    className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""}`} // visually indicate image selection state through conditional styling
                >
                    <ImageIcon className="w-5 h-5" />
                </button>

                <button
                    type="submit"
                    disabled={!text.trim() && !imagePreview} // disable send action when there is no text and no image
                    className="bg-linear-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}

export default MessageInput;