import { Menu, School } from "lucide-react"; // import Menu and School icons from lucide-react for navigation visuals
import React, { useEffect } from "react"; // import React library and useEffect hook to manage component side effects
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"; // import dropdown menu components from shadcn/ui for account dropdown
import { Button } from "./ui/button"; // import Button component from shadcn/ui for interactive buttons
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // import avatar components from shadcn/ui for user profile display
import DarkMode from "@/DarkMode"; // import DarkMode component to toggle dark/light theme
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"; // import sheet components from shadcn/ui for mobile drawer functionality
import { Separator } from "@radix-ui/react-dropdown-menu"; // import Separator component from radix-ui to separate UI elements
import { Link, useNavigate } from "react-router-dom"; // import Link for routing and useNavigate for programmatic navigation
import { useLogoutUserMutation } from "@/features/api/authApi"; // import logout mutation hook from authApi to handle user logout
import { toast } from "sonner"; // import toast library to display success or error messages
import { useSelector } from "react-redux"; // import useSelector hook to access Redux store values

const MobileNavbar = ({ user }) => { // define a functional component named 'MobileNavbar' to render responsive navigation, taking 'user' as prop
    const navigate = useNavigate(); // initialize useNavigate hook for programmatic page navigation

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon" // set button size to icon type for compact circular button
                    className="rounded-full hover:bg-gray-200" // style button with rounded edges and hover color
                    variant="outline" // apply outline variant styling from shadcn/ui
                >
                    <Menu /> {/* render menu icon for mobile drawer trigger */}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col"> {/* render drawer content with vertical layout */}
                <SheetHeader className="flex flex-row items-center justify-between mt-2"> {/* header section inside sheet with title and dark mode toggle */}
                    <SheetTitle><Link to="/">E-Learning</Link></SheetTitle> {/* clicking the title navigates user to home page */}
                    <DarkMode /> {/* render theme toggle switch */}
                </SheetHeader>
                <Separator className="mr-2" /> {/* visually separate header from navigation links */}
                <nav className="flex flex-col space-y-4"> {/* render vertical list of navigation links */}
                    <Link to="/my-learning">My Learning</Link> {/* link to user's enrolled courses */}
                    <Link to="/profile">Edit Profile</Link> {/* link to profile editing page */}
                    <p>Log out</p> {/* placeholder text for logout option */}
                </nav>
                {user?.role === "instructor" && ( // conditionally render instructor dashboard access if user's role is instructor
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="submit" onClick={() => navigate("/admin/dashboard")}>Dashboard</Button> // navigate instructor to admin dashboard
                        </SheetClose>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
};

const Navbar = () => { // define a functional component named 'Navbar' to render desktop and mobile navigation bars
    const { user } = useSelector((store) => store.auth); // retrieve user data from Redux store’s auth slice
    
    const [ // destructure values from logout mutation hook
        logoutUser, // function to trigger logout API call
        { data, isSuccess } // response data and flag to track logout completion
    ] = useLogoutUserMutation(); // initialize logout mutation hook
    
    const navigate = useNavigate(); // initialize useNavigate hook to navigate after logout or for login/signup
    
    const logoutHandler = async () => { // define async function to handle user logout
        await logoutUser(); // call logout mutation to invalidate user session
    };

    useEffect(() => { // monitor logout success to show message and redirect
        if (isSuccess) { // check if logout API call succeeded
            toast.success(data?.message || "User log out."); // display success toast with server or fallback message
            navigate("/login"); // redirect logged-out user to login page
        }
    }, [isSuccess]); // re-run effect whenever logout success status changes

    return (
        <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10"> {/* main navbar container with fixed position and theme-based styling */}
            <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full"> {/* desktop navbar layout hidden on small screens */}
                <div className="flex items-center gap-2"> {/* logo and app name container */}
                    <School size={"30"} /> {/* render school icon beside title */}
                    <Link to="/"><h1 className="hidden md:block font-extrabold text-2xl">E-Learning</h1></Link> {/* clicking title navigates to homepage */}
                </div>
                <div className="flex items-center gap-8"> {/* right section containing user actions */}
                    {user ? ( // check if user exists to conditionally render account menu
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar> {/* avatar used as dropdown trigger */}
                                    <AvatarImage
                                        src={user?.photoUrl || "https://github.com/shadcn.png"} // display user’s profile image or fallback
                                        alt="@shadcn" // set alt text for accessibility
                                    />
                                    <AvatarFallback>CN</AvatarFallback> {/* fallback initials if no image */}
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56"> {/* dropdown menu container with fixed width */}
                                <DropdownMenuLabel>My Account</DropdownMenuLabel> {/* label to indicate account section */}
                                <DropdownMenuSeparator /> {/* visual separator */}
                                <DropdownMenuGroup> {/* group user navigation items */}
                                    <DropdownMenuItem>
                                        <Link to="my-learning">My learning</Link> {/* link to user learning page */}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Link to="profile">Edit Profile</Link> {/* link to profile editing */}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={logoutHandler}>Log out</DropdownMenuItem> {/* trigger logout handler on click */}
                                </DropdownMenuGroup>
                                {user?.role === "instructor" && ( // conditionally show dashboard access for instructors
                                    <>
                                        <DropdownMenuSeparator /> {/* add separator before dashboard link */}
                                        <DropdownMenuItem>
                                            <Link to="/admin/dashboard">Dashboard</Link> {/* navigate instructor to dashboard */}
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : ( // render login/signup buttons if user is not logged in
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => navigate("/login")}>Login</Button> // navigate to login page on click
                            <Button onClick={() => navigate("/login")}>Signup</Button> // navigate to signup page on click
                        </div>
                    )}
                    <DarkMode /> {/* render dark mode toggle for desktop view */}
                </div>
            </div>
            <div className="flex md:hidden items-center justify-between px-4 h-full"> {/* mobile navbar layout visible only on small screens */}
                <h1 className="font-extrabold text-2xl">E-learning</h1> {/* display app title on mobile */}
                <MobileNavbar user={user} /> {/* render mobile drawer navigation with user prop */}
            </div>
        </div>
    );
};

export default Navbar; // export Navbar component for use in other modules