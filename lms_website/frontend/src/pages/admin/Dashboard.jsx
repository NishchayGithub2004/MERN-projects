import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // import Card components to create layout containers for dashboard metrics
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi"; // import RTK Query hook to fetch user's purchased courses data
import React from "react"; // import React library to define functional component
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"; // import chart components from Recharts library for visual analytics

const Dashboard = () => { // define a functional component 'Dashboard' to display analytics of sales and revenue
    const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery(); // call hook to fetch purchased courses and destructure states: data, isSuccess, isError, and isLoading

    if (isLoading) return <h1>Loading...</h1>; // render loading message when data fetching is in progress

    if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>; // render error message when API request fails

    const { purchasedCourse } = data || []; // extract 'purchasedCourse' array from API response, if data is null assign an empty array

    const courseData = purchasedCourse.map((course) => ({ // transform purchased course data into chart-friendly structure
        name: course.courseId.courseTitle, // set 'name' key for x-axis label using course title
        price: course.courseId.coursePrice // set 'price' key for y-axis value using course price
    }));

    const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0); // calculate total revenue by summing up 'amount' field from each purchased course

    const totalSales = purchasedCourse.length; // calculate total number of purchased courses as total sales count
    
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 "> {/* responsive grid layout for dashboard metrics */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300"> {/* card showing total sales */}
                <CardHeader>
                    <CardTitle>Total Sales</CardTitle> {/* title text for sales metric */}
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{totalSales}</p> {/* display total number of sales */}
                </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300"> {/* card showing total revenue */}
                <CardHeader>
                    <CardTitle>Total Revenue</CardTitle> {/* title text for revenue metric */}
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{totalRevenue}</p> {/* display total revenue value */}
                </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4"> {/* card for line chart visualizing course prices */}
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-700">
                        Course Prices {/* title for chart section */}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={250}> {/* responsive container to make chart scalable */}
                        <LineChart data={courseData}> {/* define line chart with 'courseData' array */}
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> {/* add gridlines to improve readability */}
                            <XAxis
                                dataKey="name" // assign 'name' property for x-axis
                                stroke="#6b7280" // set gray color for x-axis labels
                                angle={-30} // rotate labels for better readability
                                textAnchor="end" // align text end to avoid overlap
                                interval={0} // display all labels without skipping
                            />
                            <YAxis stroke="#6b7280" /> {/* define y-axis with gray stroke */}
                            <Tooltip formatter={(value, name) => [`₹${value}`, name]} /> {/* format tooltip to show price in INR */}
                            <Line
                                type="monotone" // make line smooth
                                dataKey="price" // specify y-axis data key
                                stroke="#4a90e2" // set line color to blue
                                strokeWidth={3} // define line thickness
                                dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // customize dots at data points
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard; // export Dashboard component for use in routing