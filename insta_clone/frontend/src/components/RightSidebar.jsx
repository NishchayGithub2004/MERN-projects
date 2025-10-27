import React from 'react' // import React to define the component
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar' // import Avatar components to display user profile image or fallback initials
import { useSelector } from 'react-redux' // import useSelector hook to access state from Redux store
import { Link } from 'react-router-dom' // import Link component to enable navigation to user profile routes
import SuggestedUsers from './SuggestedUsers' // import SuggestedUsers component to show user suggestions in sidebar

const RightSidebar = () => { 
    const { user } = useSelector(store => store.auth) // extract logged-in user data from the Redux store’s 'auth' slice

    return (
        <div className='w-fit my-10 pr-32'>
            <div className='flex items-center gap-2'>
                <Link to={`/profile/${user?._id}`}> {/* navigate to the logged-in user's profile using their unique ID */}
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="post_image" /> {/* display user profile picture */}
                        <AvatarFallback>CN</AvatarFallback> {/* show fallback initials if no profile picture exists */}
                    </Avatar>
                </Link>
                <div>
                    <h1 className='font-semibold text-sm'><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1> {/* display username as a link to profile */}
                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span> {/* show bio text or fallback message */}
                </div>
            </div>
            <SuggestedUsers /> {/* render list of suggested users to follow */}
        </div>
    )
}

export default RightSidebar
