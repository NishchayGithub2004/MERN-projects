import { useState } from "react"; // import useState hook to manage local component state
import { useAuthStore } from "../store/useAuthStore"; // import auth store hook to access signup logic and loading state
import BorderAnimatedContainer from "../components/BorderAnimatedContainer"; // import layout wrapper to provide animated border styling
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react"; // import icon components to visually represent form fields and loading state
import { Link } from "react-router"; // import Link component to enable client-side navigation

function SignUpPage() { // define a functional component named 'SignUpPage' to handle user registration flow
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "" }); // initialize form state to track user input values

    const { signup, isSigningUp } = useAuthStore(); // extract signup action and loading flag from auth store

    const handleSubmit = (e) => { // define submit handler to process signup form submission
        e.preventDefault(); // prevent default browser form submission behavior
        signup(formData); // trigger signup process with collected form data
    };

    return (
        <div className="w-full flex items-center justify-center p-4 bg-slate-900">
            <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
                <BorderAnimatedContainer>
                    <div className="w-full flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
                            <div className="w-full max-w-md">
                                <div className="text-center mb-8">
                                    <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
                                    <p className="text-slate-400">Sign up for a new account</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6"> {/* attach submit handler to process signup when form is submitted */}
                                    <div>
                                        <label className="auth-input-label">Full Name</label>
                                        <div className="relative">
                                            <UserIcon className="auth-input-icon" />

                                            <input
                                                type="text"
                                                value={formData.fullName} // bind input value to fullName field in local form state
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} // update fullName in form state when user types
                                                className="input"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="auth-input-label">Email</label>
                                        <div className="relative">
                                            <MailIcon className="auth-input-icon" />

                                            <input
                                                type="email"
                                                value={formData.email} // bind input value to email field in local form state
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} // update email in form state when user types
                                                className="input"
                                                placeholder="johndoe@gmail.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="auth-input-label">Password</label>
                                        <div className="relative">
                                            <LockIcon className="auth-input-icon" />

                                            <input
                                                type="password"
                                                value={formData.password} // bind input value to password field in local form state
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} // update password in form state when user types
                                                className="input"
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                    </div>

                                    <button className="auth-btn" type="submit" disabled={isSigningUp}> {/* disable submit button while signup request is in progress */}
                                        {isSigningUp ? ( // conditionally render loader while signup request is in progress
                                            <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                        ) : (
                                            "Create Account"
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link to="/login" className="auth-link">
                                        Already have an account? Login
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-linear-to-bl from-slate-800/20 to-transparent">
                            <div>
                                <img
                                    src="/signup.png"
                                    alt="People using mobile devices"
                                    className="w-full h-auto object-contain"
                                />
                                <div className="mt-6 text-center">
                                    <h3 className="text-xl font-medium text-cyan-400">Start Your Journey Today</h3>

                                    <div className="mt-4 flex justify-center gap-4">
                                        <span className="auth-badge">Free</span>
                                        <span className="auth-badge">Easy Setup</span>
                                        <span className="auth-badge">Private</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </BorderAnimatedContainer>
            </div>
        </div>
    );
}

export default SignUpPage;