import Navbar from '@/components/Navbar' // import Navbar component to display the top navigation bar across pages
import React from 'react' // import React to enable JSX and define functional components
import { Outlet } from 'react-router-dom' // import Outlet to dynamically render nested route components

const MainLayout = () => { // define a functional component named 'MainLayout' that serves as the root layout for pages
    return (
        <div className='flex flex-col min-h-screen'> {/* create a vertical flex container occupying full viewport height */}
            <Navbar /> {/* render the Navbar at the top of the layout for site-wide navigation */}
            <div className='flex-1 mt-16'> {/* create a flexible area for page content with top margin below Navbar */}
                <Outlet /> {/* dynamically render nested route content based on the current route */}
            </div>
        </div>
    )
}

export default MainLayout // export MainLayout component as default for use in route configuration