import React from 'react';
import { motion } from 'framer-motion';
import AboutSection from '../components/AboutSection';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero About Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto max-w-7xl text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
                    >
                        About SyncWage
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-bold text-gray-800 mb-6"
                    >
                        Empowering Your <br />
                        <span className="text-blue-600">Payroll Journey</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-gray-600 max-w-3xl mx-auto mb-12"
                    >
                        Transform your payroll management with innovative solutions designed to simplify processes, ensure accuracy, and save time for modern businesses.
                    </motion.p>
                </div>
            </section>

            <AboutSection />
            
            {/* Detailed About Section */}
            <section className="py-16 px-4 bg-white">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Image and Features */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* Main Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="rounded-2xl overflow-hidden mb-6 shadow-2xl"
                            >
                                <img
                                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                    alt="Payroll professionals collaborating in modern office"
                                    className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500"
                                />
                            </motion.div>

                            {/* Feature Overlay Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl max-w-xs border border-gray-200"
                            >
                                <div className="flex items-center mb-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-gray-800">99% Accuracy</h4>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Businesses trust SyncWage for error-free payroll processing, delivering reliable results month after month.
                                </p>
                            </motion.div>

                            {/* Floating Stats */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                viewport={{ once: true }}
                                className="absolute top-6 left-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                            >
                                <div className="text-2xl font-bold text-blue-600">10K+</div>
                                <div className="text-sm text-gray-600">Satisfied Users</div>
                            </motion.div>
                        </motion.div>

                        {/* Right Column - Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="inline-block bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-4"
                            >
                                About SyncWage
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                viewport={{ once: true }}
                                className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight"
                            >
                                Revolutionizing Payroll Management for
                                <span className="text-blue-600"> Modern Businesses</span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                                className="text-gray-600 mb-8 leading-relaxed text-lg"
                            >
                                At SyncWage, we believe that simplified payroll builds stronger businesses.
                                Our mission is to transform how organizations handle salary disbursement,
                                compliance, and workforce payments — with speed, accuracy, and transparency.
                                Founded by payroll experts and technology leaders, SyncWage delivers a scalable,
                                user-friendly platform that eliminates manual errors, reduces workload, and enhances employee trust.
                            </motion.p>

                            {/* Feature Points */}
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    viewport={{ once: true }}
                                    className="flex items-start group hover:bg-blue-50 p-4 rounded-xl transition-colors duration-300"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-2 text-lg">
                                            Scalable for Any Business Size
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            From small startups to large enterprises, SyncWage adapts seamlessly
                                            to your organizational needs and grows alongside your business.
                                        </p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    viewport={{ once: true }}
                                    className="flex items-start group hover:bg-blue-50 p-4 rounded-xl transition-colors duration-300"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-2 text-lg">
                                            Designed by Payroll Experts
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed">
                                            Created by professionals who understand both payroll compliance and modern technology —
                                            ensuring practical solutions that work in the real world.
                                        </p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.7 }}
                                viewport={{ once: true }}
                                className="flex flex-wrap gap-4 mt-8"
                            >
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl">
                                    Get Started Today
                                </button>
                                <button className="border-2 border-gray-300 hover:border-blue-600 text-gray-600 hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors duration-300">
                                    Learn More
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Team/Values Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Vision</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Built by a dedicated team of payroll specialists and tech innovators with a passion for simplifying payroll worldwide.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                                title: "Innovation First",
                                description: "We continuously evolve SyncWage with the latest payroll technology trends and valuable client feedback."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                                title: "Business-Centric",
                                description: "Every feature we build is designed with your business needs in mind — making payroll efficient, accurate, and stress-free."
                            },
                            {
                                image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                                title: "Global Support",
                                description: "Our dedicated support team ensures you're never alone in your payroll journey — assistance whenever you need it."
                            }
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="rounded-2xl overflow-hidden mb-6 shadow-lg group-hover:shadow-2xl transition-shadow duration-300"
                                >
                                    <img
                                        src={card.image}
                                        alt={card.title}
                                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </motion.div>
                                <motion.h3
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: i * 0.2 + 0.3 }}
                                    viewport={{ once: true }}
                                    className="text-xl font-bold text-gray-800 mb-2"
                                >
                                    {card.title}
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: i * 0.2 + 0.4 }}
                                    viewport={{ once: true }}
                                    className="text-gray-600"
                                >
                                    {card.description}
                                </motion.p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;