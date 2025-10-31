import React, { useEffect } from "react"; // import React library and useEffect hook to handle component side effects
import { Button } from "./ui/button"; // import Button component from local shadcn/ui library for UI interaction
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi"; // import mutation hook from purchaseApi to initiate checkout session creation via API
import { Loader2 } from "lucide-react"; // import Loader2 icon from lucide-react library for showing loading spinner
import { toast } from "sonner"; // import toast utility from sonner library to display notification messages

const BuyCourseButton = ({ courseId }) => { // define a functional component named 'BuyCourseButton' to let users purchase a course, taking 'courseId' as its prop
    const [ // destructure returned values from RTK Query mutation hook to manage checkout session creation and its states
        createCheckoutSession, // function to trigger API call for creating checkout session
        { data, isLoading, isSuccess, isError, error } // response data and status flags to handle API result and UI state
    ] = useCreateCheckoutSessionMutation(); // initialize the mutation hook

    const purchaseCourseHandler = async () => { // define async handler function to start purchase flow
        await createCheckoutSession(courseId); // call mutation function with current course ID to initiate checkout session
    };

    useEffect(() => { // execute side effects whenever checkout status changes
        if (isSuccess) { // check if checkout session was successfully created
            if (data?.url) window.location.href = data.url; // redirect user to checkout URL if provided by server
            else toast.error("Invalid response from server."); // display error toast if URL is missing in server response
        }

        if (isError) toast.error(error?.data?.message || "Failed to create checkout session"); // show toast with server error message or fallback if session creation fails
    }, [data, isSuccess, isError, error]); // dependencies to rerun effect whenever any of these change

    return (
        <Button
            disabled={isLoading} // disable button while API call is in progress to prevent multiple requests
            onClick={purchaseCourseHandler} // call purchase handler when user clicks the button
            className="w-full"
        >
            {isLoading ? ( // conditionally render loader or button label based on loading state
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* render spinning loader icon when waiting for response */}
                    Please wait
                </>
            ) : (
                "Purchase Course" // display purchase label when not loading
            )}
        </Button>
    );
};

export default BuyCourseButton; // export BuyCourseButton component for use in other parts of the app