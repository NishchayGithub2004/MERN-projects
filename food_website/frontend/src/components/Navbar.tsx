import { Link } from "react-router-dom"; // import 'Link' component from 'react-router-dom' library to create links
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from "./ui/menubar"; // import these menubar components from shadCN UI library
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"; // import these dropdown-menu components from shadCN UI library
import { Button } from "./ui/button"; // import 'Button' component from shadCN UI library
import { HandPlatter, Loader2, Menu, Moon, PackageCheck, ShoppingCart, SquareMenu, Sun, User, UtensilsCrossed } from "lucide-react"; // import these icons from lucide-react library
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // import these avatar components from shadCN UI library
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"; // import these sheet components from shadCN UI library
import { Separator } from "./ui/separator"; // import 'Separator' component from shadCN UI library
import { useUserStore } from "@/store/useUserStore"; // import 'useUserStore' hook to manage user related state
import { useCartStore } from "@/store/useCartStore"; // import 'useCartStore' hook to manage cart related state
import { useThemeStore } from "@/store/useThemeStore"; // import 'useThemeStore' hook to manage theme related state

const Navbar = () => { // create a functional component called 'Navbar' that doesn't take any props
    const { user, loading, logout } = useUserStore(); // extract 'user', 'loading' and 'logout' from 'useUserStore' hook

    const { cart } = useCartStore(); // extract 'cart' from 'user' from 'useCartStore' hook

    const { setTheme } = useThemeStore(); // extract 'setTheme' from 'useThemeStore' hook

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between h-14">
                <Link to="/">
                    <h1 className="font-bold md:font-extrabold text-2xl">EatItUp</h1>
                </Link>
                <div className="hidden md:flex items-center gap-10">
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/">Home</Link>
                        <Link to="/profile">Profile</Link>
                        <Link to="/order/status">Order</Link>
                        {user?.admin && (
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
                                    <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem> {/* clicking this button calls 'setTheme' for value 'light' */}
                                    <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem> {/* clicking this button calls 'setTheme' for value 'dark' */}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Link to="/cart" className="relative cursor-pointer">
                            <ShoppingCart />
                            {cart.length > 0 && ( // render the following button only if 'cart' array is not empty
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
                                <AvatarImage src={user?.profilePicture} alt="profilephoto" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            {loading ? ( // if 'loading' is true render first button else render second button */}
                                <Button className="bg-orange hover:bg-hoverOrange">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button
                                    onClick={logout} // clicking this button calls 'logout' function
                                    className="bg-orange hover:bg-hoverOrange"
                                >
                                    Logout
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <div className="md:hidden lg:hidden">
                    <MobileNavbar />
                </div>
            </div>
        </div>
    );
};

export default Navbar;

const MobileNavbar = () => {
    const { user, logout, loading } = useUserStore();
    
    const { setTheme } = useThemeStore();
    
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    size={"icon"}
                    className="rounded-full bg-gray-200 text-black hover:bg-gray-200"
                    variant="outline"
                >
                    <Menu size={"18"} />
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
                            <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SheetHeader>
                <Separator className="my-2" />
                <SheetDescription className="flex-1">
                    <Link
                        to="/profile"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <User />
                        <span>Profile</span>
                    </Link>
                    <Link
                        to="/order/status"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <HandPlatter />
                        <span>Order</span>
                    </Link>
                    <Link
                        to="/cart"
                        className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                    >
                        <ShoppingCart />
                        <span>Cart</span>
                    </Link>
                    {user?.admin && (
                        <>
                            <Link
                                to="/admin/menu"
                                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                            >
                                <SquareMenu />
                                <span>Menu</span>
                            </Link>
                            <Link
                                to="/admin/restaurant"
                                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                            >
                                <UtensilsCrossed />
                                <span>Restaurant</span>
                            </Link>
                            <Link
                                to="/admin/orders"
                                className="flex items-center gap-4 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer hover:text-gray-900 font-medium"
                            >
                                <PackageCheck />
                                <span>Restaurant Orders</span>
                            </Link>
                        </>
                    )}
                </SheetDescription>
                <SheetFooter className="flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-2">
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <h1 className="font-bold">EatItUp</h1>
                    </div>
                    <SheetClose asChild>
                        {loading ? (
                            <Button className="bg-orange hover:bg-hoverOrange">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button
                                onClick={logout}
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