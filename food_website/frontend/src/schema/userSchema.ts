import { z } from "zod"; // import the zod library to define and validate schemas

export const userSignupSchema = z.object({ // define a Zod object schema for user signup form validation
    fullname: z.string().min(1, "Fullname is required"), // require 'fullname' to be a string with minimum length 1 and provide a custom error message
    email: z.string().email("Invalid email address"), // require 'email' to be a valid email string with a custom error message
    password: z.string().min(6, "Password must be at least 6 characters."), // require 'password' to be a string with minimum length 6 and a custom error message
    contact: z.string() // require 'contact' to be a string
        .min(10, { message: "Contact number at least 10 digit" }) // enforce minimum length of 10 characters with a custom error message
        .max(10, "Contact number at most 10 digit") // enforce maximum length of 10 characters with a custom error message
});

export type SignupInputState = z.infer<typeof userSignupSchema>; // infer a TypeScript type from userSignupSchema for type safety in signup forms

export const userLoginSchema = z.object({ // define a Zod object schema for user login form validation
    email: z.string().email("Invalid email address"), // require 'email' to be a valid email string with a custom error message
    password: z.string().min(6, "Password must be at least 6 characters.") // require 'password' to be a string with minimum length 6 and a custom error message
});

export type LoginInputState = z.infer<typeof userLoginSchema>; // infer a TypeScript type from userLoginSchema for type safety in login forms
