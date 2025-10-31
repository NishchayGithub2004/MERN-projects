import { Button } from "@/components/ui/button"; // import Button component from shadcn/ui library for creating interactive buttons in the UI
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // import dialog-related components from shadcn/ui library to create a modal for editing menu items
import { Input } from "@/components/ui/input"; // import Input component from shadcn/ui library to create input fields for form
import { Label } from "@/components/ui/label"; // import Label component from shadcn/ui library to label form fields
import { type MenuFormSchema, menuSchema } from "@/schema/menuSchema"; // import MenuFormSchema type for defining input field structure and menuSchema for validating those fields
import { useMenuStore } from "@/store/useMenuStore"; // import useMenuStore hook to access menu-related state and actions like editing a menu item
import { type MenuItem } from "@/types/restaurantType"; // import MenuItem type to represent each menu item object
import { Loader2 } from "lucide-react"; // import Loader2 icon from lucide-react to display loading animation
import { type Dispatch, type FormEvent, type SetStateAction, useEffect, useState } from "react"; // import Dispatch, FormEvent, and SetStateAction types for handling React state and form events, and import useEffect and useState hooks for state and lifecycle management

// define a functional component named 'EditMenu' to edit a menu item which takes following props
const EditMenu = ({
    selectedMenu, // represents the currently selected menu item to be edited
    editOpen, // represents a boolean indicating if the edit dialog is open
    setEditOpen, // represents a dispatch function to toggle the edit dialog visibility
}: {
    selectedMenu: MenuItem; // define selectedMenu prop as a MenuItem type to pass the menu data
    editOpen: boolean; // define editOpen prop as a boolean to indicate dialog visibility
    setEditOpen: Dispatch<SetStateAction<boolean>>; // define setEditOpen prop as a function to update editOpen state
}) => {
    const [input, setInput] = useState<MenuFormSchema>({ // create a state named input with type MenuFormSchema and a setter function setInput to manage form values
        name: "", // initialize name field as empty string
        description: "", // initialize description field as empty string
        price: 0, // initialize price field with value 0
        image: undefined, // initialize image field as undefined
    });

    const [error, setError] = useState<Partial<MenuFormSchema>>({}); // create error state with Partial<MenuFormSchema> type so each field can optionally hold error messages

    const { loading, editMenu } = useMenuStore(); // destructure loading and editMenu from useMenuStore hook to manage loading state and perform edit operations

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // define changeEventHandler function to handle input field changes dynamically
        const { name, value, type } = e.target; // extract name, value, and type from input element
        setInput({ ...input, [name]: type === "number" ? Number(value) : value }); // update input state by copying previous values and converting number fields appropriately
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => { // define async submitHandler function to manage form submission
        e.preventDefault(); // prevent default form submission behavior to manually handle validation and submission
        const result = menuSchema.safeParse(input); // validate input values using menuSchema's safeParse method

        if (!result.success) { // check if validation failed
            const fieldErrors = result.error.flatten().fieldErrors; // flatten nested validation errors to access field-specific error messages
            setError(fieldErrors as Partial<MenuFormSchema>); // update error state with validation messages
            return; // stop further code execution if validation fails
        }

        try {
            const formData = new FormData(); // create new FormData instance to append validated form data
            formData.append("name", input.name); // append name field to formData
            formData.append("description", input.description); // append description field to formData
            formData.append("price", input.price.toString()); // append price field as string to formData
            if (input.image) formData.append("image", input.image); // append image field only if image is provided
            await editMenu(selectedMenu._id, formData); // call editMenu function with selected menu ID and formData to update menu
        } catch (error) { // catch errors that may occur during async form submission
            console.log(error); // log the caught error to console for debugging
        }
    };

    useEffect(() => { // use useEffect to synchronize selectedMenu data with input state whenever selectedMenu changes
        setInput({
            name: selectedMenu?.name || "", // set name field to selectedMenu name or fallback to empty string
            description: selectedMenu?.description || "", // set description field to selectedMenu description or fallback to empty string
            price: selectedMenu?.price || 0, // set price field to selectedMenu price or fallback to 0
            image: undefined, // reset image field to undefined
        });
    }, [selectedMenu]); // add selectedMenu in dependency array so this effect runs when selectedMenu changes

    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Menu</DialogTitle>
                    <DialogDescription>
                        Update your menu to keep your offerings fresh and exciting!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitHandler} className="space-y-4">
                    <div>
                        <Label>Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler} // handle input change by invoking changeEventHandler to update name field value
                            placeholder="Enter menu name"
                        />
                        {error && <span className="text-xs font-medium text-red-600">{error.name}</span>} // display error message for name field if it exists
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Input
                            type="text"
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler} // handle input change by invoking changeEventHandler to update description field value
                            placeholder="Enter menu description"
                        />
                        {error && <span className="text-xs font-medium text-red-600">{error.description}</span>} // display error message for description field if it exists
                    </div>
                    <div>
                        <Label>Price in (Rupees)</Label>
                        <Input
                            type="number"
                            name="price"
                            value={input.price}
                            onChange={changeEventHandler} // handle input change by invoking changeEventHandler to update price field value
                            placeholder="Enter menu price"
                        />
                        {error && <span className="text-xs font-medium text-red-600">{error.price}</span>} // display error message for price field if it exists
                    </div>
                    <div>
                        <Label>Upload Menu Image</Label>
                        <Input
                            type="file"
                            name="image"
                            onChange={(e) =>
                                setInput({ ...input, image: e.target.files?.[0] || undefined }) // update input image field to uploaded file or undefined if no file selected
                            }
                        />
                        {error && <span className="text-xs font-medium text-red-600">{error.image?.name}</span>} // display error message for image field if it exists
                    </div>
                    <DialogFooter className="mt-5">
                        {loading ? ( // conditionally render loading or submit button based on loading state
                            <Button disabled className="bg-orange hover:bg-hoverOrange">
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> // display spinning loader icon during loading
                                Please wait
                            </Button>
                        ) : (
                            <Button className="bg-orange hover:bg-hoverOrange">Submit</Button> // render submit button when not loading
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditMenu; // export EditMenu component as default export for reuse in other parts of the application