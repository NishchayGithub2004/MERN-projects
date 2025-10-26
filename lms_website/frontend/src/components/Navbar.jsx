import { Menu, School } from "lucide-react"; // import 'Menu' and 'School' icons from lucide-react library
import React, { useEffect } from "react"; // import 'useEffect' hook for creating side effects
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"; // import these dropdown menu related components from shadCN UI library
import { Button } from "./ui/button"; // import 'Button' component from shadCN UI library
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // import these avatar related components from shadCN UI library
import DarkMode from "@/DarkMode"; // import 'DarkMode' component
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"; // import these sheet related components from shadCN UI library
import { Separator } from "@radix-ui/react-dropdown-menu"; // import 'Separator' component from shadCN UI library
import { Link, useNavigate } from "react-router-dom"; // import 'Link' component from react-router-dom to create links and 'useNavigate' hook to navigate programmatically
import { useLogoutUserMutation } from "@/features/api/authApi"; // import 'useLogOutMutation' hook to handle authorization related state
import { toast } from "sonner"; // import toast library to display notifications
import { useSelector } from "react-redux"; // import useSelector hook to access Redux store state

const MobileNavbar = ({ user }) => { // define a functional component named 'MobileNavbar' that takes 'user' as prop
    const navigate = useNavigate(); // create an instance of 'useNavigate' hook to navigate programmatically

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size="icon"
                    className="rounded-full hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle><Link to="/">E-Learning</Link></SheetTitle>
                    <DarkMode />
                </SheetHeader>
                <Separator className="mr-2" />
                <nav className="flex flex-col space-y-4">
                    <Link to="/my-learning">My Learning</Link>
                    <Link to="/profile">Edit Profile</Link>
                    <p>Log out</p>
                </nav>
                {user?.role === "instructor" && ( // render the following content only if value of 'role' property of 'user' object is 'instructor'
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

const Navbar = () => { // define a functional component Navbar that doesn't take any props
    const { user } = useSelector((store) => store.auth); // extract 'user' object from 'auth' store
    
    const [logoutUser, { data, isSuccess }] = useLogoutUserMutation(); // extract these things from 'useLogoutUserMutation' hook
    
    const navigate = useNavigate(); // create an instance of 'useNavigate' hook to navigate to other pages programmatically
    
    const logoutHandler = async () => { // define an async function named 'logoutHandler'
        await logoutUser(); // call 'logoutUser' function to log out user
    };

    useEffect(() => { // use 'useEffect' hook to run side effects
        if (isSuccess) { // if value of 'isSuccess' is true
            toast.success(data?.message || "User log out."); // display success toast message that is present in 'message' property of 'data' object, and backup message if even that is not available
            navigate("/login"); // redirect user to login page
        }
    }, [isSuccess]); // re-run effect whenever value of 'isSuccess' changes by putting 'isSuccess' in dependency array

    return (
        <div className="h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10">
            <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center gap-10 h-full">
                <div className="flex items-center gap-2">
                    <School size={"30"} /> 
                    <Link to="/"><h1 className="hidden md:block font-extrabold text-2xl">E-Learning</h1></Link> {/* clicking this heading leads user to home page */}
                </div>
                <div className="flex items-center gap-8">
                    {user ? ( // if 'user' object is not null ie user exists
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar>
                                    <AvatarImage
                                        src={user?.photoUrl || "https://github.com/shadcn.png"}
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
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
                                {user?.role === "instructor" && ( // render the following content only if value of 'role' property of 'user' object is 'instructor'
                                    <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link to="/admin/dashboard">Dashboard</Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : ( // render the following content if 'user' object is null ie user doesn't exist
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => navigate("/login")}>Login</Button> {/* clicking this button takes user to login page */}
                            <Button onClick={() => navigate("/login")}>Signup</Button> {/* clicking this button takes user to sign up page */}
                        </div>
                    )}
                    <DarkMode />
                </div>
            </div>
            <div className="flex md:hidden items-center justify-between px-4 h-full">
                <h1 className="font-extrabold text-2xl">E-learning</h1>
                <MobileNavbar user={user} />
            </div>
        </div>
    );
};

export default Navbar;
