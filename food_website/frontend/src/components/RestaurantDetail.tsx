import { useRestaurantStore } from "@/store/useRestaurantStore"; // import custom store hook to access and manage restaurant-related global state
import AvailableMenu from "./AvailableMenu"; // import component that displays a list of available menu items for the restaurant
import { Badge } from "./ui/badge"; // import badge component used to display cuisine tags
import { Timer } from "lucide-react"; // import timer icon for showing estimated delivery time
import { useEffect } from "react"; // import useEffect hook to handle side effects on component mount or dependency changes
import { useParams } from "react-router-dom"; // import hook to extract URL parameters dynamically

const RestaurantDetail = () => { // define a functional component named 'RestaurantDetail' to display detailed restaurant information
    const params = useParams(); // create object containing route parameters from current URL
    
    const { singleRestaurant, getSingleRestaurant } = useRestaurantStore(); // destructure restaurant data and fetch function from restaurant store for state management

    useEffect(() => { // define side effect to fetch restaurant details whenever id parameter changes
        getSingleRestaurant(params.id!); // call getSingleRestaurant function with id parameter to load specific restaurant details
    }, [params.id]); // re-run effect when params.id changes to fetch updated restaurant data

    return (
        <div className="max-w-6xl mx-auto my-10">
            <div className="w-full">
                <div className="relative w-full h-32 md:h-64 lg:h-72">
                    <img
                        src={singleRestaurant?.imageUrl || "Loading..."}
                        alt="res_image"
                        className="object-cover w-full h-full rounded-lg shadow-lg"
                    />
                </div>
                <div className="flex flex-col md:flex-row justify-between">
                    <div className="my-5">
                        <h1 className="font-medium text-xl">{singleRestaurant?.restaurantName || "Loading..."}</h1>
                        <div className="flex gap-2 my-2">
                            {singleRestaurant?.cuisines.map((cuisine: string, idx: number) => ( // iterate over cuisines array to render cuisine badges for each cuisine type
                                <Badge key={idx}>{cuisine}</Badge> // render badge component for each cuisine to visually categorize restaurant type
                            ))}
                        </div>
                        <div className="flex md:flex-row flex-col gap-2 my-5">
                            <div className="flex items-center gap-2">
                                <Timer className="w-5 h-5" />
                                <h1 className="flex items-center gap-2 font-medium">
                                    Delivery Time: <span className="text-[#D19254]">{singleRestaurant?.deliveryTime || "NA"} mins</span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                {singleRestaurant?.menus && <AvailableMenu menus={singleRestaurant?.menus!} />} // render AvailableMenu component only if restaurant menus exist
            </div>
        </div>
    );
};

export default RestaurantDetail; // export RestaurantDetail component to make it available for routing or reuse