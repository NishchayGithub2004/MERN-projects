import React, { useEffect } from 'react' // import 'useEffect' hook to run side-effects in components
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs' // import custom hook 'useGetAllJobs' to fetch all jobs from backend API
import { useSelector } from 'react-redux' // import 'useSelector' function from 'react-redux' library to access a slice from redux store
import { useNavigate } from 'react-router-dom' // import 'useNavigate' function from 'react-router-dom' library to navigate to different routes

const Home = () => {
    useGetAllJobs() // call custom hook 'useGetAllJobs' to fetch all jobs from backend API

    const { user } = useSelector(store => store.auth) // retrieve 'user' object from 'auth' slice of redux store

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to redirect user to specific routes

    // create a side-effect that happens only once (when a component mounts) that navigates user to companies page if user is a recruiter

    useEffect(() => {
        if (user?.role === 'recruiter') navigate("/admin/companies")
    }, [])

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