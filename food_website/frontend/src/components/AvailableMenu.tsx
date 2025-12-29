import { type MenuItem } from "@/types/restaurantType"; // import 'MenuItem' type to define structure for each menu item data
import { Button } from "./ui/button"; // import button component from shadCN UI to render styled action buttons
import { Card, CardContent, CardFooter } from "./ui/card"; // import card components from shadCN UI to display each menu item in structured format
import { useCartStore } from "@/store/useCartStore"; // import 'useCartStore' hook to manage cart operations such as adding items
import { useNavigate } from "react-router-dom"; // import navigation hook to redirect user between routes programmatically

const AvailableMenu = ( // define a functional component named 'AvailableMenu' to display all available menu items in a grid layout
    { menus }: { menus: MenuItem[] } // define prop 'menus' which is an array of 'MenuItem' objects to be rendered
) => {
    const { addToCart } = useCartStore(); // extract 'addToCart' function from 'useCartStore' hook to allow adding items to the cart
    const navigate = useNavigate(); // initialize navigation instance to redirect user to different pages

    return (
        <div className="md:p-4">
            <h1 className="text-xl md:text-2xl font-extrabold mb-6">Available Menus</h1>
            <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
                {menus.map((menu: MenuItem) => ( // iterate through each menu item in 'menus' array and return a card element
                    <Card className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
                        <img src={menu.image} alt="" className="w-full h-40 object-cover" /> {/* display the image of current menu item */}
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                {menu.name} {/* display the name of current menu item */}
                            </h2>
                            <p className="text-sm text-gray-600 mt-2">{menu.description}</p> {/* display the description of current menu item */}
                            <h3 className="text-lg font-semibold mt-4">
                                Price: <span className="text-[#D19254]">₹{menu.price}</span> {/* display the price of current menu item */}
                            </h3>
                        </CardContent>
                        <CardFooter className="p-4">
                            <Button
                                onClick={() => { // define click event handler for button to perform two sequential actions
                                    addToCart(menu); // add the selected menu item to cart using 'addToCart' function
                                    navigate("/cart"); // redirect user to '/cart' page after adding item
                                }}
                                className="w-full bg-orange hover:bg-hoverOrange"
                            >
                                Add to Cart
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AvailableMenu; // export 'AvailableMenu' component as default so it can be used in other parts of the app