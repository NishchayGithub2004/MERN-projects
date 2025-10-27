import { Button } from "@/components/ui/button"; // import Button component of shadCN UI
import { Input } from "@/components/ui/input"; // import Input component of shadCN UI
import { Label } from "@/components/ui/label"; // import Label component of shadCN UI
import { type RestaurantFormSchema, restaurantFromSchema } from "@/schema/restaurantSchema"; // import 'RestaurantFormSchema' for form creation and 'restaurantFormSchema' for form validation
import { useRestaurantStore } from "@/store/useRestaurantStore"; // import 'useRestaurantStore' for restaurant-related actions
import { Loader2 } from "lucide-react"; // import 'Loader2' icon from lucide-react
import { type FormEvent, useEffect, useState } from "react"; // import 'FormEvent' to interact with form events, 'useEffect' to run side effects, and 'useState' to manage states

const Restaurant = () => { // create a functional component named 'Restaurant' that doesn't take any props
    const [input, setInput] = useState<RestaurantFormSchema>({ // using 'useState' hook, create a variable 'input' and a function 'setInput' to change it's values
        // 'input' variable has data type 'RestaurantFormSchema' and it's properties has following initial values
        restaurantName: "", // 'restaurantName' property has empty string as it's initial value
        city: "", // 'city' property has empty string as it's initial value
        country: "", // 'country' property has empty string as it's initial value
        deliveryTime: 0, // 'deliveryTime' property has 0 as it's initial value
        cuisines: [], // 'cuisines' property has empty array as it's initial value
        imageFile: undefined, // 'imageFile' property has 'undefined' as it's initial value
    });
    
    const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({}); // using 'useState' hook, create a variable 'error' of type 'RestaurantFormSchema' and 'setError' function to update the values present in 'MenuFormSchema' object
    // 'Partial' makes all the fields of 'RestaurantFormSchema' object optional for this particular state
    
    const { loading, restaurant, updateRestaurant, createRestaurant, getRestaurant } = useRestaurantStore(); // extract these things from 'useRestaurantStore' hook

    const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => { // create a function named 'changeEventHandler' that takes that event object as argument that responds to change in value of form field
        const { name, value, type } = e.target; // extract 'name' 'value' and 'type' from event object ie form field
        setInput({ ...input, [name]: type === "number" ? Number(value) : value }); // use 'setInput' function to update the values of 'input' object
        /* using spread operator, copy pre-existing value of 'input' object and then check if value of 'type' is number ie if form field this function is called for takes numbers as input
        if it is, then convert new input value given to form field to number, otherwise leave it as is */
    };

    const submitHandler = async (e: FormEvent<HTMLFormElement>) => { // create a function named 'submitHandler' that takes event object as argument that responds to any form event
        e.preventDefault(); // prevent default behavior of form that it submits as soon as button is clicked, so that some tasks can be done before submitting the form

        const result = restaurantFromSchema.safeParse(input); // implement 'restaurantFromSchema' validation on properties of 'input' object
        
        if (!result.success) { // if validation fails
            const fieldErrors = result.error.flatten().fieldErrors; // flatten the nested error object returned due to failure of validation and using 'fieldErrors' extract the error message from the flattened error object
            setErrors(fieldErrors as Partial<RestaurantFormSchema>); // set 'error' to 'fieldErrors', but convert it to 'MenuFormSchema' type for type safety, 'Partial' makes all the fields of 'MenuFormSchema' object optional to have values for this particular state
            return; // return from function so that code below this line isn't executed
        }
        
        try {
            const formData = new FormData(); // create a new instance of 'FormData' class to create form and add data to it's input fields
            
            formData.append("restaurantName", input.restaurantName); // to 'restaurantName' field, add value of 'restaurantName' property of 'input' object
            formData.append("city", input.city); // to 'city' field, add value of 'city' property of 'input' object
            formData.append("country", input.country); // to 'country' field, add value of 'country' property of 'input' object
            formData.append("deliveryTime", input.deliveryTime.toString()); // to 'deliveryTime' field, add value of 'deliveryTime' property of 'input' object but convert it to string also
            formData.append("cuisines", JSON.stringify(input.cuisines)); // to 'cuisines' field, add value of 'cuisines' property of 'input' object but convert it to JSON string

            if (input.imageFile) { // if 'imageFile' property of 'input' object has value
                formData.append("imageFile", input.imageFile); // to 'imageFile' field, add value of 'imageFile' property of 'input' object
            }

            if (restaurant) { // if 'restaurant' property is not null ie it has a value
                await updateRestaurant(formData); // call 'updateRestaurant' function for form data to update restaurant details since restaurant is present that means we are updating restaurant details
            } else {
                await createRestaurant(formData); // otherwise call 'createRestaurant' function for form data to create restaurant since restaurant is not present that means we are creating restaurant
            }
        } catch (error) { // if any error occurs
            console.log(error); // log it to the console for debugging purposes
        }
    };

    useEffect(() => { // call 'useEffect' hook to define a side effect
        const fetchRestaurant = async () => { // create a function named 'fetchRestaurant' to fetch restaurant details
            await getRestaurant(); // call 'getRestaurant' function from redux store
            
            if (restaurant) { // if 'restaurant' property is not null ie it has a value
                setInput({ // using 'setInput' function, update the value of 'input' variable as follows
                    restaurantName: restaurant.restaurantName || "", // if 'restaurantName' property of 'restaurant' object is not null ie it has a value, then use it, otherwise use empty string
                    city: restaurant.city || "", // if 'city' property of 'restaurant' object is not null ie it has a value, then use it, otherwise use empty string
                    country: restaurant.country || "", // if 'country' property of'restaurant' object is not null ie it has a value, then use it, otherwise use empty string
                    deliveryTime: restaurant.deliveryTime || 0, // if 'deliveryTime' property of'restaurant' object is not null ie it has a value, then use it, otherwise use 0
                    cuisines: restaurant.cuisines // check if 'cuisines' property of 'restaurant' object which is an array is not empty
                        ? restaurant.cuisines.map((cuisine: string) => cuisine) // if it isn't empty, then iterate through every element of 'cuisines' array and allot the elements to 'cuisines' array of 'input' object
                        : [], // if 'cuisines' array is empty, then allot an empty array to 'cuisines' array of 'input' object
                    imageFile: undefined, // allot 'undefined' to 'imageFile' property of 'input' object
                });
            };
        }

        fetchRestaurant(); // call 'fetchRestaurant' function
        console.log(restaurant); // log 'restaurant' object's properties and their values to the console for debugging purposes
    }, []); // keep dependency array empty so that this sie effect runs only once when component mounts

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div>
                <div>
                    <h1 className="font-extrabold text-2xl mb-5">Add Restaurants</h1>
                    <form onSubmit={submitHandler}> {/* submitting this form calls 'submitHandler' function */}
                        <div className="md:grid grid-cols-2 gap-6 space-y-2 md:space-y-0">
                            <div>
                                <Label>Restaurant Name</Label>
                                <Input
                                    type="text"
                                    name="restaurantName"
                                    value={input.restaurantName}
                                    onChange={changeEventHandler} // when value of this input field changes, then 'changeEventHandler' function will be called
                                    placeholder="Enter your restaurant name"
                                />
                                {errors && <span className="text-xs text-red-600 font-medium">{errors.restaurantName}</span>} {/* if 'error' object is not null ie error occurs, render value of 'restaurantName' property of error object */}
                            </div>
                            <div>
                                <Label>City</Label>
                                <Input
                                    type="text"
                                    name="city"
                                    value={input.city}
                                    onChange={changeEventHandler} // when value of this input field changes, then 'changeEventHandler' function will be called
                                    placeholder="Enter your city name"
                                />
                                {errors && <span className="text-xs text-red-600 font-medium">{errors.city}</span>} {/* if 'error' object is not null ie error occurs, render value of 'city' property of error object */}
                            </div>
                            <div>
                                <Label>Country</Label>
                                <Input
                                    type="text"
                                    name="country"
                                    value={input.country}
                                    onChange={changeEventHandler} // when value of this input field changes, then 'changeEventHandler' function will be called
                                    placeholder="Enter your country name"
                                />
                                {errors && <span className="text-xs text-red-600 font-medium">{errors.country}</span>} {/* if 'error' object is not null ie error occurs, render value of 'country' property of error object */}
                            </div>
                            <div>
                                <Label>Delivery Time</Label>
                                <Input
                                    type="number"
                                    name="deliveryTime"
                                    value={input.deliveryTime}
                                    onChange={changeEventHandler} // when value of this input field changes, then 'changeEventHandler' function will be called
                                    placeholder="Enter your delivery time"
                                />
                                {errors && <span className="text-xs text-red-600 font-medium">{errors.deliveryTime}</span>} {/* if 'error' object is not null ie error occurs, render value of 'deliveryTime' property of error object */}
                            </div>
                            <div>
                                <Label>Cuisines</Label>
                                <Input
                                    type="text"
                                    name="cuisines"
                                    value={input.cuisines}
                                    onChange={(e) =>
                                        setInput({ ...input, cuisines: e.target.value.split(",") }) // when value of this input field changes, then split the value of input field by comma and allot names of food items received by doing so to 'cuisines' array of 'input' object
                                        // for example, if user enters "Momos, Biryani", then after splitting by comma, 'cuisines' array of 'input' object will have two elements "Momos" and "Biryani"
                                    }
                                    placeholder="e.g. Momos, Biryani"
                                />
                                {errors && <span className="text-xs text-red-600 font-medium">{errors.cuisines}</span>} {/* if 'error' object is not null ie error occurs, render value of 'cuisines' property of error object */}
                            </div>
                            <div>
                                <Label>Upload Restaurant Banner</Label>
                                <Input
                                    onChange={(e) =>
                                        setInput({ // when value of this input field changes, then call 'setInput' function to update the value of 'input' object
                                            ...input, // using spread operator, copy pre-existing value of 'input' object
                                            imageFile: e.target.files?.[0] || undefined, // then change value of 'imageFile' property of 'input' object to file uploaded, [0] because image is received as array of files, so [0] is used to get first file, even with single file element uploaded
                                        })
                                    }
                                    type="file"
                                    accept="image/*"
                                    name="imageFile"
                                />
                                {errors && <span className="text-xs text-red-600 font-medium">{errors.imageFile?.name}</span>} {/* if 'error' object is not null ie error occurs, render value of 'imageFile' property of error object */}
                            </div>
                        </div>
                        <div className="my-5 w-fit">
                            {loading ? ( // if 'loading' property of 'useRestaurantStore' hook is true ie restaurant is being created or updated, then render loader icon and 'Please wait' message, otherwise render a button
                                <Button disabled className="bg-orange hover:bg-hoverOrange">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </Button>
                            ) : (
                                <Button className="bg-orange hover:bg-hoverOrange">
                                    {restaurant ? "Update Your Restaurant" : "Add Your Restaurant"} {/* on this button, first message will be written if 'restaurant' object is not null ie restaurant exists since it means we are updating the restaurant details
                                    render second message otherwise ie if 'restaurant' object is null ie restaurant doesn't exist as it means we aren't updating details of a pre-existing restaurant, we are giving details for creation of a new restaurant */}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;