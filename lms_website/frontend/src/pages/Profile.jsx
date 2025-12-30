import React from 'react'; // import React to define a functional component
import { useSelector } from 'react-redux'; // import useSelector to read user data from redux store
import { useNavigate } from 'react-router-dom'; // import useNavigate to programmatically change routes
import { FaArrowLeftLong } from "react-icons/fa6"; // import back arrow icon for navigation interaction

function Profile() { // define a function to render the user's profile details
  let { userData } = useSelector(state => state.user); // extract userData from redux store to display profile information

  let navigate = useNavigate(); // initialize navigate function to handle route changes

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex items-center justify-center ">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative">
        <FaArrowLeftLong onClick={() => navigate("/")} /> {/* navigate back to home page when back icon is clicked */}
        
        <div className="flex flex-col items-center text-center">
          {userData.photoUrl ? (
            <img src={userData?.photoUrl} />
          ) : (
            <div>
              {userData?.name.slice(0, 1).toUpperCase()} {/* derive and display first letter of user name as fallback avatar */}
            </div>
          )}
          <h2>{userData.name}</h2> {/* render user's full name */}
          <p>{userData.role}</p> {/* render user's role */}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <span>Email: </span>
            <span>{userData.email}</span> {/* display user's email address */}
          </div>

          <div>
            <span>Bio: </span>
            <span>{userData.description}</span> {/* display user's bio/description */}
          </div>

          <div>
            <span>Enrolled Courses: </span>
            <span>{userData.enrolledCourses.length}</span> {/* display count of enrolled courses */}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button onClick={() => navigate("/editprofile")}> {/* navigate to edit profile page on button click */}
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile