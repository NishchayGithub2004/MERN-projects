import { Button } from "@/components/ui/button"; // import Button component from shadCN UI for triggering form actions
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // import Card components to structure login/signup forms visually
import { Input } from "@/components/ui/input"; // import Input component to take user input fields
import { Label } from "@/components/ui/label"; // import Label component to describe each input field
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // import Tabs system for toggling between signup and login forms
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"; // import RTK Query hooks to handle login and registration API calls
import { Loader2 } from "lucide-react"; // import Loader2 icon for loading animation
import { useEffect, useState } from "react"; // import React hooks to handle component state and side effects
import { useNavigate } from "react-router-dom"; // import navigation hook to redirect user after authentication
import { toast } from "sonner"; // import toast function to show success/error messages

const Login = () => { // define functional component 'Login' to render signup and login forms
    const [signupInput, setSignupInput] = useState({ // initialize state to manage signup form inputs
        name: "", // store name value
        email: "", // store email value
        password: "", // store password value
    });

    const [loginInput, setLoginInput] = useState({ email: "", password: "" }); // initialize state for login form inputs with empty values

    const [ // destructure register mutation hook to handle signup requests
        registerUser, // function to call signup mutation
        {
            data: registerData, // holds API response data after signup
            error: registerError, // holds error object if signup fails
            isLoading: registerIsLoading, // indicates loading state for signup request
            isSuccess: registerIsSuccess, // boolean flag indicating signup success
        },
    ] = useRegisterUserMutation();
    
    const [ // destructure login mutation hook to handle login requests
        loginUser, // function to call login mutation
        {
            data: loginData, // holds API response data after login
            error: loginError, // holds error object if login fails
            isLoading: loginIsLoading, // indicates loading state for login request
            isSuccess: loginIsSuccess, // boolean flag indicating login success
        },
    ] = useLoginUserMutation();
    
    const navigate = useNavigate(); // create navigation instance to redirect user post-login

    const changeInputHandler = (e, type) => { // define handler to update input fields dynamically
        const { name, value } = e.target; // extract field name and value from event
        if (type === "signup") { // if form type is signup
            setSignupInput({ ...signupInput, [name]: value }); // update signupInput state with new field value
        } else { // if form type is login
            setLoginInput({ ...loginInput, [name]: value }); // update loginInput state with new field value
        }
    };

    const handleRegistration = async (type) => { // define function to handle submission for both login and signup
        const inputData = type === "signup" ? signupInput : loginInput; // select appropriate input data based on form type
        const action = type === "signup" ? registerUser : loginUser; // choose correct mutation function based on form type
        await action(inputData); // trigger API call using selected mutation
    };

    useEffect(() => { // define side effect to handle authentication responses
        if (registerIsSuccess && registerData) { // if signup is successful
            toast.success(registerData.message || "Signup successful."); // display success toast notification
        }
        if (registerError) { // if signup fails
            toast.error(registerError.data.message || "Signup Failed"); // display error toast message
        }
        if (loginIsSuccess && loginData) { // if login is successful
            toast.success(loginData.message || "Login successful."); // show success notification
            navigate("/"); // redirect to home page
        }
        if (loginError) { // if login fails
            toast.error(loginError.data.message || "Login Failed"); // show error notification
        }
    }, [
        loginIsLoading, // re-run when login loading state changes
        registerIsLoading, // re-run when signup loading state changes
        loginData, // re-run when login data changes
        registerData, // re-run when signup data changes
        loginError, // re-run when login error changes
        registerError, // re-run when signup error changes
    ]);

    return (
        <div className="flex items-center w-full justify-center mt-20"> {/* wrapper for centered layout */}
            <Tabs defaultValue="login" className="w-[400px]"> {/* define tabs for toggling login/signup */}
                <TabsList className="grid w-full grid-cols-2"> {/* container for tab buttons */}
                    <TabsTrigger value="signup">Signup</TabsTrigger> {/* trigger to open signup tab */}
                    <TabsTrigger value="login">Login</TabsTrigger> {/* trigger to open login tab */}
                </TabsList>

                <TabsContent value="signup"> {/* content for signup form */}
                    <Card> {/* wrapper card for signup section */}
                        <CardHeader> {/* header for signup card */}
                            <CardTitle>Signup</CardTitle> {/* title text */}
                            <CardDescription>Create a new account and click signup when you're done.</CardDescription> {/* short form description */}
                        </CardHeader>
                        <CardContent className="space-y-2"> {/* section containing input fields */}
                            <div className="space-y-1"> {/* field wrapper for name */}
                                <Label htmlFor="name">Name</Label> {/* label for name input */}
                                <Input
                                    type="text" // input type text for name
                                    name="name" // controlled input name
                                    value={signupInput.name} // bind current value from state
                                    onChange={(e) => changeInputHandler(e, "signup")} // handle input change for signup
                                    placeholder="Eg. patel" // hint text
                                    required="true" // mark as required
                                />
                            </div>
                            <div className="space-y-1"> {/* field wrapper for email */}
                                <Label htmlFor="username">Email</Label> {/* label for email field */}
                                <Input
                                    type="email" // input type email
                                    name="email" // controlled input name
                                    value={signupInput.email} // bind current value from state
                                    onChange={(e) => changeInputHandler(e, "signup")} // handle email change for signup
                                    placeholder="Eg. patel@gmail.com" // hint text
                                    required="true" // mark as required
                                />
                            </div>
                            <div className="space-y-1"> {/* field wrapper for password */}
                                <Label htmlFor="username">Password</Label> {/* label for password field */}
                                <Input
                                    type="password" // input type password
                                    name="password" // controlled input name
                                    value={signupInput.password} // bind current value from state
                                    onChange={(e) => changeInputHandler(e, "signup")} // handle password change for signup
                                    placeholder="Eg. xyz" // hint text
                                    required="true" // mark as required
                                />
                            </div>
                        </CardContent>
                        <CardFooter> {/* footer for signup form */}
                            <Button
                                disabled={registerIsLoading} // disable button during API request
                                onClick={() => handleRegistration("signup")} // handle signup on click
                            >
                                {registerIsLoading ? ( // check if signup request is loading
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait {/* show loader icon and message */}
                                    </>
                                ) : (
                                    "Signup" // show button text when not loading
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="login"> {/* content for login form */}
                    <Card> {/* wrapper card for login section */}
                        <CardHeader> {/* header for login card */}
                            <CardTitle>Login</CardTitle> {/* title text */}
                            <CardDescription>Login your password here. After signup, you'll be logged in.</CardDescription> {/* short form description */}
                        </CardHeader>
                        <CardContent className="space-y-2"> {/* section containing input fields */}
                            <div className="space-y-1"> {/* field wrapper for email */}
                                <Label htmlFor="current">Email</Label> {/* label for email input */}
                                <Input
                                    type="email" // input type email
                                    name="email" // controlled input name
                                    value={loginInput.email} // bind email value from login state
                                    onChange={(e) => changeInputHandler(e, "login")} // handle email change for login
                                    placeholder="Eg. patel@gmail.com" // hint text
                                    required="true" // mark as required
                                />
                            </div>
                            <div className="space-y-1"> {/* field wrapper for password */}
                                <Label htmlFor="new">Password</Label> {/* label for password input */}
                                <Input
                                    type="password" // input type password
                                    name="password" // controlled input name
                                    value={loginInput.password} // bind password value from login state
                                    onChange={(e) => changeInputHandler(e, "login")} // handle password change for login
                                    placeholder="Eg. xyz" // hint text
                                    required="true" // mark as required
                                />
                            </div>
                        </CardContent>
                        <CardFooter> {/* footer for login form */}
                            <Button
                                disabled={loginIsLoading} // disable button during API request
                                onClick={() => handleRegistration("login")} // handle login on click
                            >
                                {loginIsLoading ? ( // check if login request is loading
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait {/* show loader icon and message */}
                                    </>
                                ) : (
                                    "Login" // show button text when not loading
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Login; // export Login component for use in routes