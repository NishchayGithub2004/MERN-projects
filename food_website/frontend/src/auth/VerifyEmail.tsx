import { Button } from "@/components/ui/button"; // import Button component from shadCN UI library
import { Input } from "@/components/ui/input"; // import Input component from shadCN UI library
import { useUserStore } from "@/store/useUserStore"; // import useUserStore hook to access user state and actions
import { Loader2 } from "lucide-react"; // import Loader2 icon from lucide-react library
import { type FormEvent, useRef, useState } from "react"; // import 'FormEvent' type to handle events, useRef hook to create a reference to an element, and useState hook to manage state variables
import { useNavigate } from "react-router-dom"; // import useNavigate hook to programmatically navigate to different routes

const VerifyEmail = () => {
    const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]); // using useState hook, create a state variable 'otp' which is an array of 6 string values and 'setOtp' function to update the array values, intialize array elements as empyty strings
    
    const inputRef = useRef<any>([]); // using useRef hook, create a reference to an empty array having element of any data type and assign it to 'inputRef' variable
    
    const { loading, verifyEmail } = useUserStore(); // extract 'loading' and 'verifyEmail' from 'useUserStore' hook
    
    const navigate = useNavigate(); // create an instance of useNavigate hook to programmatically navigate to different routes
    
    const handleChange = (index: number, value: string) => { // create a function 'handleChange' which takes two parameters: 'index' which is a number and 'value' which is a string
        if (/^[a-zA-Z0-9]$/.test(value) || value === "") { // if 'value' contains only one alphanumeric value or is an empty string
            const newOtp = [...otp]; // spread the 'otp' array and store it in a new array 'newOtp'
            newOtp[index] = value; // update the value of the element at index 'index' in 'newOtp' array with 'value'
            setOtp(newOtp); // update the 'otp' state variable with the 'newOtp' array
        }
        
        if (value !== "" && index < 5) { // if 'value' is not an empty string and value of 'index' is less than 5
            inputRef.current[index + 1].focus(); // focus on the next input element
        } // this brings focus on OTP boxes from left to right one by one as user fills OTP
    };

    const handleKeyDown = ( index: number, e: React.KeyboardEvent<HTMLInputElement>) => { // create a function 'handleKeyDown' which takes two parameters: 'index' which is a number and 'e' which is a keyboard event object
        if (e.key === "Backspace" && !otp[index] && index > 0) { // if user presses backspace button and OTP number is not filled at index 'index' and value of 'index' is greater than 0 ie user is not at first OTP box
            inputRef.current[index - 1].focus(); // shift focus on previous OTP box
        }
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => { // create a function 'submitHandler' which takes form event object as parameter
        e.preventDefault(); // prevent submitting form as soon as submit button is clicked, this is done so that we can do some other tasks before submitting the form
        
        const verificationCode = otp.join(""); // join the elements of 'otp' array into a string and store it in 'verificationCode' variable
        
        try {
            await verifyEmail(verificationCode); // verify email with the verification code created
            navigate("/"); // and navigate to home page
        } catch (error) { // if any error occurs
            console.log(error); // log it to the console for debugging purposes
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-full">
            <div className="p-8 rounded-md w-full max-w-md flex flex-col gap-10 border border-gray-200">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl">Verify your email</h1>
                    <p className="text-sm text-gray-600">
                        Enter the 6 digit code sent to your email address
                    </p>
                </div>
                <form onSubmit={submitHandler}> {/* when the form is submitted, 'submitHandler' function is called */}
                    <div className="flex justify-between">
                        {otp.map((letter: string, idx: number) => ( // iterate through elements of 'otp' array as 'letter' with index 'idx' as unique identifier
                            <Input
                                key={idx}
                                ref={(element) => {inputRef.current[idx] = element}} // create a reference to each input element and store it in 'inputRef' array at index 'idx'
                                type="text"
                                maxLength={1}
                                value={letter}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(idx, e.target.value) // when value of this input field changes, call 'handleChange' function
                                }
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                                    handleKeyDown(idx, e) // when a key is pressed down, call 'handleKeyDown' function
                                }
                                className="md:w-12 md:h-12 w-8 h-8 text-center text-sm md:text-2xl font-normal md:font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        ))}
                    </div>
                    {loading ? ( // render first button if value of 'loading' is true otherwise render the second one
                        <Button
                            disabled
                            className="bg-orange hover:bg-hoverOrange mt-6 w-full"
                        >
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button className="bg-orange hover:bg-hoverOrange mt-6 w-full">Verify</Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default VerifyEmail;