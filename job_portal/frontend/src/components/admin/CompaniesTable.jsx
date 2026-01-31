import React, { useEffect, useState } from 'react' // import 'useEffect' hook to run side-effects and 'useState' hook to create an manage state variables
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux' // import 'useSelector' hook from 'react-redux' library to access redux slices from redux store
import { useNavigate } from 'react-router-dom' // import 'useNavigate' hook from 'react-router-dom' library to navigate user to different pages

const CompaniesTable = () => { // create a functional component called 'CompaniesTable' to render table of companies registered by the admin
    const { companies, searchCompanyByText } = useSelector(store => store.company) // extract 'companies' and 'searchCompanyByText' states from 'company' slice of redux store
    // first state contains all companies registered by the user, and second state contains search string used to search for a company

    const [filterCompany, setFilterCompany] = useState(companies) // create a state variable 'filterCompany' to store the filtered companies with initial value of 'companies' ie all companies registered by the user and a function called 'setFilterCompany' to change its value

    const navigate = useNavigate() // create an instance of 'useNavigate' hook to use it to navigate to different pages

    // create a side-effect that runs when companies registered by user or search string to search for a company changes, iterate over 'companies' ie all companies registered by the user
    // if 'searchCompanyByText' is empty ie search string is not provided, return all companies, else return companies whose name matches the search string (make it case-insensitive by making all searches in lower case)
    
    useEffect(() => {
        const filteredCompany = (
            companies.length >= 0 && companies.filter((company) => {
                if (!searchCompanyByText) return true
                return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
            })
        )

        setFilterCompany(filteredCompany)
    }, [companies, searchCompanyByText])

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
                    {filterCompany?.map((company) => ( // iterate over filtered companies
                        <tr key={company._id}> {/* unique ID of the company works as its unique identifier in the table */} 
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={company.logo} /> {/* render company logo */}
                                </Avatar>
                            </TableCell>
                            <TableCell>{company.name}</TableCell> {/* render company name */}
                            <TableCell>{company.createdAt.split("T")[0]}</TableCell> {/* render company creation date */}
                            <TableCell className="text-right cursor-pointer">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        <div
                                            onClick={() => navigate(`/admin/companies/${company._id}`)} // clicking on 'Edit' button takes user to the company details
                                            className='flex items-center gap-2 w-fit cursor-pointer'
                                        >
                                            <Edit2 className='w-4' />
                                            <span>Edit</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </tr>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable