import axios from 'axios'; // import axios to perform HTTP requests to backend authentication APIs
import React, { useState } from 'react'; // import React and useState hook to manage component state
import { useNavigate } from 'react-router-dom'; // import navigation hook to redirect user between routes
import { ClipLoader } from 'react-spinners'; // import loader component to indicate async processing state
import { serverUrl } from '../App'; // import serverUrl to build authentication API endpoints
import { toast } from 'react-toastify'; // import toast to display success and error notifications

function ForgotPassword() { // define a functional component named 'ForgotPassword' to handle multi-step password recovery flow
  let navigate = useNavigate(); // initialize navigate function to redirect user after password reset

  const [step, setStep] = useState(1); // store current step of forgot password flow to control UI progression
  const [email, setEmail] = useState(""); // store user's email to identify account for password reset
  const [otp, setOtp] = useState(""); // store one-time password entered by user for verification
  const [loading, setLoading] = useState(false); // store loading state to block actions during API calls
  const [newpassword, setNewPassword] = useState(""); // store new password entered by the user
  const [conPassword, setConpassword] = useState(""); // store confirmation password to validate password match

  const handleStep1 = async () => { // define a function to send OTP to user's email for password reset
    setLoading(true); // enable loading state while sending OTP request

    try {
      const result = await axios.post(`${serverUrl}/api/auth/sendotp`, { email }, { withCredentials: true }); // request backend to send OTP to provided email
      setStep(2); // move to OTP verification step after successful OTP send
      toast.success(result.data.message); // notify user that OTP has been sent successfully
      setLoading(false); // disable loading state after successful request
    } catch (error) {
      toast.error(error.response.data.message); // display backend error message if OTP sending fails
      setLoading(false); // disable loading state after failure
    }
  };

  const handleStep2 = async () => { // define a function to verify OTP entered by the user
    setLoading(true); // enable loading state while verifying OTP

    try {
      const result = await axios.post(`${serverUrl}/api/auth/verifyotp`, { email, otp }, { withCredentials: true }); // verify OTP against backend
      toast.success(result.data.message); // notify user of successful OTP verification
      setLoading(false); // disable loading state after success
      setStep(3); // move to password reset step after OTP verification
    } catch (error) {
      toast.error(error.response.data.message); // display backend error message if OTP verification fails
      setLoading(false); // disable loading state after failure
    }
  };

  const handleStep3 = async () => { // define a function to reset user password after successful OTP verification
    setLoading(true); // enable loading state while resetting password

    try {
      if (newpassword !== conPassword) return toast.error("password does not match"); // validate password confirmation before making API call
      const result = await axios.post(
        `${serverUrl}/api/auth/resetpassword`,
        { email, password: newpassword },
        { withCredentials: true }
      ); // send new password to backend to update user credentials
      toast.success(result.data.message); // notify user of successful password reset
      setLoading(false); // disable loading state after success
      navigate("/login"); // redirect user to login page after password reset
    } catch (error) {
      toast.error(error.response.data.message); // display backend error message if password reset fails
      setLoading(false); // disable loading state after failure
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {step == 1 && ( // conditionally render step 1 UI when current step is email input
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Your Password?</h2>
  
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Enter your email address</label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)} // update email state as user types to capture account identifier
                value={email} // bind input value to email state to keep it controlled
                required
              />
            </div>
  
            <button
              type="submit"
              disabled={loading} // disable button while OTP request is in progress
              onClick={handleStep1} // trigger OTP send logic for step 1
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"} {/* show loader during request, otherwise show action text */}
            </button>
          </form>
  
          <div onClick={() => navigate("/login")}> {/* navigate back to login screen on click */}
            Back to Login
          </div>
        </div>
      )}
  
      {step == 2 && ( // conditionally render step 2 UI when OTP verification is required
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Enter OTP</h2>
  
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Please enter the 4-digit code sent to your email.
              </label>
              <input
                type="text"
                onChange={(e) => setOtp(e.target.value)} // update otp state as user enters verification code
                value={otp} // bind input value to otp state for controlled input
                required
              />
            </div>
  
            <button
              type="submit"
              disabled={loading} // prevent multiple OTP verification requests
              onClick={handleStep2} // trigger OTP verification logic for step 2
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Verify OTP"} {/* show loader while verifying OTP */}
            </button>
          </form>
  
          <div onClick={() => navigate("/login")}> {/* allow user to exit flow and return to login */}
            Back to Login
          </div>
        </div>
      )}
  
      {step == 3 && ( // conditionally render step 3 UI when password reset is allowed
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Reset Your Password</h2>
  
          <p className="text-sm text-gray-500 text-center mb-6">
            Enter a new password below to regain access to your account.
          </p>
  
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}> {/* prevent default form submission to control via button */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="text"
                onChange={(e) => setNewPassword(e.target.value)} // update new password state from user input
                value={newpassword} // bind input value to new password state
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="text"
                onChange={(e) => setConpassword(e.target.value)} // update confirmation password state to validate match
                value={conPassword} // bind input value to confirmation password state
              />
            </div>
  
            <button
              type="submit"
              onClick={handleStep3} // trigger final password reset logic
            >
              {loading ? <ClipLoader size={30} color="white" /> : "Reset Password"} {/* indicate reset progress or show action text */}
            </button>
          </form>
  
          <div onClick={() => navigate("/login")}> {/* redirect user back to login after reset or cancellation */}
            Back to Login
          </div>
        </div>
      )}
    </div>
  );  
}

export default ForgotPassword