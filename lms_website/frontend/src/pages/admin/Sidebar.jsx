import { ChartNoAxesColumn, SquareLibrary } from "lucide-react"; // import icon components from lucide-react for sidebar navigation items
import React from "react"; // import React library to create functional component
import { Link, Outlet } from "react-router-dom"; // import Link for navigation routing and Outlet to render nested route components

const Sidebar = () => { // define a functional component 'Sidebar' to display admin panel navigation
    return (
        <div className="flex"> {/* create a flex container to align sidebar and main content horizontally */}
            <div className="hidden lg:block w-[250px] sm:w-[300px] space-y-8 border-r border-gray-300 dark:border-gray-700 p-5 sticky top-0 h-screen"> {/* define a fixed vertical sidebar visible only on large screens */}
                <div className="space-y-4"> {/* group of navigation links with vertical spacing */}
                    <Link to="dashboard" className="flex items-center gap-2"> {/* link to dashboard route with icon and label */}
                        <ChartNoAxesColumn size={22} /> {/* render dashboard icon with defined size */}
                        <h1>Dashboard</h1> {/* display dashboard label */}
                    </Link>
                    <Link to="course" className="flex items-center gap-2"> {/* link to courses route with icon and label */}
                        <SquareLibrary size={22} /> {/* render courses icon with defined size */}
                        <h1>Courses</h1> {/* display courses label */}
                    </Link>
                </div>
            </div>
            <div className="flex-1 p-10"> {/* define main content area that expands to remaining space */}
                <Outlet /> {/* render nested child routes dynamically based on selected link */}
            </div>
        </div>
    );
};

export default Sidebar; // export Sidebar component for use in admin layout