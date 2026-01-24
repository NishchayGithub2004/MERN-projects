import { AlignJustify, LogOut } from "lucide-react"; // import icon components AlignJustify and LogOut from lucide-react library
import { Button } from "../ui/button"; // import Button component from the local UI components directory
import { useDispatch } from "react-redux"; // import useDispatch hook from react-redux to dispatch Redux actions
import { logoutUser } from "@/store/auth-slice"; // import logoutUser action creator from the auth slice in Redux store

function AdminHeader({ setOpen }) { // define AdminHeader component with one prop 'setOpen' used to control sidebar visibility
    const dispatch = useDispatch(); // initialize Redux dispatch function to send actions to the store

    function handleLogout() { // define function handleLogout to manage user logout
        dispatch(logoutUser()); // call dispatch with logoutUser() action to update auth state and log out the user
    }

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
            <Button onClick={() => setOpen(true)} className="lg:hidden sm:block"> {/* when this button is clicked, value of 'open' is set to true */}
                <AlignJustify />
                <span className="sr-only">Toggle Menu</span>
            </Button>
            <div className="flex flex-1 justify-end">
                <Button
                    onClick={handleLogout} // clicking this button triggers 'handleLogout' function
                    className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
                >
                    <LogOut />
                    Logout
                </Button>
            </div>
        </header>
    );
}

export default AdminHeader;
