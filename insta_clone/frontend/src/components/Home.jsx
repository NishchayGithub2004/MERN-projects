import React from 'react' // import React library to use JSX and React features
import Feed from './Feed' // import Feed component to display the main posts feed
import { Outlet } from 'react-router-dom' // import Outlet to render nested routes inside Home
import RightSidebar from './RightSidebar' // import RightSidebar component to display suggested users and other info
import useGetAllPost from '@/hooks/useGetAllPost' // import custom hook to fetch all posts from backend
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers' // import custom hook to fetch suggested users for sidebar

const Home = () => { // define a functional component Home to render the main layout of the app
    useGetAllPost() // call custom hook to fetch all posts when Home component renders
    
    useGetSuggestedUsers() // call custom hook to fetch suggested users when Home component renders
    
    return (
        <div className='flex'> 
            <div className='flex-grow'>
                <Feed /> 
                <Outlet /> 
            </div>
            <RightSidebar /> 
        </div>
    )
}

export default Home
