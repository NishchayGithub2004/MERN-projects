import { useState } from "react"; // import useState hook to manage local form state within the component
import { useAuthStore } from "../store/useAuthStore"; // import auth store hook to access login logic and authentication state
import BorderAnimatedContainer from "../components/BorderAnimatedContainer"; // import animated container component to provide consistent auth page layout
import { MessageCircleIcon, MailIcon, LoaderIcon, LockIcon } from "lucide-react"; // import icon components to visually represent inputs and loading state
import { Link } from "react-router"; // import Link component to enable client-side navigation between routes

function LoginPage() { // define a functional component named 'LoginPage' to handle user authentication flow
    const [formData, setFormData] = useState({ email: "", password: "" }); // initialize state object to store user-entered email and password values

    const { login, isLoggingIn } = useAuthStore(); // extract login action and loading flag to trigger authentication and reflect progress

    const handleSubmit = (e) => { // define submit handler to process login form submission
        e.preventDefault(); // prevent default browser form submission to handle login via JavaScript
        login(formData); // invoke login action with current form data
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
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back</h2>
                                    <p className="text-slate-400">Login to access to your account</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6"> {/* attach submit handler to process login when form is submitted */}
                                    <div>
                                        <label className="auth-input-label">Email</label>
                                        <div className="relative">
                                            <MailIcon className="auth-input-icon" />

                                            <input
                                                type="email"
                                                value={formData.email} // bind input value to email field in local form state
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} // update email value in form state on user input
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
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} // update password value in form state on user input
                                                className="input"
                                                placeholder="Enter your password"
                                            />
                                        </div>
                                    </div>

                                    <button className="auth-btn" type="submit" disabled={isLoggingIn}> {/* disable submit button while login request is in progress */}
                                        {isLoggingIn ? ( // conditionally render loader while authentication is in progress
                                            <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link to="/signup" className="auth-link"> {/* navigate user to signup page when they do not have an account */}
                                        Don't have an account? Sign Up
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-linear-to-bl from-slate-800/20 to-transparent">
                            <div>
                                <img
                                    src="/login.png"
                                    alt="People using mobile devices"
                                    className="w-full h-auto object-contain"
                                />
                                <div className="mt-6 text-center">
                                    <h3 className="text-xl font-medium text-cyan-400">Connect anytime, anywhere</h3>

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

export default LoginPage;