import { Button } from "../ui/button"; // import Button component for action buttons like Edit and Delete
import { Card, CardContent, CardFooter } from "../ui/card"; // import Card components to display each product in a card layout

function AdminProductTile({ // define functional component AdminProductTile that takes multiple props
    product, // product object containing details like title, image, price, salePrice, and id
    setFormData, // function used to update form data when editing a product
    setOpenCreateProductsDialog, // function used to open or close the product creation/edit dialog
    setCurrentEditedId, // function used to store the id of the currently edited product
    handleDelete // function used to handle deletion of a product
}) {
    return (
        <Card className="w-full max-w-sm mx-auto">
            <div>
                <div className="relative">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                </div>
                <CardContent>
                    <h2 className="text-xl font-bold mb-2 mt-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className={`${product?.salePrice > 0 ? "line-through" : ""
                                } text-lg font-semibold text-primary`}
                        >
                            ${product?.price}
                        </span>
                        {product?.salePrice > 0 ? (
                            <span className="text-lg font-bold">${product?.salePrice}</span>
                        ) : null}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Button
                        onClick={() => { // handle click event for Edit button
                            setOpenCreateProductsDialog(true); // open product dialog for editing
                            setCurrentEditedId(product?._id); // store id of product being edited
                            setFormData(product); // populate form with current product data
                        }}
                    >
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(product?._id)}>Delete</Button> {/* call handleDelete with product id to remove product */}
                </CardFooter>
            </div>
        </Card>
    );
}

export default AdminProductTile;
