import uploadOnCloudinary from "../configs/cloudinary.js"; // import Cloudinary helper for handling media uploads related to courses
import Course from "../models/courseModel.js"; // import Course model to create and fetch course data
import Lecture from "../models/lectureModel.js"; // import Lecture model for course–lecture relationships
import User from "../models/userModel.js"; // import User model to associate courses with creators

export const createCourse = async ( // define an asynchronous function to create a new course which takes the following arguments
    req, // request context carrying course details and authenticated creator identifier
    res // response handler used to return creation result
) => {
    try {
        const { title, category } = req.body; // extract required course metadata from request body

        if (!title || !category) return res.status(400).json({ message: "title and category is required" }); // enforce mandatory fields before creation

        const course = await Course.create({ // create a new course document in the database
            title, // store course title provided by the creator
            category, // store course category for classification
            creator: req.userId // associate course with the authenticated creator
        });

        return res.status(201).json(course); // return newly created course data
    } catch (error) {
        return res.status(500).json({ message: `Failed to create course ${error}` }); // handle unexpected creation failures
    }
};

export const getPublishedCourses = async ( // define an asynchronous function to fetch all published courses which takes the following arguments
    req, // request context (unused but kept for consistency)
    res // response handler used to return published courses
) => {
    try {
        const courses = await Course.find({ isPublished: true }) // query only publicly available courses
            .populate("lectures reviews"); // attach related lectures and reviews for complete course data

        if (!courses) return res.status(404).json({ message: "Course not found" }); // handle empty result set

        return res.status(200).json(courses); // return list of published courses
    } catch (error) {
        return res.status(500).json({ message: `Failed to get All  courses ${error}` }); // handle retrieval errors
    }
};

export const getCreatorCourses = async ( // define an asynchronous function to fetch courses created by the authenticated user which takes the following arguments
    req, // request context containing authenticated creator identifier
    res // response handler used to return creator-specific courses
) => {
    try {
        const userId = req.userId; // reference authenticated user as course creator

        const courses = await Course.find({ creator: userId }); // fetch all courses authored by the user

        if (!courses) return res.status(404).json({ message: "Course not found" }); // handle missing creator courses

        return res.status(200).json(courses); // return creator-owned courses
    } catch (error) {
        return res.status(500).json({ message: `Failed to get creator courses ${error}` }); // handle query failures
    }
};

export const editCourse = async ( // define an asynchronous function to update editable fields of an existing course which takes the following arguments
    req, // request context carrying course identifier, update payload, and optional thumbnail file
    res // response handler used to return the updated course or errors
) => {
    try {
        const { courseId } = req.params; // extract target course identifier from route parameters

        const { title, subTitle, description, category, level, price, isPublished } = req.body; // extract allowed course fields from request body

        let thumbnail; // declare variable to hold uploaded thumbnail URL when provided

        if (req.file) thumbnail = await uploadOnCloudinary(req.file.path); // upload new thumbnail image if a file exists

        let course = await Course.findById(courseId); // fetch course to ensure it exists before updating

        if (!course) return res.status(404).json({ message: "Course not found" }); // block updates for invalid course identifiers

        const updateData = { title, subTitle, description, category, level, price, isPublished, thumbnail }; // consolidate updated fields into a single payload

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true }); // apply updates and return the latest course state

        return res.status(201).json(course); // return updated course details
    } catch (error) {
        return res.status(500).json({ message: `Failed to update course ${error}` }); // handle unexpected update failures
    }
};

export const getCourseById = async ( // define an asynchronous function to fetch a single course by identifier which takes the following arguments
    req, // request context containing course identifier
    res // response handler used to return course data
) => {
    try {
        const { courseId } = req.params; // extract course identifier from route parameters

        let course = await Course.findById(courseId); // retrieve course record from the database

        if (!course) return res.status(404).json({ message: "Course not found" }); // handle missing course records

        return res.status(200).json(course); // return course details
    } catch (error) {
        return res.status(500).json({ message: `Failed to get course ${error}` }); // handle retrieval failures
    }
};

export const removeCourse = async ( // define an asynchronous function to permanently delete a course which takes the following arguments
    req, // request context containing course identifier
    res // response handler used to return deletion status
) => {
    try {
        const courseId = req.params.courseId; // read course identifier from route parameters

        const course = await Course.findById(courseId); // fetch course to verify existence before deletion

        if (!course) return res.status(404).json({ message: "Course not found" }); // prevent deletion of non-existent courses

        await course.deleteOne(); // remove the course document from the database

        return res.status(200).json({ message: "Course Removed Successfully" }); // confirm successful deletion
    } catch (error) {
        console.error(error); // log deletion errors for debugging
        return res.status(500).json({ message: `Failed to remove course ${error}` }); // handle deletion failures
    }
};

export const createLecture = async ( // define an asynchronous function to create a lecture and attach it to a course which takes the following arguments
    req, // request context carrying lecture data and course identifier
    res // response handler used to return creation results
) => {
    try {
        const { lectureTitle } = req.body; // extract lecture title from request body

        const { courseId } = req.params; // extract target course identifier from route parameters

        if (!lectureTitle || !courseId) return res.status(400).json({ message: "Lecture Title required" }); // enforce required inputs before processing

        const lecture = await Lecture.create({ lectureTitle }); // create a new lecture record

        const course = await Course.findById(courseId); // load course to associate the lecture

        if (course) course.lectures.push(lecture._id); // link lecture to the course when course exists

        await course.populate("lectures"); // hydrate lecture references for response consistency

        await course.save(); // persist course–lecture association

        return res.status(201).json({ lecture, course }); // return created lecture and updated course
    } catch (error) {
        return res.status(500).json({ message: `Failed to Create Lecture ${error}` }); // handle lecture creation failures
    }
};

export const getCourseLecture = async ( // define an asynchronous function to fetch a course along with its lectures which takes the following arguments
    req, // request context containing course identifier
    res // response handler used to return course data
) => {
    try {
        const { courseId } = req.params; // extract course identifier from route parameters

        const course = await Course.findById(courseId); // retrieve course record

        if (!course) return res.status(404).json({ message: "Course not found" }); // handle invalid course identifiers

        await course.populate("lectures"); // load associated lecture documents

        await course.save(); // persist populated state if required by schema hooks

        return res.status(200).json(course); // return course with lectures
    } catch (error) {
        return res.status(500).json({ message: `Failed to get Lectures ${error}` }); // handle retrieval failures
    }
};

export const editLecture = async ( // define an asynchronous function to update lecture metadata and media which takes the following arguments
    req, // request context carrying lecture identifier, update payload, and optional video file
    res // response handler used to return the updated lecture
) => {
    try {
        const { lectureId } = req.params; // extract target lecture identifier from route parameters

        const { isPreviewFree, lectureTitle } = req.body; // extract editable lecture fields from request body

        const lecture = await Lecture.findById(lectureId); // load lecture to validate existence and apply updates

        if (!lecture) return res.status(404).json({ message: "Lecture not found" }); // stop processing for invalid lecture identifiers

        let videoUrl; // declare variable to hold uploaded video URL when provided

        if (req.file) {
            videoUrl = await uploadOnCloudinary(req.file.path); // upload lecture video when a file is present
            lecture.videoUrl = videoUrl; // assign uploaded video URL to the lecture
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle; // update lecture title only when a new value is provided

        lecture.isPreviewFree = isPreviewFree; // update preview accessibility flag

        await lecture.save(); // persist lecture changes

        return res.status(200).json(lecture); // return updated lecture data
    } catch (error) {
        return res.status(500).json({ message: `Failed to edit Lectures ${error}` }); // handle update failures
    }
};

export const removeLecture = async ( // define an asynchronous function to delete a lecture and unlink it from its course which takes the following arguments
    req, // request context containing lecture identifier
    res // response handler used to return deletion status
) => {
    try {
        const { lectureId } = req.params; // extract lecture identifier from route parameters

        const lecture = await Lecture.findByIdAndDelete(lectureId); // remove lecture document from the database

        if (!lecture) return res.status(404).json({ message: "Lecture not found" }); // handle deletion of non-existent lectures

        await Course.updateOne( // remove lecture reference from the associated course
            { lectures: lectureId }, // locate course containing the lecture
            { $pull: { lectures: lectureId } } // pull lecture identifier from lectures array
        );

        return res.status(200).json({ message: "Lecture Remove Successfully" }); // confirm successful removal
    } catch (error) {
        return res.status(500).json({ message: `Failed to remove Lectures ${error}` }); // handle deletion failures
    }
};

export const getCreatorById = async ( // define an asynchronous function to retrieve creator profile details by identifier which takes the following arguments
    req, // request context carrying creator identifier
    res // response handler used to return creator data
) => {
    try {
        const { userId } = req.body; // extract creator identifier from request body

        const user = await User.findById(userId).select("-password"); // load user profile while excluding sensitive fields

        if (!user) return res.status(404).json({ message: "User not found" }); // handle invalid user identifiers

        res.status(200).json(user); // return creator profile data
    } catch (error) {
        console.error("Error fetching user by ID:", error); // log retrieval failures
        res.status(500).json({ message: "get Creator error" }); // return server error response
    }
};