import { useNavigate } from "react-router-dom"; // import useNavigate hook from react-router-dom for programmatic navigation
import { Button } from "../ui/button"; // import Button component from UI library for checkout action
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"; // import Sheet components from UI library for cart drawer layout
import UserCartItemsContent from "./cart-items-content"; // import UserCartItemsContent component to render individual cart items

function UserCartWrapper({ // create a functional component named UserCartWrapper to display all cart items and handle checkout, takes cartItems and setOpenCartSheet as props
    cartItems, // array of cart item objects to display in the cart sheet
    setOpenCartSheet, // function to open or close the cart sheet
}) {
    const navigate = useNavigate(); // get navigate function from useNavigate hook for redirecting to checkout page

    const totalCartAmount = // calculate total amount of all items in cart
        cartItems && cartItems.length > 0 // check if cartItems exist and have length
            ? cartItems.reduce( // use reduce to sum total amount
                (sum, currentItem) => // accumulator sum and current cart item
                    sum +
                    (currentItem?.salePrice > 0 // check if salePrice is available
                        ? currentItem?.salePrice // use salePrice if available
                        : currentItem?.price) * // otherwise use regular price
                    currentItem?.quantity, // multiply by quantity of current item
                0 // initial sum value
            )
            : 0; // if cartItems empty or undefined, total is 0

    return (
        <SheetContent className="sm:max-w-md">
            <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle> {/* display cart sheet title */}
            </SheetHeader>
            <div className="mt-8 space-y-4">
                {cartItems && cartItems.length > 0 // check if there are cart items to display
                    ? cartItems.map((item) => <UserCartItemsContent cartItem={item} />) // render UserCartItemsContent for each item
                    : null} {/* render nothing if cart is empty */}
            </div>
            <div className="mt-8 space-y-4">
                <div className="flex justify-between">
                    <span className="font-bold">Total</span> {/* label for total */}
                    <span className="font-bold">${totalCartAmount}</span> {/* display calculated total amount */}
                </div>
            </div>
            <Button
                onClick={() => { // handle checkout button click
                    navigate("/shop/checkout"); // navigate to checkout page
                    setOpenCartSheet(false); // close the cart sheet
                }}
                className="w-full mt-6"
            >
                Checkout
            </Button>
        </SheetContent>
    );
}

export default UserCartWrapper; // export UserCartWrapper component for use in other parts of the app
