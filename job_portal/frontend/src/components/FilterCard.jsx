import React, { useEffect, useState } from 'react' // import React along with useEffect and useState hooks for handling lifecycle logic and component state
import { RadioGroup, RadioGroupItem } from './ui/radio-group' // import radio group components to allow users to select filtering options
import { Label } from './ui/label' // import Label component to associate text with radio buttons
import { useDispatch } from 'react-redux' // import useDispatch hook to send actions to Redux store
import { setSearchedQuery } from '@/redux/jobSlice' // import Redux action to update searched query value in the job slice

const fitlerData = [ // define a constant array 'fitlerData' containing filter categories and their corresponding options
    {
        fitlerType: "Location", // specify filter type as 'Location' to categorize by job location
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"] // store list of available location options
    },
    {
        fitlerType: "Industry", // specify filter type as 'Industry' to categorize by job role type
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"] // store list of industry/job role options
    },
    {
        fitlerType: "Salary", // specify filter type as 'Salary' to categorize by pay range
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"] // store list of salary range options
    },
]

const FilterCard = () => { // define a functional component named 'FilterCard' to render job filter options and update search query state
    const [selectedValue, setSelectedValue] = useState('') // initialize state variable 'selectedValue' to track currently selected filter option

    const dispatch = useDispatch() // create Redux dispatch function to trigger global state updates

    const changeHandler = ( // define a function 'changeHandler' to update local state when a user selects a new filter option
        value // parameter 'value' holds the selected radio option text
    ) => { 
        setSelectedValue(value) // update local 'selectedValue' state with newly selected filter value
    }
    
    useEffect(() => { // use effect hook to perform side effects whenever selectedValue changes
        dispatch(setSearchedQuery(selectedValue)) // dispatch Redux action to set the searched query as the selected filter value
    }, [selectedValue]) // include selectedValue in dependency array to re-run effect only when selection changes

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup 
                value={selectedValue} // bind selectedValue state to RadioGroup value so UI reflects current selection
                onValueChange={changeHandler} // call changeHandler whenever user selects a different radio option
            >
                {
                    fitlerData.map((data, index) => ( // iterate through each filter category object in fitlerData array
                        <div key={index}>
                            <h1 className='font-bold text-lg'>{data.fitlerType}</h1>
                            {
                                data.array.map((item, idx) => { // iterate through each available option under the current filter category
                                    const itemId = `id${index}-${idx}` // create unique id string for each radio input for label association
                                    return (
                                        <div className='flex items-center space-x-2 my-2' key={itemId}>
                                            <RadioGroupItem 
                                                value={item} // set radio input value to current option
                                                id={itemId} // assign generated id to connect label with corresponding input
                                            />
                                            <Label htmlFor={itemId}>{item}</Label> {/* render label text corresponding to current radio option */}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard // export FilterCard component to make it reusable across the application
