import { type MenuItem } from "@/types/restaurantType"; // import 'MenuItem' type to render menu items
import { Button } from "./ui/button"; // import Button component from shadCN UI library
import { Card, CardContent, CardFooter } from "./ui/card"; // import these card components from shadCN UI library
import { useCartStore } from "@/store/useCartStore"; // import 'useCartStore' hook to add items to cart
import { useNavigate } from "react-router-dom"; // import 'useNavigate' hook to navigate programmatically

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => { // create a functional component named 'AvailableMenu' that takes an array of 'MenuItem' object as a prop
    const { addToCart } = useCartStore(); // extract 'addToCart' function from 'useCartStore' hook
    
    const navigate = useNavigate(); // create an instance of 'useNavigate' hook to navigate programmatically
    
    return (
        <div className="md:p-4">
            <h1 className="text-xl md:text-2xl font-extrabold mb-6">Available Menus</h1>
            <div className="grid md:grid-cols-3 space-y-4 md:space-y-0">
                {menus.map((menu: MenuItem) => ( // iterate over 'menus' array as 'menu'
                    <Card className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden">
                        <img src={menu.image} alt="" className="w-full h-40 object-cover" /> {/* render 'menu.image' ie image of current object */}
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                {menu.name} {/* render'menu.name' ie name of current object */}
                            </h2>
                            <p className="text-sm text-gray-600 mt-2">{menu.description}</p> {/* render'menu.description' ie description of current object */}
                            <h3 className="text-lg font-semibold mt-4">
                                Price: <span className="text-[#D19254]">₹{menu.price}</span> {/* render'menu.price' ie price of current object */}
                            </h3>
                        </CardContent>
                        <CardFooter className="p-4">
                            <Button
                                onClick={() => { // when this button is clicked
                                    addToCart(menu); // call 'addToCart' function from 'useCartStore' hook and pass current object as argument to add current item to cart
                                    navigate("/cart"); // navigate to '/cart' route
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

export default AvailableMenu;