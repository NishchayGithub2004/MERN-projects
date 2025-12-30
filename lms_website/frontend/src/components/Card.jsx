import React from "react"; // import React to enable JSX syntax and component creation
import { FaStar } from "react-icons/fa"; // import FaStar icon to visually represent course rating
import { useNavigate } from "react-router-dom"; // import useNavigate to programmatically navigate between routes

const CourseCard = ( // define a functional component named CourseCard to render a clickable course summary card which takes the following props
  thumbnail, // thumbnail image URL to visually represent the course
  title, // course title to display as the main heading
  category, // course category to label the course type
  price, // course price to display cost information
  id, // course id to build dynamic navigation route
  reviews // reviews array to calculate and display average rating
) => {
  const navigate = useNavigate(); // initialize navigation function to redirect user on card click

  const calculateAverageRating = (reviews) => { // define a function to compute the average rating from review data that takes reviews to derive rating statistics
    if (!reviews || reviews.length === 0) return 0; // return zero when reviews are missing or empty to avoid invalid calculations
    const total = reviews.reduce((sum, review) => sum + review.rating, 0); // aggregate total rating score from all reviews
    return (total / reviews.length).toFixed(1); // calculate and format the average rating to one decimal place
  };

  const avgRating = calculateAverageRating(reviews); // compute the average rating for the current course

  console.log("Average Rating:", avgRating); // log the calculated average rating for debugging and verification

  return (
    <div
      onClick={() => navigate(`/viewcourse/${id}`)} // navigate to the course detail page using the course id when the card is clicked
    >
      <img
        src={thumbnail} // bind the course thumbnail image dynamically from props
        alt={title} // set alt text dynamically using the course title for accessibility
      />

      <div>
        <h2>{title}</h2> {/* inject the course title dynamically from props for display */}

        <span>{category}</span> {/* inject the course category dynamically from props */}

        <div>
          <span>₹{price}</span> {/* inject the course price dynamically from props */}
          <span>
            <FaStar /> {avgRating} {/* render a star icon and inject the calculated average rating dynamically */}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;