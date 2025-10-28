import React, { useEffect, useState } from 'react' // import React to define the component and include useEffect for side effects and useState for managing component state
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table' // import table components used to structure and render company data
import { Avatar, AvatarImage } from '../ui/avatar' // import avatar components to display company logo images
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover' // import popover components to handle dropdown menu for each row
import { Edit2, MoreHorizontal } from 'lucide-react' // import icons for edit option and three-dot menu symbol
import { useSelector } from 'react-redux' // import useSelector to read company data and filters from Redux store
import { useNavigate } from 'react-router-dom' // import useNavigate hook to programmatically redirect to edit company pages

const CompaniesTable = () => { // define a functional component named 'CompaniesTable' to display a searchable and filtered company list
    const { companies, searchCompanyByText } = useSelector( // extract companies array and searchCompanyByText string from Redux store
        store => store.company // access the company slice from Redux store to get state values
    )

    const [filterCompany, setFilterCompany] = useState(companies) // declare state variable 'filterCompany' to store filtered company list initialized with all companies

    const navigate = useNavigate() // call useNavigate to obtain a navigation function for route changes

    useEffect(() => { // define a side effect that filters companies whenever companies data or search text changes
        const filteredCompany = ( // declare a variable to hold newly filtered companies list
            companies.length >= 0 && // check if companies array exists and can be iterated
            companies.filter((company) => { // filter companies by checking name against search text
                if (!searchCompanyByText) return true // if no search text is provided, include all companies
                return company?.name?.toLowerCase().includes( // check if company name contains the search text ignoring case
                    searchCompanyByText.toLowerCase() // convert search text to lowercase for consistent comparison
                )
            })
        )
        setFilterCompany(filteredCompany) // update filterCompany state with filtered list to re-render table
    }, [companies, searchCompanyByText]) // rerun the effect when companies array or search text value changes

    return ( // return JSX structure to render table with filtered companies
        <div>
            <Table>
                <TableCaption>A list of your recent registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => ( // iterate through filteredCompany array to render each company's data row
                            <tr key={company._id}>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={company.logo} /> 
                                    </Avatar>
                                </TableCell>
                                <TableCell>{company.name}</TableCell>
                                <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div
                                                onClick={() => navigate(`/admin/companies/${company._id}`)} // navigate to the company-specific edit page when edit option is clicked
                                                className='flex items-center gap-2 w-fit cursor-pointer'
                                            >
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </tr>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable // export CompaniesTable component as default for external use