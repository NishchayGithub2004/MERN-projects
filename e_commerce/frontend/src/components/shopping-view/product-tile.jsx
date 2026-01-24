import { Card, CardContent, CardFooter } from "../ui/card"; // import card components
import { Button } from "../ui/button"; // import button component
import { brandOptionsMap, categoryOptionsMap } from "@/config"; // import brand and category mappings
import { Badge } from "../ui/badge"; // import badge component

function ShoppingProductTile({ // create functional component for individual product tile
    product, // product object containing product details
    handleGetProductDetails, // function to call on clicking product for details
    handleAddtoCart, // function to call on clicking add to cart
}) {
    return (
        <Card className="w-full max-w-sm mx-auto">
            <div onClick={() => handleGetProductDetails(product?._id)}> 
                { /* call handleGetProductDetails with product ID on click */ }
                <div className="relative">
                    <img
                        src={product?.image} // set product image URL
                        alt={product?.title} // set product title as alt text
                        className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                    {product?.totalStock === 0 ? ( // check if product is out of stock
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            Out Of Stock
                        </Badge>
                    ) : product?.totalStock < 10 ? ( // check if product stock is low
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            {`Only ${product?.totalStock} items left`} // display remaining stock
                        </Badge>
                    ) : product?.salePrice > 0 ? ( // check if product is on sale
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            Sale
                        </Badge>
                    ) : null}
                </div>
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[16px] text-muted-foreground">
                            {categoryOptionsMap[product?.category]} {/* map product category to label */}
                        </span>
                        <span className="text-[16px] text-muted-foreground">
                            {brandOptionsMap[product?.brand]} {/* map product brand to label */}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}
                        >
                            ${product?.price} {/* display original product price */}
                        </span>
                        {product?.salePrice > 0 ? ( // check if sale price exists
                            <span className="text-lg font-semibold text-primary">
                                ${product?.salePrice}
                            </span>
                        ) : null}
                    </div>
                </CardContent>
            </div>
            <CardFooter>
                {product?.totalStock === 0 ? ( // check if product is out of stock
                    <Button className="w-full opacity-60 cursor-not-allowed">
                        Out Of Stock
                    </Button>
                ) : (
                    <Button
                        onClick={() => handleAddtoCart(product?._id, product?.totalStock)} // call handleAddtoCart with product ID and stock
                        className="w-full"
                    >
                        Add to cart
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTile; // export product tile component
