import { useRestaurantStore } from "@/store/useRestaurantStore"; // import 'useRestaurantStore' hook to manage restaurant related states
import AvailableMenu from "./AvailableMenu"; // import 'AvailableMenu' component to show available menus of the restaurant
import { Badge } from "./ui/badge"; // import 'Badge' component from shadCN UI library
import { Timer } from "lucide-react"; // import 'Timer' icon from lucide-react library
import { useEffect } from "react"; // import 'useEffect' hook to run side effects
import { useParams } from "react-router-dom"; // import 'useParams' hook to get parameters from the URL

const RestaurantDetail = () => {
    const params = useParams(); // create an instance of 'useParams' hook to get parameters from the URL
    
    const { singleRestaurant, getSingleRestaurant } = useRestaurantStore(); // extraact these two things from the 'useRestaurantStore' hook

    useEffect(() => { // define a side effect using 'useEffect' hook
        getSingleRestaurant(params.id!); // call 'getSingleRestaurant' function to get the details of the restaurant with 'params.id' as argument to get information of restaurant of 'id' in current URL
    }, [params.id]); // write 'params.id' in dependency array to run side effect whenever 'params.id' changes

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
                            {singleRestaurant?.cuisines.map((cuisine: string, idx: number) => ( // iterave over 'cuisines' array of 'singleRestaurant' object as 'cuisine' string and 'idx' number
                                <Badge key={idx}>{cuisine}</Badge> // render 'Badge' component for each cuisine and write 'cuisine' as it's content
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
                {singleRestaurant?.menus && <AvailableMenu menus={singleRestaurant?.menus!} />} {/* if 'menus' object is not null, then render 'AvailableMenu' component */}
            </div>
        </div>
    );
};

export default RestaurantDetail;