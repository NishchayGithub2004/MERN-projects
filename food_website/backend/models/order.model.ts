import mongoose, { Document } from "mongoose"; // import mongoose for MongoDB interactions and Document type for TS interface extension

type DeliveryDetails = { // define type for delivery details of an order
    email: string; // customer's email as string
    name: string; // customer's name as string
    address: string; // delivery address as string
    city: string; // city of delivery as string
}

type CartItems = { // define type for items in the cart
    menuId: string; // reference to menu item's ID as string
    name: string; // name of the menu item as string
    image: string; // image URL or path of the menu item as string
    price: number; // price of a single item as number
    quantity: number; // quantity of the item in the order as number
}

export interface IOrder extends Document { // define interface for order documents extending mongoose Document
    user: mongoose.Schema.Types.ObjectId; // reference to the user who placed the order
    restaurant: mongoose.Schema.Types.ObjectId; // reference to the restaurant for the order
    deliveryDetails: DeliveryDetails; // embed delivery details using the DeliveryDetails type
    cartItems: CartItems; // embed cart items using the CartItems type
    totalAmount: number; // total amount of the order as number
    status: "pending" | "confirmed" | "preparing" | "outfordelivery" | "delivered"; // enum for order status
}

const orderSchema = new mongoose.Schema<IOrder>({ // create mongoose schema for orders with type safety from IOrder
    user: { // define user field in schema
        type: mongoose.Schema.Types.ObjectId, // set type to ObjectId to reference User
        ref: 'User', // reference the User collection
        required: true // make the field mandatory
    },
    
    restaurant: { // define restaurant field in schema
        type: mongoose.Schema.Types.ObjectId, // set type to ObjectId to reference Restaurant
        ref: 'Restaurant', // reference the Restaurant collection
        required: true // make the field mandatory
    },
    
    deliveryDetails: { // define deliveryDetails as an embedded object
        email: { type: String, required: true }, // set email as required string
        name: { type: String, required: true }, // set name as required string
        address: { type: String, required: true }, // set address as required string
        city: { type: String, required: true }, // set city as required string
    },
    
    cartItems: [ // define cartItems as an array of embedded objects
        {
            menuId: { type: String, required: true }, // set menuId as required string
            name: { type: String, required: true }, // set name as required string
            image: { type: String, required: true }, // set image as required string
            price: { type: Number, required: true }, // set price as required number
            quantity: { type: Number, required: true }, // set quantity as required number
        }
    ],
    
    totalAmount: Number, // define totalAmount as number without mandatory requirement
    
    status: { // define status field with allowed enum values
        type: String, // set type to String
        enum: ["pending", "confirmed", "preparing", "outfordelivery", "delivered"], // restrict values to predefined statuses
        required: true // make the field mandatory
    }
}, { timestamps: true }); // enable automatic createdAt and updatedAt timestamps

export const Order = mongoose.model("Order", orderSchema); // create and export mongoose model named "Order" using the defined schema
