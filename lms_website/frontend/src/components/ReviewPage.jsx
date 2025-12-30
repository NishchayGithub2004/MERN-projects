import React, { useEffect, useState } from "react"; // import React along with useEffect and useState to build a stateful functional component
import ReviewCard from "./ReviewCard"; // import ReviewCard component to render individual review entries
import { useSelector } from "react-redux"; // import useSelector to read review data from the Redux store

function ReviewPage() { // define a component named ReviewPage to display recent user reviews
  const [latestReview, setLatestReview] = useState([]); // create local state to store a subset of the latest reviews
  
  const { allReview } = useSelector( // extract allReview data from the Redux store
    state => state.review // access the review slice from global Redux state
  );

  useEffect(() => {
    setLatestReview(allReview.slice(0, 6)); // store only the first six reviews as the latest reviews
  }, [allReview]); // re-run the effect when allReview updates
  
  return (
    <div>
      <h1>Real Reviews from Real Learners</h1>
      <span>Discover how our Virtual Courses is transforming learning experiences through real feedback from students and professionals worldwide.</span>
      <div>
        {
          latestReview.map( // iterate over latestReview array to render review cards
            (item, index) => ( // receive each review item and its index
              <ReviewCard 
                key={index} // assign a unique key to each ReviewCard for React reconciliation
                rating={item.rating} // pass numeric rating to control star rendering
                image={item.user.photoUrl} // pass reviewer profile image dynamically
                text={item.comment} // pass review comment text dynamically
                name={item.user.name} // pass reviewer name dynamically
                role={item.user.role} // pass reviewer role dynamically for context
              />
            )
          )
        }
      </div>
    </div>
  );
}

export default ReviewPage