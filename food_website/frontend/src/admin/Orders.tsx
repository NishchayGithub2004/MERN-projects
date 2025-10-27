import { Label } from "@/components/ui/label"; // import Label component from shadCN UI
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // import these components from shadCN UI
import { useRestaurantStore } from "@/store/useRestaurantStore"; // import 'useRestaurantStore' hook
import { useEffect } from "react"; // import useEffect hook to run side effects

const Orders = () => { // create a functional component named 'Orders' that doesn't take any props
    const { restaurantOrder, getRestaurantOrders, updateRestaurantOrder } = useRestaurantStore(); // extract these values from the 'useRestaurantStore' hook

    const handleStatusChange = async (id: string, status: string) => { // create a function named 'handleStatusChange' that takes 'id' and 'status' as parameters in string format
        await updateRestaurantOrder(id, status); // call 'updateRestaurantOrder' function with 'id' and 'status' as parameters
    };

    useEffect(() => { // use useEffect hook to run side effect
        getRestaurantOrders(); // run 'getRestaurantOrders' function
    }, []); // run this effect only once when the component mounts by keeping dependency array empty
    
    return (
        <div className="max-w-6xl mx-auto py-10 px-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-10">Orders Overview</h1>
            <div className="space-y-8">
                {restaurantOrder.map((order) => ( // iterate over 'restaurantOrder' array as 'order'
                    <div className="flex flex-col md:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                        <div className="flex-1 mb-6 sm:mb-0">
                            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                                {order.deliveryDetails.name} {/* render value of current item's 'name' property present in 'deliveryDetails' object */}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-semibold">Address: </span>
                                {order.deliveryDetails.address} {/* render value of current item's 'address' property present in 'deliveryDetails' object */}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                <span className="font-semibold">Total Amount: </span>
                                {order.totalAmount / 100}
                            </p>
                        </div>
                        <div className="w-full sm:w-1/3">
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray300 mb-2">
                                Order Status
                            </Label>
                            <Select
                                onValueChange={(newStatus) => // when value of this field changes by selecting some other option
                                    handleStatusChange(order._id, newStatus) // call 'statusChange' function for current item's unique ID and new status
                                }
                                defaultValue={order.status} // set current item's current status as default value
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {/* iterate over the below 5 options as 'status' with their index as key and current item's value in lower case as it's value and render selection item for each item */}
                                        {[
                                            "Pending",
                                            "Confirmed",
                                            "Preparing",
                                            "OutForDelivery",
                                            "Delivered",
                                        ].map((status: string, index: number) => (
                                            <SelectItem key={index} value={status.toLowerCase()}>
                                                {status}
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

export default Orders;