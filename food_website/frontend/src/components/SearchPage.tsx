import { Link, useParams } from "react-router-dom"; // import 'Link' from react-router-dom to create link to other pages and 'useParams' to access and use parameters of URL
import FilterPage from "./FilterPage"; // import 'FilterPage' component to display filter options
import { Input } from "./ui/input"; // import 'Input' component from shadCN UI library
import { useEffect, useState } from "react"; // import 'useEffect' hook to create side-effects and 'useState' hook to manage state
import { Button } from "./ui/button"; // import 'Button' component from shadCN UI library
import { Badge } from "./ui/badge"; // import 'Badge' component from shadCN UI library
import { Globe, MapPin, X } from "lucide-react"; // import icons from lucide-react library
import { Card, CardContent, CardFooter } from "./ui/card"; // import these card components from shadCN UI library
import { AspectRatio } from "./ui/aspect-ratio"; // import 'AspectRatio' component from shadCN UI library
import { Skeleton } from "./ui/skeleton"; // import 'Skeleton' component from shadCN UI library
import { useRestaurantStore } from "@/store/useRestaurantStore"; // import 'useRestaurantStore' hook to access and update restaurant related state
import { type Restaurant } from "@/types/restaurantType"; // import 'Restaurant' type

const SearchPage = () => { // create a functional component named 'SearchPage' that doesn't take any props
    const params = useParams(); // create an instance of 'useParams' hook to access and use parameters of URL
    
    const [searchQuery, setSearchQuery] = useState<string>(""); // create a state variable 'searchQuery' with empty string as initial value and a function 'setSearchQuery' to update its value
    
    const { loading, searchedRestaurant, searchRestaurant, setAppliedFilter, appliedFilter } = useRestaurantStore(); // extract these things from 'useRestaurantStore' hook

    useEffect(() => { // create a side-effect using 'useEffect' hook
        searchRestaurant(params.text!, searchQuery, appliedFilter); // call 'searchRestaurant' function from 'useRestaurantStore' hook to fetch restaurant data based on URL parameters, search query and filter options
    }, [params.text!, appliedFilter]); // re-run this effect when URL parameters or filter options change

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
                            onChange={(e) => setSearchQuery(e.target.value)} // any change in value of this input field will update 'searchQuery' state variable to new value entered using 'setSearchQuery' state function
                        />
                        <Button
                            onClick={() => searchRestaurant(params.text!, searchQuery, appliedFilter)} // clicking this button calls 'searchRestaurant' function
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
                                {appliedFilter.map( // iterate over 'appliedFilter' array as 'searchFilter' which is a string and 'idx' number as it's unique identifier
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
                                                onClick={() => setAppliedFilter(selectedFilter)} // clickin this icon calls 'setAppliedFilter' function for current element
                                                className="absolute text-[#D19254] right-1 hover:cursor-pointer"
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                            {loading ? ( // if 'loading' is true, display 'SearchPageSkeleton' component
                                <SearchPageSkeleton />
                            ) : !loading && searchedRestaurant?.data.length === 0 ? ( // if 'loading' is false and 'data' array in 'searchedRestaurant' object is empty, display 'NoResultFound' component
                                <NoResultFound searchText={params.text!} />
                            ) : (
                                searchedRestaurant?.data.map((restaurant: Restaurant) => ( // otherwise iterate over 'data' array having elements of type 'Restaurant' in 'SearchedRestaurant' object as 'restaurant'
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
                                                {restaurant.cuisines.map( // iterate over 'cuisines' array in current 'restaurant' object as 'cuisine' string with 'idx' number as it's unique identifier
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
                                            <Link to={`/restaurant/${restaurant._id}`}>
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

const SearchPageSkeleton = () => {
    return (
        <>
            {[...Array(3)].map((_, index) => ( // create 3 undefined elements, spread them in an array using spread operator and iterate over them as nothing with 'index' as unique identifier
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

const NoResultFound = ({ searchText }: { searchText: string }) => {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                No results found
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
                We couldn't find any results for "{searchText}". <br /> Try searching with a different term.
            </p>
            <Link to="/">
                <Button className="mt-4 bg-orange hover:bg-orangeHover">
                    Go Back to Home
                </Button>
            </Link>
        </div>
    );
};