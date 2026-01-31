import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux' // from 'react-redux' library, import 'useDispatch' hook to dispatch actions to redux store to update values of redux states
import { setSearchedQuery } from '@/redux/jobSlice' // from 'jobSlice', import 'setSearchedQuery' function to update value of 'searchedQuery' state in redux store

// create an array of objects to store filter type and data to be used for filtering jobs
const fitlerData = [
    {
        fitlerType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        fitlerType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        fitlerType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = () => { // create a functional component named 'FilterCard' to render filtered data
    const [selectedValue, setSelectedValue] = useState('') // create a state variable named 'selectedValue' and a function called 'setSelectedValue' to change it's value

    const dispatch = useDispatch() // create an instance of 'useDispatch' hook to use it to dispatch actions to update values of redux states

    const changeHandler = (value) => { // create a function named 'changeHandler' to change the value of 'selectedValue' state
        setSelectedValue(value) // update 'selectedValue' state with the new value
    }
    
    useEffect(() => { // use 'useEffect' hook to perform side effects in the component
        dispatch(setSearchedQuery(selectedValue)) // dispatch 'setSearchedQuery' action with 'selectedValue' as the modified value of 'searchedQuery' state
    }, [selectedValue]) // re-run this effect when value of 'selectedValue' changes

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup
                value={selectedValue} // value of radio group is the value of 'selectedValue' state
                onValueChange={changeHandler} // when value of radio group changes, call 'changeHandler' function
            >
                {
                    fitlerData.map((data, index) => ( // iterate over elements of 'fitlerData' array as 'data' with it's index
                        <div key={index}> {/* index of element is the unique identifier of each item in the array */}
                            <h1 className='font-bold text-lg'>{data.fitlerType}</h1> {/* render filter type as text of the item */}
                            {
                                data.array.map((item, idx) => { // iterate over elements of array present in data as 'item' with it's index
                                    const itemId = `id${index}-${idx}` // create a unique identifier for each item
                                    
                                    return (
                                        <div className='flex items-center space-x-2 my-2' key={itemId}> {/* 'itemId' is the unique identifier of each item in the array */}
                                            <RadioGroupItem
                                                value={item} // value of radio button is the value of 'item' state
                                                id={itemId} // id of radio button is the value of 'itemId' state
                                            />
                                            <Label htmlFor={itemId}>{item}</Label> {/* label of radio button is the value of 'item' state */}
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

export default FilterCard