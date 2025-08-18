import { Button } from "./ui/button";
import { Menu, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

const LandingNavbar = () => {
    const [isPagesOpen, setIsPagesOpen] = useState(false);
    const [isPostsOpen, setIsPostsOpen] = useState(false);

    const navLinkClasses = ({ isActive }) =>
        `px-4 py-2 rounded-full transition-colors ${
            isActive
                ? "bg-[var(--color-blue)] text-[var(--color-text-white)]"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-blue-light)] hover:text-[var(--color-blue-dark)]"
        }`;

    return (
        <header className="bg-[var(--color-bg-secondary)] backdrop-blur-sm border-b border-[var(--color-border-primary)]/50 sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-md flex items-center justify-center">
                            <span className="text-[var(--color-text-white)] font-bold text-lg">H</span>
                        </div>
                        <span className="text-2xl font-bold text-[var(--color-text-primary)]">Hurevo</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        <NavLink to="/" className={navLinkClasses}>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={navLinkClasses}>
                            About Us
                        </NavLink>
                        
                        {/* Posts Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsPostsOpen(true)}
                            onMouseLeave={() => setIsPostsOpen(false)}
                        >
                            <button className="flex items-center space-x-1 px-4 py-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-blue-light)] hover:text-[var(--color-blue-dark)] transition-colors">
                                <span>Posts</span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isPostsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`absolute top-full left-0 mt-2 w-52 bg-[var(--color-blue)] text-[var(--color-text-white)] rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isPostsOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                <NavLink to="/blog" className={({ isActive }) =>
                                    `block px-4 py-3 ${isActive ? "bg-[var(--color-blue-dark)]" : "hover:bg-[var(--color-blue-dark)]"}`
                                }>
                                    Blog
                                </NavLink>
                                <NavLink to="/single-post" className={({ isActive }) =>
                                    `block px-4 py-3 ${isActive ? "bg-[var(--color-blue-dark)]" : "hover:bg-[var(--color-blue-dark)]"}`
                                }>
                                    Single Post
                                </NavLink>
                            </div>
                        </div>

                        <NavLink to="/services" className={navLinkClasses}>
                            Service
                        </NavLink>

                        {/* Pages Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsPagesOpen(true)}
                            onMouseLeave={() => setIsPagesOpen(false)}
                        >
                            <button className="flex items-center space-x-1 px-4 py-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-blue-light)] hover:text-[var(--color-blue-dark)] transition-colors">
                                <span>Pages</span>
                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isPagesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`absolute top-full left-0 mt-2 w-60 bg-[var(--color-blue)] text-[var(--color-text-white)] rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isPagesOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                                {[
                                    { to: "/talent-acquisition", label: "Talent Acquisition" },
                                    { to: "/employee-management", label: "Employee Management" },
                                    { to: "/payroll-benefits", label: "Payroll & Benefits" },
                                    { to: "/performance-appraisal", label: "Performance & Appraisal" },
                                    { to: "/hr-resources", label: "HR Resources & Templates" },
                                    { to: "/book-appointment", label: "Book Appointment" },
                                    { to: "/404", label: "404 Error" },
                                    { to: "/coming-soon", label: "Coming Soon" },
                                ].map((item) => (
                                    <NavLink 
                                        key={item.to} 
                                        to={item.to} 
                                        className={({ isActive }) =>
                                            `block px-4 py-3 ${isActive ? "bg-[var(--color-blue-dark)]" : "hover:bg-[var(--color-blue-dark)]"}`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Button variant="ghost" className="text-[var(--color-text-primary)]">
                            Log In
                        </Button>
                        <Button variant="hero" className="px-6">
                            Sign Up
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </nav>
        </header>
    );
};

export default LandingNavbar;
