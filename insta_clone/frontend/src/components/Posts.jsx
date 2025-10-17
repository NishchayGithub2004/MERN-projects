import React from 'react' // import React library to create a functional component
import Post from './Post' // import Post component to render individual post details
import { useSelector } from 'react-redux' // import useSelector hook from react-redux to access Redux store state

const Posts = () => { // define a functional component named Posts to display a list of posts
    const { posts } = useSelector(store => store.post) // use useSelector hook to extract 'posts' array from Redux store's 'post' slice
    
    return (
        <div>
            {
                posts.map((post) => <Post key={post._id} post={post} />) // iterate through posts array and render a Post component for each item, using post._id as unique key and passing post object as prop
            }
        </div>
    )
}

export default Posts