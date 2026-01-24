import { Avatar, AvatarFallback } from "../ui/avatar"; // import avatar components
import { Button } from "../ui/button"; // import button component
import { Dialog, DialogContent } from "../ui/dialog"; // import dialog components
import { Separator } from "../ui/separator"; // import separator component
import { Input } from "../ui/input"; // import input component
import { useDispatch, useSelector } from "react-redux"; // import Redux hooks
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"; // import cart actions
import { useToast } from "../ui/use-toast"; // import toast hook
import { setProductDetails } from "@/store/shop/products-slice"; // import product details action
import { Label } from "../ui/label"; // import label component
import StarRatingComponent from "../common/star-rating"; // import star rating component
import { useEffect, useState } from "react"; // import React hooks
import { addReview, getReviews } from "@/store/shop/review-slice"; // import review actions

function ProductDetailsDialog({ // create functional component for product details dialog
    open, // dialog open state
    setOpen, // function to update dialog open state
    productDetails, // object containing selected product details
}) {
    const [reviewMsg, setReviewMsg] = useState(""); // manage state for review message
    const [rating, setRating] = useState(0); // manage state for rating
    const dispatch = useDispatch(); // get dispatch function
    const { user } = useSelector((state) => state.auth); // get user from Redux auth state
    const { cartItems } = useSelector((state) => state.shopCart); // get cart items from Redux shopCart state
    const { reviews } = useSelector((state) => state.shopReview); // get reviews from Redux shopReview state
    const { toast } = useToast(); // get toast function

    function handleRatingChange(getRating) { // handle rating change from star component
        console.log(getRating, "getRating"); // log rating for debugging
        setRating(getRating); // update rating state
    }

    function handleAddToCart(getCurrentProductId, getTotalStock) { // handle adding product to cart
        let getCartItems = cartItems.items || []; // get cart items array or empty

        if (getCartItems.length) { // check if cart has items
            const indexOfCurrentItem = getCartItems.findIndex(
                (item) => item.productId === getCurrentProductId // find index of current product in cart
            );

            if (indexOfCurrentItem > -1) { // if product exists in cart
                const getQuantity = getCartItems[indexOfCurrentItem].quantity; // get current quantity

                if (getQuantity + 1 > getTotalStock) { // check if adding exceeds stock
                    toast({ // show destructive toast
                        title: `Only ${getQuantity} quantity can be added for this item`,
                        variant: "destructive",
                    });
                    return; // stop adding to cart
                }
            }
        }

        dispatch(
            addToCart({ // dispatch addToCart action
                userId: user?.id, // pass user ID
                productId: getCurrentProductId, // pass product ID
                quantity: 1, // add 1 quantity
            })
        ).then((data) => { // handle promise
            if (data?.payload?.success) { // if success
                dispatch(fetchCartItems(user?.id)); // fetch updated cart items
                toast({ // show success toast
                    title: "Product is added to cart",
                });
            }
        });
    }

    function handleDialogClose() { // handle closing dialog
        setOpen(false); // set dialog open state to false
        dispatch(setProductDetails()); // reset product details in Redux
        setRating(0); // reset rating state
        setReviewMsg(""); // reset review message
    }

    function handleAddReview() { // handle adding new review
        dispatch(
            addReview({ // dispatch addReview action
                productId: productDetails?._id, // pass product ID
                userId: user?.id, // pass user ID
                userName: user?.userName, // pass user name
                reviewMessage: reviewMsg, // pass review message
                reviewValue: rating, // pass rating value
            })
        ).then((data) => { // handle promise
            if (data.payload.success) { // if success
                setRating(0); // reset rating
                setReviewMsg(""); // reset review message
                dispatch(getReviews(productDetails?._id)); // fetch updated reviews
                toast({ // show success toast
                    title: "Review added successfully!",
                });
            }
        });
    }

    useEffect(() => { // fetch reviews when productDetails changes
        if (productDetails !== null) dispatch(getReviews(productDetails?._id)); // dispatch getReviews with product ID
    }, [productDetails]); // dependency array contains productDetails

    console.log(reviews, "reviews"); // log reviews for debugging

    const averageReview = // calculate average rating
        reviews && reviews.length > 0
            ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / reviews.length // sum ratings and divide by number of reviews
            : 0; // default 0 if no reviews

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={productDetails?.image} // product image URL
                        alt={productDetails?.title} // alt text
                        width={600} // image width
                        height={600} // image height
                        className="aspect-square w-full object-cover"
                    />
                </div>
                <div className="">
                    <div>
                        <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">
                            {productDetails?.description} {/* display product description */}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p
                            className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""}`}
                        >
                            ${productDetails?.price} {/* display original price */}
                        </p>
                        {productDetails?.salePrice > 0 ? (
                            <p className="text-2xl font-bold text-muted-foreground">
                                ${productDetails?.salePrice} {/* display sale price if exists */}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={averageReview} /> {/* display average review stars */}
                        </div>
                        <span className="text-muted-foreground">
                            ({averageReview.toFixed(2)}) {/* display average rating numeric */}
                        </span>
                    </div>
                    <div className="mt-5 mb-5">
                        {productDetails?.totalStock === 0 ? (
                            <Button className="w-full opacity-60 cursor-not-allowed">
                                Out of Stock
                            </Button>
                        ) : (
                            <Button
                                className="w-full"
                                onClick={() =>
                                    handleAddToCart(productDetails?._id, productDetails?.totalStock) // call add to cart
                                }
                            >
                                Add to Cart
                            </Button>
                        )}
                    </div>
                    <Separator />
                    <div className="max-h-[300px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        <div className="grid gap-6">
                            {reviews && reviews.length > 0 ? ( // check if reviews exist
                                reviews.map((reviewItem) => ( // iterate over reviews
                                    <div className="flex gap-4" key={reviewItem?._id}>
                                        <Avatar className="w-10 h-10 border">
                                            <AvatarFallback>
                                                {reviewItem?.userName[0].toUpperCase()} {/* display first letter of reviewer */}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold">{reviewItem?.userName}</h3> {/* display reviewer name */}
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                <StarRatingComponent rating={reviewItem?.reviewValue} /> {/* display review rating */}
                                            </div>
                                            <p className="text-muted-foreground">
                                                {reviewItem.reviewMessage} {/* display review message */}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <h1>No Reviews</h1> // display if no reviews
                            )}
                        </div>
                        <div className="mt-10 flex-col flex gap-2">
                            <Label>Write a review</Label>
                            <div className="flex gap-1">
                                <StarRatingComponent
                                    rating={rating} // display selected rating
                                    handleRatingChange={handleRatingChange} // handle rating selection
                                />
                            </div>
                            <Input
                                name="reviewMsg" // input name
                                value={reviewMsg} // input value
                                onChange={(event) => setReviewMsg(event.target.value)} // update review message state
                                placeholder="Write a review..." 
                            />
                            <Button
                                onClick={handleAddReview} // submit review
                                disabled={reviewMsg.trim() === ""}
                            >
                                Submit
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;