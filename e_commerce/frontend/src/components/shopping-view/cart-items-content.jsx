import { Minus, Plus, Trash } from "lucide-react"; // import icon components for minus, plus, and trash from lucide-react
import { Button } from "../ui/button"; // import Button component from UI library for quantity control and delete actions
import { useDispatch, useSelector } from "react-redux"; // import Redux hooks for dispatching actions and accessing state
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice"; // import Redux actions for cart item management
import { useToast } from "../ui/use-toast"; // import custom hook for showing toast notifications

function UserCartItemsContent({ // create a functional component named UserCartItemsContent for rendering individual cart items and handling quantity updates and deletion, takes cartItem as prop
    cartItem, // object containing details of the cart item like productId, title, price, salePrice, image, quantity
}) {
    const { user } = useSelector((state) => state.auth); // get user object from Redux auth state using useSelector
    
    const { cartItems } = useSelector((state) => state.shopCart); // get cartItems object from Redux shopCart state using useSelector
    
    const { productList } = useSelector((state) => state.shopProducts); // get productList array from Redux shopProducts state using useSelector
    
    const dispatch = useDispatch(); // get Redux dispatch function to dispatch actions
    
    const { toast } = useToast(); // get toast function from custom useToast hook for showing notifications

    function handleUpdateQuantity(getCartItem, typeOfAction) { // create a function to update cart item quantity, takes getCartItem object and typeOfAction string ("plus" or "minus")
        if (typeOfAction == "plus") { // check if the action is to increase quantity
            let getCartItems = cartItems.items || []; // get current cart items array or empty array if undefined

            if (getCartItems.length) { // check if cart has items
                const indexOfCurrentCartItem = getCartItems.findIndex( // find index of current cart item in cartItems array
                    (item) => item.productId === getCartItem?.productId
                );

                const getCurrentProductIndex = productList.findIndex( // find index of current product in productList array
                    (product) => product._id === getCartItem?.productId
                );
                
                const getTotalStock = productList[getCurrentProductIndex].totalStock; // get total stock for the current product

                console.log(getCurrentProductIndex, getTotalStock, "getTotalStock"); // log current product index and total stock for debugging

                if (indexOfCurrentCartItem > -1) { // check if cart item exists in cartItems
                    const getQuantity = getCartItems[indexOfCurrentCartItem].quantity; // get current quantity of the cart item
                    
                    if (getQuantity + 1 > getTotalStock) { // check if increasing quantity exceeds stock
                        toast({ // show toast notification
                            title: `Only ${getQuantity} quantity can be added for this item`, // message showing max allowable quantity
                            variant: "destructive", // toast variant type for error
                        });
                        
                        return; // exit function early to prevent exceeding stock
                    }
                }
            }
        }

        dispatch( // dispatch Redux action to update cart quantity
            updateCartQuantity({ // call updateCartQuantity action
                userId: user?.id, // pass current user ID
                productId: getCartItem?.productId, // pass product ID of cart item
                quantity: // calculate new quantity based on action
                    typeOfAction === "plus"
                        ? getCartItem?.quantity + 1 // increase quantity by 1 if action is "plus"
                        : getCartItem?.quantity - 1, // decrease quantity by 1 if action is "minus"
            })
        ).then((data) => { // handle promise after dispatch
            if (data?.payload?.success) { // check if response indicates success
                toast({ // show success toast
                    title: "Cart item is updated successfully", // toast message
                });
            }
        });
    }

    function handleCartItemDelete(getCartItem) { // create a function to delete a cart item, takes getCartItem object
        dispatch( // dispatch Redux action to delete cart item
            deleteCartItem({ userId: user?.id, productId: getCartItem?.productId }) // call deleteCartItem action with user ID and product ID
        ).then((data) => { // handle promise after dispatch
            if (data?.payload?.success) { // check if deletion was successful
                toast({ // show success toast
                    title: "Cart item is deleted successfully", // toast message
                });
            }
        });
    }

    return (
        <div className="flex items-center space-x-4">
            <img
                src={cartItem?.image} // display product image
                alt={cartItem?.title} // set alt text for image
                className="w-20 h-20 rounded object-cover"
            />
            <div className="flex-1">
                <h3 className="font-extrabold">{cartItem?.title}</h3> {/* display product title */}
                <div className="flex items-center gap-2 mt-1">
                    <Button
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        size="icon"
                        disabled={cartItem?.quantity === 1} // disable minus button if quantity is 1
                        onClick={() => handleUpdateQuantity(cartItem, "minus")} // call handleUpdateQuantity with "minus" action
                    >
                        <Minus className="w-4 h-4" />
                        <span className="sr-only">Decrease</span>
                    </Button>
                    <span className="font-semibold">{cartItem?.quantity}</span> {/* display current quantity */}
                    <Button
                        variant="outline"
                        className="h-8 w-8 rounded-full"
                        size="icon"
                        onClick={() => handleUpdateQuantity(cartItem, "plus")} // call handleUpdateQuantity with "plus" action
                    >
                        <Plus className="w-4 h-4" />
                        <span className="sr-only">Increase</span>
                    </Button>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="font-semibold">
                    $
                    {(
                        (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * // use salePrice if available otherwise price
                        cartItem?.quantity // multiply by quantity
                    ).toFixed(2)} {/* format total price to 2 decimal places */}
                </p>
                <Trash
                    onClick={() => handleCartItemDelete(cartItem)} // call handleCartItemDelete on click
                    className="cursor-pointer mt-1"
                    size={20}
                />
            </div>
        </div>
    );
}

export default UserCartItemsContent; // export UserCartItemsContent component for use in other parts of the app
