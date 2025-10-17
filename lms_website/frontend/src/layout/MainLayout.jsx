import Navbar from '@/components/Navbar' // import the Navbar component from the local components folder using an alias path
import React from 'react' // import the React library to use JSX and React features
import { Outlet } from 'react-router-dom' // import the Outlet component from react-router-dom to render child routes inside this layout

const MainLayout = () => { // define a function component named MainLayout with no arguments to serve as the main layout wrapper
    return (
        <div className='flex flex-col min-h-screen'>
            <Navbar /> {/* render the Navbar component inside the layout */}
            <div className='flex-1 mt-16'>
                <Outlet /> {/* render the matched child route component dynamically using react-router's Outlet */}
            </div>
        </div>
    )
}

export default MainLayout
