import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // import Card components for layout of dashboard metrics
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi"; // import hook to fetch purchased courses data
import React from "react"; // import React library to define the component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"; // import Recharts components for rendering line chart

const Dashboard = () => { // define a function component Dashboard to show analytics
    const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery(); 
    // call API hook to fetch purchased courses, destructure loading, success, and error states

    if (isLoading) return <h1>Loading...</h1>; // display loading text if data is being fetched
    
    if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>; // display error message if API call fails

    const { purchasedCourse } = data || []; // extract purchasedCourse array from API response or default to empty array

    const courseData = purchasedCourse.map((course) => ({ // transform data for chart
        name: course.courseId.courseTitle, // x-axis label as course title
        price: course.courseId.coursePrice // y-axis value as course price
    }));

    const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0); 
    // calculate total revenue by summing amount of all purchased courses

    const totalSales = purchasedCourse.length; // calculate total number of sales
    
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>Total Sales</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
                </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{totalRevenue}</p>
                </CardContent>
            </Card>

            {/* Course Prices Card */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-700">
                        Course Prices
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={courseData}> 
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> 
                            <XAxis
                                dataKey="name"
                                stroke="#6b7280"
                                angle={-30} 
                                textAnchor="end" 
                                interval={0} 
                            />
                            <YAxis stroke="#6b7280" /> 
                            <Tooltip formatter={(value, name) => [`₹${value}`, name]} /> 
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#4a90e2" 
                                strokeWidth={3} 
                                dot={{ stroke: "#4a90e2", strokeWidth: 2 }} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
