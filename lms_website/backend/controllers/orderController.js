import Course from "../models/courseModel.js"; // import Course model to read and update course-related data
import razorpay from "razorpay"; // import Razorpay SDK to create and verify payment orders
import User from "../models/userModel.js"; // import User model to manage enrollments after successful payment
import dotenv from "dotenv"; // import dotenv to load Razorpay credentials from environment variables

dotenv.config(); // initialize environment variables for secure configuration access

const razorpayInstance = new razorpay({ // initialize a Razorpay client instance to communicate with the payment gateway
  key_id: process.env.RAZORPAY_KEY_ID, // provide Razorpay public key for request authentication
  key_secret: process.env.RAZORPAY_SECRET, // provide Razorpay secret key to authorize sensitive operations
});

export const createOrder = async ( // define an asynchronous function to create a Razorpay order for course purchase which takes the following arguments
  req, // HTTP request object containing course identifier
  res // HTTP response object used to return order details or errors
) => {
  try {
    const { courseId } = req.body; // extract course identifier sent by the client

    const course = await Course.findById(courseId); // retrieve course details to determine payable amount

    if (!course) return res.status(404).json({ message: "Course not found" }); // prevent order creation for non-existent courses

    const options = { // construct Razorpay order configuration
      amount: course.price * 100, // convert course price to the smallest currency unit required by Razorpay
      currency: "INR", // specify transaction currency
      receipt: `${courseId}.toString()`, // attach course-based receipt reference for tracking
    };

    const order = await razorpayInstance.orders.create(options); // create a payment order with Razorpay

    return res.status(200).json(order); // return the created order details to the client
  } catch (err) {
    console.log(err); // log order creation errors for operational visibility
    return res.status(500).json({ message: `Order creation failed ${err}` }); // notify client about server-side failure
  }
};

export const verifyPayment = async ( // define an asynchronous function to verify Razorpay payment and enroll the user which takes the following arguments
  req, // HTTP request object containing payment and enrollment identifiers
  res // HTTP response object used to return verification outcome
) => {
  try {
    const { razorpay_order_id, courseId, userId } = req.body; // extract required identifiers for payment verification and enrollment

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id); // fetch payment status directly from Razorpay

    if (orderInfo.status === "paid") {
      const user = await User.findById(userId); // load user record to update enrolled courses

      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId); // add course to user enrollments only if not already present
        await user.save(); // persist updated enrollment data
      }

      const course = await Course.findById(courseId).populate("lectures"); // load course with lecture data for enrollment tracking

      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId); // register user as an enrolled student for the course
        await course.save(); // persist course enrollment changes
      }

      return res.status(200).json({ message: "Payment verified and enrollment successful" }); // confirm successful payment and enrollment
    } else {
      return res.status(400).json({ message: "Payment verification failed (invalid signature)" }); // reject enrollment when payment is not confirmed
    }
  } catch (error) {
    console.log(error); // log verification errors for debugging
    return res.status(500).json({ message: "Internal server error during payment verification" }); // return generic failure response
  }
};