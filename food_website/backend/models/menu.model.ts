import mongoose, { Document } from "mongoose"; // import mongoose library for MongoDB interactions and Document type to extend TS interfaces

export interface IMenu { // define interface for menu structure to enforce type safety
    name: string; // name of the menu item as string
    description: string; // description of the menu item as string
    price: number; // price of the menu item as number
    image: string; // URL or path of the menu item image as string
}

export interface IMenuDocument extends IMenu, Document { // extend IMenu with mongoose Document to include MongoDB document properties
    createdAt: Date; // timestamp of when the document was created
    updatedAt: Date; // timestamp of when the document was last updated
}

const menuSchema = new mongoose.Schema<IMenuDocument>({ // create mongoose schema for menu documents with type safety from IMenuDocument
    name: { // define name field in schema
        type: String, // set type to String in MongoDB
        required: true // make the field mandatory
    },
    
    description: { // define description field in schema
        type: String, // set type to String in MongoDB
        required: true // make the field mandatory
    },
    
    price: { // define price field in schema
        type: Number, // set type to Number in MongoDB
        required: true // make the field mandatory
    },
    
    image: { // define image field in schema
        type: String, // set type to String in MongoDB
        required: true // make the field mandatory
    },
}, { timestamps: true }); // enable automatic createdAt and updatedAt timestamps in the schema

export const Menu = mongoose.model("Menu", menuSchema); // create and export mongoose model named "Menu" using the defined schema
