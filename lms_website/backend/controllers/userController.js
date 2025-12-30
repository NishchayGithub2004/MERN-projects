import uploadOnCloudinary from "../configs/cloudinary.js"; // import Cloudinary helper to upload user profile images
import User from "../models/userModel.js"; // import User model to read and update user account data

export const getCurrentUser = async ( // define an asynchronous function to fetch the authenticated user's profile which takes the following arguments
  req, // request context containing authenticated user identifier
  res // response handler used to return user data or errors
) => {
  try {
    const user = await User.findById(req.userId) // query the database for the authenticated user
      .select("-password") // exclude sensitive password field from the response
      .populate("enrolledCourses"); // attach enrolled course details for client consumption

    if (!user) return res.status(400).json({ message: "user does not found" }); // handle missing user records

    return res.status(200).json(user); // return sanitized user profile data
  } catch (error) {
    console.log(error); // log unexpected runtime issues
    return res.status(400).json({ message: "get current user error" }); // return failure response
  }
};

export const UpdateProfile = async ( // define an asynchronous function to update user profile details which takes the following arguments
  req, // request context carrying profile updates and optional file upload
  res // response handler used to return updated user data
) => {
  try {
    const userId = req.userId; // reference authenticated user identifier

    const { name, description } = req.body; // extract editable profile fields from request body

    let photoUrl; // declare variable to hold uploaded profile image URL

    if (req.file) photoUrl = await uploadOnCloudinary(req.file.path); // upload profile image when a file is provided

    const user = await User.findByIdAndUpdate( // apply profile updates to the user document
      userId,
      { name, description, photoUrl }
    );

    if (!user) return res.status(404).json({ message: "User not found" }); // handle updates targeting non-existent users

    await user.save(); // persist updated profile changes

    return res.status(200).json(user); // return updated user profile
  } catch (error) {
    console.log(error); // log update failures for debugging
    return res.status(500).json({ message: `Update Profile Error  ${error}` }); // return server-side error response
  }
};