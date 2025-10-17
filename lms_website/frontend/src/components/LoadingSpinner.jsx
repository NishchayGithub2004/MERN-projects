import { Loader } from 'lucide-react'; // import Loader icon to display a spinning loader animation
import React from 'react'; // import React library to use JSX and React features

const LoadingSpinner = () => { // define a function component LoadingSpinner to show a full-screen loading indicator
    return ( // return the JSX structure for the loading spinner
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50"> {/* container centered vertically and horizontally with full screen height */}
            <Loader className="animate-spin h-16 w-16 text-blue-600" /> {/* spinning loader icon with size and color */}
            <p className="mt-4 text-lg font-semibold text-gray-700">Loading, please wait...</p> {/* informative text displayed below the loader */}
        </div>
    )
}

export default LoadingSpinner; // export LoadingSpinner component as default for use in other parts of the app
