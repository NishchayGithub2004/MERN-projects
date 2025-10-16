import React, { useEffect, useState } from 'react' // import React and hooks useEffect (for side effects) and useState (for managing component state)
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table' // import table components for displaying company data
import { Avatar, AvatarImage } from '../ui/avatar' // import avatar components to show company logos
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover' // import popover components for dropdown menu functionality
import { Edit2, MoreHorizontal } from 'lucide-react' // import icons for edit and more options menu
import { useSelector } from 'react-redux' // import useSelector hook to access Redux store state
import { useNavigate } from 'react-router-dom' // import useNavigate hook to navigate programmatically between routes

const CompaniesTable = () => { // define a function component CompaniesTable to display filtered list of companies
    const { companies, searchCompanyByText } = useSelector( // destructure 'companies' and 'searchCompanyByText' from Redux store
        store => store.company // access 'company' slice from Redux store
    );
    
    const [filterCompany, setFilterCompany] = useState(companies); // define a state variable 'filterCompany' initialized with companies list to store filtered data
    
    const navigate = useNavigate(); // call useNavigate to get navigation function for route changes
    
    useEffect(() => { // define side effect to filter companies whenever list or search text changes
        const filteredCompany = ( // define a new variable to hold filtered list of companies
            companies.length >= 0 && // check if companies array exists and has length
            companies.filter((company) => { // use array filter method to filter companies based on search text
                if (!searchCompanyByText) return true // if search text is empty, include all companies
                
                return company?.name?.toLowerCase().includes( // check if company name includes the search text (case-insensitive)
                    searchCompanyByText.toLowerCase() // convert search text to lowercase for comparison
                );
            })
        );
        
        setFilterCompany(filteredCompany); // update filterCompany state with new filtered list to trigger re-render
    }, [companies, searchCompanyByText]); // run this effect whenever companies list or search text changes
    
    return (
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
                        filterCompany?.map((company) => ( // iterate through filtered companies list to render each row
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
                                                onClick={() => navigate(`/admin/companies/${company._id}`)} // navigate to company edit page when edit option is clicked
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

export default CompaniesTable
