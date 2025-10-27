import { Button } from "@/components/ui/button"; // import Button component from shadCN UI library
import { Input } from "@/components/ui/input"; // import Input component from shadCN UI library
import { Loader2, Mail } from "lucide-react"; // import Mail and Loader2 icons from lucide-react library
import { useState } from "react"; // import useState hook to manage states
import { Link } from "react-router-dom"; // import Link component from react-router-dom library to create links

const ForgotPassword = () => { // create a functional component named 'ForgotPassword' that doesn't take any props
    const [email, setEmail] = useState<string>(""); // initialize a state variable 'email' with an empty string and a function 'setEmail' to update it's value

    const loading = false; // initialize a variable 'loading' with a value of 'false'

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
                        onChange={(e) => setEmail(e.target.value)} // when value of this input field changes, update the state variable 'email' with the new value using 'setEmail' function
                        placeholder="Enter your email"
                        className="pl-10"
                    />
                    <Mail className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
                </div>
                {
                    loading ? ( // render first button if value of 'loading' is true, otherwise render the second one
                        <Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</Button>
                    ) : (
                        <Button className="bg-orange hover:bg-hoverOrange">Send Reset Link</Button>
                    )
                }
                <span className="text-center">
                    Back to{" "}
                    <Link to="/login" className="text-blue-500">Login</Link>
                </span>
            </form>
        </div>
    );
};

export default ForgotPassword;