import { Button } from "@/components/ui/button"; // import 'Button' component from shadCN UI for form submission buttons
import { Input } from "@/components/ui/input"; // import 'Input' component from shadCN UI for text and number fields
import { Label } from "@/components/ui/label"; // import 'Label' component from shadCN UI for field labeling
import { type RestaurantFormSchema, restaurantFromSchema } from "@/schema/restaurantSchema"; // import 'RestaurantFormSchema' type for structure and 'restaurantFromSchema' for validation
import { useRestaurantStore } from "@/store/useRestaurantStore"; // import 'useRestaurantStore' custom hook to manage restaurant-related states and actions
import { Loader2 } from "lucide-react"; // import 'Loader2' icon from lucide-react for loading indicator
import { type FormEvent, useEffect, useState } from "react"; // import 'FormEvent' type for event typing, 'useEffect' for side effects, and 'useState' for state management

const Restaurant = () => { // define functional component 'Restaurant' to handle creation and update of restaurant details
    const [input, setInput] = useState<RestaurantFormSchema>({ // initialize 'input' state with fields from 'RestaurantFormSchema' to store form input values
        restaurantName: "", // set initial restaurant name as empty string
        city: "", // set initial city as empty string
        country: "", // set initial country as empty string
        deliveryTime: 0, // set initial delivery time as 0
        cuisines: [], // set initial cuisines array as empty
        imageFile: undefined, // set initial image file as undefined
    });

    const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({}); // create 'errors' state to store form validation errors, using 'Partial' to make all fields optional

    const { loading, restaurant, updateRestaurant, createRestaurant, getRestaurant } = useRestaurantStore(); // destructure 'loading', 'restaurant' object, and related CRUD functions from store hook

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // define 'changeEventHandler' to handle input field changes
        const { name, value, type } = e.target; // extract field name, value, and type from event target
        setInput({ ...input, [name]: type === "number" ? Number(value) : value }); // update respective input field, converting numeric values to numbers when applicable
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => { // define async 'submitHandler' to process form submission
        e.preventDefault(); // prevent default form submission behavior for controlled submission flow

        const result = restaurantFromSchema.safeParse(input); // validate 'input' fields using zod schema 'restaurantFromSchema'
        if (!result.success) { // if validation fails
            const fieldErrors = result.error.flatten().fieldErrors; // flatten nested zod error structure into 'fieldErrors' object
            setErrors(fieldErrors as Partial<RestaurantFormSchema>); // assign errors to state, ensuring type safety with 'Partial<RestaurantFormSchema>'
            return; // exit function early if validation fails
        }

        try {
            const formData = new FormData(); // create new 'FormData' instance to hold form field values
            formData.append("restaurantName", input.restaurantName); // append restaurant name field
            formData.append("city", input.city); // append city field
            formData.append("country", input.country); // append country field
            formData.append("deliveryTime", input.deliveryTime.toString()); // append delivery time field as string
            formData.append("cuisines", JSON.stringify(input.cuisines)); // append cuisines field as JSON string
            if (input.imageFile) formData.append("imageFile", input.imageFile); // append image file if provided

            if (restaurant) await updateRestaurant(formData); // if restaurant exists, call 'updateRestaurant' to modify data
            else await createRestaurant(formData); // otherwise, call 'createRestaurant' to add a new restaurant
        } catch (error) { // handle potential runtime errors
            console.log(error); // log error to console for debugging
        }
    };

    useEffect(() => { // use 'useEffect' to fetch and populate restaurant data when component mounts
        const fetchRestaurant = async () => { // define async helper function for fetching restaurant details
            await getRestaurant(); // call 'getRestaurant' to retrieve restaurant details from store
            if (restaurant) { // if restaurant data exists
                setInput({ // populate form fields using restaurant data, with fallback defaults
                    restaurantName: restaurant.restaurantName || "", // assign restaurant name or fallback to empty string
                    city: restaurant.city || "", // assign city or fallback
                    country: restaurant.country || "", // assign country or fallback
                    deliveryTime: restaurant.deliveryTime || 0, // assign delivery time or fallback
                    cuisines: restaurant.cuisines ? restaurant.cuisines.map((c: string) => c) : [], // clone cuisines array or use empty array
                    imageFile: undefined, // reset image file since it's not directly retrievable
                });
            }
        };
        fetchRestaurant(); // call the data fetching function
        console.log(restaurant); // log restaurant object for debugging
    }, []); // keep dependency array empty so this effect runs only once on mount

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div>
                <h1 className="font-extrabold text-2xl mb-5">Add Restaurants</h1>
                <form onSubmit={submitHandler}> {/* bind form submission to 'submitHandler' */}
                    <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                        <div>
                            <Label>Restaurant Name</Label>
                            <Input
                                type="text"
                                name="restaurantName"
                                value={input.restaurantName}
                                onChange={changeEventHandler} // update restaurant name when user types
                                placeholder="Enter your restaurant name"
                            />
                            {errors && <span className="text-xs text-red-600 font-medium">{errors.restaurantName}</span>} {/* display validation error for restaurant name if any */}
                        </div>
                        <div>
                            <Label>City</Label>
                            <Input
                                type="text"
                                name="city"
                                value={input.city}
                                onChange={changeEventHandler} // update city field when user types
                                placeholder="Enter your city name"
                            />
                            {errors && <span className="text-xs text-red-600 font-medium">{errors.city}</span>} {/* display validation error for city if any */}
                        </div>
                        <div>
                            <Label>Country</Label>
                            <Input
                                type="text"
                                name="country"
                                value={input.country}
                                onChange={changeEventHandler} // update country field when user types
                                placeholder="Enter your country name"
                            />
                            {errors && <span className="text-xs text-red-600 font-medium">{errors.country}</span>} {/* display validation error for country if any */}
                        </div>
                        <div>
                            <Label>Delivery Time</Label>
                            <Input
                                type="number"
                                name="deliveryTime"
                                value={input.deliveryTime}
                                onChange={changeEventHandler} // update delivery time when user types
                                placeholder="Enter your delivery time"
                            />
                            {errors && <span className="text-xs text-red-600 font-medium">{errors.deliveryTime}</span>} {/* display validation error for delivery time if any */}
                        </div>
                        <div>
                            <Label>Cuisines</Label>
                            <Input
                                type="text"
                                name="cuisines"
                                value={input.cuisines}
                                onChange={(e) =>
                                    setInput({ ...input, cuisines: e.target.value.split(",") }) // split comma-separated values into cuisines array for state update
                                }
                                placeholder="e.g. Momos, Biryani"
                            />
                            {errors && <span className="text-xs text-red-600 font-medium">{errors.cuisines}</span>} {/* display validation error for cuisines if any */}
                        </div>
                        <div>
                            <Label>Upload Restaurant Banner</Label>
                            <Input
                                onChange={(e) =>
                                    setInput({ // handle image file upload and update input state
                                        ...input, // keep previous state intact
                                        imageFile: e.target.files?.[0] || undefined, // assign first selected file or undefined if none
                                    })
                                }
                                type="file"
                                accept="image/*"
                                name="imageFile"
                            />
                            {errors && <span className="text-xs text-red-600 font-medium">{errors.imageFile?.name}</span>} {/* display validation error for image file if any */}
                        </div>
                    </div>
                    <div className="my-5 w-fit">
                        {loading ? ( // check if form is currently submitting (loading)
                            <Button disabled className="bg-orange hover:bg-hoverOrange">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {/* show spinning loader while form submission is in progress */}
                                Please wait
                            </Button>
                        ) : (
                            <Button className="bg-orange hover:bg-hoverOrange">
                                {restaurant ? "Update Your Restaurant" : "Add Your Restaurant"} {/* dynamically set button text depending on restaurant existence */}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Restaurant; // export component as default for reuse