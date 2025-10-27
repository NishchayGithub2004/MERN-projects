import type { Orders } from "./orderType"; // import the Orders type from the orderType module for use in restaurant order management

export type MenuItem = { // define the structure of a menu item and specify the following fields
    _id: string; // unique identifier of the menu item
    name: string; // name of the menu item
    description: string; // detailed description of the menu item
    price: number; // numeric price of the menu item
    image: string; // URL or path of the menu item's image
}

export type Restaurant = { // define the structure of a restaurant and specify the following fields
    _id: string; // unique identifier of the restaurant
    user: string; // ID of the user who owns or manages the restaurant
    restaurantName: string; // name of the restaurant
    city: string; // city where the restaurant is located
    country: string; // country where the restaurant is located
    deliveryTime: number; // estimated delivery time in minutes
    cuisines: string[]; // array of cuisines offered by the restaurant
    menus: MenuItem[]; // array of MenuItem objects representing the restaurant's menu
    imageUrl: string; // URL of the restaurant's image or logo
}

export type SearchedRestaurant = { // define the structure for searched restaurant results
    data: Restaurant[] // array of Restaurant objects returned from a search
}

export type RestaurantState = { // define the shape of the restaurant state in the application and specify the following fields
    loading: boolean; // indicates whether restaurant-related operations are in progress
    restaurant: Restaurant | null; // currently selected or fetched restaurant, or null if none
    searchedRestaurant: SearchedRestaurant | null; // stores the results of a restaurant search, or null if none
    appliedFilter: string[]; // array of currently applied filters for restaurant searches
    singleRestaurant: Restaurant | null; // stores details of a single restaurant, or null if none
    restaurantOrder: Orders[]; // array of Orders associated with the restaurant
    createRestaurant: (formData: FormData) => Promise<void>; // async function to create a restaurant using FormData, returns a Promise that resolves with no value when done
    getRestaurant: () => Promise<void>; // async function to fetch restaurant data, returns a Promise that resolves with no value when done
    updateRestaurant: (formData: FormData) => Promise<void>; // async function to update restaurant data using FormData, returns a Promise that resolves with no value when done
    searchRestaurant: (searchText: string, searchQuery: string, selectedCuisines: any) => Promise<void>; // async function to search restaurants with text, query, and selected cuisines, returns a Promise that resolves with no value when done
    addMenuToRestaurant: (menu: MenuItem) => void; // function to add a new MenuItem to the restaurant's menu, does not return a value
    updateMenuToRestaurant: (menu: MenuItem) => void; // function to update an existing MenuItem in the restaurant's menu, does not return a value
    setAppliedFilter: (value: string) => void; // function to set a single applied filter value, does not return a value
    resetAppliedFilter: () => void; // function to clear all applied filters, does not return a value
    getSingleRestaurant: (restaurantId: string) => Promise<void>; // async function to fetch a single restaurant by ID, returns a Promise that resolves with no value when done
    getRestaurantOrders: () => Promise<void>; // async function to fetch all orders for the restaurant, returns a Promise that resolves with no value when done
    updateRestaurantOrder: (orderId: string, status: string) => Promise<void>; // async function to update the status of a specific order by ID, returns a Promise that resolves with no value when done
}
