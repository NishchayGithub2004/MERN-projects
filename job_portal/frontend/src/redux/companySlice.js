import { createSlice } from "@reduxjs/toolkit"; // from 'reduxjs' library, import 'createSlice' function to create a redux slice

const companySlice = createSlice({ // create a redux slice named 'companySlice' to handle company related states
    name: "company", // unique name of this slice is 'company'
    initialState: { // this part contains the following properties related to companies with their initial values
        singleCompany: null, // object called 'singleCompany' to store data of a single company with initial value of null
        companies: [], // array called 'companies' to store all companies data with initial value of empty array
        searchCompanyByText: "", // string called 'searchCompanyByText' to store search string written in search bar to search for a company
    },
    reducers: { /* this is the container of all functions/actions to change the value of states related to company data
        create functions to update values of states defined in 'initialState' part, they take two arguments: 'state' which is the 
        state to update and 'action' which contains the new value to update the state with in it's payload
        update the state the functions are supposed to update with the value contained by the 'payload' property of 'action' */
        
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
        },
        setCompanies: (state, action) => {
            state.companies = action.payload;
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        }
    }
});

export const { setSingleCompany, setCompanies, setSearchCompanyByText } = companySlice.actions; // export the functions defined in reducers to update values of state variables related to company data

export default companySlice.reducer; // export the reducer to be used in redux store
