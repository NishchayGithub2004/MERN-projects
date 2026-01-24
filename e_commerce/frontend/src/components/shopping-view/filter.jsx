import { filterOptions } from "@/config"; // import filterOptions object to dynamically generate filter categories and options
import { Fragment } from "react"; // import Fragment to group multiple elements without extra DOM nodes
import { Label } from "../ui/label"; // import Label component to wrap checkboxes
import { Checkbox } from "../ui/checkbox"; // import Checkbox component for filter selection
import { Separator } from "../ui/separator"; // import Separator component to separate categories visually

function ProductFilter({ // create a functional component named ProductFilter that takes filters object and handleFilter function as props
    filters, // object containing currently selected filter values
    handleFilter, // function to update filters when a checkbox is clicked
}) {
    return (
        <div className="bg-background rounded-lg shadow-sm">
            <div className="p-4 border-b">
                <h2 className="text-lg font-extrabold">Filters</h2>
            </div>
            <div className="p-4 space-y-4">
                {Object.keys(filterOptions).map((keyItem) => ( // iterate over filter categories dynamically
                    <Fragment key={keyItem}>
                        <div>
                            <h3 className="text-base font-bold">{keyItem}</h3>
                            <div className="grid gap-2 mt-2">
                                {filterOptions[keyItem].map((option) => ( // iterate over each option in current category
                                    <Label className="flex font-medium items-center gap-2 " key={option.id}>
                                        <Checkbox
                                            checked={ // determine if the checkbox is checked based on current filters
                                                filters &&
                                                Object.keys(filters).length > 0 &&
                                                filters[keyItem] &&
                                                filters[keyItem].indexOf(option.id) > -1
                                            }
                                            onCheckedChange={() => handleFilter(keyItem, option.id)} // call handleFilter with category key and option id on checkbox change
                                        />
                                        {option.label}
                                    </Label>
                                ))}
                            </div>
                        </div>
                        <Separator />
                    </Fragment>
                ))}
            </div>
        </div>
    );
}

export default ProductFilter; // export ProductFilter component
