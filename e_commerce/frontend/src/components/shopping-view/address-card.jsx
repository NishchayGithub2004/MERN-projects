import { Button } from "../ui/button"; // import Button component from the UI library to use for edit and delete actions
import { Card, CardContent, CardFooter } from "../ui/card"; // import Card components from the UI library to structure the address display
import { Label } from "../ui/label"; // import Label component from the UI library to display text fields like address, city, etc.

function AddressCard({ // create a functional component for displaying an address card that takes the following props
    addressInfo, // object containing details of the address like address, city, pincode, phone, notes
    handleDeleteAddress, // function to handle deleting the address when delete button is clicked
    handleEditAddress, // function to handle editing the address when edit button is clicked
    setCurrentSelectedAddress, // function to update the currently selected address when the card is clicked
    selectedId, // object containing the currently selected address ID to compare and style the selected card
}) {
    return (
        <Card
            onClick={ // attach onClick handler to Card to allow selecting the address
                setCurrentSelectedAddress
                    ? () => setCurrentSelectedAddress(addressInfo) // call setCurrentSelectedAddress with the addressInfo if function exists
                    : null // do nothing if setCurrentSelectedAddress is not provided
            }
            className={`cursor-pointer border-red-700 ${selectedId?._id === addressInfo?._id
                ? "border-red-900 border-4px" // apply thicker red border if this card’s address matches the selectedId
                : "border-black" // otherwise apply default black border
                }`}
        >
            <CardContent className="grid p-4 gap-4">
                <Label>Address: {addressInfo?.address}</Label>
                <Label>City: {addressInfo?.city}</Label>
                <Label>pincode: {addressInfo?.pincode}</Label>
                <Label>Phone: {addressInfo?.phone}</Label>
                <Label>Notes: {addressInfo?.notes}</Label>
            </CardContent>
            <CardFooter className="p-3 flex justify-between">
                <Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
                <Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
            </CardFooter>
        </Card>
    );
}

export default AddressCard;
