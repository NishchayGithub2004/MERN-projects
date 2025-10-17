import React from 'react' // import React library to build the UI component
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store state
import { Link } from 'react-router-dom' // import Link component to navigate between profile pages
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar' // import avatar components for displaying user profile pictures

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth) // extract suggestedUsers array from Redux auth slice
    
    const users = Array.isArray(suggestedUsers) ? suggestedUsers : [];

    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
                <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {
                users.map((user) => { // iterate over each user in the suggestedUsers array
                    return (
                        <div key={user._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user?._id}`}> {/* navigate to the profile page of the suggested user */}
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="post_image" /> {/* display user's profile picture */}
                                        <AvatarFallback>CN</AvatarFallback> {/* fallback initials if image fails */}
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'>
                                        <Link to={`/profile/${user?._id}`}>{user?.username}</Link> {/* display username with link to profile */}
                                    </h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span> {/* show user's bio or placeholder */}
                                </div>
                            </div>
                            <span className='text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]'>Follow</span> {/* clickable follow button */}
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SuggestedUsers