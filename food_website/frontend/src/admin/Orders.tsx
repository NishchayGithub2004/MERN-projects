import { Label } from "@/components/ui/label"; // import 'Label' component from shadCN UI for labeling form or UI elements
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // import select-related components from shadCN UI to create a dropdown menu for order status
import { useRestaurantStore } from "@/store/useRestaurantStore"; // import 'useRestaurantStore' custom hook to access and manage restaurant order data
import { useEffect } from "react"; // import 'useEffect' hook from react to handle side effects like fetching data

const Orders = () => { // define a functional component named 'Orders' to display and manage restaurant orders
    const { restaurantOrder, getRestaurantOrders, updateRestaurantOrder } = useRestaurantStore(); // extract 'restaurantOrder' array, 'getRestaurantOrders' fetch function, and 'updateRestaurantOrder' update function from 'useRestaurantStore' hook

    const handleStatusChange = async ( // define an async function 'handleStatusChange' to update the order status of a given order
        id: string, // unique identifier of the order whose status is to be updated
        status: string // new status value selected for the order
    ) => {
        await updateRestaurantOrder(id, status); // call 'updateRestaurantOrder' with the given order ID and new status to update backend/store data
    };

    useEffect(() => { // use 'useEffect' hook to trigger data fetching when the component first mounts
        getRestaurantOrders(); // call 'getRestaurantOrders' to fetch the latest list of orders from the backend or store
    }, []); // pass an empty dependency array so that the effect runs only once during the initial render

    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10">Orders Overview</h1>
            <div className="space-y-8">
                {restaurantOrder.map((order) => ( // iterate through each order object inside 'restaurantOrder' array and render order details
                    <div className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700" key={order._id}> 
                        <div className="flex-1 mb-6 sm:mb-0">
                            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {order.deliveryDetails.name} {/* display customer's name fetched from 'deliveryDetails' object of current order */}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-semibold">Address: </span>
                                {order.deliveryDetails.address} {/* display delivery address of current order */}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-semibold">Total Amount: </span>
                                {order.totalAmount / 100} {/* display total payable amount by dividing the stored value (in paise) by 100 to convert to rupees */}
                            </p>
                        </div>
                        <div className="w-full sm:w-1/3">
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Order Status
                            </Label>
                            <Select
                                onValueChange={(newStatus) => // trigger callback whenever a new value is selected in the dropdown
                                    handleStatusChange(order._id, newStatus) // invoke 'handleStatusChange' to update the selected order's status
                                }
                                defaultValue={order.status} // set the dropdown's initial value to the current order's existing status
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" /> {/* display placeholder text when no status is selected */}
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {[
                                            "Pending",
                                            "Confirmed",
                                            "Preparing",
                                            "OutForDelivery",
                                            "Delivered",
                                        ].map((status: string, index: number) => ( // iterate through predefined list of status options and render each as a selectable item
                                            <SelectItem key={index} value={status.toLowerCase()}> {/* use lowercase version of each status as the value */}
                                                {status} {/* display human-readable version of status in dropdown */}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders; // export 'Orders' component as default so it can be imported and used in other parts of the app