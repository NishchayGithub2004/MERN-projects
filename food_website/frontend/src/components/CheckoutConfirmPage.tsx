import { type Dispatch, type FormEvent, type SetStateAction, useState } from "react"; // import types for dispatching state updates, handling form events, and using local state
import { Dialog, DialogContent, DialogDescription, DialogFooter } from "./ui/dialog"; // import dialog components from shadCN UI to build a modal
import { DialogTitle } from "@radix-ui/react-dialog"; // import dialog title component for modal heading
import { Label } from "./ui/label"; // import label component from shadCN UI for form field labeling
import { Input } from "./ui/input"; // import input component from shadCN UI for controlled input fields
import { Button } from "./ui/button"; // import button component from shadCN UI for interactive actions
import { useUserStore } from "@/store/useUserStore"; // import 'useUserStore' hook to access logged-in user's data
import { type CheckoutSessionRequest } from "@/types/orderType"; // import type 'CheckoutSessionRequest' to structure checkout request payload
import { useCartStore } from "@/store/useCartStore"; // import 'useCartStore' hook to access cart items
import { useRestaurantStore } from "@/store/useRestaurantStore"; // import 'useRestaurantStore' hook to access restaurant data
import { useOrderStore } from "@/store/useOrderStore"; // import 'useOrderStore' hook to handle order creation and checkout sessions
import { Loader2 } from "lucide-react"; // import loader icon for showing loading state

const CheckoutConfirmPage = ( // define a functional component named 'CheckoutConfirmPage' to handle checkout confirmation
    {
        open, // boolean state indicating if dialog is open
        setOpen, // state setter function to open/close the dialog
    }: {
        open: boolean;
        setOpen: Dispatch<SetStateAction<boolean>>;
    }
) => {
    const { user } = useUserStore(); // extract current logged-in user details from 'useUserStore'
    
    const [input, setInput] = useState({ // create a local state 'input' to store delivery details of the user
        name: user?.fullname || "", // set default name from user's fullname if available
        email: user?.email || "", // set default email from user's email if available
        contact: user?.contact.toString() || "", // set default contact from user's contact converted to string
        address: user?.address || "", // set default address from user's data
        city: user?.city || "", // set default city from user's data
        country: user?.country || "", // set default country from user's data
    });
    
    const { cart } = useCartStore(); // extract 'cart' array from 'useCartStore' to include items in checkout request
    
    const { restaurant } = useRestaurantStore(); // extract 'restaurant' data from 'useRestaurantStore' to associate order with a restaurant
    
    const { createCheckoutSession, loading } = useOrderStore(); // extract 'createCheckoutSession' function and 'loading' state from 'useOrderStore'
    
    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // define event handler function to manage input changes dynamically
        const { name, value } = e.target; // extract 'name' and 'value' from target input
        setInput({ ...input, [name]: value }); // update respective field in 'input' object using computed property name
    };
    
    const checkoutHandler = async (e: FormEvent<HTMLFormElement>) => { // define asynchronous function 'checkoutHandler' to handle form submission
        e.preventDefault(); // prevent default form submission behavior
        
        try {
            const checkoutData: CheckoutSessionRequest = { // create structured object 'checkoutData' according to 'CheckoutSessionRequest' type
                cartItems: cart.map((cartItem) => ({ // map over 'cart' array and transform each cart item into required format
                    menuId: cartItem._id, // assign 'menuId' from item's unique id
                    name: cartItem.name, // assign menu item name
                    image: cartItem.image, // assign menu item image
                    price: cartItem.price.toString(), // convert price to string for consistency
                    quantity: cartItem.quantity.toString(), // convert quantity to string
                })),
                deliveryDetails: input, // assign current input state containing user delivery details
                restaurantId: restaurant?._id as string, // assign restaurant id as string
            };
            
            await createCheckoutSession(checkoutData); // call 'createCheckoutSession' to initiate checkout with server
        } catch (error) { // if any error occurs during checkout
            console.log(error); // log it to console for debugging
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}> {/* render a dialog component that opens/closes based on 'open' state */}
            <DialogContent> {/* main container for dialog content */}
                <DialogTitle className="font-semibold">Review Your Order</DialogTitle> {/* display heading for dialog */}
                <DialogDescription className="text-xs"> {/* display short instructional text below heading */}
                    Double-check your delivery details and ensure everything is in order.
                    When you are ready, hit confirm button to finalize your order
                </DialogDescription>
                <form
                    onSubmit={checkoutHandler} // attach 'checkoutHandler' to form submit event
                    className="md:grid grid-cols-2 gap-2 space-y-1 md:space-y-0"
                >
                    <div>
                        <Label>Fullname</Label>
                        <Input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler} // handle changes to 'name' input
                        />
                    </div>
                    <div>
                        <Label>Email</Label>
                        <Input
                            disabled // make email input read-only
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler} // handle changes to 'email' input
                        />
                    </div>
                    <div>
                        <Label>Contact</Label>
                        <Input
                            type="text"
                            name="contact"
                            value={input.contact}
                            onChange={changeEventHandler} // handle changes to 'contact' input
                        />
                    </div>
                    <div>
                        <Label>Address</Label>
                        <Input
                            type="text"
                            name="address"
                            value={input.address}
                            onChange={changeEventHandler} // handle changes to 'address' input
                        />
                    </div>
                    <div>
                        <Label>City</Label>
                        <Input
                            type="text"
                            name="city"
                            value={input.city}
                            onChange={changeEventHandler} // handle changes to 'city' input
                        />
                    </div>
                    <div>
                        <Label>Country</Label>
                        <Input
                            type="text"
                            name="country"
                            value={input.country}
                            onChange={changeEventHandler} // handle changes to 'country' input
                        />
                    </div>
                    <DialogFooter className="col-span-2 pt-5"> {/* footer section with buttons */}
                        {loading ? ( // conditionally render loading state button
                            <Button disabled className="bg-orange hover:bg-hoverOrange">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* show spinner animation while processing */}
                                Please wait
                            </Button>
                        ) : (
                            <Button className="bg-orange hover:bg-hoverOrange">
                                Continue To Payment
                            </Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CheckoutConfirmPage; // export 'CheckoutConfirmPage' as default export for external use