import { Link, useParams } from "react-router-dom"; // import 'Link' to navigate between pages and 'useParams' to read dynamic URL parameters
import FilterPage from "./FilterPage"; // import 'FilterPage' component to show filtering options for search results
import { Input } from "./ui/input"; // import input component for capturing user search query
import { useEffect, useState } from "react"; // import hooks for handling side effects and component state
import { Button } from "./ui/button"; // import button component for user actions
import { Badge } from "./ui/badge"; // import badge component for displaying applied filters
import { Globe, MapPin, X } from "lucide-react"; // import icon components for UI representation
import { Card, CardContent, CardFooter } from "./ui/card"; // import card layout components for restaurant display
import { AspectRatio } from "./ui/aspect-ratio"; // import aspect ratio wrapper to maintain image proportions
import { Skeleton } from "./ui/skeleton"; // import skeleton loader for showing placeholder while fetching data
import { useRestaurantStore } from "@/store/useRestaurantStore"; // import restaurant store hook to manage restaurant search and filters
import { type Restaurant } from "@/types/restaurantType"; // import type definition for restaurant data structure

const SearchPage = () => { // define functional component 'SearchPage' to display and handle restaurant search functionality
    const params = useParams(); // get URL parameters using 'useParams' hook for accessing search text in dynamic routes
    
    const [searchQuery, setSearchQuery] = useState<string>(""); // create state variable 'searchQuery' to store user-entered text for searching restaurants
    
    const { loading, searchedRestaurant, searchRestaurant, setAppliedFilter, appliedFilter } = useRestaurantStore(); // destructure restaurant store to access loading state, search results, search function, and applied filters

    useEffect(() => { // trigger side-effect whenever parameters or filters change
        searchRestaurant(params.text!, searchQuery, appliedFilter); // call store function to fetch restaurants based on URL text, search input, and filters
    }, [params.text!, appliedFilter]); // depend on URL text and applied filters to re-run this effect

    return (
        <div className="max-w-7xl mx-auto my-10">
            <div className="flex flex-col md:flex-row justify-between gap-10">
                <FilterPage />
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <Input
                            type="text"
                            value={searchQuery}
                            placeholder="Search by restaurant & cuisines"
                            onChange={(e) => setSearchQuery(e.target.value)} // update 'searchQuery' whenever user types in input field
                        />
                        <Button
                            onClick={() => searchRestaurant(params.text!, searchQuery, appliedFilter)} // trigger restaurant search manually when user clicks search button
                            className="bg-orange hover:bg-hoverOrange"
                        >
                            Search
                        </Button>
                    </div>
                    <div>
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-2 my-3">
                            <h1 className="font-medium text-lg">
                                ({searchedRestaurant?.data.length}) search result found
                            </h1>
                            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                                {appliedFilter.map( // iterate through applied filters to render badges for each active filter
                                    (selectedFilter: string, idx: number) => (
                                        <div
                                            key={idx}
                                            className="relative inline-flex items-center max-w-full"
                                        >
                                            <Badge
                                                className="text-[#D19254] rounded-md hover:cursor-pointer pr-6 whitespace-nowrap"
                                                variant="outline"
                                            >
                                                {selectedFilter}
                                            </Badge>
                                            <X
                                                onClick={() => setAppliedFilter(selectedFilter)} // remove filter badge by updating applied filter list
                                                className="absolute text-[#D19254] right-1 hover:cursor-pointer"
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {loading ? ( // if data is still loading, show placeholder skeleton UI
                                <SearchPageSkeleton />
                            ) : !loading && searchedRestaurant?.data.length === 0 ? ( // if not loading and no results found, show empty state message
                                <NoResultFound searchText={params.text!} />
                            ) : (
                                searchedRestaurant?.data.map((restaurant: Restaurant) => ( // render list of restaurants fetched from search results
                                    <Card
                                        key={restaurant._id}
                                        className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                                    >
                                        <div className="relative">
                                            <AspectRatio ratio={16 / 6}>
                                                <img
                                                    src={restaurant.imageUrl}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            </AspectRatio>
                                            <div className="absolute top-2 left-2 bg-white dark:bg-gray-700 bg-opacity-75 rounded-lg px-3 py-1">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Featured
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {restaurant.restaurantName}
                                            </h1>
                                            <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                                                <MapPin size={16} />
                                                <p className="text-sm">
                                                    City:{" "}
                                                    <span className="font-medium">{restaurant.city}</span>
                                                </p>
                                            </div>
                                            <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                                                <Globe size={16} />
                                                <p className="text-sm">
                                                    Country:{" "}
                                                    <span className="font-medium">
                                                        {restaurant.country}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex gap-2 mt-4 flex-wrap">
                                                {restaurant.cuisines.map( // map through cuisines of each restaurant to show them as badges
                                                    (cuisine: string, idx: number) => (
                                                        <Badge
                                                            key={idx}
                                                            className="font-medium px-2 py-1 rounded-full shadow-sm"
                                                        >
                                                            {cuisine}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 border-t dark:border-t-gray-700 border-t-gray-100 text-white flex justify-end">
                                            <Link to={`/restaurant/${restaurant._id}`}> {/* navigate to individual restaurant page when clicked */}
                                                <Button className="bg-orange hover:bg-hoverOrange font-semibold py-2 px-4 rounded-full shadow-md transition-colors duration-200">
                                                    View Menus
                                                </Button>
                                            </Link>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;

const SearchPageSkeleton = () => { // define component to show skeleton UI while data loads
    return (
        <>
            {[...Array(3)].map((_, index) => ( // render three skeleton cards using array iteration for placeholder loading state
                <Card
                    key={index}
                    className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden"
                >
                    <div className="relative">
                        <AspectRatio ratio={16 / 6}>
                            <Skeleton className="w-full h-full" />
                        </AspectRatio>
                    </div>
                    <CardContent className="p-4">
                        <Skeleton className="h-8 w-3/4 mb-2" />
                        <div className="mt-2 gap-1 flex items-center text-gray-600 dark:text-gray-400">
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="mt-2 flex gap-1 items-center text-gray-600 dark:text-gray-400">
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <div className="flex gap-2 mt-4 flex-wrap">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                    </CardContent>
                    <CardFooter className="p-4  dark:bg-gray-900 flex justify-end">
                        <Skeleton className="h-10 w-24 rounded-full" />
                    </CardFooter>
                </Card>
            ))}
        </>
    );
};

const NoResultFound = ({ searchText }: { searchText: string }) => { // define component to show message when no search results are found
    return (
        <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                No results found
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                We couldn't find any results for "{searchText}". <br /> Try searching with a different term.
            </p>
            <Link to="/"> {/* navigate user back to homepage if no results are available */}
                <Button className="mt-4 bg-orange hover:bg-orangeHover">
                    Go Back to Home
                </Button>
            </Link>
        </div>
    );
};