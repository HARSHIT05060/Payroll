import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const LandingNavbar = () => {
    return (
        <header className="bg-[var(--color-bg-secondary)]/95 backdrop-blur-sm border-b border-[var(--color-border-primary)]/50 sticky top-0 z-50">
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
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" className={({ isActive }) =>
                            `transition-colors font-medium ${isActive ? 'text-[var(--color-blue)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-blue)]'}`
                        }>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={({ isActive }) =>
                            `transition-colors ${isActive ? 'text-[var(--color-blue)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-blue)]'}`
                        }>
                            About Us
                        </NavLink>
                        <NavLink to="/services" className={({ isActive }) =>
                            `transition-colors ${isActive ? 'text-[var(--color-blue)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-blue)]'}`
                        }>
                            Services
                        </NavLink>
                        <NavLink to="/features" className={({ isActive }) =>
                            `transition-colors ${isActive ? 'text-[var(--color-blue)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-blue)]'}`
                        }>
                            Features
                        </NavLink>
                        <NavLink to="/posts" className={({ isActive }) =>
                            `transition-colors ${isActive ? 'text-[var(--color-blue)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-blue)]'}`
                        }>
                            Posts
                        </NavLink>
                        <NavLink to="/contact" className={({ isActive }) =>
                            `transition-colors ${isActive ? 'text-[var(--color-blue)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-blue)]'}`
                        }>
                            Contact
                        </NavLink>
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