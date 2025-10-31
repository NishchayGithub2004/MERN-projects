import { Button } from "@/components/ui/button"; // import Button component from shadCN UI library to create styled interactive buttons
import { Input } from "@/components/ui/input"; // import Input component from shadCN UI library to render styled text input fields
import { useUserStore } from "@/store/useUserStore"; // import useUserStore hook to access user-related state and actions like verifying email
import { Loader2 } from "lucide-react"; // import Loader2 icon from lucide-react library to show a loading spinner
import { type FormEvent, useRef, useState } from "react"; // import FormEvent type for handling form submissions, useRef for element references, and useState for managing component state
import { useNavigate } from "react-router-dom"; // import useNavigate hook to programmatically navigate to other routes

const VerifyEmail = () => { // define a functional component named 'VerifyEmail' to handle user email verification
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]); // create a state variable 'otp' initialized as an array of six empty strings and a setter 'setOtp' to update it
    const inputRef = useRef<any>([]); // create a reference 'inputRef' to store an array of input elements for direct DOM access
    const { loading, verifyEmail } = useUserStore(); // extract 'loading' to track async state and 'verifyEmail' action to verify the entered OTP
    const navigate = useNavigate(); // create an instance of 'useNavigate' to enable programmatic navigation after verification

    const handleChange = (index: number, value: string) => { // define function 'handleChange' to handle change event in each OTP input field
        if (/^[a-zA-Z0-9]$/.test(value) || value === "") { // check if entered value is a single alphanumeric character or empty
            const newOtp = [...otp]; // create a shallow copy of current 'otp' state array
            newOtp[index] = value; // assign new value to the corresponding index in 'newOtp'
            setOtp(newOtp); // update 'otp' state with modified array
        }
        if (value !== "" && index < 5) { // if a value was entered and it's not the last input field
            inputRef.current[index + 1].focus(); // move focus automatically to the next OTP input box for smooth user experience
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => { // define function 'handleKeyDown' to handle key press events on each OTP input field
        if (e.key === "Backspace" && !otp[index] && index > 0) { // check if backspace is pressed, current field is empty, and it's not the first box
            inputRef.current[index - 1].focus(); // move focus back to the previous input box for intuitive back navigation
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => { // define asynchronous function 'submitHandler' to handle form submission event
        e.preventDefault(); // prevent default form submission to handle OTP verification manually
        const verificationCode = otp.join(""); // combine the six OTP digits into a single string
        try {
            await verifyEmail(verificationCode); // call 'verifyEmail' function to validate the entered verification code
            navigate("/"); // redirect the user to home page upon successful verification
        } catch (error) { // handle any error that occurs during verification
            console.log(error); // log the error in console for debugging
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl">Verify your email</h1>
                    <p className="text-sm text-gray-600">Enter the 6 digit code sent to your email address</p>
                </div>
                <form onSubmit={submitHandler}> {/* call 'submitHandler' when user submits the verification form */}
                    <div className="flex justify-between">
                        {otp.map((letter: string, idx: number) => ( // iterate over 'otp' array to render six input boxes, one for each character
                            <Input
                                key={idx}
                                ref={(element) => { inputRef.current[idx] = element; }} // store reference to each input box in 'inputRef' array for direct DOM manipulation
                                type="text"
                                maxLength={1}
                                value={letter}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(idx, e.target.value)} // call 'handleChange' when user types a character
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(idx, e)} // call 'handleKeyDown' when a key is pressed down for navigation handling
                                className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        ))}
                    </div>
                    {loading ? ( // check if 'loading' is true to conditionally render loader or submit button
                        <Button disabled className="bg-orange hover:bg-hoverOrange mt-6 w-full"> {/* render disabled button with loader while OTP verification is processing */}
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" /> {/* render spinning loader to indicate active verification process */}
                            Please wait
                        </Button>
                    ) : (
                        <Button className="bg-orange hover:bg-hoverOrange mt-6 w-full"> {/* render active button when not loading */}
                            Verify {/* display text prompting user to submit entered OTP */}
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail; // export VerifyEmail component as default so it can be used in other parts of the application