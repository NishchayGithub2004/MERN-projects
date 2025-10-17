import { clsx } from "clsx" // import the clsx function from the clsx library to conditionally join class names
import { twMerge } from "tailwind-merge" // import the twMerge function from tailwind-merge to merge Tailwind CSS class names intelligently

export function cn(...inputs) { // define a function cn that takes a rest parameter inputs to handle multiple class name arguments
  return twMerge( // call twMerge to intelligently merge class names
    clsx(inputs) // call clsx with inputs to combine conditional class names into a single string
  )
}

export const readFileAsDataURL = (file) => { // define a constant arrow function readFileAsDataURL that takes a file argument to read and convert it into a data URL
  return new Promise((resolve) => { // return a new Promise that resolves when the file is fully read
    const reader = new FileReader(); // create a new FileReader instance to read the contents of the file
    reader.onloadend = () => { // define an event handler for when file reading is complete
      if (typeof reader.result === 'string') resolve(reader.result); // check if the reader result is a string and resolve the Promise with that string result
    }
    reader.readAsDataURL(file); // call readAsDataURL with the file argument to read the file content as a base64-encoded data URL
  })
}
