import { Button } from "@/components/ui/button"; // import Button component from shadCN UI library to render styled interactive buttons
import { Input } from "@/components/ui/input"; // import Input component from shadCN UI library to render styled text input fields
import { Loader2, LockKeyholeIcon } from "lucide-react"; // import Loader2 icon for showing loading animation and LockKeyholeIcon for password input decoration
import { useState } from "react"; // import useState hook to manage component-level state
import { Link } from "react-router-dom"; // import Link component from react-router-dom to create navigation links between pages

const ResetPassword = () => { // define a functional component named 'ResetPassword' to allow users to set a new password
    const [newPassword, setNewPassword] = useState<string>(""); // create a state variable 'newPassword' initialized as an empty string and a function 'setNewPassword' to update its value
    const loading = false; // define a constant 'loading' initialized with false to represent whether the form submission process is ongoing

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
                        onChange={(e) => setNewPassword(e.target.value)} // update 'newPassword' state variable whenever user types in the input field
                        placeholder="Enter your new password"
                        className="pl-10"
                    />
                    <LockKeyholeIcon className="absolute inset-y-2 left-2 text-gray-600 pointer-events-none" /> {/* render lock icon inside input field for password visual cue */}
                </div>
                {loading ? ( // check if 'loading' is true to decide button state
                    <Button disabled className="bg-orange hover:bg-hoverOrange"> {/* render disabled button with loader while request is processing */}
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* show spinning loader icon to indicate progress */}
                        Please wait
                    </Button>
                ) : (
                    <Button className="bg-orange hover:bg-hoverOrange"> {/* render active button when no process is running */}
                        Reset Password {/* display text prompting user to reset their password */}
                    </Button>
                )}
                <span className="text-center">
                    Back to{" "} {/* display text to navigate user back to login screen */}
                    <Link to="/login" className="text-blue-500">Login</Link> {/* render link that routes user to login page */}
                </span>
            </form>
        </div>
    );
};

export default ResetPassword; // export ResetPassword component as default to make it available for import elsewhere