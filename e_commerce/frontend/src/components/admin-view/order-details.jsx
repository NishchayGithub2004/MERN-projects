import { useState } from "react"; // import useState hook to manage component-level state
import CommonForm from "../common/form"; // import CommonForm component for rendering form UI
import { DialogContent } from "../ui/dialog"; // import DialogContent for displaying content inside a dialog/modal
import { Label } from "../ui/label"; // import Label component for displaying text labels
import { Separator } from "../ui/separator"; // import Separator component to visually divide sections
import { Badge } from "../ui/badge"; // import Badge component for displaying styled order status
import { useDispatch, useSelector } from "react-redux"; // import Redux hooks: useDispatch for dispatching actions, useSelector for accessing store state
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "@/store/admin/order-slice"; // import Redux action creators for admin order operations
import { useToast } from "../ui/use-toast"; // import useToast hook to show notifications to the user

const initialFormData = { // define an object representing initial form data for the order status form
    status: "", // default status is an empty string to represent no selection
};

function AdminOrderDetailsView({ orderDetails }) { // define AdminOrderDetailsView component with prop orderDetails containing selected order info
    const [formData, setFormData] = useState(initialFormData); // create state variable formData to store selected status, and setFormData to update it
    
    const { user } = useSelector((state) => state.auth); // extract user object from Redux auth slice using useSelector hook
    
    const dispatch = useDispatch(); // initialize dispatch function for sending Redux actions
    
    const { toast } = useToast(); // destructure toast function from useToast to trigger notification messages

    console.log(orderDetails, "orderDetailsorderDetails"); // log order details for debugging purposes

    function handleUpdateStatus(event) { // define handler for updating order status when form is submitted
        event.preventDefault(); // prevent default form submission behavior
        
        const { status } = formData; // extract selected status from form data

        dispatch( // dispatch Redux action to update order status
            updateOrderStatus({ id: orderDetails?._id, orderStatus: status }) // call updateOrderStatus with order ID and new status
        ).then((data) => { // handle the promise returned by dispatch since Redux Thunk actions return a promise
            if (data?.payload?.success) { // check if update was successful based on response payload
                dispatch(getOrderDetailsForAdmin(orderDetails?._id)); // refresh specific order details after update
                
                dispatch(getAllOrdersForAdmin()); // refresh the complete admin orders list
                
                setFormData(initialFormData); // reset form data to its initial state
                
                toast({ // display success message using toast notification
                    title: data?.payload?.message, // show success message from backend
                });
            }
        });
    }

    return (
        <DialogContent className="sm:max-w-[600px]">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex mt-6 items-center justify-between">
                        <p className="font-medium">Order ID</p>
                        <Label>{orderDetails?._id}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Date</p>
                        <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Price</p>
                        <Label>${orderDetails?.totalAmount}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Payment method</p>
                        <Label>{orderDetails?.paymentMethod}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Payment Status</p>
                        <Label>{orderDetails?.paymentStatus}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-medium">Order Status</p>
                        <Label>
                            <Badge
                                className={`py-1 px-3 ${orderDetails?.orderStatus === "confirmed"
                                        ? "bg-green-500"
                                        : orderDetails?.orderStatus === "rejected"
                                            ? "bg-red-600"
                                            : "bg-black"
                                    }`}
                            >
                                {orderDetails?.orderStatus}
                            </Badge>
                        </Label>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Order Details</div>
                        <ul className="grid gap-3">
                            {orderDetails?.cartItems && orderDetails?.cartItems.length > 0
                                ? orderDetails?.cartItems.map((item) => (
                                    <li className="flex items-center justify-between">
                                        <span>Title: {item.title}</span>
                                        <span>Quantity: {item.quantity}</span>
                                        <span>Price: ${item.price}</span>
                                    </li>
                                ))
                                : null}
                        </ul>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-medium">Shipping Info</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>{user.userName}</span>
                            <span>{orderDetails?.addressInfo?.address}</span>
                            <span>{orderDetails?.addressInfo?.city}</span>
                            <span>{orderDetails?.addressInfo?.pincode}</span>
                            <span>{orderDetails?.addressInfo?.phone}</span>
                            <span>{orderDetails?.addressInfo?.notes}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <CommonForm
                        formControls={[ // define form controls to pass into CommonForm for rendering a select dropdown
                            {
                                label: "Order Status", // label text for the select input
                                name: "status", // field name linked to formData.status
                                componentType: "select", // specify input type as dropdown
                                options: [ // provide options for possible order statuses
                                    { id: "pending", label: "Pending" },
                                    { id: "inProcess", label: "In Process" },
                                    { id: "inShipping", label: "In Shipping" },
                                    { id: "delivered", label: "Delivered" },
                                    { id: "rejected", label: "Rejected" },
                                ],
                            },
                        ]}
                        formData={formData} // pass current formData state to control input values
                        setFormData={setFormData} // pass state setter to allow form updates
                        buttonText={"Update Order Status"} // specify text for the submit button
                        onSubmit={handleUpdateStatus} // bind form submission to handleUpdateStatus function
                    />
                </div>
            </div>
        </DialogContent>
    );
}

export default AdminOrderDetailsView;
