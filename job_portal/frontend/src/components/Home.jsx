import React, { useEffect } from 'react' // import React for component creation and useEffect hook to perform side effects
import Navbar from './shared/Navbar' // import Navbar component to display the top navigation bar
import HeroSection from './HeroSection' // import HeroSection component for main introductory banner and search functionality
import CategoryCarousel from './CategoryCarousel' // import CategoryCarousel component to show job categories in a sliding layout
import LatestJobs from './LatestJobs' // import LatestJobs component to display recently posted job listings
import Footer from './shared/Footer' // import Footer component to show footer content at the bottom
import useGetAllJobs from '@/hooks/useGetAllJobs' // import custom hook to fetch all job listings from backend API
import { useSelector } from 'react-redux' // import useSelector hook to read Redux store state
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically navigate between pages

const Home = () => { // define a functional component named 'Home' to serve as the main landing page
    useGetAllJobs() // call the custom hook to load all job data when the component is rendered

    const { user } = useSelector(store => store.auth) // retrieve 'user' object from Redux auth slice to determine login role

    const navigate = useNavigate() // create a navigate instance to redirect user to specific routes

    useEffect(() => { // execute logic when component mounts
        if (user?.role === 'recruiter') navigate("/admin/companies") // if user is a recruiter, redirect to recruiter dashboard route
    }, []) // run this effect only once on initial render

    return (
        <div>
            <Navbar /> 
            <HeroSection /> 
            <CategoryCarousel /> 
            <LatestJobs /> 
            <Footer /> 
        </div>
    )
}

export default Home // export Home component for usage in route configuration or parent components
