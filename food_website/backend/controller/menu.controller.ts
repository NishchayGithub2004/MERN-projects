import { Request, Response } from "express"; // import Request and Response types from express to type the request and response objects
import uploadImageOnCloudinary from "../utils/imageUpload"; // import the function to upload images to Cloudinary
import { Menu } from "../models/menu.model"; // import the Menu model to interact with the menu collection in the database
import { Restaurant } from "../models/restaurant.model"; // import the Restaurant model to interact with the restaurant collection in the database
import mongoose from "mongoose"; // import mongoose for database object types and operations

export const addMenu = async (req: Request, res: Response) => { // define an asynchronous function to add a new menu, typed with Request and Response
    try { // start try block to handle potential errors during the menu creation process
        const { name, description, price } = req.body; // destructure name, description, and price from the request body

        const file = (req as any).file; // extract the uploaded file from the request, casting req to any to access the file property

        if (!file) { // check if no file was uploaded
            return res.status(400).json({ // return a 400 Bad Request response if image is missing
                success: false, // indicate failure in response
                message: "Image is required" // provide a descriptive error message
            })
        };

        const imageUrl = await uploadImageOnCloudinary(file as any); // upload the image file to Cloudinary and await the returned URL

        const menu: any = await Menu.create({ // create a new menu document in the database and await the result
            name, // assign name from request body
            description, // assign description from request body
            price, // assign price from request body
            image: imageUrl // assign the uploaded image URL to the image field
        });

        const restaurant = await Restaurant.findOne({ user: (req as any).id }); // find the restaurant document associated with the current user id

        if (restaurant) { // check if the restaurant exists
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id); // push the new menu's ObjectId into the restaurant's menus array
            await restaurant.save(); // save the updated restaurant document to persist the new menu association
        }

        return res.status(201).json({ // return a 201 Created response indicating successful menu addition
            success: true, // indicate success in response
            message: "Menu added successfully", // provide a success message
            menu // return the newly created menu object in the response
        });
    } catch (error) { // catch any errors thrown during the process
        console.log(error); // log the error for debugging purposes
        return res.status(500).json({ message: "Internal server error" }); // return a 500 Internal Server Error response
    }
}

export const editMenu = async (req: Request, res: Response) => { // define an asynchronous function to edit an existing menu, typed with Request and Response
    try { // start try block to handle potential errors during menu editing
        const { id } = req.params; // destructure id from request parameters to identify which menu to edit

        const { name, description, price } = req.body; // destructure name, description, and price from the request body for potential updates

        const file = (req as any).file; // extract the uploaded file from the request, casting req to any to access the file property

        const menu = await Menu.findById(id); // find the menu document in the database by its id and await the result

        if (!menu) { // check if the menu was not found
            return res.status(404).json({ // return a 404 Not Found response if the menu does not exist
                success: false, // indicate failure in response
                message: "Menu not found!" // provide a descriptive error message
            })
        }

        if (name) menu.name = name; // if a new name is provided in the request body, update the menu's name

        if (description) menu.description = description; // if a new description is provided, update the menu's description

        if (price) menu.price = price; // if a new price is provided, update the menu's price

        if (file) { // check if a new image file is uploaded
            const imageUrl = await uploadImageOnCloudinary(file as any); // upload the new image to Cloudinary and await the returned URL
            menu.image = imageUrl; // update the menu's image field with the new image URL
        }

        await menu.save(); // save the updated menu document to persist changes in the database

        return res.status(200).json({ // return a 200 OK response indicating successful menu update
            success: true, // indicate success in response
            message: "Menu updated", // provide a success message
            menu, // return the updated menu object in the response
        })
    } catch (error) { // catch any errors thrown during the process
        console.log(error); // log the error for debugging purposes
        return res.status(500).json({ message: "Internal server error" }); // return a 500 Internal Server Error response
    }
}