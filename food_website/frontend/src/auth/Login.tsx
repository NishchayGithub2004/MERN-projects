import { Button } from "@/components/ui/button"; // import button component from shadCN UI to create styled buttons
import { Input } from "@/components/ui/input"; // import input component from shadCN UI to create styled input fields
import { Separator } from "@/components/ui/separator"; // import separator component from shadCN UI to visually divide sections
import { type LoginInputState, userLoginSchema } from "@/schema/userSchema"; // import 'LoginInputState' type for defining structure of login form input and 'userLoginSchema' for input validation rules
import { useUserStore } from "@/store/useUserStore"; // import 'useUserStore' hook to manage authentication state and user actions globally
import { Loader2, LockKeyhole, Mail } from "lucide-react"; // import loader, lock, and mail icons from lucide-react for UI decoration
import { type ChangeEvent, type FormEvent, useState } from "react"; // import types for event handling and 'useState' hook to manage local component states
import { Link, useNavigate } from "react-router-dom"; // import link component for navigation between routes and 'useNavigate' hook for programmatic navigation

const Login = () => { // define a functional component named 'Login' to handle user login process with form validation and navigation
    const [input, setInput] = useState<LoginInputState>({ // create state 'input' to store user entered login credentials and 'setInput' to update them
        email: "", // initialize 'email' field as empty string to hold user's email input
        password: "", // initialize 'password' field as empty string to hold user's password input
    });

    const [errors, setErrors] = useState<Partial<LoginInputState>>({}); // create state 'errors' to store validation error messages for form fields

    const { login, loading } = useUserStore(); // extract 'login' function and 'loading' flag from 'useUserStore' hook for login handling and loading state tracking

    const navigate = useNavigate(); // create navigation instance to redirect user programmatically after successful login

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => { // define function to handle input field changes triggered by user typing
        const { name, value } = e.target; // extract name and value of currently changed input field
        setInput({ ...input, [name]: value }); // update the specific field in 'input' state while keeping other fields unchanged
    };

    const loginSubmitHandler = async (e: FormEvent) => { // define function to handle form submission for login process
        e.preventDefault(); // prevent browser’s default form submission to handle validation and logic first
        const result = userLoginSchema.safeParse(input); // validate 'input' object using schema defined in 'userLoginSchema'
        if (!result.success) { // check if validation failed
            const fieldErrors = result.error.flatten().fieldErrors; // extract field specific error messages from validation result
            setErrors(fieldErrors as Partial<LoginInputState>); // update 'errors' state to display validation messages
            return; // stop form submission since validation failed
        }
        try {
            await login(input); // call 'login' function with validated input credentials to authenticate user
            navigate("/verify-email"); // redirect user to email verification page after successful login
        } catch (error) {
            console.log(error); // log any unexpected error during login for debugging
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <form
                onSubmit={loginSubmitHandler} // attach form submission handler to trigger login process
                className="md:p-8 w-full max-w-md rounded-lg md:border border-gray-200 mx-4"
            >
                <div className="mb-4">
                    <h1 className="font-bold text-2xl">EatItUp</h1>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler} // update 'input.email' state when user types in email field
                            className="pl-10 focus-visible:ring-1"
                        />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.email}</span>} {/* render error message for email field if validation fails */}
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler} // update 'input.password' state when user types in password field
                            className="pl-10 focus-visible:ring-1"
                        />
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.password}</span>} {/* render error message for password field if validation fails */}
                    </div>
                </div>
                <div className="mb-10">
                    {loading ? ( // conditionally render loading state button when authentication request is in progress
                        <Button disabled className="w-full bg-orange hover:bg-hoverOrange">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            className="w-full bg-orange hover:bg-hoverOrange"
                        >
                            Login
                        </Button>
                    )}
                    <div className="mt-4">
                        <Link
                            to="/forgot-password" // navigate user to password recovery page when clicked
                            className="hover:text-blue-500 hover:underline"
                        >
                            Forgot Password
                        </Link>
                    </div>
                </div>
                <Separator />
                <p className="mt-2">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500">Signup</Link> {/* navigate user to signup page to create a new account */}
                </p>
            </form>
        </div>
    );
};

export default Login; // export 'Login' component as default so it can be used in routing or other components