import { BadgeCheck, ChartNoAxesCombined, LayoutDashboard, ShoppingBasket } from "lucide-react"; // import lucide-react icons for sidebar menu items
import { Fragment } from "react"; // import Fragment to group multiple JSX elements without adding extra DOM nodes
import { useNavigate } from "react-router-dom"; // import useNavigate hook to programmatically navigate between routes
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"; // import UI components for mobile sidebar sheet

const adminSidebarMenuItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: <LayoutDashboard />,
    },
    {
        id: "products",
        label: "Products",
        path: "/admin/products",
        icon: <ShoppingBasket />,
    },
    {
        id: "orders",
        label: "Orders",
        path: "/admin/orders",
        icon: <BadgeCheck />,
    },
];

function MenuItems({ setOpen }) { // define MenuItems component that renders all sidebar links; accepts setOpen to control sidebar visibility
    const navigate = useNavigate(); // initialize navigation function to change route programmatically

    return (
        <nav className="mt-8 flex-col flex gap-2">
            {adminSidebarMenuItems.map((menuItem) => ( // iterate through all menu items and render each one dynamically
                <div
                    key={menuItem.id} // assign unique key to each menu item for React reconciliation
                    onClick={() => { // handle click event for each menu item
                        navigate(menuItem.path); // navigate to the respective route when clicked
                        setOpen ? setOpen(false) : null; // if setOpen exists (mobile view), close the sidebar
                    }}
                    className="flex cursor-pointer text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                    {menuItem.icon}
                    <span>{menuItem.label}</span>
                </div>
            ))}
        </nav>
    );
}

function AdminSideBar({ open, setOpen }) { // define AdminSideBar component that handles both mobile and desktop sidebar display
    const navigate = useNavigate(); // initialize navigation function to redirect on clicking the logo

    return (
        <Fragment>
            <Sheet open={open} onOpenChange={setOpen}> {/* pass open state to control sidebar visibility and onOpenChange to toggle it */}
                <SheetContent side="left" className="w-64">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="border-b">
                            <SheetTitle className="flex gap-2 mt-5 mb-5">
                                <ChartNoAxesCombined size={30} />
                                <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems setOpen={setOpen} /> {/* pass setOpen to allow closing sidebar in mobile mode */}
                    </div>
                </SheetContent>
            </Sheet>
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div
                    onClick={() => navigate("/admin/dashboard")} // navigate to dashboard when clicking the sidebar title in desktop view
                    className="flex cursor-pointer items-center gap-2"
                >
                    <ChartNoAxesCombined size={30} />
                    <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                </div>
                <MenuItems />
            </aside>
        </Fragment>
    );
}

export default AdminSideBar;
