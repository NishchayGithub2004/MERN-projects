import { createSlice } from "@reduxjs/toolkit"; // import the createSlice function from Redux Toolkit to create a slice that combines reducers, actions, and state for a specific feature

const companySlice = createSlice({ // define a constant named companySlice by calling createSlice to create a Redux slice for company-related data
    name: "company", // specify the name of the slice as 'company' to label this section of the Redux state tree

    initialState: { // define the initial state object for the company slice
        singleCompany: null, // initialize singleCompany as null to represent that no individual company data is loaded initially
        companies: [], // initialize companies as an empty array to store a list of companies when data is fetched
        searchCompanyByText: "", // initialize searchCompanyByText as an empty string to hold user-entered search text for filtering companies
    },

    reducers: { // define reducer functions that describe how the state changes based on specific actions
        setSingleCompany: (state, action) => { // define a reducer function setSingleCompany with arguments state (current company state) and action (object containing payload data)
            state.singleCompany = action.payload; // update singleCompany with the value provided in action.payload to store details of a single company
        },

        setCompanies: (state, action) => { // define a reducer function setCompanies with arguments state (current company state) and action (object containing payload data)
            state.companies = action.payload; // update companies with the array provided in action.payload to store a list of companies
        },

        setSearchCompanyByText: (state, action) => { // define a reducer function setSearchCompanyByText with arguments state (current company state) and action (object containing payload data)
            state.searchCompanyByText = action.payload; // update searchCompanyByText with the value provided in action.payload to store the current search input for filtering companies
        }
    }
});

export const { setSingleCompany, setCompanies, setSearchCompanyByText } = companySlice.actions; // export the automatically generated action creators setSingleCompany, setCompanies, and setSearchCompanyByText for dispatching actions
export default companySlice.reducer; // export the reducer function of companySlice as the default export to integrate into the Redux store
