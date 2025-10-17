import { Button } from "@/components/ui/button"; // import Button component for form actions
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // import Card components for UI layout
import { Input } from "@/components/ui/input"; // import Input component for form fields
import { Label } from "@/components/ui/label"; // import Label component for form fields
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // import Tabs components for switching between login/signup
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"; // import RTK query hooks for login and signup
import { Loader2 } from "lucide-react"; // import loader icon for loading states
import { useEffect, useState } from "react"; // import React hooks
import { useNavigate } from "react-router-dom"; // import useNavigate for redirecting after login
import { toast } from "sonner"; // import toast for notifications

const Login = () => { // define Login component for user authentication
    const [signupInput, setSignupInput] = useState({ // state to store signup form inputs
        name: "",
        email: "",
        password: "",
    });

    const [loginInput, setLoginInput] = useState({ email: "", password: "" }); // state to store login form inputs

    const [ // setup registerUser mutation for signup
        registerUser,
        {
            data: registerData, // response data after signup
            error: registerError, // error if signup fails
            isLoading: registerIsLoading, // loading state for signup
            isSuccess: registerIsSuccess, // success flag for signup
        },
    ] = useRegisterUserMutation();
    
    const [ // setup loginUser mutation for login
        loginUser,
        {
            data: loginData, // response data after login
            error: loginError, // error if login fails
            isLoading: loginIsLoading, // loading state for login
            isSuccess: loginIsSuccess, // success flag for login
        },
    ] = useLoginUserMutation();
    
    const navigate = useNavigate(); // initialize navigation hook

    const changeInputHandler = (e, type) => { // handle changes in form inputs
        const { name, value } = e.target; // get name and value of input field
        
        if (type === "signup") {
            setSignupInput({ ...signupInput, [name]: value }); // update signup state
        } else {
            setLoginInput({ ...loginInput, [name]: value }); // update login state
        }
    };

    const handleRegistration = async (type) => { // handle form submission for login/signup
        const inputData = type === "signup" ? signupInput : loginInput; // select input data based on type
        const action = type === "signup" ? registerUser : loginUser; // select mutation action based on type
        await action(inputData); // execute mutation
    };

    useEffect(() => { // handle success and error messages for login and signup
        if (registerIsSuccess && registerData) {
            toast.success(registerData.message || "Signup successful."); // show signup success toast
        }
        
        if (registerError) {
            toast.error(registerError.data.message || "Signup Failed"); // show signup error toast
        }
        
        if (loginIsSuccess && loginData) {
            toast.success(loginData.message || "Login successful."); // show login success toast
            navigate("/"); // redirect to homepage after successful login
        }
        
        if (loginError) {
            toast.error(loginError.data.message || "Login Failed"); // show login error toast
        }
    }, [
        loginIsLoading, // dependency for login loading state
        registerIsLoading, // dependency for signup loading state
        loginData, // dependency for login response
        registerData, // dependency for signup response
        loginError, // dependency for login error
        registerError, // dependency for signup error
    ]);

    return (
        <div className="flex items-center w-full justify-center mt-20">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">Signup</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Signup</CardTitle>
                            <CardDescription>
                                Create a new account and click signup when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={signupInput.name}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    placeholder="Eg. patel"
                                    required="true"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={signupInput.email}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    placeholder="Eg. patel@gmail.com"
                                    required="true"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="username">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={signupInput.password}
                                    onChange={(e) => changeInputHandler(e, "signup")}
                                    placeholder="Eg. xyz"
                                    required="true"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                disabled={registerIsLoading}
                                onClick={() => handleRegistration("signup")}
                            >
                                {registerIsLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                                        wait
                                    </>
                                ) : (
                                    "Signup"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login your password here. After signup, you'll be logged in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    value={loginInput.email}
                                    onChange={(e) => changeInputHandler(e, "login")}
                                    placeholder="Eg. patel@gmail.com"
                                    required="true"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    value={loginInput.password}
                                    onChange={(e) => changeInputHandler(e, "login")}
                                    placeholder="Eg. xyz"
                                    required="true"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                disabled={loginIsLoading}
                                onClick={() => handleRegistration("login")}
                            >
                                {loginIsLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                                        wait
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Login;