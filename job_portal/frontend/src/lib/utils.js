import { clsx } from "clsx"; // import clsx function to conditionally combine multiple class names into a single string
import { twMerge } from "tailwind-merge" // import twMerge function to intelligently merge Tailwind CSS class names, handling conflicts

export function cn(...inputs) { // define a function cn that takes a variable number of class name arguments to combine and merge them
  return twMerge(clsx(inputs)); // use clsx to combine inputs into a single class string, then pass it to twMerge to resolve Tailwind class conflicts and return the final class string
}
