import React from "react"; // import React to enable JSX syntax and component creation
import { FaStar } from "react-icons/fa6"; // import filled star icon to represent active rating
import { FaRegStar } from "react-icons/fa"; // import outlined star icon to represent inactive rating

const ReviewCard = ( // define a functional component named ReviewCard to render an individual user review which takes the following props
  {
    text, // review text content to display user feedback
    name, // reviewer name to identify the author
    image, // reviewer image URL to display avatar
    rating, // numeric rating to determine star rendering
    role // reviewer role or designation for context
  }
) => {
  return (
    <div>
      <div>
        {
          Array(5) // create an array of fixed length to represent maximum star count
            .fill(0) // fill the array with placeholder values to enable mapping
            .map( // iterate over the array to render star icons
              (_, i) => ( // access index to compare against rating value
                <span key={i}>
                  {i < rating ? <FaStar /> : <FaRegStar />} {/* conditionally render filled or outlined star based on rating */}
                </span>
              )
            )
        }
      </div>

      <p>{text}</p> {/* inject the review text dynamically from props */}

      <div>
        <img
          src={image} // inject reviewer image dynamically from props
          alt={name} // inject reviewer name dynamically for accessibility
        />
        <div>
          <h4>{name}</h4> {/* inject reviewer name dynamically from props */}
          <p>{role}</p> {/* inject reviewer role dynamically from props */}
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;