import React, { useState } from 'react' // import React library and useState hook to define and manage component state
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar' // import avatar-related components for displaying user profile images
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog' // import dialog components to create and control modal popups
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react' // import specific icon components from lucide-react library for UI actions
import { Button } from './ui/button' // import custom Button component for user interactions
import { FaHeart, FaRegHeart } from "react-icons/fa" // import filled and outlined heart icons from react-icons library for like/unlike functionality
import CommentDialog from './CommentDialog' // import CommentDialog component to handle displaying and adding comments
import { useDispatch, useSelector } from 'react-redux' // import hooks from react-redux to dispatch actions and select data from the Redux store
import axios from 'axios' // import axios library to make HTTP requests to backend APIs
import { toast } from 'sonner' // import toast function from sonner library to show notification popups
import { setPosts, setSelectedPost } from '@/redux/postSlice' // import Redux actions setPosts and setSelectedPost to manage post-related state
import { Badge } from './ui/badge' // import Badge component for displaying small highlighted labels or counts

const Post = ({ post }) => { // define a functional component named Post that takes a single prop 'post' representing a post object
    const [text, setText] = useState("") // define a state variable 'text' to store input text and use 'setText' to update it, initialized with an empty string
    
    const [open, setOpen] = useState(false) // define a state variable 'open' to track dialog visibility and use 'setOpen' to toggle it, initialized as false
    
    const { user } = useSelector(store => store.auth) // use useSelector hook to extract 'user' object from the Redux store's 'auth' state slice
    
    const { posts } = useSelector(store => store.post) // use useSelector hook to extract 'posts' array from the Redux store's 'post' state slice
    
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false) // define a state variable 'liked' to track if the user liked the post, initialized by checking if user's id exists in post.likes
    
    const [postLike, setPostLike] = useState(post.likes.length) // define a state variable 'postLike' to store the count of likes on the post, initialized to the length of post.likes
    
    const [comment, setComment] = useState(post.comments) // define a state variable 'comment' to hold comments of the post, initialized with post.comments array
    
    const dispatch = useDispatch() // initialize Redux's dispatch function to send actions to the Redux store

    const changeEventHandler = (e) => { // define a function 'changeEventHandler' to handle input field changes, with parameter 'e' for the event object
        const inputText = e.target.value // extract the input value from event target and assign to 'inputText'
        
        if (inputText.trim()) { // check if inputText contains non-whitespace characters
            setText(inputText) // update 'text' state with the trimmed inputText
        } else {
            setText("") // reset 'text' state to empty if input is only whitespace
        }
    }

    const likeOrDislikeHandler = async () => { // define an asynchronous function 'likeOrDislikeHandler' to handle like or dislike action
        try {
            const action = liked ? 'dislike' : 'like' // determine the action type based on the current 'liked' state
            
            const res = await axios.get( // send GET request to backend API using axios to toggle like/dislike
                `http://localhost:8080/api/v1/post/${post._id}/${action}`, // dynamically generate endpoint using post id and action type
                { withCredentials: true } // include credentials for authentication
            )
            
            console.log(res.data) // log response data to the console for debugging
            
            if (res.data.success) { // check if the backend response indicates a successful request
                const updatedLikes = liked ? postLike - 1 : postLike + 1 // calculate new like count based on the action
                
                setPostLike(updatedLikes) // update 'postLike' state with new like count
                
                setLiked(!liked) // toggle 'liked' state to reflect the new like status

                const updatedPostData = posts.map( // create a new posts array by mapping over existing posts
                    p => p._id === post._id ? { // find the current post by matching post id
                        ...p, // copy all properties of post
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id] // update the likes array by removing or adding user's id
                    } : p // keep other posts unchanged
                )
                
                dispatch(setPosts(updatedPostData)) // dispatch the updated posts array to the Redux store using setPosts action
                
                toast.success(res.data.message) // show a success toast notification with message from response
            }
        } catch (error) {
            console.log(error) // log any caught errors to the console
        }
    }

    const commentHandler = async () => { // define an asynchronous function 'commentHandler' to handle posting a new comment
        try {
            const res = await axios.post( // send POST request to backend API to add a comment
                `http://localhost:8080/api/v1/post/${post._id}/comment`, // dynamically generate endpoint using post id
                { text }, // send comment text as request body
                {
                    headers: { 'Content-Type': 'application/json' }, // specify JSON content type in request headers
                    withCredentials: true // include credentials for authentication
                }
            )
            
            console.log(res.data) // log the response data for debugging
            
            if (res.data.success) { // check if the API response indicates success
                const updatedCommentData = [...comment, res.data.comment] // append the new comment to the existing comment array
                
                setComment(updatedCommentData) // update 'comment' state with the new array

                const updatedPostData = posts.map( // create a new posts array reflecting updated comments
                    p => p._id === post._id ? { ...p, comments: updatedCommentData } : p // update the comments for the current post
                )

                dispatch(setPosts(updatedPostData)) // dispatch updated posts array to Redux store
                
                toast.success(res.data.message) // show success notification with response message
                
                setText("") // reset input text field after successful comment submission
            }
        } catch (error) {
            console.log(error) // log error to console for debugging
        }
    }

    const deletePostHandler = async () => { // define an asynchronous function 'deletePostHandler' to handle post deletion
        try {
            const res = await axios.delete( // send DELETE request to backend API to remove a post
                `http://localhost:8080/api/v1/post/delete/${post?._id}`, // dynamically build URL with optional chaining for post id
                { withCredentials: true } // include credentials for authentication
            )
            
            if (res.data.success) { // check if response indicates successful deletion
                const updatedPostData = posts.filter( // filter posts array to remove deleted post
                    (postItem) => postItem?._id !== post?._id // exclude post that matches the deleted post id
                )
                
                dispatch(setPosts(updatedPostData)) // dispatch the updated posts array to Redux store
                
                toast.success(res.data.message) // show success notification with response message
            }
        } catch (error) {
            console.log(error) // log error for debugging
            toast.error(error.response.data.messsage) // show error notification with message from server response
        }
    }

    const bookmarkHandler = async () => { // define an asynchronous function 'bookmarkHandler' to handle post bookmarking
        try {
            const res = await axios.get( // send GET request to backend API to bookmark/unbookmark post
                `http://localhost:8080/api/v1/post/${post?._id}/bookmark`, // dynamically construct URL with post id
                { withCredentials: true } // include credentials for authentication
            )
            
            if (res.data.success) { // check if bookmarking was successful
                toast.success(res.data.message) // show success message from backend
            }
        } catch (error) {
            console.log(error) // log error to console for debugging
        }
    }

    return ( // return the JSX structure that defines how the Post component will render on the UI
        <div className='my-8 w-full max-w-sm mx-auto'> 
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="post_image" /> 
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>
                        <h1>{post.author?.username}</h1>
                        {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>} {/* check if logged-in user is post author and display 'Author' badge */}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {
                            post?.author?._id !== user?._id && <Button variant='ghost' className="cursor-pointer w-fit text-[#ED4956] font-bold">Unfollow</Button> // render 'Unfollow' button only if the post is not authored by current user
                        }
                        <Button variant='ghost' className="cursor-pointer w-fit">Add to favorites</Button>
                        {
                            user && user?._id === post?.author._id && <Button onClick={deletePostHandler} variant='ghost' className="cursor-pointer w-fit">Delete</Button> // attach deletePostHandler function to delete button only if user is the author
                        }
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image}
                alt="post_img"
            />
            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-3'>
                    {
                        liked 
                            ? <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' />  // render filled heart icon if post is liked and attach likeOrDislikeHandler to toggle state
                            : <FaRegHeart onClick={likeOrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' /> // render outline heart icon if post not liked and attach same handler
                    }
                    <MessageCircle onClick={() => { // attach inline function to handle comment dialog open on clicking comment icon
                        dispatch(setSelectedPost(post)) // dispatch setSelectedPost action to store the currently selected post in Redux
                        setOpen(true) // update 'open' state to true to display comment dialog
                    }} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark onClick={bookmarkHandler} className='cursor-pointer hover:text-gray-600' /> {/* attach bookmarkHandler function to handle bookmarking when icon is clicked */}
            </div>
            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            {
                comment.length > 0 && ( // conditionally render link only if comments exist
                    <span onClick={() => { // attach click handler to open comment dialog
                        dispatch(setSelectedPost(post)) // dispatch action to set current post as selected
                        setOpen(true) // open comment dialog by setting open to true
                    }} className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span>
                )
            }
            <CommentDialog open={open} setOpen={setOpen} /> {/* pass open state and setOpen function as props to CommentDialog to control modal visibility */}
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text} // bind input value to 'text' state for controlled input behavior
                    onChange={changeEventHandler} // attach changeEventHandler to update text state as user types
                    className='outline-none text-sm w-full'
                />
                {
                    text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span> // render clickable 'Post' button only when text input is not empty, attach commentHandler to handle posting
                }
            </div>
        </div>
    )
}

export default Post // export Post component for use in other parts of the application