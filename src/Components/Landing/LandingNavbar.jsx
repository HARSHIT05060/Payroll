import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Building2 } from 'lucide-react';
import { ThemeToggle } from '../../context/Themetoggle';

const LandingNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Features', href: '#features' },
        { name: 'Benefits', href: '#benefits' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Contact', href: '#contact' }
    ];

    const handleNavClick = (href) => {
        if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-[var(--color-bg-secondary)]/95 backdrop-blur-md shadow-lg border-b border-[var(--color-border-primary)]'
                : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
                        <div className="relative">
                            <Building2 className="w-8 h-8 text-[var(--color-blue)]" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--color-success)] rounded-full animate-pulse"></div>
                        </div>
                        <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] bg-clip-text text-transparent">
                            HRPro
                        </span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.href)}
                                className="text-[var(--color-text-secondary)] hover:text-[var(--color-blue)] font-medium transition-colors duration-200 relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--color-blue)] transition-all duration-200 group-hover:w-full"></span>
                            </button>
                        ))}
                    </div>

                    {/* Right side - Theme Toggle + CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <div className="mr-2">
                            <ThemeToggle />
                        </div>
                        
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-[var(--color-text-secondary)] hover:text-[var(--color-blue)] font-medium transition-colors duration-200"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="px-6 py-2 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-full font-medium hover:from-[var(--color-blue-dark)] hover:to-[var(--color-blue-darker)] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        {/* Theme Toggle for Mobile (visible) */}
                        <ThemeToggle />
                        
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-gradient-start)] transition-colors duration-200"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                    <div className="py-4 space-y-2 border-t border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]/95 backdrop-blur-md rounded-b-lg">
                        {navItems.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleNavClick(item.href)}
                                className="block w-full text-left px-4 py-3 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-gradient-start)] hover:text-[var(--color-blue)] rounded-lg font-medium transition-colors duration-200"
                            >
                                {item.name}
                            </button>
                        ))}
                        <div className="px-4 pt-4 pb-2 space-y-2">
                            <button
                                onClick={() => navigate('/login')}
                                className="block w-full px-4 py-2 text-center text-[var(--color-text-secondary)] border border-[var(--color-border-secondary)] rounded-lg font-medium hover:bg-[var(--color-bg-gradient-start)] hover:text-[var(--color-blue)] transition-colors duration-200"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="block w-full px-4 py-2 text-center bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-lg font-medium hover:from-[var(--color-blue-dark)] hover:to-[var(--color-blue-darker)] transition-all duration-200"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar;