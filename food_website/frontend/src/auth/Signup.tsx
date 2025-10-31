import { Button } from "@/components/ui/button"; // import Button component from shadCN UI library to create styled action buttons
import { Input } from "@/components/ui/input"; // import Input component from shadCN UI library to render styled input fields
import { Separator } from "@/components/ui/separator"; // import Separator component from shadCN UI library to create visual separation between sections
import { type SignupInputState, userSignupSchema } from "@/schema/userSchema"; // import SignupInputState type to structure signup form data and userSignupSchema to validate the form input
import { useUserStore } from "@/store/useUserStore"; // import useUserStore hook to access user-related states and actions like signup
import { Loader2, LockKeyhole, Mail, PhoneOutgoing, User } from "lucide-react"; // import UI icons from lucide-react library for better form representation
import { type ChangeEvent, type FormEvent, useState } from "react"; // import ChangeEvent and FormEvent types for event typing and useState hook for local state management
import { Link, useNavigate } from "react-router-dom"; // import Link to navigate via links and useNavigate hook for programmatic routing

const Signup = () => { // define a functional component named 'Signup' to handle new user registration
    const [input, setInput] = useState<SignupInputState>({ // create a state variable 'input' with structure defined by SignupInputState and a setter 'setInput' to update it
        fullname: "", // initialize 'fullname' property as empty string
        email: "", // initialize 'email' property as empty string
        password: "", // initialize 'password' property as empty string
        contact: "", // initialize 'contact' property as empty string
    });
    
    const [errors, setErrors] = useState<Partial<SignupInputState>>({}); // create an 'errors' state to store validation errors and a setter 'setErrors' to update them dynamically
    const { signup, loading } = useUserStore(); // destructure 'signup' action for creating new users and 'loading' to track signup process status
    const navigate = useNavigate(); // create an instance of useNavigate to redirect user after successful signup
    
    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => { // define a function 'changeEventHandler' to handle input field changes
        const { name, value } = e.target; // extract 'name' and 'value' from input field triggering the event
        setInput({ ...input, [name]: value }); // update the respective property in 'input' object while retaining other existing values
    };
    
    const loginSubmitHandler = async (e: FormEvent) => { // define async function 'loginSubmitHandler' to handle form submission and validation
        e.preventDefault(); // prevent the default form submission behavior to manually handle validation and API call
        const result = userSignupSchema.safeParse(input); // validate the current 'input' data against 'userSignupSchema' rules and store result
        if (!result.success) { // check if validation failed
            const fieldErrors = result.error.flatten().fieldErrors; // extract and flatten field-specific validation errors for readability
            setErrors(fieldErrors as Partial<SignupInputState>); // update 'errors' state with extracted validation messages
            return; // exit function early to avoid submitting invalid data
        }
        try {
            await signup(input); // call 'signup' function from store to register the user using validated input data
            navigate("/verify-email"); // redirect user to email verification page after successful registration
        } catch (error) { // catch any runtime or network error during signup
            console.log(error); // log error for debugging and tracing issues
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form onSubmit={loginSubmitHandler} className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"> {/* call 'loginSubmitHandler' when the form is submitted */}
                <div className="mb-4">
                    <h1 className="font-bold text-2xl">EatItUp</h1>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Full Name"
                            name="fullname"
                            value={input.fullname}
                            onChange={changeEventHandler} // update 'fullname' field in 'input' state when user types in this box
                            className="pl-10 focus-visible:ring-1"
                        />
                        <User className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.fullname}</span>} {/* display 'fullname' validation error if exists */}
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler} // update 'email' field in 'input' state when user types in this box
                            className="pl-10 focus-visible:ring-1"
                        />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.email}</span>} {/* display 'email' validation error if exists */}
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler} // update 'password' field in 'input' state when user types in this box
                            className="pl-10 focus-visible:ring-1"
                        />
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.password}</span>} {/* display 'password' validation error if exists */}
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Contact"
                            name="contact"
                            value={input.contact}
                            onChange={changeEventHandler} // update 'contact' field in 'input' state when user types in this box
                            className="pl-10 focus-visible:ring-1"
                        />
                        <PhoneOutgoing className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.contact}</span>} {/* display 'contact' validation error if exists */}
                    </div>
                </div>
                <div className="mb-10">
                    {loading ? ( // check if signup process is ongoing to show loading state
                        <Button disabled className="w-full bg-orange hover:bg-hoverOrange"> {/* render disabled button with spinner while loading */}
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* display rotating loader icon to indicate processing */}
                            Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full bg-orange hover:bg-hoverOrange"> {/* render active signup button when not loading */}
                            Signup {/* label for user action to submit the form */}
                        </Button>
                    )}
                </div>
                <Separator /> {/* add visual separator between form and login link */}
                <p className="mt-2">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500">Login</Link> {/* provide navigation link for existing users to log in */}
                </p>
            </form>
        </div>
    );
};

export default Signup; // export Signup component as default to use in routing or other modules