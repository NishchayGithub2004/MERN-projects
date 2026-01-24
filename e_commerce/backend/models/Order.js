import mongoose from "mongoose"; // import mongoose library to define schemas and models for MongoDB interaction

const OrderSchema = new mongoose.Schema({ // create a new mongoose schema named OrderSchema to define the structure of order documents
    userId: String, // declare a 'userId' field of type String to store the ID of the user who placed the order
    cartId: String, // declare a 'cartId' field of type String to reference the cart associated with this order
    cartItems: [ // define an array called 'cartItems' to hold multiple products included in the order
        { // each object inside the array represents a product in the order
            productId: String, // declare a 'productId' field of type String to reference the product ID
            title: String, // declare a 'title' field of type String to store the product name or title
            image: String, // declare an 'image' field of type String to store the product image URL or path
            price: String, // declare a 'price' field of type String to store the product price at the time of purchase
            quantity: Number, // declare a 'quantity' field of type Number to store how many units of the product were ordered
        },
    ],
    addressInfo: { // define an object 'addressInfo' to store the shipping address details
        addressId: String, // declare 'addressId' field of type String to reference the saved address ID
        address: String, // declare 'address' field of type String to store the street or house address
        city: String, // declare 'city' field of type String to store the city name of the shipping address
        pincode: String, // declare 'pincode' field of type String to store the postal or ZIP code
        phone: String, // declare 'phone' field of type String to store the contact phone number for delivery
        notes: String, // declare 'notes' field of type String to store any extra delivery instructions or comments
    },
    orderStatus: String, // declare an 'orderStatus' field of type String to store the current status of the order (e.g., pending, shipped, delivered)
    paymentMethod: String, // declare a 'paymentMethod' field of type String to store how the user paid (e.g., PayPal, card, cash)
    paymentStatus: String, // declare a 'paymentStatus' field of type String to store whether payment is completed, pending, or failed
    totalAmount: Number, // declare a 'totalAmount' field of type Number to store the total cost of the order
    orderDate: Date, // declare an 'orderDate' field of type Date to record when the order was placed
    orderUpdateDate: Date, // declare an 'orderUpdateDate' field of type Date to track when the order was last updated
    paymentId: String, // declare a 'paymentId' field of type String to store the transaction or payment reference ID
    payerId: String, // declare a 'payerId' field of type String to store the ID of the payer in case of payment via PayPal or similar gateways
});

module.exports = mongoose.model("Order", OrderSchema); // create and export a mongoose model named 'Order' using the OrderSchema to interact with the 'orders' collection in MongoDB
