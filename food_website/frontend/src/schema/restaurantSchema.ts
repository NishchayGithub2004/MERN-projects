import { z } from "zod"; // import the zod library to define and validate schemas

export const restaurantFromSchema = z.object({ // define a Zod object schema for restaurant form validation
    restaurantName: z.string().nonempty({ message: "Restaurant name is required" }), // require 'restaurantName' to be a non-empty string with a custom error message
    city: z.string().nonempty({ message: "City is required" }), // require 'city' to be a non-empty string with a custom error message
    country: z.string().nonempty({ message: "Country is required" }), // require 'country' to be a non-empty string with a custom error message
    deliveryTime: z.number().min(0, { message: "Delivery time can not be negative" }), // require 'deliveryTime' to be a number >= 0 with a custom error message if negative
    cuisines: z.array(z.string()), // require 'cuisines' to be an array of strings representing the restaurant's cuisines
    imageFile: z.instanceof(File).optional().refine( // define 'imageFile' as an optional File object with additional refinement
        (file) => file?.size !== 0, // ensure that if a File is provided, its size is not zero
        { message: "Image file is required" } // provide a custom error message if the refinement fails
    ),
});

export type RestaurantFormSchema = z.infer<typeof restaurantFromSchema>; // infer a TypeScript type from the restaurantFromSchema for type safety in forms and related code
