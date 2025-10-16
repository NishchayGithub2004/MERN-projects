import React, { useEffect } from 'react' // import React library and useEffect hook to handle side effects
import Navbar from './shared/Navbar' // import Navbar component for top navigation
import HeroSection from './HeroSection' // import HeroSection component for main banner section
import CategoryCarousel from './CategoryCarousel' // import CategoryCarousel to display job categories in a carousel
import LatestJobs from './LatestJobs' // import LatestJobs component to show recent job listings
import Footer from './shared/Footer' // import Footer component for the page bottom section
import useGetAllJobs from '@/hooks/useGetAllJobs' // import custom hook to fetch all jobs from API
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store state
import { useNavigate } from 'react-router-dom' // import useNavigate hook to handle programmatic navigation

const Home = () => {
    useGetAllJobs() // call custom hook to load all job data on component mount

    const { user } = useSelector(store => store.auth) // extract user object from auth slice of Redux store

    const navigate = useNavigate() // initialize navigation hook to redirect users

    useEffect(() => { // use effect to handle redirection logic when the component mounts
        if (user?.role === 'recruiter') { // check if the logged-in user's role is recruiter
            navigate("/admin/companies") // redirect recruiter users to the company management page
        }
    }, []) // run effect only once when component mounts
     
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

export default Home
