import { Menu, School } from "lucide-react"; // import icons Menu and School from lucide-react library for UI display
import React, { useEffect } from "react"; // import React library and useEffect hook for component creation and side effects
import { // import dropdown components from custom ui library for user menu functionality
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Button } from "./ui/button"; // import Button component for rendering clickable buttons
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // import Avatar components for displaying user profile image
import DarkMode from "@/DarkMode"; // import DarkMode component for toggling light/dark theme
import { // import Sheet components for creating a mobile sidebar menu
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu"; // import Separator component to visually separate menu items
import { Link, useNavigate } from "react-router-dom"; // import Link for navigation and useNavigate hook for programmatic route navigation
import { useLogoutUserMutation } from "@/features/api/authApi"; // import RTK Query mutation hook to handle logout API call
import { toast } from "sonner"; // import toast library to display notifications for logout success or failure
import { useSelector } from "react-redux"; // import useSelector hook to access Redux store state

const Navbar = () => { // define a functional component Navbar to render the top navigation bar
    const { user } = useSelector((store) => store.auth); // extract user object from auth slice in Redux store to check authentication state
    
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation(); // use RTK Query hook to get logoutUser function and mutation state values
    
    const navigate = useNavigate(); // initialize useNavigate hook to redirect user after logout or button actions
    
    const logoutHandler = async () => { // define function to handle logout button click
        await logoutUser(); // call logoutUser mutation to trigger logout API request
    };

    useEffect(() => { // use useEffect to perform actions after logout success
        if (isSuccess) { // check if logout API request was successful
            toast.success(data?.message || "User log out."); // display success toast message using server response or fallback text
            navigate("/login"); // redirect user to login page after successful logout
        }
    }, [isSuccess]); // re-run effect whenever logout success state changes

    return ( // return JSX for the Navbar UI
        <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
            {/* Desktop Navbar */}
            <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
                <div className="flex items-center gap-2">
                    <School size={"30"} /> 
                    <Link to="/">
                        <h1 className="hidden md:block font-extrabold text-2xl">E-Learning</h1>
                    </Link>
                </div>
                {/* User profile and dark mode controls */}
                <div className="flex items-center gap-8">
                    {user ? ( // check if user is logged in
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar>
                                    <AvatarImage
                                        src={user?.photoUrl || "https://github.com/shadcn.png"} // display user's photo or fallback image
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>CN</AvatarFallback> {/* display fallback initials if image fails to load */}
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem>
                                        <Link to="my-learning">My learning</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="profile">Edit Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem>
                                </DropdownMenuGroup>
                                {user?.role === "instructor" && ( // check if logged-in user is an instructor
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link to="/admin/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : ( // render login/signup buttons if no user is logged in
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => navigate("/login")}>Login</Button>
                            <Button onClick={() => navigate("/login")}>Signup</Button>
                        </div>
                    )}
                    <DarkMode /> {/* render dark mode toggle button */}
                </div>
            </div>
            {/* Mobile Navbar */}
            <div className="flex md:hidden items-center justify-between px-4 h-full">
                <h1 className="font-extrabold text-2xl">E-learning</h1>
                <MobileNavbar user={user} /> {/* render mobile navigation component */}
            </div>
        </div>
    );
};

export default Navbar; // export Navbar component for use in layout or pages

const MobileNavbar = ({ user }) => { // define functional component for mobile navigation with user prop
    const navigate = useNavigate(); // initialize useNavigate hook for navigation actions

    return ( // return JSX for mobile sidebar navigation
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    className="rounded-full hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu /> {/* display menu icon to open sidebar */}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle><Link to="/">E-Learning</Link></SheetTitle>
                    <DarkMode /> {/* include dark mode toggle in mobile header */}
                </SheetHeader>
                <Separator className="mr-2" />
                <nav className="flex flex-col space-y-4">
                    <Link to="/my-learning">My Learning</Link>
                    <Link to="/profile">Edit Profile</Link>
                    <p>Log out</p>
                </nav>
                {user?.role === "instructor" && ( // show dashboard link for instructors only
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={() => navigate("/admin/dashboard")}>Dashboard</Button>
                        </SheetClose>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};