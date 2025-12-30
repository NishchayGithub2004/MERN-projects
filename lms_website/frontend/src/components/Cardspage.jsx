import React, { useEffect, useState } from "react"; // import React along with useEffect and useState to build a functional component with state and side effects
import Card from "./Card.jsx"; // import Card component to render individual course cards
import { useSelector } from "react-redux"; // import useSelector to read course data from the Redux store
import { SiViaplay } from "react-icons/si"; // import SiViaplay icon to visually enhance the action button
import { useNavigate } from "react-router-dom"; // import useNavigate to enable programmatic route navigation

function Cardspage() { // define a component named Cardspage to display a list of popular courses
  const [popularCourses, setPopularCourses] = useState([]); // create local state to store a subset of popular courses
  
  const { courseData } = useSelector( // extract courseData from the Redux store
    state => state.course // access the course slice from global Redux state
  );
  
  const navigate = useNavigate(); // initialize navigation helper for redirecting users
  
  useEffect(() => { // run side effect whenever courseData changes
    setPopularCourses(courseData.slice(0, 6)); // store only the first six courses as popular courses
  }, [courseData]); // re-run effect when courseData updates
  
  return (
    <div>
      <h1>Our Popular Courses</h1>
      
      <span>Explore top-rated courses designed to boost your skills, enhance careers, and unlock opportunities in tech, AI, business, and beyond.</span>
      
      <div>
        {
          popularCourses.map( // iterate over popularCourses to render a Card for each course
            (item, index) => ( // receive course item and index during iteration
              <Card 
                key={index} // assign a unique key using index to help React track list items
                id={item._id} // pass course id dynamically for navigation and identification
                thumbnail={item.thumbnail} // pass thumbnail image dynamically from course data
                title={item.title} // pass course title dynamically for display
                price={item.price} // pass course price dynamically for display
                category={item.category} // pass course category dynamically for labeling
                reviews={item.reviews} // pass reviews dynamically for rating calculations
              />
            )
          )
        }
      </div>
      
      <button
        onClick={() => navigate("/allcourses")} // navigate to the all courses page when button is clicked
      >
        View all Courses <SiViaplay /> 
      </button>
    </div>
  );
}

export default Cardspage;