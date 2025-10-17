import { clsx } from "clsx"; // import the clsx function from the 'clsx' library to conditionally join class names into a single string
import { twMerge } from "tailwind-merge"; // import the twMerge function from the 'tailwind-merge' library to intelligently merge tailwind css classes by removing conflicts

export function cn( // define a function named cn to combine and merge class names
    ...inputs // use rest parameter 'inputs' to collect all provided arguments into an array so multiple class names can be passed
) {
    return twMerge( // return the result of calling twMerge to merge tailwind class names
        clsx(inputs) // call clsx with the array 'inputs' to convert conditional class names into a single string before passing it to twMerge
    );
}
