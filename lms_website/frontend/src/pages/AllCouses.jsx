import React, { useEffect, useState } from 'react'; // import React and hooks to build a functional component with state and side effects
import Card from "../components/Card.jsx"; // import Card component to render individual course details
import { FaArrowLeftLong } from "react-icons/fa6"; // import arrow icon to provide a visual back navigation control
import { useNavigate } from 'react-router-dom'; // import navigation hook to programmatically change routes
import Nav from '../components/Nav'; // import Nav component to render the top navigation bar
import ai from '../assets/SearchAi.png'; // import AI image asset to visually represent AI search feature
import { useSelector } from 'react-redux'; // import useSelector to read data from redux store

function AllCourses() { // define a functional component named 'AllCourses' to display all courses with filtering capability
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // store sidebar visibility state to control mobile filter panel
  const [category, setCategory] = useState([]); // store selected categories to filter courses by category
  const [filterCourses, setFilterCourses] = useState([]); // store filtered course list to render based on applied filters
  
  const navigate = useNavigate(); // initialize navigate function to handle route changes
  
  const { courseData } = useSelector(state => state.course); // extract courseData from redux store to access all available courses

  const toggleCategory = (e) => { // define a function to add or remove a category from selected filters that takes the change event
    if (category.includes(e.target.value)) setCategory(prev => prev.filter(item => item !== e.target.value)); // remove category if already selected to toggle it off
    else setCategory(prev => [...prev, e.target.value]); // add category if not selected to toggle it on
  };

  const applyFilter = () => { // define a function to apply selected category filters on course data
    let courseCopy = courseData.slice(); // create a shallow copy of course data to avoid mutating redux state
    if (category.length > 0) courseCopy = courseCopy.filter(item => category.includes(item.category)); // filter courses matching selected categories
    setFilterCourses(courseCopy); // update filtered courses state to trigger re-render
  };

  useEffect(() => {
    setFilterCourses(courseData); // initialize filtered courses whenever course data changes
  }, [courseData]);

  useEffect(() => {
    applyFilter(); // re-apply filters whenever selected categories change
  }, [category]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Nav />

      <button
        onClick={() => setIsSidebarVisible(prev => !prev)} // toggle sidebar visibility on button click for mobile view
        className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-1 rounded md:hidden border-2 border-black"
      >
        {isSidebarVisible ? 'Hide' : 'Show'} Filters {/* conditionally render button label based on sidebar visibility state to indicate current toggle action */}
      </button>

      <aside
        className={`w-[260px] h-screen overflow-y-auto bg-black fixed top-0 left-0 p-6 py-[130px] border-r border-gray-200 shadow-md transition-transform duration-300 z-5 
        ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} 
        md:block md:translate-x-0`}
      >
        <h2 className="text-xl font-bold flex items-center justify-center gap-2 text-gray-50 mb-6">
          <FaArrowLeftLong
            onClick={() => navigate("/")} // navigate back to home page when arrow icon is clicked
          />
          Filter by Category
        </h2>

        <form
          className="space-y-4 text-sm bg-gray-600 border-white text-[white] border p-[20px] rounded-2xl"
          onSubmit={(e) => e.preventDefault()} // prevent form submission to avoid page reload
        >
          <button
            className="px-[10px] py-[10px] bg-black text-white rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => navigate("/searchwithai")} // navigate to AI search page when button is clicked
          >
            Search with AI
            <img src={ai} className="w-[30px] h-[30px] rounded-full" alt="" />
          </button>

          {/* for the following form input fields, call 'toggleCategory' method when the input value changes */}
          
          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'App Development'} onChange={toggleCategory} /> 
            App Development
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'AI/ML'} onChange={toggleCategory} /> 
            AI/ML
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'AI Tools'} onChange={toggleCategory} /> 
            AI Tools
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Data Science'} onChange={toggleCategory} /> 
            Data Science
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Data Analytics'} onChange={toggleCategory} /> 
            Data Analytics
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Ethical Hacking'} onChange={toggleCategory} /> 
            Ethical Hacking
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'UI UX Designing'} onChange={toggleCategory} /> 
            UI UX Designing
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Web Development'} onChange={toggleCategory} /> 
            Web Development
          </label>

          <label className="flex items-center gap-3 cursor-pointer hover:text-gray-200 transition">
            <input type="checkbox" value={'Others'} onChange={toggleCategory} /> 
            Others
          </label>
        </form>
      </aside>

      <main className="w-full transition-all duration-300 py-[130px] md:pl-[300px] flex items-start justify-center md:justify-start flex-wrap gap-6 px-[10px]">
        {
          filterCourses?.map((item, index) => ( // iterate over filtered courses to render each course card
            <Card
              key={index} // provide unique key to help React optimize list rendering
              thumbnail={item.thumbnail} // pass course thumbnail image to Card component
              title={item.title} // pass course title to Card component
              price={item.price} // pass course price to Card component
              category={item.category} // pass course category to Card component
              id={item._id} // pass course id to uniquely identify course
              reviews={item.reviews} // pass course reviews to display ratings or feedback
            />
          ))
        }
      </main>
    </div>
  );
}

export default AllCourses;