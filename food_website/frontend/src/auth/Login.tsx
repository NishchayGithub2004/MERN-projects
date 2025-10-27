import { Button } from "@/components/ui/button"; // import Button component from shadCN UI library
import { Input } from "@/components/ui/input"; // import Input component from shadCN UI library
import { Separator } from "@/components/ui/separator"; // import Separator component from shadCN UI library
import { type LoginInputState, userLoginSchema } from "@/schema/userSchema"; // import 'LoginInputState' type to create form for user login and 'userLoginSchema' to implement validations for this form
import { useUserStore } from "@/store/useUserStore"; // import 'useUserStore' hook to manage user states and actions
import { Loader2, LockKeyhole, Mail } from "lucide-react"; // load these icons from lucide-react library
import { type ChangeEvent, type FormEvent, useState } from "react"; // import 'ChangeEvent' type for event handling, 'FormEvent' to handle form related events, 'useState' hook to manage states
import { Link, useNavigate } from "react-router-dom"; // import 'Link' component to create links and 'useNavigate' hook to navigate prgrammatically

const Login = () => { // create a functional component named 'Login' that doesn't take any props
    const [input, setInput] = useState<LoginInputState>({ // using 'useState' hook, create an object named 'input' of type 'SignupInputState' and 'setInput' function to update values of properties of 'input' object
        // initialize all properties of 'input' object with empty string as initial values
        email: "",
        password: "",
    });
    
    const [errors, setErrors] = useState<Partial<LoginInputState>>({}); // using 'useState' hook, create an object named 'errors' of type 'SignupInputState' and 'setErrors' function to update values of properties of 'errors' object
    // 'Partial' makes all properties of 'errors' object optional to have values
    
    const { login, loading } = useUserStore(); // extract 'signup' and 'loading' properties from 'useUserStore' hook
    
    const navigate = useNavigate(); // create an instance of 'useNavigate' hook to navigate programmatically

    const changeEventHandler = (e: ChangeEvent<HTMLInputElement>) => { // create a function named 'changeEventHandler' that takes change event object as argument
        const { name, value } = e.target; // extract 'name' and 'value' properties from event object ie form field
        setInput({ ...input, [name]: value }); // using spread operator, spread pre-existing properties and their values and update value of form field with new value
    }
    
    const loginSubmitHandler = async (e: FormEvent) => { // create a function named 'loginSubmitHandler' that takes form event object as argument
        e.preventDefault(); // prevent default behaviour of form that it submits as soon as submit button is clicked so that some tasks can be done first before submitting the form
        
        const result = userLoginSchema.safeParse(input); // apply validation rules defined in 'userSignupSchema' on 'input' object and store result in 'result' variable
        
        if (!result.success) { // if validation fails
            const fieldErrors = result.error.flatten().fieldErrors; // flatten error object in result to simplify nested error structure and extract fields having error using 'fieldErrors' property
            setErrors(fieldErrors as Partial<LoginInputState>); // set 'errors' to field errors obtained using 'setErrors' function
            return; // don't proceed further with form submission if validation fails
        }
        
        try {
            await login(input); // call 'signup' function from 'useUserStore' hook and pass 'input' object as argument
            navigate("/verify-email"); // navigate to '/verify-email' route after successful signup to verify email
        } catch (error) { // if any error occurs
            console.log(error); // log it to the console for debugging purposes
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <form
                onSubmit={loginSubmitHandler} // when this form is submitted, 'loginSubmitHandler' function is called
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
                            onChange={changeEventHandler} // when value of this input field changes, 'changeEventHandler' function is called
                            className="pl-10 focus-visible:ring-1"
                        />
                        <Mail className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.email}</span>} {/* if 'errors' object is not null ie any error occurs then render 'email' property of 'errors' object */}
                    </div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler} // when value of this input field changes, 'changeEventHandler' function is called
                            className="pl-10 focus-visible:ring-1"
                        />
                        <LockKeyhole className="absolute inset-y-2 left-2 text-gray-500 pointer-events-none" />
                        {errors && <span className="text-xs text-red-500">{errors.password}</span>} {/* if 'errors' object is not null ie any error occurs then render 'password' property of 'errors' object */}
                    </div>
                </div>
                <div className="mb-10">
                    {loading ? ( // render first button if 'loading' is true otherwise render the second one
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
                            to="/forgot-password" // clickable link to '/forgot-password' route
                            className="hover:text-blue-500 hover:underline"
                        >
                            Forgot Password
                        </Link>
                    </div>
                </div>
                <Separator />
                <p className="mt-2">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500">Signup</Link> {/* if user is not registered and needs to create an account, user can redirect itself to signup page */}
                </p>
            </form>
        </div>
    );
};

export default Login;