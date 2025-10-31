import { Minus, Plus } from "lucide-react"; // import Minus and Plus icons for quantity control
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // import avatar components to display product image or fallback initials
import { Button } from "./ui/button"; // import Button component for interactive elements
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table"; // import table components to structure cart items in tabular form
import { useState } from "react"; // import 'useState' hook to manage local component state
import CheckoutConfirmPage from "./CheckoutConfirmPage"; // import 'CheckoutConfirmPage' component to handle checkout confirmation
import { useCartStore } from "@/store/useCartStore"; // import 'useCartStore' hook to manage global cart state
import { type CartItem } from "@/types/cartType"; // import 'CartItem' type for proper typing of cart items

const Cart = () => { // define a functional component named 'Cart' to display and manage shopping cart data
    const [open, setOpen] = useState<boolean>(false); // create a boolean state 'open' with initial value 'false' to control visibility of checkout dialog
    
    const { cart, decrementQuantity, incrementQuantity } = useCartStore(); // destructure 'cart', 'decrementQuantity', and 'incrementQuantity' from global store to access and modify cart items

    let totalAmount = cart.reduce((acc, ele) => acc + ele.price * ele.quantity, 0); // calculate total amount by summing (price * quantity) for each cart item
    
    return (
        <div className="flex flex-col max-w-7xl mx-auto my-10">
            <div className="flex justify-end">
                <Button variant="link">Clear All</Button> {/* render a link-style button for clearing cart items (functionality not yet implemented) */}
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Items</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead className="text-right">Remove</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {cart.map((item: CartItem) => ( // iterate over each 'item' in 'cart' array to render table rows dynamically
                        <TableRow key={item._id}> {/* assign unique key using item's id for stable rendering */}
                            <TableCell>
                                <Avatar> {/* display product image using Avatar */}
                                    <AvatarImage src={item.image} alt="" /> {/* render product image */}
                                    <AvatarFallback>CN</AvatarFallback> {/* render fallback initials when image not available */}
                                </Avatar>
                            </TableCell>
                            <TableCell>{item.name}</TableCell> {/* render name of current item */}
                            <TableCell>{item.price}</TableCell> {/* render price of current item */}
                            <TableCell>
                                <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                                    <Button
                                        onClick={() => decrementQuantity(item._id)} // decrease quantity of current item by calling 'decrementQuantity' with item id
                                        size={"icon"}
                                        variant={"outline"}
                                        className="rounded-full bg-gray-200"
                                    >
                                        <Minus /> {/* render minus icon for decreasing quantity */}
                                    </Button>
                                    <Button
                                        size={"icon"}
                                        className="font-bold border-none"
                                        disabled
                                        variant={"outline"}
                                    >
                                        {item.quantity} {/* display current quantity in a disabled button */}
                                    </Button>
                                    <Button
                                        onClick={() => incrementQuantity(item._id)} // increase quantity of current item by calling 'incrementQuantity' with item id
                                        size={"icon"}
                                        className="rounded-full bg-orange hover:bg-hoverOrange"
                                        variant={"outline"}
                                    >
                                        <Plus /> {/* render plus icon for increasing quantity */}
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell>{item.price * item.quantity}</TableCell> {/* display total cost for current item */}
                            <TableCell className="text-right">
                                <Button size={"sm"} className="bg-orange hover:bg-hoverOrange">
                                    Remove {/* render remove button (functionality not yet implemented) */}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="text-2xl font-bold">
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell className="text-right">{totalAmount}</TableCell> {/* display final total amount for all cart items */}
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="flex justify-end my-5">
                <Button
                    onClick={() => setOpen(true)} // open checkout confirmation dialog by setting 'open' to true
                    className="bg-orange hover:bg-hoverOrange"
                >
                    Proceed To Checkout
                </Button>
            </div>
            <CheckoutConfirmPage
                open={open} // pass 'open' state to control dialog visibility
                setOpen={setOpen} // pass 'setOpen' function to allow dialog to close or open externally
            />
        </div>
    );
};

export default Cart; // export 'Cart' component as default for use in other parts of the app