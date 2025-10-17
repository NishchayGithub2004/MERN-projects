import React, { useEffect, useState } from 'react' // import React for JSX and useEffect/useState hooks for component lifecycle and state
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog' // import dialog components to display modal content
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar' // import avatar components to display user profile images
import { Link } from 'react-router-dom' // import Link for client-side navigation
import { MoreHorizontal } from 'lucide-react' // import horizontal menu icon from lucide-react library
import { Button } from './ui/button' // import reusable button component
import { useDispatch, useSelector } from 'react-redux' // import Redux hooks to read state and dispatch actions
import Comment from './Comment' // import Comment component to render each individual comment
import axios from 'axios' // import axios to perform HTTP requests
import { toast } from 'sonner' // import toast from sonner library to display success/error messages
import { setPosts } from '@/redux/postSlice' // import Redux action to update posts state

const CommentDialog = ({ open, setOpen }) => { // define a function component CommentDialog with open (boolean) and setOpen (function) props for controlling dialog visibility
    const [text, setText] = useState("") // define text state variable to store comment input text

    const { selectedPost, posts } = useSelector( // destructure selectedPost and posts from Redux post slice
        store => store.post // access post state from Redux store
    )

    const [comment, setComment] = useState([]) // define comment state variable to hold all comments of the selected post

    const dispatch = useDispatch() // create a dispatch function reference to trigger Redux actions

    useEffect(() => { // define side effect to update comment state whenever selectedPost changes
        if (selectedPost) { // check if selectedPost is available
            setComment(selectedPost.comments) // set comment state to the selectedPost’s comments array
        }
    }, [selectedPost]) // dependency ensures this runs when selectedPost changes

    const changeEventHandler = (e) => { // define a function changeEventHandler to handle input change event
        const inputText = e.target.value // extract input value from event target

        if (inputText.trim()) { // check if trimmed text is not empty
            setText(inputText) // update text state with valid input
        } else {
            setText("") // reset text to empty if user clears input
        }
    }

    const sendMessageHandler = async () => { // define async function sendMessageHandler to send a comment to the backend
        try {
            const res = await axios.post( // send POST request to comment endpoint of selectedPost
                `http://localhost:8080/api/v1/post/${selectedPost?._id}/comment`, // dynamic URL containing selectedPost ID
                { text }, // pass text state as request payload
                {
                    headers: { 'Content-Type': 'application/json' }, // specify JSON request format in header
                    withCredentials: true // include cookies for authentication
                }
            )

            if (res.data.success) { // check if comment submission was successful
                const updatedCommentData = [ // create new array with existing and new comment
                    ...comment,
                    res.data.comment
                ]

                setComment(updatedCommentData) // update comment state with new comments list

                const updatedPostData = posts.map( // create new posts array with updated comments for current post
                    p => p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p // replace matching post with updated comments
                )

                dispatch(setPosts(updatedPostData)) // dispatch updated posts array to Redux store

                toast.success(res.data.message) // display success toast with server message

                setText("") // reset comment input field after successful submission
            }
        } catch (error) { // handle API request errors
            console.log(error) // log error in console for debugging
        }
    }

    return ( // return JSX for comment dialog UI
        <Dialog open={open}> {/* pass open prop to control visibility of dialog */}
            <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col"> {/* close dialog when clicked outside */}
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img
                            src={selectedPost?.image}
                            alt="post_img"
                            className='w-full h-full object-cover rounded-l-lg'
                        />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex gap-3 items-center'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='font-semibold text-xs'>{selectedPost?.author?.username}</Link>
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center text-sm text-center">
                                    <div className='cursor-pointer w-full text-[#ED4956] font-bold'>
                                        Unfollow
                                    </div>
                                    <div className='cursor-pointer w-full'>
                                        Add to favorites
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            {
                                comment.map((comment) => ( // iterate over comment array to render each Comment component
                                    <Comment key={comment._id} comment={comment} /> // pass unique key and comment prop to Comment component
                                ))
                            }
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input 
                                    type="text" 
                                    value={text} // bind input value to text state for controlled input
                                    onChange={changeEventHandler} // call changeEventHandler to update text on every keystroke
                                    placeholder='Add a comment...' 
                                    className='w-full outline-none border text-sm border-gray-300 p-2 rounded' 
                                />
                                <Button 
                                    disabled={!text.trim()} // disable button if input is empty or whitespace
                                    onClick={sendMessageHandler} // trigger sendMessageHandler on click to send comment
                                    variant="outline"
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog
