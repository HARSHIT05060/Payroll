import React from 'react';
import { MessageCircle, Instagram, Linkedin, X } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[var(--color-blue)] min-h-screen flex flex-col justify-between">
            {/* Hero Section */}
            <section
                className="rounded-2xl m-6 p-10 flex flex-col md:flex-row items-center"
                style={{
                    background: 'linear-gradient(135deg, var(--color-blue-lightest) 0%, var(--color-blue-lighter) 100%)'
                }}
            >
                {/* Left Text */}
                <div className="flex-1">
                    <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4 leading-tight">
                        Empowering HR Teams to Work Smarter Everyday
                    </h1>
                    <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                        Join thousands of businesses simplifying HR tasks, improving employee
                        experience, and scaling faster with our all-in-one management platform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button className="bg-[var(--color-blue)] text-[var(--color-text-white)] px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-blue-dark)] transition-colors">
                            Get Started Now
                        </button>
                        <button className="border-2 border-[var(--color-blue)] text-[var(--color-blue)] px-8 py-3 rounded-full font-semibold hover:bg-[var(--color-blue)] hover:text-[var(--color-text-white)] transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>

                {/* Right Image */}
                <div className="flex-1 mt-8 md:mt-0 md:ml-8 flex justify-center items-center">
                    <div className="w-full max-w-md h-[300px] md:h-[350px]">
                        <img
                            src="https://img.freepik.com/free-photo/medium-shot-woman-working-laptop_23-2149300654.jpg"
                            alt="HR Professional"
                            className="w-full h-full object-cover rounded-xl shadow-lg"
                        />
                    </div>
                </div>
            </section>

            {/* Navigation Links Section */}
            <div className="text-[var(--color-text-white)] px-6 py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                        {/* Home Column */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Home</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                            </ul>
                        </div>

                        {/* About us Column */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About us</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                            </ul>
                        </div>

                        {/* Service Column */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Service</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                            </ul>
                        </div>

                        {/* Payroll Column */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Payroll</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                                <li><a href="#" className="text-sm hover:text-[var(--color-blue-lighter)] transition-colors cursor-pointer">Vision & Mission</a></li>
                            </ul>
                        </div>

                        {/* Contact Us Column */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <div className="flex space-x-3">
                                <a href="#" className="bg-[var(--color-bg-secondary-20)] p-2 rounded-full hover:bg-[var(--color-bg-secondary-30)] transition-all">
                                    <MessageCircle size={20} className="text-[var(--color-text-white)]" />
                                </a>
                                <a href="#" className="bg-[var(--color-bg-secondary-20)] p-2 rounded-full hover:bg-[var(--color-bg-secondary-30)] transition-all">
                                    <Instagram size={20} className="text-[var(--color-text-white)]" />
                                </a>
                                <a href="#" className="bg-[var(--color-bg-secondary-20)] p-2 rounded-full hover:bg-[var(--color-bg-secondary-30)] transition-all">
                                    <Linkedin size={20} className="text-[var(--color-text-white)]" />
                                </a>
                                <a href="#" className="bg-[var(--color-bg-secondary-20)] p-2 rounded-full hover:bg-[var(--color-bg-secondary-30)] transition-all">
                                    <X size={20} className="text-[var(--color-text-white)]" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Bar - Dark */}
            <div className="bg-[var(--color-blue-darkest)] border-t border-[var(--color-blue-darker)] px-6 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
                    <div className="mb-2 md:mb-0 text-[var(--color-text-white-90)]">
                        Copyright © 2025 Hunivo - Human Resources Management (HRM)
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-[var(--color-text-white-90)] hover:text-[var(--color-blue-lighter)] transition-colors">Privacy Policy</a>
                        <a href="#" className="text-[var(--color-text-white-90)] hover:text-[var(--color-blue-lighter)] transition-colors">Terms Condition</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;