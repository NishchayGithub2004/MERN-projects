import { useRef, useState } from "react"; // import 'useRef' hook to create a direct reference to a DOM element and 'useState' hook to create a state variable and a function to update it
import useKeyboardSound from "../hooks/useKeyboardSound"; // import custom hook 'useKeyboardSound' to play random keyboard sound effects on key strokes
import { useChatStore } from "../store/useChatStore"; // import custom hook 'useChatStore' to access chat related states and functions
import toast from "react-hot-toast"; // import 'toast' function from 'react-hot-toast' library to display toast pop-up notifications
import { ImageIcon, SendIcon, XIcon } from "lucide-react";

function MessageInput() {
    const { playRandomKeyStrokeSound } = useKeyboardSound(); // extract 'playRandomKeyStrokeSound' function from custom hook 'useKeyboardSound'
    
    const [text, setText] = useState(""); // create a state variable 'text' and a function 'setText' to update it's value (initial value is an empty string)
    
    const [imagePreview, setImagePreview] = useState(null); // create a state variable 'imagePreview' and a function 'setImagePreview' to update it's value (initial value is null)

    const fileInputRef = useRef(null); // create a reference to the file input element using 'useRef' hook with initial value of null since initially it doesn't point to any element

    const { sendMessage, isSoundEnabled } = useChatStore(); // import 'sendMessage' function and 'isSoundEnabled' state from custom hook 'useChatStore'

    const handleSendMessage = (e) => { // create a function named 'handleSendMessage' that takes an event object as an argument
        e.preventDefault(); // prevent the default behavior of the form submission so that this function executes before the form is submitted
        
        if (!text.trim() && !imagePreview) return; // if 'text' state is empty and 'imagePreview' state is null return nothing
        
        if (isSoundEnabled) playRandomKeyStrokeSound(); // if 'isSoundEnabled' state is true call 'playRandomKeyStrokeSound' function to play a random keyboard sound effect

        // call 'sendMessage' function from custom hook 'useChatStore' with an object containing 'text' and 'imagePreview' state as it's properties

        sendMessage({
            text: text.trim(),
            image: imagePreview,
        });
        
        setText(""); // set value of 'text' state to an empty string to clear the input field

        setImagePreview(""); // set value of 'imagePreview' state to an empty string to clear the preview image
        
        if (fileInputRef.current) fileInputRef.current.value = ""; // if there's a file input element reference it's value to an empty string to clear the selected file
    };

    const handleImageChange = (e) => { // create a function named 'handleImageChange' that takes an event object as an argument
        const file = e.target.files[0]; // get the first file from the files array of the event target
        
        if (!file.type.startsWith("image/")) { // check if the file type doesn't start with "image/" ie chosen file is not an image
            toast.error("Please select an image file"); // display an error toast message that an image file needs to be selected
            return;
        }

        const reader = new FileReader(); // create an instance of 'FileReader' class to read the contents of the file as a data URL
        
        reader.onloadend = () => setImagePreview(reader.result); // set the value of 'imagePreview' state to the result of the file reading operation when the file is read
        
        reader.readAsDataURL(file); // read the contents of the file as a data URL
    };

    // create a function named 'removeImage' that sets the value of 'imagePreview' state to null to clear the preview image
    // by setting the value of 'imagePreview' state to null using 'setImagePreview' function and if there's a file input element reference it's value to an empty string

    const removeImage = () => {
        setImagePreview(null);
        
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="p-4 border-t border-slate-700/50">
            {imagePreview && ( // if image preview is available
                <div className="max-w-3xl mx-auto mb-3 flex items-center">
                    <div className="relative">
                        <img
                            src={imagePreview} // render the preview image
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-lg border border-slate-700"
                        />
                        <button
                            onClick={removeImage} // clicking this button calls 'removeImage' function to clear the preview image
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 hover:bg-slate-700"
                            type="button"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4"> {/* submitting this form calls 'handleSendMessage' function */}
                <input
                    type="text"
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value); // changing value of this input field calls 'setText' function to update 'text' state
                        isSoundEnabled && playRandomKeyStrokeSound(); // if 'isSoundEnabled' state is true ie sound is enabled, call 'playRandomKeyStrokeSound' function to play a random keyboard sound effect
                    }}
                    className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
                    placeholder="Type your message..."
                />

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef} // create a direct reference to the file input element using 'useRef' hook
                    onChange={handleImageChange} // changing value of this input field calls 'handleImageChange' function to update 'imagePreview' state ie change the preview image
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()} // clicking this button calls 'click' method on the file input element to open file selection dialog
                    className={`bg-slate-800/50 text-slate-400 hover:text-slate-200 rounded-lg px-4 transition-colors ${imagePreview ? "text-cyan-500" : ""}`}
                >
                    <ImageIcon className="w-5 h-5" />
                </button>
                
                <button
                    type="submit"
                    disabled={!text.trim() && !imagePreview} // this button is disabled if 'text' state is empty and 'imagePreview' state is null ie no text or image is available
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <SendIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}

export default MessageInput;