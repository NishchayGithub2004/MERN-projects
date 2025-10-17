import { Course } from "../models/course.model.js"; // import Course model to interact with the courses collection in the database
import { Lecture } from "../models/lecture.model.js"; // import Lecture model to interact with the lectures collection in the database
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js"; // import Cloudinary utility functions to handle media upload and deletion

export const createCourse = async (req, res) => { // define a function createCourse to handle HTTP POST requests for creating a course, takes req and res objects
    try { // start try block to catch potential errors during execution
        const { courseTitle, category } = req.body; // destructure courseTitle and category from request body to extract course details

        if (!courseTitle || !category) { // check if either courseTitle or category is missing from request
            return res.status(400).json({ // return 400 Bad Request response with error message
                message: "Course title and category is required." // provide error message indicating missing required fields
            })
        }

        const course = await Course.create({ // create a new course document in the database asynchronously using Course model
            courseTitle, // set courseTitle field from request body
            category, // set category field from request body
            creator: req.id // set creator field using authenticated user's ID from request object
        });

        return res.status(201).json({ // return 201 Created response with the newly created course object
            course, // include created course document in response
            message: "Course created." // include success message
        })
    } catch (error) { // catch any errors thrown in try block
        console.log(error); // log the error to the console for debugging purposes
        
        return res.status(500).json({ // return 500 Internal Server Error response if course creation fails
            message: "Failed to create course" // include error message in response
        })
    }
}

export const searchCourse = async (req, res) => { // define a function searchCourse to handle HTTP GET requests for searching courses, takes req and res objects
    try { // start try block to handle potential errors
        const { query = "", categories = [], sortByPrice = "" } = req.query; // destructure query, categories, and sortByPrice from request query parameters with default values

        console.log(categories); // log categories array to console for debugging purposes

        const searchCriteria = { // define searchCriteria object to specify conditions for querying courses in database
            isPublished: true, // only include courses that are published
            $or: [ // use $or to match any of the following conditions
                { courseTitle: { $regex: query, $options: "i" } }, // match courseTitle containing query string, case-insensitive
                { subTitle: { $regex: query, $options: "i" } }, // match subTitle containing query string, case-insensitive
                { category: { $regex: query, $options: "i" } }, // match category containing query string, case-insensitive
            ]
        }

        if (categories.length > 0) { // check if categories array has any values
            searchCriteria.category = { $in: categories }; // filter courses to include only those whose category is in the categories array
        }

        const sortOptions = {}; // define empty sortOptions object to dynamically set sorting for query
        
        if (sortByPrice === "low") { // check if sortByPrice parameter is "low"
            sortOptions.coursePrice = 1; // set coursePrice sorting in ascending order
        } else if (sortByPrice === "high") { // check if sortByPrice parameter is "high"
            sortOptions.coursePrice = -1; // set coursePrice sorting in descending order
        }

        let courses = await Course.find(searchCriteria) // query Course collection using searchCriteria
            .populate({ path: "creator", select: "name photoUrl" }) // populate creator field with name and photoUrl from user collection
            .sort(sortOptions); // sort results based on sortOptions

        return res.status(200).json({ // return 200 OK response with search results
            success: true, // include success flag
            courses: courses || [] // include courses array or empty array if no results found
        });
    } catch (error) { // catch any errors thrown during the try block
        console.log(error); // log error to console for debugging purposes
    }
}

export const getPublishedCourse = async (_, res) => { // define a function getPublishedCourse to fetch all published courses, takes request (_) and response (res) objects; request is ignored here
    try { // start try block to handle potential errors
        const courses = await Course.find({ isPublished: true }) // query Course collection to find all documents where isPublished is true
            .populate({ path: "creator", select: "name photoUrl" }); // populate creator field with user's name and photoUrl

        if (!courses) { // check if no courses are found
            return res.status(404).json({ // return 404 Not Found response with error message
                message: "Course not found" // include message indicating no published courses exist
            })
        }

        return res.status(200).json({ // return 200 OK response with the fetched courses
            courses, // include the courses array in response
        })
    } catch (error) { // catch any errors thrown in try block
        console.log(error); // log the error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if fetching courses fails
            message: "Failed to get published courses" // include error message
        })
    }
}

export const getCreatorCourses = async (req, res) => { // define a function getCreatorCourses to fetch all courses created by the authenticated user, takes req and res objects
    try { // start try block to handle potential errors
        const userId = req.id; // extract authenticated user's ID from request object

        const courses = await Course.find({ creator: userId }); // query Course collection to find all courses where creator matches userId

        if (!courses) { // check if no courses are found
            return res.status(404).json({ // return 404 Not Found response with empty array and error message
                courses: [], // include empty courses array
                message: "Course not found" // include message indicating no courses exist for this user
            })
        };

        return res.status(200).json({ // return 200 OK response with the fetched courses
            courses, // include courses array in response
        })
    } catch (error) { // catch any errors thrown in try block
        console.log(error); // log error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if fetching creator's courses fails
            message: "Failed to create course" // include error message (note: message text could be adjusted to "Failed to get creator courses" for clarity)
        })
    }
}

export const editCourse = async (req, res) => { // define a function editCourse to handle updating an existing course, takes req and res objects
    try { // start try block to catch potential errors
        const courseId = req.params.courseId; // extract courseId from request parameters to identify which course to update
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body; // destructure updated course fields from request body
        const thumbnail = req.file; // get uploaded thumbnail file from request, if any

        let course = await Course.findById(courseId); // fetch course document from database by courseId

        if (!course) { // check if course does not exist
            return res.status(404).json({ // return 404 Not Found response with error message
                message: "Course not found!" // indicate the specified course could not be found
            })
        }

        let courseThumbnail; // declare variable to store new thumbnail URL if uploaded

        if (thumbnail) { // check if a new thumbnail is provided
            if (course.courseThumbnail) { // check if course already has a thumbnail
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0]; // extract publicId from existing thumbnail URL for deletion
                await deleteMediaFromCloudinary(publicId); // delete old thumbnail from Cloudinary using publicId
            }

            courseThumbnail = await uploadMedia(thumbnail.path); // upload new thumbnail to Cloudinary and store returned data
        }

        const updateData = { // prepare object with updated course data for database update
            courseTitle, // updated courseTitle
            subTitle, // updated subTitle
            description, // updated description
            category, // updated category
            courseLevel, // updated courseLevel
            coursePrice, // updated coursePrice
            courseThumbnail: courseThumbnail?.secure_url // set courseThumbnail URL if a new thumbnail was uploaded
        };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true }); // update course document in database by courseId with new data and return updated document

        return res.status(200).json({ // return 200 OK response with updated course
            course, // include updated course object in response
            message: "Course updated successfully." // include success message
        })
    } catch (error) { // catch any errors thrown during try block
        console.log(error); // log error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if course update fails
            message: "Failed to create course" // include error message (note: message text could be adjusted to "Failed to update course" for clarity)
        })
    }
}

export const getCourseById = async (req, res) => { // define a function getCourseById to fetch a single course by its ID, takes req and res objects
    try { // start try block to catch potential errors
        const { courseId } = req.params; // destructure courseId from request parameters to identify which course to fetch

        const course = await Course.findById(courseId); // fetch course document from database by courseId

        if (!course) { // check if no course is found
            return res.status(404).json({ // return 404 Not Found response with error message
                message: "Course not found!" // indicate the specified course does not exist
            })
        }

        return res.status(200).json({ // return 200 OK response with the fetched course
            course // include course object in response
        })
    } catch (error) { // catch any errors thrown during try block
        console.log(error); // log error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if fetching course fails
            message: "Failed to get course by id" // include error message
        })
    }
}

export const createLecture = async (req, res) => { // define a function createLecture to create a new lecture and associate it with a course, takes req and res objects
    try { // start try block to catch potential errors
        const { lectureTitle } = req.body; // destructure lectureTitle from request body to get lecture name
        const { courseId } = req.params; // destructure courseId from request parameters to identify associated course

        if (!lectureTitle || !courseId) { // check if either lectureTitle or courseId is missing
            return res.status(400).json({ // return 400 Bad Request response with error message
                message: "Lecture title is required" // indicate missing lecture title
            })
        };

        const lecture = await Lecture.create({ lectureTitle }); // create a new lecture document in database with provided lectureTitle

        const course = await Course.findById(courseId); // fetch course document from database by courseId

        if (course) { // check if course exists
            course.lectures.push(lecture._id); // add newly created lecture's ID to course's lectures array
            await course.save(); // save updated course document to database
        }

        return res.status(201).json({ // return 201 Created response with the newly created lecture
            lecture, // include lecture object in response
            message: "Lecture created successfully." // include success message
        });
    } catch (error) { // catch any errors thrown during try block
        console.log(error); // log error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if lecture creation fails
            message: "Failed to create lecture" // include error message
        })
    }
}

export const getCourseLecture = async (req, res) => { // define a function getCourseLecture to fetch all lectures of a specific course, takes req and res objects
    try { // start try block to handle potential errors
        const { courseId } = req.params; // destructure courseId from request parameters to identify the course

        const course = await Course.findById(courseId).populate("lectures"); // fetch course by courseId and populate its lectures array with lecture documents

        if (!course) { // check if course does not exist
            return res.status(404).json({ // return 404 Not Found response with error message
                message: "Course not found" // indicate that the specified course was not found
            })
        }

        return res.status(200).json({ // return 200 OK response with course lectures
            lectures: course.lectures // include populated lectures array in response
        });
    } catch (error) { // catch any errors thrown during try block
        console.log(error); // log error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if fetching lectures fails
            message: "Failed to get lectures" // include error message
        })
    }
}

export const editLecture = async (req, res) => { // define a function editLecture to update lecture details, takes req and res objects
    try { // start try block to handle potential errors
        const { lectureTitle, videoInfo, isPreviewFree } = req.body; // destructure lectureTitle, videoInfo object, and isPreviewFree flag from request body
        const { courseId, lectureId } = req.params; // destructure courseId and lectureId from request parameters

        const lecture = await Lecture.findById(lectureId); // fetch lecture document by lectureId

        if (!lecture) { // check if lecture does not exist
            return res.status(404).json({ // return 404 Not Found response with error message
                message: "Lecture not found!" // indicate the specified lecture was not found
            })
        }

        if (lectureTitle) lecture.lectureTitle = lectureTitle; // update lectureTitle if provided in request body

        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl; // update videoUrl if provided inside videoInfo object

        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId; // update publicId if provided inside videoInfo object

        lecture.isPreviewFree = isPreviewFree; // update isPreviewFree flag based on request body

        await lecture.save(); // save updated lecture document to database

        const course = await Course.findById(courseId); // fetch course document by courseId

        if (course && !course.lectures.includes(lecture._id)) { // check if course exists and lecture is not already in course's lectures array
            course.lectures.push(lecture._id); // add lecture ID to course's lectures array
            await course.save(); // save updated course document to database
        };

        return res.status(200).json({ // return 200 OK response with updated lecture
            lecture, // include updated lecture object in response
            message: "Lecture updated successfully." // include success message
        })
    } catch (error) { // catch any errors thrown during try block
        console.log(error); // log error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if editing lecture fails
            message: "Failed to edit lectures" // include error message
        })
    }
}

export const removeLecture = async (req, res) => { // define a function removeLecture to delete a lecture and update associated course, takes req and res objects
    try { // start try block to handle potential errors
        const { lectureId } = req.params; // destructure lectureId from request parameters to identify the lecture to delete

        const lecture = await Lecture.findByIdAndDelete(lectureId); // delete lecture document by lectureId and return the deleted document

        if (!lecture) { // check if lecture was not found
            return res.status(404).json({ // return 404 Not Found response with error message
                message: "Lecture not found!" // indicate that the specified lecture does not exist
            });
        }

        if (lecture.publicId) { // check if lecture has an associated video in Cloudinary
            await deleteVideoFromCloudinary(lecture.publicId); // delete video from Cloudinary using lecture's publicId
        }

        await Course.updateOne( // update course document containing this lecture
            { lectures: lectureId }, // find course where lectures array contains lectureId
            { $pull: { lectures: lectureId } } // remove lectureId from course's lectures array using $pull operator
        );

        return res.status(200).json({ // return 200 OK response after successful deletion
            message: "Lecture removed successfully." // include success message
        })
    } catch (error) { // catch any errors thrown during try block
        console.log(error); // log error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if lecture removal fails
            message: "Failed to remove lecture" // include error message
        })
    }
}

export const getLectureById = async (req, res) => { // define a function getLectureById to fetch a single lecture by its ID, takes req and res objects
    try { // start try block to handle potential errors
        const { lectureId } = req.params; // destructure lectureId from request parameters

        const lecture = await Lecture.findById(lectureId); // fetch lecture document by lectureId

        if (!lecture) { // check if lecture does not exist
            return res.status(404).json({ // return 404 Not Found response with error message
                message: "Lecture not found!" // indicate the specified lecture was not found
            });
        }

        return res.status(200).json({ // return 200 OK response with the fetched lecture
            lecture // include lecture object in response
        });
    } catch (error) { // catch any errors thrown during try block
        console.log(error); // log error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if fetching lecture fails
            message: "Failed to get lecture by id" // include error message
        })
    }
}

export const togglePublishCourse = async (req, res) => { // define a function togglePublishCourse to publish or unpublish a course, takes req and res objects
    try { // start try block to handle potential errors
        const { courseId } = req.params; // destructure courseId from request parameters
        const { publish } = req.query; // destructure publish flag from query parameters

        const course = await Course.findById(courseId); // fetch course document by courseId

        if (!course) { // check if course does not exist
            return res.status(404).json({ // return 404 Not Found response with error message
                message: "Course not found!" // indicate the specified course was not found
            });
        }

        course.isPublished = publish === "true"; // set course's isPublished field based on publish query parameter

        await course.save(); // save updated course document to database

        const statusMessage = course.isPublished ? "Published" : "Unpublished"; // create status message based on course's published state

        return res.status(200).json({ // return 200 OK response with status message
            message: `Course is ${statusMessage}` // include message indicating current publish status
        });
    } catch (error) { // catch any errors thrown during try block
        console.log(error); // log error to console for debugging

        return res.status(500).json({ // return 500 Internal Server Error response if updating publish status fails
            message: "Failed to update status" // include error message
        })
    }
}