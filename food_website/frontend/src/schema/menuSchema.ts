import { z } from "zod"; // import the zod library to define and validate schemas

export const menuSchema = z.object({ // define a Zod object schema for menu form validation
    name: z.string().nonempty({ message: "Name is required" }), // require 'name' to be a non-empty string and provide a custom error message
    description: z.string().nonempty({ message: "description is required" }), // require 'description' to be a non-empty string with a custom error message
    price: z.number().min(0, { message: "Price can not be negative" }), // require 'price' to be a number with a minimum value of 0 and custom error message if negative
    image: z.instanceof(File).optional().refine( // define 'image' as an optional File object and apply a custom refinement
        (file) => file?.size !== 0, // refine validation to ensure that if a File is provided, its size is not zero
        { message: "Image file is required" } // custom error message if refinement fails
    ),
});

export type MenuFormSchema = z.infer<typeof menuSchema>; // infer a TypeScript type from the menuSchema to use in forms and type checking
