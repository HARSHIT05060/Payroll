import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Calendar,
    DollarSign,
    Clock,
    BarChart3,
    Shield,
    CheckCircle,
    Star,
    ArrowRight,
    Play,
    ChevronRight,
    Building2,
    UserCheck,
    TrendingUp,
    Award,
    Zap,
    Globe,
    Phone,
    Mail,
    MapPin,
    Network,
    Target,
    MessageCircle,
    Timer,
    FileText,
    CreditCard,
    Briefcase,
    Settings
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(0);
    const [stats, setStats] = useState({ employees: 0, companies: 0, countries: 0 });
    const [scrollY, setScrollY] = useState(0);
    const featuresRef = useRef(null);

    // Handle scroll for parallax effect
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animated counter effect
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                employees: prev.employees < 50000 ? prev.employees + 500 : 50000,
                companies: prev.companies < 1200 ? prev.companies + 12 : 1200,
                countries: prev.countries < 75 ? prev.countries + 1 : 75
            }));
        }, 50);

        setTimeout(() => clearInterval(interval), 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Clock,
            title: "Real-Time Attendance",
            description: "Track employee check-in and check-out times with precision. Real-time attendance monitoring with automated validation and reporting.",
            image: "/api/placeholder/600/400",
            benefits: ["Live attendance tracking", "Automated validation", "Real-time dashboards"],
            mockupContent: {
                title: "Today's Attendance",
                stats: { present: "245", absent: "15", late: "8" },
                items: ["Check-in: 09:00 AM", "Break: 01:00 PM", "Check-out: 06:00 PM"]
            }
        },
        {
            icon: Users,
            title: "Employee Management",
            description: "Comprehensive employee directory with department management, role assignments, and detailed profile management for organizational efficiency.",
            image: "/api/placeholder/600/400",
            benefits: ["Complete employee profiles", "Department organization", "Role-based access"],
            mockupContent: {
                title: "Employee Directory",
                stats: { employees: "260", departments: "12", branches: "5" },
                items: ["Human Resources", "Information Technology", "Finance & Accounts"]
            }
        },
        {
            icon: DollarSign,
            title: "Payroll Management",
            description: "Automated payroll processing with salary calculations, deductions, allowances, and comprehensive payroll reports with export capabilities.",
            image: "/api/placeholder/600/400",
            benefits: ["Automated calculations", "Tax deductions", "Payroll reports"],
            mockupContent: {
                title: "Monthly Payroll",
                stats: { processed: "98%", amount: "$125K", employees: "245" },
                items: ["Salary Processing", "Tax Calculations", "Bonus Distribution"]
            }
        },
        {
            icon: Calendar,
            title: "Leave Management",
            description: "Digital leave application system with approval workflows, leave balance tracking, and automated status updates for seamless leave management.",
            image: "/api/placeholder/600/400",
            benefits: ["Digital applications", "Approval workflows", "Balance tracking"],
            mockupContent: {
                title: "Leave Dashboard",
                stats: { pending: "12", approved: "85", rejected: "3" },
                items: ["Annual Leave", "Sick Leave", "Emergency Leave"]
            }
        },
        {
            icon: BarChart3,
            title: "Advanced Reports",
            description: "Comprehensive reporting system with daily, monthly, and custom date range reports. Export capabilities in PDF and Excel formats.",
            image: "/api/placeholder/600/400",
            benefits: ["Custom date ranges", "Multiple formats", "Automated generation"],
            mockupContent: {
                title: "Analytics Dashboard",
                stats: { reports: "25", exports: "150", insights: "45" },
                items: ["Daily Reports", "Monthly Analysis", "Custom Insights"]
            }
        },
        {
            icon: Settings,
            title: "System Configuration",
            description: "Flexible system settings with shift management, time zone configuration, and customizable workflows to match your organization's needs.",
            image: "/api/placeholder/600/400",
            benefits: ["Custom workflows", "Shift management", "Time zone support"],
            mockupContent: {
                title: "Configuration Panel",
                stats: { shifts: "3", policies: "8", integrations: "5" },
                items: ["Morning Shift", "Evening Shift", "Night Shift"]
            }
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "HR Director",
            company: "TechCorp Solutions",
            content: "SyncWage has revolutionized our attendance management. The automated payroll processing saves us hours every month.",
            rating: 5,
            avatar: "/api/placeholder/60/60"
        },
        {
            name: "Michael Chen",
            role: "Operations Manager",
            company: "Global Manufacturing",
            content: "The real-time attendance tracking and comprehensive reporting have improved our workforce management significantly.",
            rating: 5,
            avatar: "/api/placeholder/60/60"
        },
        {
            name: "Emily Rodriguez",
            role: "CEO",
            company: "StartupHub",
            content: "As a growing company, SyncWage's scalable solution has been perfect for managing our expanding team efficiently.",
            rating: 5,
            avatar: "/api/placeholder/60/60"
        }
    ];
    // Calculate parallax offset
    const parallaxOffset = scrollY * 0.5;

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]" >
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
                {/* Background Elements with Parallax */}
                <div
                    className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue-lightest)] via-[var(--color-bg-secondary)] to-[var(--color-bg-gradient-end)]"
                    style={{ transform: `translateY(${parallaxOffset * 0.1}px)` }}
                ></div>
                <div
                    className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--color-blue-lighter)]/50 to-transparent"
                    style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
                ></div>

                {/* Floating Elements */}
                <div
                    className="absolute top-20 left-10 w-20 h-20 bg-[var(--color-blue-lighter)] rounded-full opacity-20 animate-pulse"
                    style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
                ></div>
                <div
                    className="absolute bottom-20 right-20 w-32 h-32 bg-[var(--color-bg-gradient-end)] rounded-full opacity-20 animate-bounce"
                    style={{ transform: `translateY(${-parallaxOffset * 0.2}px)` }}
                ></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                        <div className="lg:col-span-6">
                            {/* Badge */}
                            <div className="inline-flex items-center px-4 py-2 bg-[var(--color-blue-lightest)] text-[var(--color-blue-dark)] rounded-full text-sm font-medium mb-8">
                                <Clock className="w-4 h-4 mr-2" />
                                #1 Attendance Management System
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] leading-tight">
                                Streamline Your
                                <span className="block bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] bg-clip-text text-transparent">
                                    SyncWage
                                </span>
                                Operations
                            </h1>

                            {/* Description */}
                            <p className="mt-6 text-xl text-[var(--color-text-secondary)] leading-relaxed">
                                Comprehensive attendance management system with real-time tracking, automated payroll,
                                leave management, and powerful analytics. Transform your HR operations with SyncWage.
                            </p>

                            {/* CTA Buttons */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-xl font-semibold hover:from-[var(--color-blue-dark)] hover:to-[var(--color-blue-darker)] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group"
                                >
                                    Start Free Trial
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 border-2 border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] rounded-xl font-semibold hover:border-[var(--color-blue)] hover:text-[var(--color-blue)] transition-all duration-200 flex items-center justify-center group">
                                    <Play className="w-5 h-5 mr-2" />
                                    Watch Demo
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="mt-12 flex items-center space-x-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.employees.toLocaleString()}+</div>
                                    <div className="text-sm text-[var(--color-text-secondary)]">Employees Managed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.companies}+</div>
                                    <div className="text-sm text-[var(--color-text-secondary)]">Companies Trust Us</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.countries}+</div>
                                    <div className="text-sm text-[var(--color-text-secondary)]">Countries Served</div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Dashboard Mockup */}
                        <div className="lg:col-span-6 mt-16 lg:mt-0">
                            <div
                                className="relative"
                                style={{ transform: `translateY(${-parallaxOffset * 0.1}px)` }}
                            >
                                {/* Main Dashboard */}
                                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <div className="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] h-12 flex items-center px-6">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-[var(--color-error)] rounded-full"></div>
                                            <div className="w-3 h-3 bg-[var(--color-warning)] rounded-full"></div>
                                            <div className="w-3 h-3 bg-[var(--color-success)] rounded-full"></div>
                                        </div>
                                        <div className="ml-4 text-[var(--color-text-white)] text-sm font-medium">SyncWage Dashboard</div>
                                    </div>
                                    <div className="p-8">
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-[var(--color-blue-lightest)] p-4 rounded-lg">
                                                <UserCheck className="w-8 h-8 text-[var(--color-blue)] mb-2" />
                                                <div className="text-2xl font-bold text-[var(--color-text-primary)]">245</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="relative py-24 bg-[var(--color-bg-primary)] overflow-hidden" ref={featuresRef}>
                {/* Parallax Background */}
                <div
                    className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{ transform: `translateY(${parallaxOffset * 0.15}px)` }}
                >
                    <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--color-blue)] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-[var(--color-blue-dark)] rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div
                        className="text-center mb-16"
                        style={{ transform: `translateY(${-parallaxOffset * 0.05}px)` }}
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-[var(--color-blue-lightest)] text-[var(--color-blue-dark)] rounded-full text-sm font-medium mb-4">
                            <Zap className="w-4 h-4 mr-2" />
                            Powerful Features
                        </div>
                        <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                            Everything You Need for
                            <span className="block text-[var(--color-blue)]">Modern HR Management</span>
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
                            SyncWage provides comprehensive tools for attendance tracking, payroll management,
                            leave administration, and advanced reporting to streamline your HR operations.
                        </p>
                    </div>

                    {/* Interactive Features */}
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Feature Navigation */}
                        <div className="lg:col-span-4 mb-8 lg:mb-0">
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveFeature(index)}
                                        className={`w-full text-left p-6 rounded-xl transition-all duration-500 transform ${activeFeature === index
                                            ? 'bg-[var(--color-bg-secondary)] shadow-lg border-l-4 border-[var(--color-blue)] scale-105'
                                            : 'bg-[var(--color-bg-secondary)]/50 hover:bg-[var(--color-bg-secondary)] hover:shadow-md hover:scale-102'
                                            }`}
                                        style={{
                                            transform: `translateY(${-parallaxOffset * 0.02 * (index + 1)}px) ${activeFeature === index ? 'scale(1.05)' : 'scale(1)'}`,
                                            transition: 'all 0.5s ease-out'
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-lg mr-4 transition-all duration-300 ${activeFeature === index ? 'bg-[var(--color-blue-lightest)] animate-pulse' : 'bg-[var(--color-bg-gray-light)]'
                                                }`}>
                                                <feature.icon className={`w-6 h-6 transition-all duration-300 ${activeFeature === index ? 'text-[var(--color-blue)] scale-110' : 'text-[var(--color-text-secondary)]'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1">{feature.title}</h3>
                                                <p className="text-sm text-[var(--color-text-secondary)]">{feature.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Feature Display */}
                        <div className="lg:col-span-8">
                            <div
                                className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl overflow-hidden transform transition-all duration-700"
                                style={{ transform: `translateY(${-parallaxOffset * 0.03}px)` }}
                            >
                                <div className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="p-4 bg-[var(--color-blue-lightest)] rounded-xl mr-4 animate-pulse">
                                            {React.createElement(features[activeFeature].icon, {
                                                className: "w-8 h-8 text-[var(--color-blue)]"
                                            })}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{features[activeFeature].title}</h3>
                                            <p className="text-[var(--color-text-secondary)]">{features[activeFeature].description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                        {features[activeFeature].benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center p-4 bg-[var(--color-success-light)] rounded-lg transform hover:scale-105 transition-transform duration-300">
                                                <CheckCircle className="w-5 h-5 text-[var(--color-success)] mr-2 flex-shrink-0" />
                                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Dynamic Interface Mockup */}
                                    <div className="bg-[var(--color-bg-gray-light)] rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-[var(--color-error)] rounded-full animate-pulse"></div>
                                                <div className="w-3 h-3 bg-[var(--color-warning)] rounded-full animate-pulse delay-100"></div>
                                                <div className="w-3 h-3 bg-[var(--color-success)] rounded-full animate-pulse delay-200"></div>
                                            </div>
                                            <div className="text-xs text-[var(--color-text-muted)] bg-[var(--color-success-light)] px-2 py-1 rounded-full">Live Preview</div>
                                        </div>
                                        <div className="bg-[var(--color-bg-secondary)] rounded-lg p-6">
                                            <div className="mb-4">
                                                <h4 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                                                    {features[activeFeature].mockupContent.title}
                                                </h4>
                                                <div className="flex space-x-4 mb-4">
                                                    {Object.entries(features[activeFeature].mockupContent.stats).map(([key, value], index) => (
                                                        <div key={index} className="bg-[var(--color-blue-lightest)] px-3 py-2 rounded-lg">
                                                            <div className="text-sm font-bold text-[var(--color-blue)]">{value}</div>
                                                            <div className="text-xs text-[var(--color-text-secondary)]">{key}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {features[activeFeature].mockupContent.items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-3 bg-[var(--color-bg-primary)] rounded-lg"
                                                    >
                                                        <span className="text-sm text-[var(--color-text-primary)]">{item}</span>
                                                        <div className="w-16 h-2 bg-[var(--color-bg-gray-light)] rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-full animate-pulse"
                                                                style={{
                                                                    width: `${70 + (index * 10)}%`,
                                                                    animationDelay: `${index * 200}ms`
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Stats Section */}
            <section className="py-24 bg-[var(--color-bg-secondary)] relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                            SyncWage by the Numbers
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">
                            Join thousands of organizations already using SyncWage to streamline their HR operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div
                            className="text-center transform hover:scale-105 transition-transform duration-300"
                            style={{ transform: `translateY(${-parallaxOffset * 0.02}px)` }}
                        >
                            <div className="bg-[var(--color-blue-lightest)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-10 h-10 text-[var(--color-blue)]" />
                            </div>
                            <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{stats.employees.toLocaleString()}+</div>
                            <div className="text-[var(--color-text-secondary)]">Employees Managed Daily</div>
                        </div>

                        <div
                            className="text-center transform hover:scale-105 transition-transform duration-300"
                            style={{ transform: `translateY(${-parallaxOffset * 0.03}px)` }}
                        >
                            <div className="bg-[var(--color-success-light)] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Building2 className="w-10 h-10 text-[var(--color-success)]" />
                            </div>
                            <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{stats.companies}+</div>
                            <div className="text-[var(--color-text-secondary)]">Companies Trust Us</div>
                        </div>

                        <div
                            className="text-center transform hover:scale-105 transition-transform duration-300"
                            style={{ transform: `translateY(${-parallaxOffset * 0.04}px)` }}
                        >
                            <div className="bg-[#fefce8] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-10 h-10 text-[var(--color-warning)]" />
                            </div>
                            <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{stats.countries}+</div>
                            <div className="text-[var(--color-text-secondary)]">Countries Worldwide</div>
                        </div>

                        <div
                            className="text-center transform hover:scale-105 transition-transform duration-300"
                            style={{ transform: `translateY(${-parallaxOffset * 0.05}px)` }}
                        >
                            <div className="bg-[#f3e8ff] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-10 h-10 text-[#8b5cf6]" />
                            </div>
                            <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">99.9%</div>
                            <div className="text-[var(--color-text-secondary)]">Uptime Guarantee</div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-br from-[var(--color-blue-lightest)] to-[var(--color-bg-gradient-end)] relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ transform: `translateY(${parallaxOffset * 0.08}px)` }}
                >
                    <div className="absolute top-1/4 left-0 w-64 h-64 bg-[var(--color-blue)] rounded-full blur-2xl"></div>
                    <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-[var(--color-blue-dark)] rounded-full blur-2xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                            Loved by Business Leaders
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">
                            Don't just take our word for it. See what our members have to say.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-[var(--color-bg-secondary)] rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                                style={{
                                    transform: `translateY(${-parallaxOffset * 0.02 * (index + 1)}px)`,
                                    transition: 'all 0.5s ease-out'
                                }}
                            >
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-[var(--color-warning)] fill-current" />
                                    ))}
                                </div>
                                <p className="text-[var(--color-text-secondary)] mb-6 italic">"{testimonial.content}"</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-[var(--color-blue-lightest)] rounded-full flex items-center justify-center mr-4">
                                        <span className="text-[var(--color-blue)] font-semibold">
                                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-[var(--color-text-primary)]">{testimonial.name}</div>
                                        <div className="text-sm text-[var(--color-text-secondary)]">{testimonial.role}, {testimonial.company}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ transform: `translateY(${parallaxOffset * 0.05}px)` }}
                >
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-[var(--color-text-white)] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[var(--color-blue-lighter)] rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-[var(--color-text-white)] mb-6">
                        Ready to Transform Your Business Network?
                    </h2>
                    <p className="text-xl text-[var(--color-blue-lightest)] mb-10">
                        Join thousands of entrepreneurs already using Progress Alliance to build meaningful business connections.
                        Start your networking journey today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-[var(--color-bg-secondary)] text-[var(--color-blue)] rounded-xl font-semibold hover:bg-[var(--color-blue-lightest)] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group"
                        >
                            Join Alliance Today
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 border-2 border-[var(--color-text-white)] text-[var(--color-text-white)] rounded-xl font-semibold hover:bg-[var(--color-text-white)] hover:text-[var(--color-blue)] transition-all duration-200 flex items-center justify-center">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[var(--color-modal-footer-bg)] text-[var(--color-text-white)] py-16 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-5"
                    style={{ transform: `translateY(${parallaxOffset * 0.03}px)` }}
                >
                    <div className="absolute top-10 left-10 w-64 h-64 bg-[var(--color-blue)] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-[var(--color-blue-dark)] rounded-full blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-[var(--color-blue)] rounded-lg flex items-center justify-center mr-3">
                                    <Network className="w-6 h-6 text-[var(--color-text-white)]" />
                                </div>
                                <span className="text-2xl font-bold">Progress Alliance</span>
                            </div>
                            <p className="text-[var(--color-text-muted)] mb-6">
                                Connect, network, and keep track of your business growth with our comprehensive networking platform.
                                Built for modern entrepreneurs and business leaders.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-[var(--color-bg-hover)] rounded-lg flex items-center justify-center hover:bg-[var(--color-blue)] transition-colors cursor-pointer">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-[var(--color-bg-hover)] rounded-lg flex items-center justify-center hover:bg-[var(--color-blue)] transition-colors cursor-pointer">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-[var(--color-bg-hover)] rounded-lg flex items-center justify-center hover:bg-[var(--color-blue)] transition-colors cursor-pointer">
                                    <Phone className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Platform Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Platform</h3>
                            <ul className="space-y-4">
                                <li><a href="#features" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Features</a></li>
                                <li><a href="#pricing" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Membership</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Mobile App</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Member Directory</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Events</a></li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Company</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">About Us</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Our Mission</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Success Stories</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Press</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Partners</a></li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Support</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Help Center</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Contact Us</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Member Support</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Guidelines</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-12 pt-8 border-t border-[var(--color-border-primary)] flex flex-col md:flex-row justify-between items-center">
                        <div className="text-[var(--color-text-muted)] mb-4 md:mb-0">
                            © 2025 Progress Alliance. All rights reserved.
                        </div>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Terms</a>
                            <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Privacy</a>
                            <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;