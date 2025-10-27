import { IndianRupee } from "lucide-react"; // import the IndianRupee icon from lucide-react library
import { Separator } from "./ui/separator"; // import the Separator component from shadCN UI library
import { Link } from "react-router-dom"; // import the Link component from react-router-dom library to create links to redirect user to
import { Button } from "./ui/button"; // import the Button component from shadCN UI library
import { useOrderStore } from "@/store/useOrderStore"; // import the useOrderStore hook to handle order related states
import { useEffect } from "react"; // import the useEffect hook to run side effects
import { type CartItem } from "@/types/cartType"; // import the 'CartItem' type

const Success = () => {
    const { orders, getOrderDetails } = useOrderStore(); // extract 'orders' and 'gerOrderDetails' from 'useOrderStore' hook

    useEffect(() => { // run a side effect using 'useEffect' hook
        getOrderDetails(); // call 'getOrderDetails' function to get the details of the order
    }, []); // dependency array is empty, so side effect will run only once when component mounts

    // if orders array is empty, return a message that order was not found
    if (orders.length === 0)
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
                    Order not found!
                </h1>
            </div>
        );

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        Order Status:{" "}
                        <span className="text-[#FF5A5A]">{"confirm".toUpperCase()}</span>
                    </h1>
                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">Order Summary</h2>
                    {orders.map((order: any, index: number) => ( // iterate over 'orders' object as 'order' of type 'any' and 'index' number as unique identifier
                        <div key={index}>
                            {order.cartItems.map((item: CartItem) => ( // iterate over 'cartItems' array present in 'order' object as 'item' of custom type 'CartItem'
                                <div className="mb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image} // render 'image' property of current 'item' object as image
                                                alt=""
                                                className="w-14 h-14 rounded-md object-cover"
                                            />
                                            <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">{item.name}</h3> {/* render 'item.name' as name of current 'item' object */}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-800 dark:text-gray-200 flex items-center">
                                                <IndianRupee />
                                                <span className="text-lg font-medium">{item.price}</span> {/* render 'item.price' as price of current 'item' object */}
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="my-4" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <Link to="/cart">
                    <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Success;