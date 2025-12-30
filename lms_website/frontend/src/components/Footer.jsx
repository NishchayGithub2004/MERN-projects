import React from "react"; // import React to enable JSX syntax and functional component creation
import { useNavigate } from "react-router-dom"; // import useNavigate to programmatically change routes
import logo from "../assets/logo.jpg"; // import logo asset to display brand identity in the footer

const Footer = () => { // define a functional component to render the application footer
  let navigate = useNavigate(); // initialize navigation helper to redirect users on interaction
  
  return (
    <footer>
      <div>
        <div>
          <img
            src={logo} // inject logo image dynamically from imported asset
            alt="Logo"
          />
          <h2>Virtual Courses</h2>
          <p>
            AI-powered learning platform to help you grow smarter. Learn anything, anytime, anywhere.
          </p>
        </div>
        
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li onClick={() => navigate("/")}>Home</li> {/* navigate to home route when clicked */}
            <li onClick={() => navigate("/allcourses")}>Courses</li> {/* navigate to all courses page when clicked */}
            <li onClick={() => navigate("/login")}>Login</li> {/* navigate to login page when clicked */}
            <li onClick={() => navigate("/profile")}>My Profile</li> {/* navigate to user profile page when clicked */}
          </ul>
        </div>

        <div>
          <h3>Explore Categories</h3>
          <ul>
            <li>Web Development</li>
            <li>AI/ML</li>
            <li>Data Science</li>
            <li>UI/UX Design</li>
          </ul>
        </div>
      </div>

      <div>
        © {new Date().getFullYear()} {/* dynamically render the current year */}
        LearnAI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;