import { Link } from "react-router-dom"; // import 'Link' to navigate between routes in the app
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./ui/menubar"; // import menu components to create admin dashboard dropdown
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"; // import dropdown components for theme toggle
import { Button } from "./ui/button"; // import button component for reusable action buttons
import { HandPlatter, Loader2, Menu, Moon, PackageCheck, ShoppingCart, SquareMenu, Sun, User, UtensilsCrossed } from "lucide-react"; // import icons for navigation and UI indication
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // import avatar components to display user profile picture
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"; // import sheet components for mobile sidebar navigation
import { Separator } from "./ui/separator"; // import separator to divide sections visually
import { useUserStore } from "@/store/useUserStore"; // import user store hook to manage user authentication and info
import { useCartStore } from "@/store/useCartStore"; // import cart store hook to manage cart state globally
import { useThemeStore } from "@/store/useThemeStore"; // import theme store hook to manage dark/light mode

const Navbar = () => { // define 'Navbar' functional component to render navigation bar and user controls
    const { user, loading, logout } = useUserStore(); // extract user info, loading state, and logout function from user store

    const { cart } = useCartStore(); // extract current cart data from cart store

    const { setTheme } = useThemeStore(); // extract function to change theme from theme store

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-14">
                <Link to="/"> {/* navigate to homepage when brand name is clicked */}
                    <h1 className="font-bold md:font-extrabold text-2xl">EatItUp</h1>
                </Link>
                <div className="hidden md:flex items-center gap-10">
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/order/status">Order</Link>
                        {user?.admin && ( // show dashboard menu only if logged-in user is an admin
                            <Menubar>
                                <MenubarMenu>
                                    <MenubarTrigger>Dashboard</MenubarTrigger>
                                    <MenubarContent>
                                        <Link to="/admin/restaurant">
                                            <MenubarItem>Restaurant</MenubarItem>
                                        </Link>
                                        <Link to="/admin/menu">
                                            <MenubarItem>Menu</MenubarItem>
                                        </Link>
                                        <Link to="/admin/orders">
                                            <MenubarItem>Orders</MenubarItem>
                                        </Link>
                                    </MenubarContent>
                                </MenubarMenu>
                            </Menubar>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem> // switch app theme to light mode when clicked
                                    <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem> // switch app theme to dark mode when clicked
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Link to="/cart" className="relative cursor-pointer"> {/* navigate to cart page */}
                            <ShoppingCart />
                            {cart.length > 0 && ( // show cart item count only when cart has one or more items
                                <Button
                                    size={"icon"}
                                    className="absolute -inset-y-3 left-2 text-xs rounded-full w-4 h-4 bg-red-500 hover:bg-red-500"
                                >
                                    {cart.length}
                                </Button>
                            )}
                        </Link>
                        <div>
                            <Avatar>
                                <AvatarImage src={user?.profilePicture} alt="profilephoto" /> {/* display user profile picture if available */}
                                <AvatarFallback>CN</AvatarFallback> {/* show fallback initials when image not found */}
                            </Avatar>
                        </div>
                        <div>
                            {loading ? ( // show loading spinner when logout or user actions are in progress
                                <Button className="bg-orange hover:bg-hoverOrange">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button
                                    onClick={logout} // trigger user logout when clicked
                                    className="bg-orange hover:bg-hoverOrange"
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="md:hidden lg:hidden">
                    <MobileNavbar /> {/* render responsive mobile navbar component */}
                </div>
            </div>
        </div>
    );
};

export default Navbar;

const MobileNavbar = () => { // define mobile version of navbar for smaller screen sizes
    const { user, logout, loading } = useUserStore(); // extract user info and logout function for mobile menu actions
    
    const { setTheme } = useThemeStore(); // extract theme setter for theme toggle in mobile menu
    
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size={"icon"}
                    className="rounded-full bg-gray-200 text-black hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu size={"18"} /> {/* display hamburger icon for opening mobile menu */}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader className="flex flex-row items-center justify-between mt-2">
                    <SheetTitle>PatelEats</SheetTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem> // set light theme for mobile view
                            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem> // set dark theme for mobile view
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SheetHeader>
                <Separator className="my-2" />
                <SheetDescription className="flex-1">
                    <Link to="/profile" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                        <User /> {/* icon for profile navigation */}
                        <span>Profile</span>
                    </Link>
                    <Link to="/order/status" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                        <HandPlatter /> {/* icon for orders section */}
                        <span>Order</span>
                    </Link>
                    <Link to="/cart" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                        <ShoppingCart /> {/* icon for cart page */}
                        <span>Cart</span>
                    </Link>
                    {user?.admin && ( // show admin-only links when user has admin role
                        <>
                            <Link to="/admin/menu" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                                <SquareMenu /> {/* icon for admin menu page */}
                                <span>Menu</span>
                            </Link>
                            <Link to="/admin/restaurant" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                                <UtensilsCrossed /> {/* icon for restaurant management page */}
                                <span>Restaurant</span>
                            </Link>
                            <Link to="/admin/orders" className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium">
                                <PackageCheck /> {/* icon for admin order management page */}
                                <span>Restaurant Orders</span>
                            </Link>
                        </>
                    )}
                </SheetDescription>
                <SheetFooter className="flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-2">
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} /> {/* show user's avatar image in footer */}
                            <AvatarFallback>CN</AvatarFallback> {/* fallback initials if avatar not available */}
                        </Avatar>
                        <h1 className="font-bold">EatItUp</h1>
                    </div>
                    <SheetClose asChild>
                        {loading ? ( // if user state is loading, show loader button to indicate progress
                            <Button className="bg-orange hover:bg-hoverOrange">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button
                                onClick={logout} // call logout function to sign out user when pressed
                                className="bg-orange hover:bg-hoverOrange"
                            >
                                Logout
                            </Button>
                        )}
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};