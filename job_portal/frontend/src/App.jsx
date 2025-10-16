import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Jobs from './components/Jobs'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import ProtectedRoute from './components/admin/ProtectedRoute'

const appRouter = createBrowserRouter([ // define all app routes with corresponding components
  { path: '/', element: <Home /> }, // homepage route
  { path: '/login', element: <Login /> }, // login page route
  { path: '/signup', element: <Signup /> }, // signup page route
  { path: "/jobs", element: <Jobs /> }, // route to job listings
  { path: "/description/:id", element: <JobDescription /> }, // dynamic route for job details by ID
  { path: "/browse", element: <Browse /> }, // route to browse jobs
  { path: "/profile", element: <Profile /> }, // user profile route
  { path: "/admin/companies", element: <ProtectedRoute><Companies /></ProtectedRoute> }, // admin company list, protected
  { path: "/admin/companies/create", element: <ProtectedRoute><CompanyCreate /></ProtectedRoute> }, // admin company creation, protected
  { path: "/admin/companies/:id", element: <ProtectedRoute><CompanySetup /></ProtectedRoute> }, // admin company setup by ID, protected
  { path: "/admin/jobs", element: <ProtectedRoute><AdminJobs /></ProtectedRoute> }, // admin job list, protected
  { path: "/admin/jobs/create", element: <ProtectedRoute><PostJob /></ProtectedRoute> }, // admin job creation, protected
  { path: "/admin/jobs/:id/applicants", element: <ProtectedRoute><Applicants /></ProtectedRoute> } // view applicants for job by ID, protected
])

function App() { // main App component providing the router
  return <RouterProvider router={appRouter} /> // inject appRouter into RouterProvider
}

export default App