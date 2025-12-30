import React from 'react'; // import React to define a functional component
import home from "../assets/home1.jpg"; // import home background image to visually represent landing section
import Nav from '../components/Nav'; // import Nav component to render top navigation bar
import { SiViaplay } from "react-icons/si"; // import play icon to visually enhance course navigation CTA
import Logos from '../components/Logos'; // import Logos component to display partner or brand logos
import Cardspage from '../components/Cardspage'; // import Cardspage component to showcase featured courses
import ExploreCourses from '../components/ExploreCourses'; // import ExploreCourses component to highlight course categories
import About from '../components/About'; // import About component to describe platform purpose and value
import ai from '../assets/ai.png'; // import AI icon image for desktop AI search button
import ai1 from '../assets/SearchAi.png'; // import alternate AI icon image optimized for mobile view
import ReviewPage from '../components/ReviewPage'; // import ReviewPage component to display user testimonials
import Footer from '../components/Footer'; // import Footer component to render page footer
import { useNavigate } from 'react-router-dom'; // import navigation hook to handle route changes

function Home() { // define a functional component named 'Home' to render the main landing page
  const navigate = useNavigate(); // initialize navigate function to redirect users based on actions

  return (
    <div className='w-[100%] overflow-hidden'>
      <div className='w-[100%] lg:h-[140vh] h-[70vh] relative'>
        <Nav />

        <img src={home} alt="" />

        <span>Grow Your Skills to Advance</span>
        <span>Your Career path</span>

        <div>
          <button
            onClick={() => navigate("/allcourses")} // navigate user to all courses page to browse full catalog
          >
            View all Courses <SiViaplay />
          </button>

          <button
            onClick={() => navigate("/searchwithai")} // navigate user to AI-powered course search experience
          >
            Search with AI
            <img src={ai} alt="" />
            <img src={ai1} alt="" />
          </button>
        </div>
      </div>

      <Logos />
      <ExploreCourses />
      <Cardspage />
      <About />
      <ReviewPage />
      <Footer />
    </div>
  );
}

export default Home;