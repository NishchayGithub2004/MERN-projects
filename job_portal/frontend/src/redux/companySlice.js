import { createSlice } from "@reduxjs/toolkit"; // import createSlice from redux toolkit to easily define a redux slice that manages company-related state and actions

const companySlice = createSlice({ // create a redux slice named companySlice to handle logic and data flow related to companies
    name: "company", // set the name of this slice as 'company' to represent the company section in the redux store
    initialState: { // define the default structure and initial values for the company state
        singleCompany: null, // initialize singleCompany as null to indicate that no specific company details are currently loaded
        companies: [], // initialize companies as an empty array to store multiple company records once fetched
        searchCompanyByText: "", // initialize searchCompanyByText as an empty string to hold the user's search query for filtering companies
    },
    reducers: { // declare reducer functions that specify how the company state should update in response to dispatched actions
        setSingleCompany: (state, action) => { // define reducer setSingleCompany which assigns company details from the action payload to the state
            state.singleCompany = action.payload; // update singleCompany with action.payload to save the currently selected company's data
        },
        setCompanies: (state, action) => { // define reducer setCompanies which replaces the companies array with new data from the action payload
            state.companies = action.payload; // update companies with action.payload to store the fetched list of companies
        },
        setSearchCompanyByText: (state, action) => { // define reducer setSearchCompanyByText which updates the search text in state using action payload
            state.searchCompanyByText = action.payload; // assign action.payload to searchCompanyByText to track user input for company search filtering
        }
    }
});

export const { setSingleCompany, setCompanies, setSearchCompanyByText } = companySlice.actions; // extract and export setSingleCompany, setCompanies, and setSearchCompanyByText action creators for dispatching updates to the redux store
export default companySlice.reducer; // export reducer function as default to integrate companySlice into the redux store configuration