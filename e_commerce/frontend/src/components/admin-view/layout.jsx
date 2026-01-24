import { Outlet } from "react-router-dom"; // import Outlet component from react-router-dom to render nested routes inside layout
import AdminSideBar from "./sidebar"; // import AdminSideBar component to display navigation sidebar for admin panel
import AdminHeader from "./header"; // import AdminHeader component to show header bar with controls
import { useState } from "react"; // import useState hook from React to manage component state

function AdminLayout() { // define AdminLayout component to structure admin dashboard layout
    const [openSidebar, setOpenSidebar] = useState(false); // create state variable openSidebar to track sidebar visibility, initialized to false; setOpenSidebar updates it

    return (
        <div className="flex min-h-screen w-full">
            <AdminSideBar open={openSidebar} setOpen={setOpenSidebar} /> {/* pass sidebar state and its setter to AdminSideBar for controlling open/close behavior */}
            <div className="flex flex-1 flex-col">
                <AdminHeader setOpen={setOpenSidebar} /> {/* pass setOpen function to AdminHeader so it can toggle sidebar visibility */}
                <main className="flex-1 flex-col flex bg-muted/40 p-4 md:p-6">
                    <Outlet /> {/* render nested admin routes based on current route path */}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
