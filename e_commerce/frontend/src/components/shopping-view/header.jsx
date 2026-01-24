import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react"; // import icons used in header
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"; // import router hooks for navigation and search params
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"; // import sheet components for drawer functionality
import { Button } from "../ui/button"; // import button component
import { useDispatch, useSelector } from "react-redux"; // import Redux hooks
import { shoppingViewHeaderMenuItems } from "@/config"; // import header menu config
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"; // import dropdown components
import { Avatar, AvatarFallback } from "../ui/avatar"; // import avatar components
import { logoutUser } from "@/store/auth-slice"; // import logout action
import UserCartWrapper from "./cart-wrapper"; // import cart wrapper component
import { useEffect, useState } from "react"; // import React hooks
import { fetchCartItems } from "@/store/shop/cart-slice"; // import fetch cart items action
import { Label } from "../ui/label"; // import Label component for menu items

function MenuItems({ }) { // create functional component for menu items
    const navigate = useNavigate(); // get navigate function
    const location = useLocation(); // get current location object
    const [searchParams, setSearchParams] = useSearchParams(); // get and set search params

    function handleNavigate(getCurrentMenuItem) { // handle menu item click
        sessionStorage.removeItem("filters"); // clear filters from session storage

        const currentFilter = // determine current filter for non-home/product/search items
            getCurrentMenuItem.id !== "home" && // check if menu item is not home
            getCurrentMenuItem.id !== "products" && // check if menu item is not products
            getCurrentMenuItem.id !== "search" // check if menu item is not search
                ? { category: [getCurrentMenuItem.id] } // create filter object with category
                : null; // otherwise set filter to null

        sessionStorage.setItem("filters", JSON.stringify(currentFilter)); // save currentFilter to session storage

        location.pathname.includes("listing") && currentFilter !== null // check if on listing page and filter exists
            ? setSearchParams( // if true, update URL search params
                new URLSearchParams(`?category=${getCurrentMenuItem.id}`) // create URLSearchParams with category
            )
            : navigate(getCurrentMenuItem.path); // otherwise, navigate to menu item's path
    }

    return (
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
            {shoppingViewHeaderMenuItems.map((menuItem) => ( // iterate over header menu items
                <Label
                    onClick={() => handleNavigate(menuItem)} // call handleNavigate when menu item clicked
                    className="text-sm font-medium cursor-pointer"
                    key={menuItem.id} // set unique key for React list
                >
                    {menuItem.label}
                </Label>
            ))}
        </nav>
    );
}

function HeaderRightContent() { // create functional component for cart and user avatar dropdown
    const { user } = useSelector((state) => state.auth); // get user from auth state
    const { cartItems } = useSelector((state) => state.shopCart); // get cart items from shopCart state
    const [openCartSheet, setOpenCartSheet] = useState(false); // manage cart sheet open state
    const navigate = useNavigate(); // get navigate function
    const dispatch = useDispatch(); // get dispatch function

    function handleLogout() { // handle user logout
        dispatch(logoutUser()); // dispatch logout action
    }

    useEffect(() => { // fetch cart items on component mount
        dispatch(fetchCartItems(user?.id)); // dispatch fetchCartItems with user ID
    }, [dispatch]); // dependency array

    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">
            <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}> 
                <Button
                    onClick={() => setOpenCartSheet(true)} // open cart sheet
                    variant="outline"
                    size="icon"
                    className="relative"
                >
                    <ShoppingCart className="w-6 h-6" />
                    <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
                        {cartItems?.items?.length || 0} {/* display number of items in cart */}
                    </span>
                    <span className="sr-only">User cart</span>
                </Button>
                <UserCartWrapper
                    setOpenCartSheet={setOpenCartSheet} // pass function to close cart sheet
                    cartItems={ // determine cart items to pass
                        cartItems && // check if cartItems object exists
                        cartItems.items && // check if items array exists
                        cartItems.items.length > 0 // check if items array is not empty
                            ? cartItems.items // if true, use items array
                            : [] // if false, pass empty array
                    }
                />
            </Sheet>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="bg-black">
                        <AvatarFallback className="bg-black text-white font-extrabold">
                            {user?.userName[0].toUpperCase()} {/* display first letter of username */}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                    <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/shop/account")}> 
                        <UserCog className="mr-2 h-4 w-4" />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}> 
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

function ShoppingHeader() { // create main header component
    const { isAuthenticated } = useSelector((state) => state.auth); // get authentication state

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/shop/home" className="flex items-center gap-2">
                    <HousePlug className="h-6 w-6" />
                    <span className="font-bold">Ecommerce</span>
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="lg:hidden">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle header menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full max-w-xs">
                        <MenuItems /> 
                        <HeaderRightContent /> 
                    </SheetContent>
                </Sheet>
                <div className="hidden lg:block">
                    <MenuItems /> 
                </div>
                <div className="hidden lg:block">
                    <HeaderRightContent /> 
                </div>
            </div>
        </header>
    );
}

export default ShoppingHeader; // export main header component
