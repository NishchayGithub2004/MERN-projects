import { clsx } from "clsx" // import the clsx function from the clsx library to conditionally join class names
import { twMerge } from "tailwind-merge" // import the twMerge function from tailwind-merge to merge Tailwind CSS class names intelligently

export function cn(...inputs) { // define a function cn that takes a rest parameter inputs to handle multiple class name arguments
  return twMerge( // call twMerge to intelligently merge class names
    clsx(inputs) // call clsx with inputs to combine conditional class names into a single string
  )
}