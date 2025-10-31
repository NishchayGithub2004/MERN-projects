import { Button } from "@/components/ui/button"; // import Button component from shadcn/ui library to render styled button elements
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // import dialog-related components from shadcn/ui library to create modal dialog for adding menu
import { Input } from "@/components/ui/input"; // import Input component from shadcn/ui library for text and number input fields
import { Label } from "@/components/ui/label"; // import Label component from shadcn/ui library for labeling input fields
import { Loader2, Plus } from "lucide-react"; // import Loader2 and Plus icons from lucide-react for showing loading state and add icon
import React, { type FormEvent, useState } from "react"; // import React for JSX, useState for managing component states, and FormEvent type for handling form submission
import EditMenu from "./EditMenu"; // import EditMenu component for editing existing menu items
import { type MenuFormSchema, menuSchema } from "@/schema/menuSchema"; // import MenuFormSchema type for defining input structure and menuSchema for validation
import { useMenuStore } from "@/store/useMenuStore"; // import useMenuStore hook to manage menu-related state and actions like creating menu
import { useRestaurantStore } from "@/store/useRestaurantStore"; // import useRestaurantStore hook to manage restaurant-related state like menus

const AddMenu = () => { // define functional component AddMenu to handle creation and editing of restaurant menus
    const [input, setInput] = useState<MenuFormSchema>({ // create state input of type MenuFormSchema and function setInput to update its values
        name: "", // initialize name field as empty string
        description: "", // initialize description field as empty string
        price: 0, // initialize price field with value 0
        image: undefined, // initialize image field as undefined
    });

    const [open, setOpen] = useState<boolean>(false); // create boolean state open to manage add-menu dialog visibility
    const [editOpen, setEditOpen] = useState<boolean>(false); // create boolean state editOpen to manage edit-menu dialog visibility
    const [selectedMenu, setSelectedMenu] = useState<any>(); // create selectedMenu state to hold currently selected menu for editing
    const [error, setError] = useState<Partial<MenuFormSchema>>({}); // create error state with Partial<MenuFormSchema> type to hold field-specific validation messages

    const { loading, createMenu } = useMenuStore(); // destructure loading and createMenu from useMenuStore to manage loading state and perform menu creation
    const { restaurant } = useRestaurantStore(); // destructure restaurant from useRestaurantStore to access current restaurant data

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // define changeEventHandler function to handle input field updates dynamically
        const { name, value, type } = e.target; // extract name, value, and type from input field element
        setInput({ ...input, [name]: type === "number" ? Number(value) : value }); // update input state, converting numeric fields appropriately before storing
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => { // define async submitHandler function to handle menu form submission
        e.preventDefault(); // prevent default form submission to manually handle validation and data sending

        const result = menuSchema.safeParse(input); // validate input fields using menuSchema

        if (!result.success) { // check if validation failed
            const fieldErrors = result.error.flatten().fieldErrors; // flatten nested validation error structure to extract field-specific errors
            setError(fieldErrors as Partial<MenuFormSchema>); // update error state with extracted field errors
            return; // stop function execution to avoid submitting invalid data
        }

        try {
            const formData = new FormData(); // create new FormData instance to send form values as multipart/form-data
            formData.append("name", input.name); // append name field value to formData
            formData.append("description", input.description); // append description field value to formData
            formData.append("price", input.price.toString()); // append price field as string to formData
            if (input.image) formData.append("image", input.image); // append image only if an image file exists
            await createMenu(formData); // call createMenu function with formData to create a new menu in store
        } catch (error) { // handle any unexpected errors during async operation
            console.log(error); // log error to console for debugging
        }
    };

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="flex justify-between">
                <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
                    Available Menus
                </h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger>
                        <Button className="bg-orange hover:bg-hoverOrange">
                            <Plus className="mr-2" /> {/* render plus icon beside Add Menus text */}
                            Add Menus
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add A New Menu</DialogTitle>
                            <DialogDescription>
                                Create a menu that will make your restaurant stand out.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={submitHandler} className="space-y-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={input.name}
                                    onChange={changeEventHandler} // handle input change by invoking changeEventHandler for name field
                                    placeholder="Enter menu name"
                                />
                                {error && <span className="text-xs font-medium text-red-600">{error.name}</span>} // display validation error message for name field if any
                            </div>
                            <div>
                                <Label>Description</Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler} // handle input change by invoking changeEventHandler for description field
                                    placeholder="Enter menu description"
                                />
                                {error && <span className="text-xs font-medium text-red-600">{error.description}</span>} // display validation error message for description field if any
                            </div>
                            <div>
                                <Label>Price in (Rupees)</Label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={input.price}
                                    onChange={changeEventHandler} // handle input change by invoking changeEventHandler for price field
                                    placeholder="Enter menu price"
                                />
                                {error && <span className="text-xs font-medium text-red-600">{error.price}</span>} // display validation error message for price field if any
                            </div>
                            <div>
                                <Label>Upload Menu Image</Label>
                                <Input
                                    type="file"
                                    name="image"
                                    onChange={(e) =>
                                        setInput({ ...input, image: e.target.files?.[0] || undefined }) // update input state to selected file or undefined if no file selected
                                    }
                                />
                                {error && <span className="text-xs font-medium text-red-600">{error.image?.name}</span>} // display validation error message for image field if any
                            </div>
                            <DialogFooter className="mt-5">
                                {loading ? ( // conditionally render loading or submit button based on loading state
                                    <Button disabled className="bg-orange hover:bg-hoverOrange">
                                        <Loader2 className="mr-2 w-4 h-4 animate-spin" /> {/* render loader icon when loading is true */}
                                        Please wait
                                    </Button>
                                ) : (
                                    <Button className="bg-orange hover:bg-hoverOrange">Submit</Button> // render submit button when not loading
                                )}
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            {restaurant?.menus.map((menu: any, idx: number) => ( // iterate through menus array of restaurant and render each menu item with unique key
                <div key={idx} className="mt-6 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 md:p-4 p-2 shadow-md rounded-lg border">
                        <img
                            src={menu.image} // display menu image for current item
                            alt=""
                            className="md:h-24 md:w-24 h-16 w-full object-cover rounded-lg"
                        />
                        <div className="flex-1">
                            <h1 className="text-lg font-semibold text-gray-800">{menu.name}</h1> {/* display name of current menu item */}
                            <p className="text-sm tex-gray-600 mt-1">{menu.description}</p> {/* display description of current menu item */}
                            <h2 className="text-md font-semibold mt-2">Price: <span className="text-[#D19254]">80</span></h2> {/* display price of current menu item */}
                        </div>
                        <Button
                            onClick={() => { // define onClick handler to trigger editing mode for selected menu
                                setSelectedMenu(menu); // set selectedMenu to current menu item
                                setEditOpen(true); // set editOpen to true to open EditMenu component for current menu
                            }}
                            size={"sm"}
                            className="bg-orange hover:bg-hoverOrange mt-2"
                        >
                            Edit
                        </Button>
                    </div>
                </div>
            ))}
            <EditMenu
                selectedMenu={selectedMenu} // pass selected menu item to EditMenu component
                editOpen={editOpen} // pass editOpen state to control EditMenu visibility
                setEditOpen={setEditOpen} // pass setEditOpen to allow EditMenu to close itself
            />
        </div>
    );
};

export default AddMenu; // export AddMenu component as default export for use in other parts of the app