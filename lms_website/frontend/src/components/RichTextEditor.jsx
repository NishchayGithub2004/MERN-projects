import React from 'react'; // import React library to use JSX and component functionality
import ReactQuill from 'react-quill'; // import ReactQuill component for rich text editing
import 'react-quill/dist/quill.snow.css'; // import Quill's snow theme CSS for editor styling

const RichTextEditor = ({ input, setInput }) => { // define a function RichTextEditor component, input is current state, setInput is state setter function

    const handleChange = (content) => { // define a function handleChange to update input state, content is the new editor value
        setInput({ ...input, description: content }); // update input state by spreading previous input and setting description to content
    }

    return <ReactQuill theme="snow" value={input.description} onChange={handleChange} />; // render ReactQuill editor with snow theme, bind value to input.description, handle changes via handleChange
}

export default RichTextEditor; // export RichTextEditor component as default for use in other modules
