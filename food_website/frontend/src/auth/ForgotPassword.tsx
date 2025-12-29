import { Button } from "@/components/ui/button"; // import Button component from shadCN UI library to create styled button elements
import { Input } from "@/components/ui/input"; // import Input component from shadCN UI library to render styled input fields
import { Loader2, Mail } from "lucide-react"; // import Loader2 icon for showing loading animation and Mail icon for email input UI decoration
import { useState } from "react"; // import useState hook to manage and update component state
import { Link } from "react-router-dom"; // import Link component from react-router-dom library to navigate between routes

const ForgotPassword = () => { // define a functional component named 'ForgotPassword' to allow users to reset their password
    const [email, setEmail] = useState<string>(""); // create a state variable 'email' initialized with an empty string and a function 'setEmail' to update it
    const loading = false; // define a constant 'loading' initialized with false to represent loading state of the form

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <form className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl mb-2">Forgot Password</h1>
                    <p className="text-sm text-gray-600">Enter your email address to reset your password</p>
                </div>
                <div className="relative w-full">
                    <Input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // update 'email' state variable when user types in the input field
                        placeholder="Enter your email"
                        className="pl-10"
                    />
                    <Mail className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" /> {/* render mail icon inside the input field for visual indication */}
                </div>
                {loading ? ( // check if 'loading' is true to decide what to render
                    <Button disabled className="bg-orange hover:bg-hoverOrange"> {/* render a disabled button with loader when form is submitting */}
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* render loader icon to indicate ongoing process */}
                        Please wait
                    </Button>
                ) : (
                    <Button className="bg-orange hover:bg-hoverOrange"> {/* render active button when not loading */}
                        Send Reset Link {/* button text prompting user action to send password reset link */}
                    </Button>
                )}
                <span className="text-center">
                    Back to{" "} {/* display navigation text for login page redirection */}
                    <Link to="/login" className="text-blue-500">Login</Link> {/* render link to navigate user back to login page */}
                </span>
            </form>
        </div>
    );
};

export default ForgotPassword; // export ForgotPassword component as default so it can be imported and used elsewhere