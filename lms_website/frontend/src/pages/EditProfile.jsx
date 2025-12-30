import axios from 'axios'; // import axios to perform HTTP requests to backend APIs
import React, { useState } from 'react'; // import React and useState hook to manage component state
import { useDispatch, useSelector } from 'react-redux'; // import redux hooks to read state and dispatch actions
import { serverUrl } from '../App'; // import serverUrl to construct backend API endpoints
import { setUserData } from '../redux/userSlice'; // import action to update user data in redux store
import { toast } from 'react-toastify'; // import toast to show success and error notifications
import { ClipLoader } from 'react-spinners'; // import loader component to indicate async operation progress
import { useNavigate } from 'react-router-dom'; // import navigation hook to redirect user programmatically
import { FaArrowLeftLong } from "react-icons/fa6"; // import back arrow icon for navigation UI

function EditProfile() { // define a functional component named 'EditProfile' to allow users to update their profile details
  let { userData } = useSelector(state => state.user); // extract userData from redux store to prefill profile form
  let [name, setName] = useState(userData.name || ""); // store user's name input and initialize from existing data
  let [description, setDescription] = useState(userData.description || ""); // store user's description input and initialize from existing data
  let [photoUrl, setPhotoUrl] = useState(null); // store selected profile image file before upload
  let [loading, setLoading] = useState(false); // store loading state to disable actions during API call
  
  let dispatch = useDispatch(); // initialize dispatch to update redux state
  let navigate = useNavigate(); // initialize navigate to redirect user after successful update

  const formData = new FormData(); // create FormData instance to send multipart form data including file

  formData.append("name", name); // append updated name value to form data payload
  formData.append("description", description); // append updated description value to form data payload
  formData.append("photoUrl", photoUrl); // append selected image file to form data payload

  // define a function to update user profile by sending data to backend API
  const updateProfile = async () => {
    setLoading(true); // enable loading state to indicate request in progress
    
    try {
      const result = await axios.post(serverUrl + "/api/user/updateprofile", formData, { withCredentials: true }); // send profile update request with credentials
      dispatch(setUserData(result.data)); // update redux store with latest user data from response
      navigate("/"); // redirect user to home page after successful update
      setLoading(false); // disable loading state after success
      toast.success("Profile Update Successfully"); // show success notification to user
    } catch (error) {
      toast.error("Profile Update Error"); // show error notification if update fails
      setLoading(false); // disable loading state after failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full relative">
        <FaArrowLeftLong onClick={() => navigate("/profile")} /> {/* navigate back to profile page when back icon is clicked */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Edit Profile</h2>

        <form onSubmit={(e) => e.preventDefault()}> {/* prevent default form submission to control submit via button */}
          <div className="flex flex-col items-center text-center">
            {userData.photoUrl
              ? <img src={userData?.photoUrl} /> /* render profile image when user has uploaded one */
              : <div>{userData?.name.slice(0, 1).toUpperCase()}</div> /* render user's first initial as fallback avatar */}
          </div>
          
          <div>
            <label>Select Avatar</label>
            <input
              type="file"
              name="photoUrl"
              onChange={(e) => setPhotoUrl(e.target.files[0])} /* capture selected file and store it in state */
            />
          </div>

          <div>
            <label>Full Name</label>
            <input
              type="text"
              placeholder={userData.name} /* show current name as placeholder for user reference */
              onChange={(e) => setName(e.target.value)} /* update name state as user types */
              value={name} /* bind input value to name state */
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              readOnly
              placeholder={userData.email} /* display email as read-only since it cannot be edited */
            />
          </div>

          <div>
            <label>Description</label>
            <textarea
              rows={3}
              onChange={(e) => setDescription(e.target.value)} /* update description state on text change */
              value={description} /* bind textarea value to description state */
            />
          </div>

          <button
            type="submit"
            disabled={loading} /* disable submit button while API request is in progress */
            onClick={updateProfile} /* trigger profile update when button is clicked */
          >
            {loading ? <ClipLoader size={30} color='white' /> : "Save Changes"} {/* show loader while saving, otherwise show button text */}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile