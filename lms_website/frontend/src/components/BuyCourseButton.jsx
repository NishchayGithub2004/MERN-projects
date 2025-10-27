import React, { useEffect } from "react"; // import 'useEffect' hook to implement side effects
import { Button } from "./ui/button"; // import Button component from shadCN UI library
import { useCreateCheckoutSessionMutation } from "@/features/api/purchaseApi"; // import RTK Query mutation hook to handle creating checkout session via API
import { Loader2 } from "lucide-react"; // import 'Loader2' icon from react-lucide library
import { toast } from "sonner"; // import 'toast' component from sonner library for toast messages

const BuyCourseButton = ({ courseId }) => { // define a functional component named 'BuyCourseButton' that takes 'courseId' as props
    const [ createCheckoutSession, { data, isLoading, isSuccess, isError, error } ] = useCreateCheckoutSessionMutation(); // extract the following things from 'useCreateCheckoutSessionMutation' hook

    const purchaseCourseHandler = async () => { // create an async function naemd 'purchaseCourseHandler'
        await createCheckoutSession(courseId); // call 'createCheckoutSession' function with 'courseId' as argument
    };

    useEffect(() => { // use 'useEffect' hook to create a side effect
        if (isSuccess) { // if 'isSuccess' is true
            if (data?.url) window.location.href = data.url; // if 'url' property of 'data' object has non-null value, redirect user to URL that is value of 'url' property
            else toast.error("Invalid response from server."); // if URL missing, show error toast message
        }

        if (isError) toast.error(error?.data?.message || "Failed to create checkout session"); // if 'isError' is true, show a toast message that is in 'message' property of 'data' object of 'error' object, or a backup message if even that doesn't exist
    }, [data, isSuccess, isError, error]); // dependency array to re-run effect when any of these variables change

    return (
        <Button
            disabled={isLoading} // this button is disabled ie unclickable when value of 'isLoading' is true
            onClick={purchaseCourseHandler} // call 'purchaseCourseHandler' function when this button is cliked
            className="w-full"
        >
            {isLoading ? ( // if 'isLoading' is true, then render loader with message 'Please Wait', otherwise render text 'Purchase Course', any one of it renders inside button
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Please wait
                </>
            ) : (
                "Purchase Course"
            )}
        </Button>
    );
};

export default BuyCourseButton;
