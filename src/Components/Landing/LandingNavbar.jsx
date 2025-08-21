import { Button } from "./ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Logo from "../../assets/logo.png";
import { ThemeToggle } from "../../context/Themetoggle";
import { motion, AnimatePresence } from "framer-motion";

const LandingNavbar = () => {
    const [isPagesOpen, setIsPagesOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const navLinkClasses = ({ isActive }) =>
        `px-4 py-2 rounded-full transition-colors ${isActive
            ? "bg-[var(--color-blue-darker)] text-[var(--color-text-white)]"
            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-blue-darker)] hover:text-[var(--color-text-white)]"
        }`;

    return (
        <>
            <header className="bg-[var(--color-bg-secondary)] backdrop-blur-sm border-b border-[var(--color-border-primary)]/50 sticky top-0 z-50">
                <nav className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center space-x-2">
                            <NavLink to="/">
                                <img
                                    src={Logo}
                                    alt="Hurevo Logo"
                                    className="h-12 w-auto object-contain max-w-[200px] cursor-pointer"
                                />
                            </NavLink>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-4">
                            <NavLink to="/" className={navLinkClasses} onClick={scrollToTop}>
                                Home
                            </NavLink>
                            <NavLink to="/about" className={navLinkClasses} onClick={scrollToTop}>
                                About Us
                            </NavLink>
                            <NavLink to="/services" className={navLinkClasses} onClick={scrollToTop}>
                                Service
                            </NavLink>

                            {/* Pages Dropdown */}
                            <div
                                className="relative"
                                onMouseEnter={() => setIsPagesOpen(true)}
                                onMouseLeave={() => setIsPagesOpen(false)}
                            >
                                <button className="flex items-center space-x-1 px-4 py-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-blue-darker)] hover:text-[var(--color-text-white)] transition-colors">
                                    <span>Pages</span>
                                    <ChevronDown
                                        className={`h-4 w-4 transition-transform duration-200 ${isPagesOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                <div
                                    className={`absolute top-full left-0 mt-2 w-60 bg-[var(--color-blue-darker)] text-[var(--color-text-white)] rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out z-[60] ${isPagesOpen
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-2"
                                        }`}
                                >
                                    {[
                                        { to: "/dashboard", label: "Dashboard" },
                                        { to: "/employee-management", label: "Employee Management" },
                                        { to: "/payroll-benefits", label: "Payroll & Benefits" },
                                        { to: "/attendance-leave", label: "Attendance & Leave" },
                                        { to: "/performance-appraisal", label: "Performance & Appraisal" },
                                        { to: "/compliance-reports", label: "Compliance & Reports" },
                                        { to: "/hr-resources", label: "HR Resources & Templates" },
                                        { to: "/book-appointment", label: "Book Appointment / Demo" },
                                    ].map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            className={({ isActive }) =>
                                                `block px-4 py-3 ${isActive
                                                    ? "bg-[var(--color-blue-dark)]"
                                                    : "hover:bg-[var(--color-blue-dark)]"
                                                }`
                                            }
                                            onClick={scrollToTop}
                                        >
                                            {item.label}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Auth Buttons (Desktop) */}
                        <div className="hidden md:flex items-center space-x-3">
                            <ThemeToggle />
                            <NavLink to="/login">
                                <Button variant="ghost" className="text-[var(--color-text-primary)]">
                                    Log In
                                </Button>
                            </NavLink>
                            <NavLink to="/contact">
                                <Button variant="hero" className="px-6">
                                    Contact Us
                                </Button>
                            </NavLink>
                        </div>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsMobileOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                </nav>
            </header>

            {/* Mobile Slide-in Menu - Moved outside header */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-[9998]"
                            onClick={() => setIsMobileOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed top-0 right-0 h-full w-80 bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] shadow-2xl z-[9999] flex flex-col overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-[var(--color-border-primary)]">
                                <span className="text-xl font-semibold text-[var(--color-text-primary)]">Menu</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMobileOpen(false)}
                                    className="hover:bg-[var(--color-bg-hover)]"
                                >
                                    <X className="h-6 w-6 text-[var(--color-text-secondary)]" />
                                </Button>
                            </div>

                            {/* Menu Items */}
                            <div className="flex flex-col p-6 space-y-2">
                                <NavLink
                                    to="/"
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                            ? "bg-[var(--color-blue-darker)] text-[var(--color-text-white)]"
                                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                        }`
                                    }
                                    onClick={() => {
                                        scrollToTop();
                                        setIsMobileOpen(false);
                                    }}
                                >
                                    Home
                                </NavLink>
                                <NavLink
                                    to="/about"
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                            ? "bg-[var(--color-blue-darker)] text-[var(--color-text-white)]"
                                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                        }`
                                    }
                                    onClick={() => {
                                        scrollToTop();
                                        setIsMobileOpen(false);
                                    }}
                                >
                                    About Us
                                </NavLink>
                                <NavLink
                                    to="/services"
                                    className={({ isActive }) =>
                                        `px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                            ? "bg-[var(--color-blue-darker)] text-[var(--color-text-white)]"
                                            : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                        }`
                                    }
                                    onClick={() => {
                                        scrollToTop();
                                        setIsMobileOpen(false);
                                    }}
                                >
                                    Services
                                </NavLink>

                                {/* Pages Section */}
                                <div className="pt-4">
                                    <h3 className="px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                                        Pages
                                    </h3>
                                    {[
                                        { to: "/dashboard", label: "Dashboard" },
                                        { to: "/employee-management", label: "Employee Management" },
                                        { to: "/payroll-benefits", label: "Payroll & Benefits" },
                                        { to: "/attendance-leave", label: "Attendance & Leave" },
                                        { to: "/performance-appraisal", label: "Performance & Appraisal" },
                                        { to: "/compliance-reports", label: "Compliance & Reports" },
                                        { to: "/hr-resources", label: "HR Resources & Templates" },
                                        { to: "/book-appointment", label: "Book Appointment / Demo" },
                                    ].map((item) => (
                                        <NavLink
                                            key={item.to}
                                            to={item.to}
                                            className={({ isActive }) =>
                                                `block px-4 py-3 rounded-lg text-sm transition-colors ${isActive
                                                    ? "bg-[var(--color-blue-darker)] text-[var(--color-text-white)]"
                                                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                                }`
                                            }
                                            onClick={() => {
                                                scrollToTop();
                                                setIsMobileOpen(false);
                                            }}
                                        >
                                            {item.label}
                                        </NavLink>
                                    ))}
                                </div>

                                {/* Auth Links */}
                                <div className="pt-4 border-t border-[var(--color-border-primary)]">
                                    <NavLink
                                        to="/login"
                                        className={({ isActive }) =>
                                            `px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                                ? "bg-[var(--color-blue-darker)] text-[var(--color-text-white)]"
                                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                            }`
                                        }
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        Log In
                                    </NavLink>
                                    <NavLink
                                        to="/contact"
                                        className={({ isActive }) =>
                                            `px-4 py-3 rounded-lg text-base font-medium transition-colors ${isActive
                                                ? "bg-[var(--color-blue-darker)] text-[var(--color-text-white)]"
                                                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]"
                                            }`
                                        }
                                        onClick={() => setIsMobileOpen(false)}
                                    >
                                        Contact Us
                                    </NavLink>
                                </div>

                                {/* Theme Toggle */}
                                <div className="pt-4 border-t border-[var(--color-border-primary)]">
                                    <div className="px-4">
                                        <ThemeToggle />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default LandingNavbar;