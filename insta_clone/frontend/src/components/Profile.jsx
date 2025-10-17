import React, { useState } from 'react' // import React and useState hook for managing local component state
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar' // import avatar components to display user profile images
import useGetUserProfile from '@/hooks/useGetUserProfile' // import custom hook to fetch user profile data using user ID
import { Link, useParams } from 'react-router-dom' // import Link for navigation and useParams to access dynamic URL parameters
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store state
import { Button } from './ui/button' // import Button component for interaction elements
import { Badge } from './ui/badge' // import Badge component for highlighted labels
import { AtSign, Heart, MessageCircle } from 'lucide-react' // import icons for UI representation

const Profile = () => {
    const params = useParams() // call useParams hook to get URL parameters object containing route info
    
    const userId = params.id // extract 'id' parameter from URL and assign to userId
    
    useGetUserProfile(userId) // call custom hook with userId argument to fetch and update the user profile in Redux state
    
    const [activeTab, setActiveTab] = useState('posts') // create state variable 'activeTab' initialized as 'posts' to track selected tab between posts/saved
    
    const { userProfile, user } = useSelector(store => store.auth) // extract userProfile and current user objects from Redux auth slice

    const isLoggedInUserProfile = user?._id === userProfile?._id // check whether the logged-in user is viewing their own profile
    
    const isFollowing = false // temporary variable indicating follow status (to be managed later dynamically)

    const handleTabChange = (tab) => { // function to handle tab switching; receives tab name as argument
        setActiveTab(tab) // update activeTab state with selected tab value
    }

    const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks // choose which array to display (posts or bookmarks) based on current activeTab

    return (
        <div className='flex max-w-5xl justify-center mx-auto pl-10'>
            <div className='flex flex-col gap-20 p-8'>
                <div className='grid grid-cols-2'>
                    <section className='flex items-center justify-center'>
                        <Avatar className='h-32 w-32'>
                            <AvatarImage src={userProfile?.profilePicture} alt="profilephoto" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </section>
                    <section>
                        <div className='flex flex-col gap-5'>
                            <div className='flex items-center gap-2'>
                                <span>{userProfile?.username}</span>
                                {
                                    isLoggedInUserProfile ? ( // conditionally render profile buttons if logged-in user is viewing their own profile
                                        <>
                                            <Link to="/account/edit"><Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button></Link>
                                            <Button variant='secondary' className='hover:bg-gray-200 h-8'>View archive</Button>
                                            <Button variant='secondary' className='hover:bg-gray-200 h-8'>Ad tools</Button>
                                        </>
                                    ) : ( // otherwise render follow/unfollow options
                                        isFollowing ? (
                                            <>
                                                <Button variant='secondary' className='h-8'>Unfollow</Button>
                                                <Button variant='secondary' className='h-8'>Message</Button>
                                            </>
                                        ) : (
                                            <Button className='bg-[#0095F6] hover:bg-[#3192d2] h-8'>Follow</Button>
                                        )
                                    )
                                }
                            </div>
                            <div className='flex items-center gap-4'>
                                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
                            </div>
                        </div>
                    </section>
                </div>
                <div className='border-t border-t-gray-200'>
                    <div className='flex items-center justify-center gap-10 text-sm'>
                        <span className={`py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold' : ''}`} onClick={() => handleTabChange('posts')}> {/* trigger handleTabChange with 'posts' when clicked */}
                            POSTS
                        </span>
                        <span className={`py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold' : ''}`} onClick={() => handleTabChange('saved')}> {/* trigger handleTabChange with 'saved' when clicked */}
                            SAVED
                        </span>
                        <span className='py-3 cursor-pointer'>REELS</span>
                        <span className='py-3 cursor-pointer'>TAGS</span>
                    </div>
                    <div className='grid grid-cols-3 gap-1'>
                        {
                            displayedPost?.map((post) => { // iterate over displayedPost array and render each post dynamically
                                return (
                                    <div key={post?._id} className='relative group cursor-pointer'>
                                        <img src={post.image} alt='postimage' className='rounded-sm my-2 w-full aspect-square object-cover' />
                                        <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                                            <div className='flex items-center text-white space-x-4'>
                                                <button className='flex items-center gap-2 hover:text-gray-300'>
                                                    <Heart /> 
                                                    <span>{post?.likes.length}</span> {/* display total number of likes for post */}
                                                </button>
                                                <button className='flex items-center gap-2 hover:text-gray-300'>
                                                    <MessageCircle /> 
                                                    <span>{post?.comments.length}</span> {/* display total number of comments for post */}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile