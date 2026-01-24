import { useEffect, useState } from "react"; // import useEffect and useState hooks to handle side effects and component state
import { Button } from "../ui/button"; // import Button component for UI interaction
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; // import Card components to structure the UI
import { Dialog } from "../ui/dialog"; // import Dialog component to display modal dialogs
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"; // import Table components for displaying order data in tabular form
import AdminOrderDetailsView from "./order-details"; // import AdminOrderDetailsView component to show order details inside the dialog
import { useDispatch, useSelector } from "react-redux"; // import Redux hooks to dispatch actions and access state
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice"; // import Redux actions for managing admin order data
import { Badge } from "../ui/badge"; // import Badge component for showing status labels

function AdminOrdersView() { // define functional component AdminOrdersView
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false); // create state 'openDetailsDialog' to control whether the order details dialog is visible

    const { orderList, orderDetails } = useSelector((state) => state.adminOrder); // use Redux selector to extract 'orderList' and 'orderDetails' from adminOrder slice of the global state

    const dispatch = useDispatch(); // create dispatch function to send actions to Redux store

    function handleFetchOrderDetails(getId) { // define function to fetch specific order details, takes 'getId' as the order ID argument
        dispatch(getOrderDetailsForAdmin(getId)); // dispatch action 'getOrderDetailsForAdmin' with 'getId' to load specific order details
    }

    useEffect(() => { // useEffect runs after the component mounts
        dispatch(getAllOrdersForAdmin()); // dispatch action to fetch all admin orders when component loads
    }, [dispatch]); // dependency array includes dispatch so it runs only once unless dispatch reference changes

    console.log(orderDetails, "orderList"); // log orderDetails to console for debugging purpose

    useEffect(() => { // useEffect runs whenever 'orderDetails' changes
        if (orderDetails !== null) setOpenDetailsDialog(true); // open details dialog automatically when orderDetails is set (not null)
    }, [orderDetails]); // dependency array ensures it runs when orderDetails updates

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
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
                        {orderList && orderList.length > 0
                            ? orderList.map((orderItem) => ( // iterate through orderList array and render each order item
                                <TableRow>
                                    <TableCell>{orderItem?._id}</TableCell>
                                    <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell> {/* split order date string to display only date part */}
                                    <TableCell>
                                        <Badge
                                            className={`py-1 px-3 ${orderItem?.orderStatus === "confirmed"
                                                    ? "bg-green-500"
                                                    : orderItem?.orderStatus === "rejected"
                                                        ? "bg-red-600"
                                                        : "bg-black"
                                                }`}
                                        >
                                            {orderItem?.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${orderItem?.totalAmount}</TableCell>
                                    <TableCell>
                                        <Dialog
                                            open={openDetailsDialog} // bind Dialog visibility to openDetailsDialog state
                                            onOpenChange={() => { // handle dialog open/close state change
                                                setOpenDetailsDialog(false); // close dialog when user closes it manually
                                                dispatch(resetOrderDetails()); // reset order details in Redux store when dialog closes
                                            }}
                                        >
                                            <Button
                                                onClick={() =>
                                                    handleFetchOrderDetails(orderItem?._id) // call handleFetchOrderDetails with order ID when user clicks 'View Details'
                                                }
                                            >
                                                View Details
                                            </Button>
                                            <AdminOrderDetailsView orderDetails={orderDetails} /> {/* render order details component and pass orderDetails as prop */}
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                            : null} {/* handle empty order list case */}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default AdminOrdersView;
