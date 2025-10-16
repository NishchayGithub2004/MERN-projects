import React, { useEffect, useState } from 'react' // import React and hooks useEffect & useState for component logic and state management
import { RadioGroup, RadioGroupItem } from './ui/radio-group' // import radio group components for filter option selection
import { Label } from './ui/label' // import Label component to label radio options
import { useDispatch } from 'react-redux' // import useDispatch hook to dispatch Redux actions
import { setSearchedQuery } from '@/redux/jobSlice' // import action to update search query in Redux job slice

const fitlerData = [ // define a static array of filter categories and their options
    {
        fitlerType: "Location", // specify filter type as Location
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"] // list of location options
    },
    {
        fitlerType: "Industry", // specify filter type as Industry
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"] // list of industry options
    },
    {
        fitlerType: "Salary", // specify filter type as Salary
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"] // list of salary range options
    },
]

const FilterCard = () => { // define a functional component FilterCard to render job filter options
    const [selectedValue, setSelectedValue] = useState('') // create a state variable selectedValue to store the selected filter value, initialized as empty string
    
    const dispatch = useDispatch() // initialize dispatch function to dispatch Redux actions
    
    const changeHandler = (value) => { // define a function changeHandler that takes a value argument representing selected radio option
        setSelectedValue(value) // update selectedValue state to the new selected filter value
    }
    
    useEffect(() => { // define an effect that runs whenever selectedValue changes
        dispatch(setSearchedQuery(selectedValue)) // dispatch Redux action to update searched query with the selected filter value
    }, [selectedValue]) // dependency array ensures effect runs when selectedValue changes
    
    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup 
                value={selectedValue} // bind current selectedValue state to RadioGroup value
                onValueChange={changeHandler} // handle radio option changes by calling changeHandler
            >
                {
                    fitlerData.map((data, index) => ( // iterate through each filter type object in fitlerData array
                        <div key={index}>
                            <h1 className='font-bold text-lg'>{data.fitlerType}</h1>
                            {
                                data.array.map((item, idx) => { // iterate through each option inside the current filter type
                                    const itemId = `id${index}-${idx}` // create a unique id string for each radio input
                                    return (
                                        <div className='flex items-center space-x-2 my-2' key={itemId}>
                                            <RadioGroupItem 
                                                value={item} // assign the current option as the radio value
                                                id={itemId} // assign unique id for accessibility and labeling
                                            />
                                            <Label htmlFor={itemId}>{item}</Label> 
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

export default FilterCard // export FilterCard component for external use
