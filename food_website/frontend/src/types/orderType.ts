export type CheckoutSessionRequest = { // define the structure of a checkout session request and specify the following fields
    cartItems: { // define the cartItems array containing details of each menu item
        menuId: string; // ID of the menu item in the database
        name: string; // name of the menu item
        image: string; // URL or path of the menu item's image
        price: string; // price of the menu item as a string
        quantity: string; // quantity of the menu item as a string
    }[],
    
    deliveryDetails: { // define deliveryDetails object containing customer info
        name: string; // name of the customer
        email: string; // email address of the customer
        contact: string; // contact number of the customer
        address: string; // street address for delivery
        city: string; // city for delivery
        country: string // country for delivery
    },

    restaurantId: string; // ID of the restaurant associated with the order
}

export interface Orders extends CheckoutSessionRequest { // define Orders interface that extends CheckoutSessionRequest and adds order-specific fields
    _id: string; // unique identifier for the order
    status: string; // current status of the order (e.g., pending, completed)
    totalAmount: number; // total numeric amount of the order
}

export type OrderState = { // define the shape of the order state in the application and specify the following fields
    loading: boolean; // indicates whether order-related operations are in progress
    orders: Orders[]; // array of Orders representing all fetched or stored orders
    createCheckoutSession: (checkoutSessionRequest: CheckoutSessionRequest) => Promise<void>; // async function to create a checkout session using the provided CheckoutSessionRequest, returns a Promise that resolves with no value (void) when the operation completes
    getOrderDetails: () => Promise<void>; // async function to fetch detailed information about orders, returns a Promise that resolves with no value (void) when fetching is complete
}
