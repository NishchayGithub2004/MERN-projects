import { useEffect, useState } from "react"; // import React hooks
import { Button } from "../ui/button"; // import button component
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; // import card components
import { Dialog } from "../ui/dialog"; // import dialog component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"; // import table components
import ShoppingOrderDetailsView from "./order-details"; // import order details component
import { useDispatch, useSelector } from "react-redux"; // import Redux hooks
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice"; // import order-related actions
import { Badge } from "../ui/badge"; // import badge component

function ShoppingOrders() { // create functional component for displaying user's orders
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false); // manage state of order details dialog
    const dispatch = useDispatch(); // get dispatch function
    const { user } = useSelector((state) => state.auth); // get user object from Redux auth state
    const { orderList, orderDetails } = useSelector((state) => state.shopOrder); // get order list and order details from Redux shopOrder state

    function handleFetchOrderDetails(getId) { // fetch order details by order ID
        dispatch(getOrderDetails(getId)); // dispatch getOrderDetails action with order ID
    }

    useEffect(() => { // fetch all orders for user on component mount
        dispatch(getAllOrdersByUserId(user?.id)); // dispatch getAllOrdersByUserId with user ID
    }, [dispatch]); // dependency array contains dispatch

    useEffect(() => { // open details dialog when orderDetails state changes
        if (orderDetails !== null) setOpenDetailsDialog(true); // if orderDetails exist, open dialog
    }, [orderDetails]); // dependency array contains orderDetails

    console.log(orderDetails, "orderDetails"); // log orderDetails for debugging

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orderList && orderList.length > 0 // check if orderList exists and is non-empty
                            ? orderList.map((orderItem) => ( // iterate over orderList
                                <TableRow key={orderItem?._id}>
                                    <TableCell>{orderItem?._id}</TableCell> {/* display order ID */}
                                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell> {/* display order date (YYYY-MM-DD) */}
                                    <TableCell>
                                        <Badge
                                            className={`py-1 px-3 ${orderItem?.orderStatus === "confirmed" // check if order is confirmed
                                                    ? "bg-green-500" // apply green background for confirmed
                                                    : orderItem?.orderStatus === "rejected" // check if order is rejected
                                                        ? "bg-red-600" // apply red background for rejected
                                                        : "bg-black" // default background for other statuses
                                                }`}
                                        >
                                            {orderItem?.orderStatus} {/* display order status */}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${orderItem?.totalAmount}</TableCell> {/* display total amount */}
                                    <TableCell>
                                        <Dialog
                                            open={openDetailsDialog} // control dialog open state
                                            onOpenChange={() => { // handle dialog close
                                                setOpenDetailsDialog(false); // set dialog state to closed
                                                dispatch(resetOrderDetails()); // reset orderDetails state in Redux
                                            }}
                                        >
                                            <Button
                                                onClick={() =>
                                                    handleFetchOrderDetails(orderItem?._id) // fetch order details when button clicked
                                                }
                                            >
                                                View Details
                                            </Button>
                                            <ShoppingOrderDetailsView orderDetails={orderDetails} /> {/* pass orderDetails to details view componen0 */}t
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                            : null} {/* render null if orderList is empty */}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default ShoppingOrders; // export ShoppingOrders component
