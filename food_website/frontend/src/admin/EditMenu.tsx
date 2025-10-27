import { Button } from "@/components/ui/button"; // import 'Button' component from shadCN UI
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // import these dialog related components from shadCN UI
import { Input } from "@/components/ui/input"; // import 'Input' component from shadCN UI
import { Label } from "@/components/ui/label"; // import 'Label' component from shadCN UI
import { type MenuFormSchema, menuSchema } from "@/schema/menuSchema"; // import 'MenuFormSchema' to create menu related form fields and 'menuSchema' for validation of menu related form fields
import { useMenuStore } from "@/store/useMenuStore"; // import 'useMenuStore' hook to access menu related states and actions
import { type MenuItem } from "@/types/restaurantType"; // import 'MenuItem' type to create form fields for menu item
import { Loader2 } from "lucide-react"; // import 'Loader2' icon from lucide-react
import { type Dispatch, type FormEvent, type SetStateAction, useEffect, useState } from "react";
// import 'Dispatch' type to send actions to store to update redux states, 'FormEvent' type to handle form submission events, 'SetStateAction' type to update states made using 'useState' hook
// 'useEffect' hook to handle side effects, and 'useState' hook to manage states and their values

const EditMenu = ({ // create a functional component named 'EditMenu' to edit a menu item that takes following props
    selectedMenu,
    editOpen,
    setEditOpen,
}: {
    selectedMenu: MenuItem; // 'selectedMenu' that is a variable of 'MenuItem' type
    editOpen: boolean; // 'editOpen' that is a variable of 'boolean' type
    setEditOpen: Dispatch<SetStateAction<boolean>>; // 'setEditOpen' that is a function of 'Dispatch' type that dispatches function of type 'SetStateAction' to update boolean value present in redux store
}) => {
    const [input, setInput] = useState<MenuFormSchema>({ // create a state named 'input' of type 'MenuFormSchema' using 'useState' hook and a function 'setInput' to update it's state, 'input' contains following fields with the following initial values
        name: "", // 'name' with empty string as initial value
        description: "", // 'description' with empty string as initial value
        price: 0, // 'price' with 0 as initial value
        image: undefined, // 'image' with 'undefined' as initial value
    });
    
    const [error, setError] = useState<Partial<MenuFormSchema>>({}); // using 'useState' hook, create a variable 'error' of type 'MenuFormSchema' and 'setError' function to update the values present in 'MenuFormSchema' object
    // 'Partial' makes all the fields of 'MenuFormSchema' object optional for this particular state
    
    const { loading, editMenu } = useMenuStore(); // extract 'loading' and 'editMenu' from 'useMenuStore' hook

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // create a function named 'changeEventHandler' that takes that event object as argument that responds to change in value of form field
        const { name, value, type } = e.target; // extract 'name' 'value' and 'type' from event object ie form field
        setInput({ ...input, [name]: type === "number" ? Number(value) : value }); // use 'setInput' function to update the values of 'input' object
        /* using spread operator, copy pre-existing value of 'input' object and then check if value of 'type' is number ie if form field this function is called for takes numbers as input
        if it is, then convert new input value given to form field to number, otherwise leave it as is */
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => { // create a function named 'submitHandler' that takes form event object as argument that responds to form submission
        e.preventDefault(); // prevent default behavior of form submission so that form isn't submitted as soon as it is submitted, this is done so that some tasks can be done before form is submitted like form field validation
        
        const result = menuSchema.safeParse(input); // implement 'menuForm' form field validation in values of 'input' object
        
        if (!result.success) { // if validation fails
            const fieldErrors = result.error.flatten().fieldErrors; // flatten the nested error object returned due to failure of validation and using 'fieldErrors' extract the error message from the flattened error object
            setError(fieldErrors as Partial<MenuFormSchema>); // set 'error' to 'fieldErrors', but convert it to 'MenuFormSchema' type for type safety, 'Partial' makes all the fields of 'MenuFormSchema' object optional to have values for this particular state
            return; // return from function so that code below this line isn't executed
        }

        try {
            const formData = new FormData(); // create a new instance of 'FormData' object to store form field values
            
            formData.append("name", input.name); // append to field named 'name' the updaed value of 'name' field
            formData.append("description", input.description); // append to field named 'description' the updated value of 'description' field
            formData.append("price", input.price.toString()); // append to field named 'price' the updated value of 'price' field, convert the number to string before appending
            
            if (input.image) { // if image exists in input object
                formData.append("image", input.image); // append to field named 'image' the updated value of 'image' field
            }
            
            await editMenu(selectedMenu._id, formData); // call 'editMenu' function to edit the menu, '_id' is the unique identifier to signal the menu to edit/update, and 'formData' contains updated values
        } catch (error) { // catch any errors that occur during form submission
            console.log(error); // log them to the console for debugging purposes
        }
    };

    useEffect(() => { // create a side effect using 'useEffect' hook
        setInput({ // call 'setInput' function to update the values of 'input' object
            name: selectedMenu?.name || "", // set 'name' to value of 'name' field of 'selectedMenu' object if it exists, otherwise set it to empty string
            description: selectedMenu?.description || "", // set 'description' to value of 'description' field of 'selectedMenu' object if it exists, otherwise set it to empty string
            price: selectedMenu?.price || 0, // set 'price' to value of 'price' field of'selectedMenu' object if it exists, otherwise set it to 0
            image: undefined, // set 'image' to 'undefined'
        });
    }, [selectedMenu]); // write 'selectedMenu' in dependency array so that this side effect runs whenever value of'selectedMenu' changes
    
    return (
        <Dialog open={editOpen} onOpenChange={setEditOpen}> {/* this dialog box will only render if value of 'editOpen' is true and 'setEditOpen' is the function that manipulates the value of 'editOpen' */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Menu</DialogTitle>
                    <DialogDescription>
                        Update your menu to keep your offerings fresh and exciting!
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submitHandler} className="space-y-4"> {/* when this form is submitted, 'submitHandler' function will be called */}
                    <div>
                        <Label>Name</Label>
                        <Input
                            type="text"
                            name="name"
                            value={input.name}
                            onChange={changeEventHandler} // when value of this input field changes, then 'changeEventHandler' function will be called
                            placeholder="Enter menu name"
                        />
                        {error && <span className="text-xs font-medium text-red-600">{error.name}</span>} {/* if value of 'error' is not null ie any error occurs, only then render the value of 'name' present in 'error' object */}
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Input
                            type="text"
                            name="description"
                            value={input.description}
                            onChange={changeEventHandler} // when value of this input field changes, then 'changeEventHandler' function will be called
                            placeholder="Enter menu description"
                        />
                        {error && <span className="text-xs font-medium text-red-600">{error.description}</span>} {/* if value of 'error' is not null ie any error occurs, only then render the value of 'description' present in 'error' object */}
                    </div>
                    <div>
                        <Label>Price in (Rupees)</Label>
                        <Input
                            type="number"
                            name="price"
                            value={input.price}
                            onChange={changeEventHandler} // when value of this input field changes, then 'changeEventHandler' function will be called
                            placeholder="Enter menu price"
                        />
                        {error && <span className="text-xs font-medium text-red-600">{error.price}</span>} {/* if value of 'error' is not null ie any error occurs, only then render the value of 'price' present in 'error' object */}
                    </div>
                    <div>
                        <Label>Upload Menu Image</Label>
                        <Input
                            type="file"
                            name="image"
                            onChange={(e) =>
                                setInput({ ...input, image: e.target.files?.[0] || undefined }) // when value of this input field changes, then 'setInput' will be called to update this field to image uploaded to it
                                // [0] because image object is a nested array even with single image, if no image is uploaded, then set the value of this field to undefined
                            }
                        />
                        {error && <span className="text-xs font-medium text-red-600">{error.image?.name}</span>} {/* if value of 'error' is not null ie any error occurs, only then render the value of 'image' present in 'error' object */}
                    </div>
                    <DialogFooter className="mt-5">
                        {loading ? ( // render one of the two JSX below: first if 'loading' is true, otherwise second
                            <Button disabled className="bg-orange hover:bg-hoverOrange">
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button className="bg-orange hover:bg-hoverOrange">Submit</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditMenu;