import Stripe from "stripe"; // import Stripe library to handle payment processing and checkout session creation
import { Course } from "../models/course.model.js"; // import Course model to access course details from MongoDB
import { CoursePurchase } from "../models/coursePurchase.model.js"; // import CoursePurchase model to store payment and purchase information
import { Lecture } from "../models/lecture.model.js"; // import Lecture model though not used here, typically for course lectures
import { User } from "../models/user.model.js"; // import User model to interact with user data if needed

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // create a new instance of Stripe using the secret API key from environment variables for secure authentication

export const createCheckoutSession = async (req, res) => { // define an asynchronous function createCheckoutSession to initiate a Stripe checkout process
    try { // start try block to safely handle runtime errors
        const userId = req.id; // extract userId from request object, usually attached by authentication middleware after verifying token
        const { courseId } = req.body; // destructure courseId from request body to identify which course user wants to purchase

        const course = await Course.findById(courseId); // query Course model by courseId to get course details such as title, price, and thumbnail
        
        if (!course) return res.status(404).json({ message: "Course not found!" }); // check if course is not found and return 404 Not Found response if invalid courseId

        const newPurchase = new CoursePurchase({ // create a new instance of CoursePurchase model to represent a pending course purchase
            courseId, // store ID of the course being purchased
            userId, // store ID of the user making the purchase
            amount: course.coursePrice, // store the price of the course to track payment amount
            status: "pending", // set purchase status to pending until payment is completed
        });

        const session = await stripe.checkout.sessions.create({ // call Stripe API to create a new checkout session for payment
            payment_method_types: ["card"], // specify accepted payment method type as card
            
            line_items: [ // define line items array to represent what user is purchasing
                {
                    price_data: { // define pricing and product details for Stripe checkout
                        currency: "inr", // set currency as Indian Rupees
                        product_data: { // define metadata about the product being purchased
                            name: course.courseTitle, // set product name as the course title
                            images: [course.courseThumbnail], // set product image as the course thumbnail
                        },
                        unit_amount: course.coursePrice * 100, // set amount in smallest currency unit (paise) by multiplying course price by 100
                    },
                    quantity: 1, // set quantity to 1 as one course is purchased per transaction
                },
            ],
            
            mode: "payment", // specify checkout mode as one-time payment
            
            success_url: `http://localhost:5173/course-progress/${courseId}`, // define redirect URL after successful payment, leading to course progress page
            
            cancel_url: `http://localhost:5173/course-detail/${courseId}`, // define redirect URL if user cancels payment, leading back to course details page
            
            metadata: { // attach additional metadata for internal tracking
                courseId: courseId, // include course ID to link payment with course
                userId: userId, // include user ID to associate payment with the user
            },
            
            shipping_address_collection: { // specify that shipping address collection is required for user
                allowed_countries: ["IN"], // restrict shipping addresses to India
            },
        });

        if (!session.url) { // check if Stripe session did not return a valid URL
            return res // return a 400 Bad Request response if checkout session creation fails
                .status(400)
                .json({ success: false, message: "Error while creating session" });
        }

        newPurchase.paymentId = session.id; // store Stripe session ID in newPurchase to track transaction against this payment session
        
        await newPurchase.save(); // save the new purchase record in the database to record pending transaction

        return res.status(200).json({ // send 200 OK response when checkout session is successfully created
            success: true, // indicate success
            url: session.url, // send Stripe checkout session URL to frontend for redirection
        });
    } catch (error) { // catch any runtime errors during session creation
        console.log(error); // log error details for debugging purposes
    }
};

export const stripeWebhook = async (req, res) => { // define an asynchronous function stripeWebhook to handle Stripe webhook events using req and res
    let event; // declare variable event to store the constructed Stripe event object

    try { // start try block to safely handle webhook payload verification
        const payloadString = JSON.stringify(req.body, null, 2); // convert request body to JSON string with 2-space indentation for readability
        
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET; // retrieve webhook secret key from environment variables for event verification

        const header = stripe.webhooks.generateTestHeaderString({ // generate a mock test header string using Stripe's utility for testing webhooks
            payload: payloadString, // pass payload string as the payload to generate test header
            secret, // pass webhook secret key for signing the header
        });

        event = stripe.webhooks.constructEvent(payloadString, header, secret); // construct and verify event object using payload, header, and secret to ensure authenticity
    } catch (error) { // catch any errors that occur during event verification
        console.error("Webhook error:", error.message); // log webhook error message for debugging
        return res.status(400).send(`Webhook error: ${error.message}`); // return 400 Bad Request with error details if verification fails
    }

    if (event.type === "checkout.session.completed") { // check if webhook event type indicates successful checkout completion
        console.log("check session complete is called"); // log message to indicate that checkout completion is being handled

        try { // start nested try block to handle checkout session processing
            const session = event.data.object; // extract session object from event data containing payment and user details

            const purchase = await CoursePurchase.findOne({ // query CoursePurchase model to find purchase record linked with Stripe session ID
                paymentId: session.id, // match purchase by session ID (paymentId)
            }).populate({ path: "courseId" }); // populate courseId field to get associated course document details

            if (!purchase) { // check if no matching purchase record is found
                return res.status(404).json({ message: "Purchase not found" }); // return 404 Not Found response when purchase record missing
            }

            if (session.amount_total) { // check if total amount field exists in session data
                purchase.amount = session.amount_total / 100; // convert amount from smallest currency unit (paise) to rupees and assign it to purchase record
            }
            
            purchase.status = "completed"; // update purchase status to completed since payment was successful

            if (purchase.courseId && purchase.courseId.lectures.length > 0) { // check if course exists and has associated lectures
                await Lecture.updateMany( // update all lectures belonging to purchased course
                    { _id: { $in: purchase.courseId.lectures } }, // filter lectures whose IDs are in the course's lecture array
                    { $set: { isPreviewFree: true } } // set isPreviewFree field to true to grant user access
                );
            }

            await purchase.save(); // save updated purchase document to persist status and amount changes

            await User.findByIdAndUpdate( // update user's enrolledCourses list in User model
                purchase.userId, // pass user ID from purchase record to identify user
                { $addToSet: { enrolledCourses: purchase.courseId._id } }, // add course ID to enrolledCourses array without duplication
                { new: true } // use { new: true } option to return updated document (though unused here)
            );

            await Course.findByIdAndUpdate( // update course document to include user in enrolledStudents
                purchase.courseId._id, // pass course ID to identify course
                { $addToSet: { enrolledStudents: purchase.userId } }, // add user ID to enrolledStudents array without duplication
                { new: true } // use { new: true } option to return updated document (though unused here)
            );
        } catch (error) { // catch any errors that occur while processing checkout session
            console.error("Error handling event:", error); // log detailed error message for debugging
            return res.status(500).json({ message: "Internal Server Error" }); // return 500 Internal Server Error response for unhandled issues
        }
    }

    res.status(200).send(); // send 200 OK response to acknowledge successful receipt of webhook event
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => { // define an asynchronous function getCourseDetailWithPurchaseStatus to fetch course details along with user purchase status
    try { // start try block to handle runtime errors safely
        const { courseId } = req.params; // destructure courseId from request parameters to identify which course to retrieve
        const userId = req.id; // extract userId from request object, usually added after authentication middleware validation

        const course = await Course.findById(courseId) // query Course model to find course by its MongoDB ID
            .populate({ path: "creator" }) // populate creator field to replace creator ID with actual creator document
            .populate({ path: "lectures" }); // populate lectures field to include complete lecture documents associated with the course

        const purchased = await CoursePurchase.findOne({ userId, courseId }); // search CoursePurchase collection to check if user has purchased the specified course
        
        console.log(purchased); // log purchase record for debugging purposes

        if (!course) { // check if no course is found for the given courseId
            return res.status(404).json({ message: "course not found!" }); // return 404 Not Found response when invalid courseId is provided
        }

        return res.status(200).json({ // send 200 OK response when course data retrieval is successful
            course, // include course details in the response
            purchased: !!purchased, // send boolean value for purchase status by converting object existence to true or false
        });
    } catch (error) { // catch any unexpected runtime errors
        console.log(error); // log error for debugging purposes
    }
};

export const getAllPurchasedCourse = async (_, res) => { // define an asynchronous function getAllPurchasedCourse to retrieve all successfully purchased courses
    try { // start try block to handle errors during database query
        const purchasedCourse = await CoursePurchase.find({ // query CoursePurchase model to find all purchases
            status: "completed", // filter only those purchases whose status is marked as completed
        }).populate("courseId"); // populate courseId field to include actual course details instead of IDs
        
        if (!purchasedCourse) { // check if no completed purchase records exist
            return res.status(404).json({ // return 404 Not Found response if none found
                purchasedCourse: [], // send empty array to indicate no data available
            });
        }
        
        return res.status(200).json({ // send 200 OK response if purchased courses found
            purchasedCourse, // include list of purchased course documents in response
        });
    } catch (error) { // catch any runtime or database errors
        console.log(error); // log error details for debugging purposes
    }
};