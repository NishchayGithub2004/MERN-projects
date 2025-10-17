import { CourseProgress } from "../models/courseProgress.js"; // import CourseProgress model to access user's course progress data from MongoDB
import { Course } from "../models/course.model.js"; // import Course model to access course-related data from MongoDB

export const getCourseProgress = async (req, res) => { // define an asynchronous function getCourseProgress to retrieve user's progress for a given course
    try { // start try block to handle any errors that occur during execution
        const { courseId } = req.params; // destructure courseId from request parameters to identify which course progress to fetch
        const userId = req.id; // extract userId from request object, typically assigned after authentication middleware

        let courseProgress = await CourseProgress.findOne({ // query CourseProgress model to find a record matching userId and courseId
            courseId, // specify courseId in query filter to match the course
            userId, // specify userId in query filter to match the user
        }).populate("courseId"); // populate courseId field to include full course details instead of just the ID

        const courseDetails = await Course.findById(courseId).populate("lectures"); // fetch complete course details and populate its lectures for more context

        if (!courseDetails) { // check if no course record is found for the given ID
            return res.status(404).json({ // return 404 Not Found response when course does not exist
                message: "Course not found", // send descriptive error message
            });
        }

        if (!courseProgress) { // check if user has not yet started or recorded progress for the course
            return res.status(200).json({ // return 200 OK response indicating no progress yet
                data: { // send structured response data
                    courseDetails, // include course details for the frontend to display
                    progress: [], // send empty progress array since user hasn't made progress
                    completed: false, // mark completed as false since no progress record exists
                },
            });
        }

        return res.status(200).json({ // send 200 OK response when user progress exists
            data: { // send structured response data
                courseDetails, // include full course details for display
                progress: courseProgress.lectureProgress, // include progress details from lectureProgress array showing which lectures are completed
                completed: courseProgress.completed, // include boolean flag indicating if the course is fully completed
            },
        });
    } catch (error) { // catch any unexpected runtime or database errors
        console.log(error); // log error to console for debugging purposes
    }
};

export const updateLectureProgress = async (req, res) => { // define an asynchronous function updateLectureProgress to update the user's progress for a specific lecture in a course
    try { // start try block to handle potential runtime errors
        const { courseId, lectureId } = req.params; // destructure courseId and lectureId from request parameters to identify which lecture in which course to update
        const userId = req.id; // extract userId from request object, usually added by authentication middleware

        let courseProgress = await CourseProgress.findOne({ courseId, userId }); // search for existing course progress record for the given user and course

        if (!courseProgress) { // check if no progress record exists for this user-course pair
            courseProgress = new CourseProgress({ // create a new CourseProgress document to initialize user's tracking data for the course
                userId, // assign the userId to link progress with the specific user
                courseId, // assign the courseId to link progress to the correct course
                completed: false, // initialize completed status as false since progress just started
                lectureProgress: [], // start with an empty array to track lecture-wise progress
            });
        }

        const lectureIndex = courseProgress.lectureProgress.findIndex( // find the index of the lecture in lectureProgress array
            (lecture) => lecture.lectureId === lectureId // match lecture by comparing stored lectureId with the given lectureId
        );

        if (lectureIndex !== -1) { // check if lecture already exists in the progress array
            courseProgress.lectureProgress[lectureIndex].viewed = true; // mark the lecture as viewed if it already exists
        } else { // if the lecture does not exist in the progress array
            courseProgress.lectureProgress.push({ // add a new entry in lectureProgress array
                lectureId, // assign the current lectureId being updated
                viewed: true, // mark the newly added lecture as viewed
            });
        }

        const lectureProgressLength = courseProgress.lectureProgress.filter( // calculate how many lectures have been viewed
            (lectureProg) => lectureProg.viewed // filter only those lectures that are marked as viewed
        ).length; // get the count of viewed lectures

        const course = await Course.findById(courseId); // fetch the course document from the database using courseId

        if (course.lectures.length === lectureProgressLength) { // compare number of viewed lectures with total lectures in the course
            courseProgress.completed = true; // if all lectures are viewed, mark the course as completed
        }

        await courseProgress.save(); // save the updated course progress record to the database

        return res.status(200).json({ // send a 200 OK response back to the client
            message: "Lecture progress updated successfully.", // include success message in response
        });
    } catch (error) { // catch any unexpected errors during the process
        console.log(error); // log the error to console for debugging purposes
    }
};

export const markAsCompleted = async (req, res) => { // define an asynchronous function markAsCompleted to mark all lectures of a course as viewed and course as completed for a user
    try { // start try block to handle potential runtime errors
        const { courseId } = req.params; // destructure courseId from request parameters to identify which course to update
        const userId = req.id; // extract userId from request object, typically added by authentication middleware

        const courseProgress = await CourseProgress.findOne({ courseId, userId }); // find the course progress record for the given user and course
        
        if (!courseProgress) { // check if no progress record exists for this user-course pair
            return res.status(404).json({ message: "Course progress not found" }); // return 404 Not Found if progress record does not exist
        }

        courseProgress.lectureProgress.map( // iterate over each lecture progress entry
            (lectureProgress) => (lectureProgress.viewed = true) // mark each lecture as viewed
        );
        
        courseProgress.completed = true; // mark the entire course as completed
        
        await courseProgress.save(); // save the updated progress record to the database
        
        return res.status(200).json({ message: "Course marked as completed." }); // return 200 OK response with success message
    } catch (error) { // catch any unexpected errors during execution
        console.log(error); // log the error for debugging purposes
    }
};

export const markAsInCompleted = async (req, res) => { // define an asynchronous function markAsInCompleted to reset all lectures of a course as not viewed and course as incomplete for a user
    try { // start try block to handle potential runtime errors
        const { courseId } = req.params; // destructure courseId from request parameters to identify which course to update
        const userId = req.id; // extract userId from request object, typically added by authentication middleware

        const courseProgress = await CourseProgress.findOne({ courseId, userId }); // find the course progress record for the given user and course
        
        if (!courseProgress) { // check if no progress record exists for this user-course pair
            return res.status(404).json({ message: "Course progress not found" }); // return 404 Not Found if progress record does not exist
        }

        courseProgress.lectureProgress.map( // iterate over each lecture progress entry
            (lectureProgress) => (lectureProgress.viewed = false) // mark each lecture as not viewed
        );
        
        courseProgress.completed = false; // mark the entire course as incomplete
        
        await courseProgress.save(); // save the updated progress record to the database
        
        return res.status(200).json({ message: "Course marked as incompleted." }); // return 200 OK response with success message
    } catch (error) { // catch any unexpected errors during execution
        console.log(error); // log the error for debugging purposes
    }
};