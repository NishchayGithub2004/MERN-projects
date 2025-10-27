import mongoose, { Document } from "mongoose"; // import mongoose for MongoDB interactions and Document type for TS interface extension

export interface IRestaurant { // define interface for restaurant structure to enforce type safety
    user: mongoose.Schema.Types.ObjectId; // reference to the user who owns the restaurant
    restaurantName: string; // name of the restaurant as string
    city: string; // city where the restaurant is located as string
    country: string; // country where the restaurant is located as string
    deliveryTime: number; // estimated delivery time in minutes as number
    cuisines: string[]; // array of cuisine types offered as strings
    imageUrl: string; // URL or path of the restaurant image as string
    menus: mongoose.Schema.Types.ObjectId[]; // array of references to Menu documents
}

export interface IRestaurantDocument extends IRestaurant, Document { // extend IRestaurant with mongoose Document to include MongoDB document properties
    createdAt: Date; // timestamp of when the document was created
    updatedAt: Date; // timestamp of when the document was last updated
}

const restaurantSchema = new mongoose.Schema<IRestaurantDocument>({ // create mongoose schema for restaurants with type safety from IRestaurantDocument
    user: { // define user field in schema
        type: mongoose.Schema.Types.ObjectId, // set type to ObjectId to reference User
        ref: "User", // reference the User collection
        required: true // make the field mandatory
    },
    
    restaurantName: { // define restaurantName field in schema
        type: String, // set type to String
        required: true // make the field mandatory
    },
    
    city: { // define city field in schema
        type: String, // set type to String
        required: true // make the field mandatory
    },
    
    country: { // define country field in schema
        type: String, // set type to String
        required: true // make the field mandatory
    },
    
    deliveryTime: { // define deliveryTime field in schema
        type: Number, // set type to Number
        required: true // make the field mandatory
    },
    
    cuisines: [{ type: String, required: true }], // define cuisines as an array of strings and make each string mandatory
    
    menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu' }], // define menus as an array of ObjectId references to Menu documents
    
    imageUrl: { // define imageUrl field in schema
        type: String, // set type to String
        required: true // make the field mandatory
    }
}, { timestamps: true }); // enable automatic createdAt and updatedAt timestamps

export const Restaurant = mongoose.model("Restaurant", restaurantSchema); // create and export mongoose model named "Restaurant" using the defined schema
