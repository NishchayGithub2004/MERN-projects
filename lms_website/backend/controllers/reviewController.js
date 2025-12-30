import Review from "../models/reviewModel.js"; // import Review model to create and query course reviews
import Course from "../models/courseModel.js"; // import Course model to validate courses and attach reviews

export const addReview = async ( // define an asynchronous function to add a user review to a course which takes the following arguments
  req, // request context carrying review data and authenticated user identifier
  res // response handler used to return review creation outcomes
) => {
  try {
    const { rating, comment, courseId } = req.body; // extract review content and target course identifier

    const userId = req.userId; // read authenticated user identifier injected by auth middleware

    const course = await Course.findById(courseId); // fetch course to ensure review is linked to a valid record

    if (!course) return res.status(404).json({ message: "Course not found" }); // block review creation for invalid courses

    const alreadyReviewed = await Review.findOne({ course: courseId, user: userId }); // check for an existing review by the same user

    if (alreadyReviewed) return res.status(400).json({ message: "You have already reviewed this course" }); // prevent duplicate reviews

    const review = new Review({ course: courseId, user: userId, rating, comment }); // construct a new review document

    await review.save(); // persist the review entry

    course.reviews.push(review._id); // associate the review with the course

    await course.save(); // persist course–review linkage

    return res.status(201).json(review); // return the newly created review
  } catch (error) {
    console.error("Add Review Error:", error); // log review creation failures
    return res.status(500).json({ message: "Server error" }); // return generic server error
  }
};

export const getCourseReviews = async ( // define an asynchronous function to retrieve reviews for a specific course which takes the following arguments
  req, // request context containing route parameters
  res // response handler used to return fetched reviews
) => {
  try {
    const { courseId } = req.params; // extract course identifier from URL parameters

    const reviews = await Review.find({ course: courseId }); // fetch all reviews linked to the course

    return res.status(200).json(reviews); // return the list of course reviews
  } catch (error) {
    return res.status(500).json({ message: "Error fetching reviews" }); // handle query failures
  }
};

export const getAllReviews = async ( // define an asynchronous function to retrieve all reviews across courses which takes the following arguments
  _, // unused request object as no request data is required
  res // response handler used to return aggregated reviews
) => {
  try {
    const reviews = await Review.find({}) // query all review documents
      .populate("user", "name photoUrl role") // enrich reviews with selected user fields
      .sort({ reviewedAt: -1 }); // order results by most recent reviews first

    return res.status(200).json(reviews); // return the aggregated review list
  } catch (error) {
    console.error("Error fetching reviews:", error); // log retrieval failures
    return res.status(500).json({ message: "Failed to fetch reviews" }); // return generic server error
  }
};