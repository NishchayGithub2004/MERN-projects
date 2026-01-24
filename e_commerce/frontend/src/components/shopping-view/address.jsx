import { useEffect, useState } from "react"; // import React hooks useEffect for side effects and useState for local state management
import CommonForm from "../common/form"; // import reusable CommonForm component for rendering form fields
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"; // import Card components from UI library for layout
import { addressFormControls } from "@/config"; // import form configuration for address fields
import { useDispatch, useSelector } from "react-redux"; // import Redux hooks for dispatching actions and accessing state
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from "@/store/shop/address-slice"; // import Redux actions for address management
import AddressCard from "./address-card"; // import AddressCard component for displaying individual addresses
import { useToast } from "../ui/use-toast"; // import custom hook for showing toast notifications

const initialAddressFormData = { // define initial state object for the address form
    address: "", // default empty string for address field
    city: "", // default empty string for city field
    phone: "", // default empty string for phone field
    pincode: "", // default empty string for pincode field
    notes: "", // default empty string for notes field
};

function Address({ // create a functional component named Address for managing the address list, adding, editing, and selecting addresses
    setCurrentSelectedAddress, // function to set the currently selected address in parent component
    selectedId, // object containing the currently selected address ID for highlighting the selected card
}) {
    const [formData, setFormData] = useState(initialAddressFormData); // create local state formData initialized with initialAddressFormData and setter function setFormData
    
    const [currentEditedId, setCurrentEditedId] = useState(null); // create local state to track currently edited address ID, initially null
    
    const dispatch = useDispatch(); // get Redux dispatch function to dispatch actions
    
    const { user } = useSelector((state) => state.auth); // get user object from Redux auth state using useSelector
    
    const { addressList } = useSelector((state) => state.shopAddress); // get addressList array from Redux shopAddress state using useSelector
    
    const { toast } = useToast(); // get toast function from custom useToast hook for showing notifications

    function handleManageAddress(event) { // create a function to handle form submission for adding or editing an address
        event.preventDefault(); // prevent default form submission behavior

        if (addressList.length >= 3 && currentEditedId === null) { // check if user is trying to add more than 3 addresses and not editing
            setFormData(initialAddressFormData); // reset formData to initial state
            toast({ // show toast notification
                title: "You can add max 3 addresses", // title of toast
                variant: "destructive", // variant type for error styling
            });

            return; // exit function early
        }

        currentEditedId !== null // check if editing an existing address
            ? dispatch( // dispatch Redux action to edit address
                editaAddress({ // call editaAddress action
                    userId: user?.id, // pass current user ID
                    addressId: currentEditedId, // pass ID of the address being edited
                    formData, // pass updated formData
                })
            ).then((data) => { // handle promise after dispatch
                if (data?.payload?.success) { // check if response indicates success
                    dispatch(fetchAllAddresses(user?.id)); // fetch updated list of addresses
                    setCurrentEditedId(null); // reset currentEditedId to null after editing
                    setFormData(initialAddressFormData); // reset formData to initial state
                    toast({ // show success toast
                        title: "Address updated successfully", // toast title
                    });
                }
            })
            : dispatch( // else, dispatch Redux action to add a new address
                addNewAddress({ // call addNewAddress action
                    ...formData, // spread formData fields into payload
                    userId: user?.id, // attach current user ID
                })
            ).then((data) => { // handle promise after dispatch
                if (data?.payload?.success) { // check if response indicates success
                    dispatch(fetchAllAddresses(user?.id)); // fetch updated list of addresses
                    setFormData(initialAddressFormData); // reset formData to initial state
                    toast({ // show success toast
                        title: "Address added successfully", // toast title
                    });
                }
            });
    }

    function handleDeleteAddress(getCurrentAddress) { // create a function to handle deleting an address with the passed address object
        dispatch( // dispatch Redux action to delete address
            deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id }) // call deleteAddress action with user ID and address ID
        ).then((data) => { // handle promise after dispatch
            if (data?.payload?.success) { // check if response indicates success
                dispatch(fetchAllAddresses(user?.id)); // fetch updated address list after deletion
                toast({ // show success toast
                    title: "Address deleted successfully", // toast title
                });
            }
        });
    }

    function handleEditAddress(getCuurentAddress) { // create a function to handle populating form for editing a given address
        setCurrentEditedId(getCuurentAddress?._id); // set currentEditedId to the ID of the address being edited
        setFormData({ // update formData with details of the address being edited
            ...formData, // preserve existing formData fields
            address: getCuurentAddress?.address, // update address field
            city: getCuurentAddress?.city, // update city field
            phone: getCuurentAddress?.phone, // update phone field
            pincode: getCuurentAddress?.pincode, // update pincode field
            notes: getCuurentAddress?.notes, // update notes field
        });
    }

    function isFormValid() { // create a function to check if all form fields are non-empty
        return Object.keys(formData) // get all keys from formData
            .map((key) => formData[key].trim() !== "") // map each key to boolean indicating if value is non-empty after trimming
            .every((item) => item); // return true if every field is non-empty, otherwise false
    }

    useEffect(() => { // run side effect to fetch all addresses when component mounts
        dispatch(fetchAllAddresses(user?.id)); // dispatch action to fetch addresses for current user
    }, [dispatch]); // dependency array with dispatch to avoid unnecessary re-renders

    console.log(addressList, "addressList"); // log addressList to console for debugging

    return (
        <Card>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
                {addressList && addressList.length > 0 // check if there are addresses to display
                    ? addressList.map((singleAddressItem) => ( // map through addressList to render each AddressCard
                        <AddressCard
                            selectedId={selectedId}
                            handleDeleteAddress={handleDeleteAddress}
                            addressInfo={singleAddressItem}
                            handleEditAddress={handleEditAddress}
                            setCurrentSelectedAddress={setCurrentSelectedAddress}
                        />
                    ))
                    : null} {/* render nothing if addressList is empty */}
            </div>
            <CardHeader>
                <CardTitle>
                    {currentEditedId !== null ? "Edit Address" : "Add New Address"} {/* dynamically display title based on edit mode */}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <CommonForm
                    formControls={addressFormControls} // pass form field configuration
                    formData={formData} // pass current formData
                    setFormData={setFormData} // pass setter for formData
                    buttonText={currentEditedId !== null ? "Edit" : "Add"} // dynamically set button text based on edit mode
                    onSubmit={handleManageAddress} // pass handleManageAddress function as submit handler
                    isBtnDisabled={!isFormValid()} // disable submit button if form is invalid
                />
            </CardContent>
        </Card>
    );
}

export default Address; // export Address component for use in other parts of the app
