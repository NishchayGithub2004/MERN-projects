import React, { useEffect } from "react"; // import React library and useEffect hook to create functional component and handle side effects
import { Button } from "./ui/button"; // import Button component from ui directory for rendering the purchase button
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi"; // import RTK Query mutation hook to handle creating checkout session via API
import { Loader2 } from "lucide-react"; // import Loader2 icon for loading animation during purchase process
import { toast } from "sonner"; // import toast notification library to display success or error messages

const BuyCourseButton = ({ courseId }) => { // define a function component BuyCourseButton with courseId prop to identify which course to purchase
    const [ // destructure array returned by RTK Query hook
        createCheckoutSession, // function to trigger checkout session creation API call
        { data, isLoading, isSuccess, isError, error } // object containing response data and status flags from mutation
    ] = useCreateCheckoutSessionMutation(); // call custom mutation hook to manage API state for creating Stripe checkout session

    const purchaseCourseHandler = async () => { // define a function to handle purchase button click
        await createCheckoutSession(courseId); // call createCheckoutSession function with courseId argument to initiate checkout API request
    };

    useEffect(() => { // use useEffect hook to handle side effects when API response changes
        if (isSuccess) { // check if API request was successful
            if (data?.url) window.location.href = data.url; // if response contains a valid checkout URL, redirect user to Stripe checkout page
            else toast.error("Invalid response from server."); // if URL missing, show error toast
        }

        if (isError) toast.error(error?.data?.message || "Failed to create checkout session"); // if API request fails, show error toast with message from server or fallback text
    }, [data, isSuccess, isError, error]); // dependency array to re-run effect when any of these variables change

    return ( // render JSX for the button
        <Button
            disabled={isLoading} // disable button while API request is in progress
            onClick={purchaseCourseHandler} // set click handler to start purchase process
            className="w-full"
        >
            {isLoading ? ( // conditional rendering to show loading spinner while waiting for API response
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Please wait
                </>
            ) : (
                "Purchase Course" // show button text when not loading
            )}
        </Button>
    );
};

export default BuyCourseButton; // export component to use it in other parts of the application
