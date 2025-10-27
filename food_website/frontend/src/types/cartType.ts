import type { MenuItem } from "./restaurantType"; // import the MenuItem type from restaurantType module to use as a base for cart items

export interface CartItem extends MenuItem { // define CartItem interface that extends MenuItem and adds cart-specific fields
    quantity: number; // number of this menu item added to the cart
}

export type CartState = { // define the shape of the cart state in the application and specify the following fields
    cart: CartItem[]; // array of CartItem objects representing all items currently in the cart
    addToCart: (item: MenuItem) => void; // function to add a MenuItem to the cart, does not return a value
    clearCart: () => void; // function to remove all items from the cart, does not return a value
    removeFromTheCart: (id: string) => void; // function to remove a specific item from the cart by its ID, does not return a value
    incrementQuantity: (id: string) => void; // function to increase the quantity of a specific cart item by its ID, does not return a value
    decrementQuantity: (id: string) => void; // function to decrease the quantity of a specific cart item by its ID, does not return a value
}
