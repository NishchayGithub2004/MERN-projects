import { Minus, Plus } from "lucide-react"; // import Minus and Plus icons from lucide-react library
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; // import these avatar components from shadCN UI library
import { Button } from "./ui/button"; // import Button component from shadCN UI library
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table"; // import these table components from shadCN UI library
import { useState } from "react"; // import 'useState' hook to manage states
import CheckoutConfirmPage from "./CheckoutConfirmPage"; // import 'CheckoutConfirmPage' component
import { useCartStore } from "@/store/useCartStore"; // import 'useCartStore' hook to manage cart state
import { type CartItem } from "@/types/cartType"; // import 'CartItem' type

const Cart = () => {
    const [open, setOpen] = useState<boolean>(false); // using 'useState' hook, create a boolean state 'open' and a function 'setOpen' to update it's value
    
    const { cart, decrementQuantity, incrementQuantity } = useCartStore(); // import these things from 'useCartStore' hook

    // determine total amount of cart items
    let totalAmount = cart.reduce((acc, ele) => {
        return acc + ele.price * ele.quantity;
    }, 0);
    
    return (
        <div className="flex flex-col max-w-7xl mx-auto my-10">
            <div className="flex justify-end">
                <Button variant="link">Clear All</Button>
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
                    {cart.map((item: CartItem) => ( // iterate over 'cart' array containing elements of 'CartItem' type
                        <TableRow>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={item.image} alt="" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell> {item.name}</TableCell>
                            <TableCell> {item.price}</TableCell>
                            <TableCell>
                                <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                                    <Button
                                        onClick={() => decrementQuantity(item._id)} // clicking this button calls 'decrementQuantity' function with 'item._id' as argument to target current item accurately
                                        size={"icon"}
                                        variant={"outline"}
                                        className="rounded-full bg-gray-200"
                                    >
                                        <Minus />
                                    </Button>
                                    <Button
                                        size={"icon"}
                                        className="font-bold border-none"
                                        disabled
                                        variant={"outline"}
                                    >
                                        {item.quantity}
                                    </Button>
                                    <Button
                                        onClick={() => incrementQuantity(item._id)} // clicking this button calls 'incrementQuantity' function with 'item._id' as argument to target current item accurately
                                        size={"icon"}
                                        className="rounded-full bg-orange hover:bg-hoverOrange"
                                        variant={"outline"}
                                    >
                                        <Plus />
                                    </Button>
                                </div>
                            </TableCell>
                            <TableCell>{item.price * item.quantity}</TableCell>
                            <TableCell className="text-right">
                                <Button size={"sm"} className="bg-orange hover:bg-hoverOrange">
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow className="text-2xl font-bold">
                        <TableCell colSpan={5}>Total</TableCell>
                        <TableCell className="text-right">{totalAmount}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
            <div className="flex justify-end my-5">
                <Button
                    onClick={() => setOpen(true)} // cliking this button sets value of 'open' to true
                    className="bg-orange hover:bg-hoverOrange"
                >
                    Proceed To Checkout
                </Button>
            </div>
            <CheckoutConfirmPage open={open} setOpen={setOpen} />
        </div>
    );
};

export default Cart;