import { IndianRupee } from "lucide-react"; // import icon to visually represent Indian currency symbol
import { Separator } from "./ui/separator"; // import visual separator component for dividing sections cleanly
import { Link } from "react-router-dom"; // import navigation component to create clickable links for routing
import { Button } from "./ui/button"; // import button component from shadcn UI library for styled interactive buttons
import { useOrderStore } from "@/store/useOrderStore"; // import global order store hook to manage and access order data
import { useEffect } from "react"; // import hook to handle lifecycle side effects like data fetching
import { type CartItem } from "@/types/cartType"; // import custom data type definition for cart items

const Success = () => { // define functional component 'Success' to display order confirmation page
    const { orders, getOrderDetails } = useOrderStore(); // destructure orders array and function to fetch order details from global store

    useEffect(() => { // define a side effect to load order details when component mounts
        getOrderDetails(); // invoke store function to fetch and update latest order information
    }, []); // run this effect only once after initial render since dependency array is empty

    if (orders.length === 0) // check if there are no orders to display
        return ( // if true, render a fallback message for missing order
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
                    {orders.map((order: any, index: number) => ( // iterate through list of orders to render summary for each
                        <div key={index}>
                            {order.cartItems.map((item: CartItem) => ( // iterate through cart items in each order to render item details
                                <div className="mb-4" key={item._id}>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image} // display product image from item data
                                                alt=""
                                                className="w-14 h-14 rounded-md object-cover"
                                            />
                                            <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">{item.name}</h3> // render product name beside image
                                        </div>
                                        <div className="text-right">
                                            <div className="text-gray-800 dark:text-gray-200 flex items-center">
                                                <IndianRupee /> // show currency symbol before price
                                                <span className="text-lg font-medium">{item.price}</span> // display item price in numeric form
                                            </div>
                                        </div>
                                    </div>
                                    <Separator className="my-4" /> // render horizontal divider between items
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <Link to="/cart"> // create navigation link to cart page
                    <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg"> // styled button prompting user to continue shopping
                        Continue Shopping
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Success; // export Success component for use in routing or other components