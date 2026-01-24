import { StarIcon } from "lucide-react"; // import StarIcon to visually represent rating stars
import { Button } from "../ui/button"; // import Button component to make stars clickable

// create a component for displaying a star rating that takes these props: rating (number) and handleRatingChange (function to update rating)
function StarRatingComponent({ rating, handleRatingChange }) {
    console.log(rating, "rating"); // log current rating for debugging

    return [1, 2, 3, 4, 5].map((star) => ( // iterate through 1 to 5 to render each star
        <Button
            className={`p-2 rounded-full transition-colors ${star <= rating
                    ? "text-yellow-500 hover:bg-black"
                    : "text-black hover:bg-primary hover:text-primary-foreground"
                }`}
            variant="outline" // use outlined button style for each star
            size="icon" // set button size to icon size
            onClick={handleRatingChange ? () => handleRatingChange(star) : null} // call handleRatingChange with clicked star number if function exists
        >
            <StarIcon
                className={`w-6 h-6 ${star <= rating ? "fill-yellow-500" : "fill-black"
                    }`} // fill star yellow if selected, black otherwise
            />
        </Button>
    ));
}

export default StarRatingComponent;
