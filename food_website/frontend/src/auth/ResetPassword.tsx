import { Button } from "@/components/ui/button"; // import Button component from shadCN UI library
import { Input } from "@/components/ui/input"; // import Input component from shadCN UI library
import { Loader2, LockKeyholeIcon } from "lucide-react"; // import LockKeyholeIcon and Loader2 icons from lucide-react library
import { useState } from "react"; // import useState hook to manage states
import { Link } from "react-router-dom"; // import Link component from react-router-dom library to create links

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState<string>(""); // using 'useState' hook, create a state variable 'newPassword' with empty string as initial value and a function 'setNewPassword' to update it's value
    
    const loading = false; // create a variable 'loading' with initial value set to false

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <form className="flex flex-col gap-5 md:p-8 w-full max-w-md rounded-lg mx-4">
                <div className="text-center">
                    <h1 className="font-extrabold text-2xl mb-2">Reset Password</h1>
                    <p className="text-sm text-gray-600">Enter your new password to reset old one</p>
                </div>
                <div className="relative w-full">
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} // when value of this input field changes, update the state variable 'password' with the new value using 'setNewPassword' function
                        placeholder="Enter your new password"
                        className="pl-10"
                    />
                    <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" />
                </div>
                {
                    loading ? ( // render first button if value of 'loading' is true, otherwise render the second one
                        <Button disabled className="bg-orange hover:bg-hoverOrange"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait</Button>
                    ) : (
                        <Button className="bg-orange hover:bg-hoverOrange">Reset Password</Button>
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

export default ResetPassword;