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
    Settings,
    Eye,
    PlusCircle,
    Download
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(0);
    const [stats, setStats] = useState({ employees: 0, companies: 0, countries: 0, accuracy: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [visibleSections, setVisibleSections] = useState(new Set());
    const featuresRef = useRef(null);
    const observerRef = useRef(null);

    // Handle scroll for parallax effect
    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer for scroll animations
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections(prev => new Set([...prev, entry.target.id]));
                    }
                });
            },
            { threshold: 0.1, rootMargin: '-50px' }
        );

        const sections = document.querySelectorAll('[data-animate]');
        sections.forEach(section => observerRef.current.observe(section));

        return () => observerRef.current?.disconnect();
    }, []);

    // Animated counter effect
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                employees: prev.employees < 50000 ? prev.employees + 750 : 50000,
                companies: prev.companies < 1200 ? prev.companies + 15 : 1200,
                countries: prev.countries < 75 ? prev.countries + 1 : 75,
                accuracy: prev.accuracy < 99.9 ? prev.accuracy + 0.1 : 99.9
            }));
        }, 30);

        setTimeout(() => clearInterval(interval), 2500);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Clock,
            title: "Real-Time Attendance Tracking",
            description: "Track employee check-in and check-out times with precision. Automated validation, GPS tracking, and real-time monitoring dashboard.",
            image: "/api/placeholder/600/400",
            benefits: ["Live GPS tracking", "Automated validation", "Real-time dashboards"],
            mockupContent: {
                title: "Today's Attendance Overview",
                stats: { present: "245", absent: "15", late: "8" },
                items: ["Check-in: 09:00 AM", "Lunch Break: 01:00 PM", "Check-out: 06:00 PM"]
            }
        },
        {
            icon: Users,
            title: "Comprehensive Employee Management",
            description: "Complete employee directory with department management, role assignments, branch organization, and detailed profile management.",
            image: "/api/placeholder/600/400",
            benefits: ["Complete employee profiles", "Multi-branch support", "Role-based access control"],
            mockupContent: {
                title: "Employee Directory",
                stats: { employees: "260", departments: "12", branches: "5" },
                items: ["Human Resources", "Information Technology", "Finance & Accounts"]
            }
        },
        {
            icon: DollarSign,
            title: "Automated Payroll Processing",
            description: "Advanced payroll management with automated salary calculations, tax deductions, allowances, overtime calculations, and comprehensive reporting.",
            image: "/api/placeholder/600/400",
            benefits: ["Automated calculations", "Tax management", "Multi-format exports"],
            mockupContent: {
                title: "Monthly Payroll Dashboard",
                stats: { processed: "98%", amount: "$125K", employees: "245" },
                items: ["Salary Processing", "Tax Calculations", "Overtime & Bonuses"]
            }
        },
        {
            icon: Calendar,
            title: "Smart Leave Management",
            description: "Digital leave application system with multi-level approval workflows, leave balance tracking, calendar integration, and automated notifications.",
            image: "/api/placeholder/600/400",
            benefits: ["Digital applications", "Approval workflows", "Calendar integration"],
            mockupContent: {
                title: "Leave Management Dashboard",
                stats: { pending: "12", approved: "85", available: "180" },
                items: ["Annual Leave", "Sick Leave", "Emergency Leave"]
            }
        },
        {
            icon: BarChart3,
            title: "Advanced Analytics & Reports",
            description: "Comprehensive reporting system with daily, monthly, and custom reports. Export in PDF/Excel formats with interactive charts and insights.",
            image: "/api/placeholder/600/400",
            benefits: ["Custom date ranges", "Interactive charts", "Multiple export formats"],
            mockupContent: {
                title: "Analytics Dashboard",
                stats: { reports: "25", insights: "150", exports: "45" },
                items: ["Daily Attendance", "Monthly Analysis", "Performance Insights"]
            }
        },
        {
            icon: Settings,
            title: "Flexible System Configuration",
            description: "Customizable shift management, time zone configuration, workflow automation, and integration capabilities to match your organization's needs.",
            image: "/api/placeholder/600/400",
            benefits: ["Custom workflows", "Multi-shift support", "API integrations"],
            mockupContent: {
                title: "Configuration Panel",
                stats: { shifts: "6", policies: "12", integrations: "8" },
                items: ["Morning Shift", "Evening Shift", "Night Shift"]
            }
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "HR Director",
            company: "TechCorp Solutions",
            content: "SyncWage has revolutionized our attendance management. The automated payroll processing and real-time tracking have saved us countless hours every month.",
            rating: 5,
            avatar: "/api/placeholder/60/60"
        },
        {
            name: "Michael Chen",
            role: "Operations Manager",
            company: "Global Manufacturing Inc.",
            content: "The comprehensive reporting and multi-branch support make managing our workforce across different locations incredibly efficient and transparent.",
            rating: 5,
            avatar: "/api/placeholder/60/60"
        },
        {
            name: "Emily Rodriguez",
            role: "CEO",
            company: "Innovation StartupHub",
            content: "As a growing company, SyncWage's scalable solution has been perfect for managing our expanding team with automated workflows and detailed analytics.",
            rating: 5,
            avatar: "/api/placeholder/60/60"
        }
    ];

    // Calculate parallax offset with smoother animations
    const parallaxOffset = scrollY * 0.3;

    const getAnimationClass = (sectionId) => {
        return visibleSections.has(sectionId) 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 translate-y-10 scale-95';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden" id="hero" data-animate>
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div 
                        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-indigo-500/5 to-purple-600/10"
                        style={{ transform: `translateY(${parallaxOffset * 0.1}px) rotate(${scrollY * 0.01}deg)` }}
                    />
                    <div 
                        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 blur-3xl animate-pulse"
                        style={{ transform: `translateY(${parallaxOffset * 0.2}px)` }}
                    />
                    <div 
                        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-15 blur-3xl animate-bounce"
                        style={{ transform: `translateY(${-parallaxOffset * 0.15}px)`, animationDuration: '3s' }}
                    />
                </div>

                <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${getAnimationClass('hero')}`}>
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                        <div className="lg:col-span-6">
                            {/* Animated Badge */}
                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <Clock className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                                #1 Attendance Management System
                                <Zap className="w-4 h-4 ml-2 text-yellow-500" />
                            </div>

                            {/* Main Heading with Gradient Animation */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                Streamline Your
                                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                                    SyncWage
                                </span>
                                <span className="text-3xl sm:text-4xl lg:text-5xl text-gray-700">Operations</span>
                            </h1>

                            {/* Enhanced Description */}
                            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                                Transform your HR operations with our comprehensive attendance management system. 
                                Real-time tracking, automated payroll processing, smart leave management, and powerful 
                                analytics - all in one intuitive platform designed for modern businesses.
                            </p>

                            {/* Animated CTA Buttons */}
                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 flex items-center justify-center group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10 flex items-center">
                                        Start Free Trial
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                                    </span>
                                </button>
                                <button className="px-8 py-4 border-2 border-blue-300 text-blue-700 rounded-xl font-semibold hover:border-blue-500 hover:text-blue-800 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center group transform hover:scale-105">
                                    <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                    Watch Demo
                                </button>
                            </div>

                            {/* Animated Trust Indicators */}
                            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center transform hover:scale-110 transition-all duration-300">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.employees.toLocaleString()}+</div>
                                    <div className="text-sm text-gray-600">Employees Managed</div>
                                </div>
                                <div className="text-center transform hover:scale-110 transition-all duration-300">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.companies}+</div>
                                    <div className="text-sm text-gray-600">Companies Trust Us</div>
                                </div>
                                <div className="text-center transform hover:scale-110 transition-all duration-300">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.countries}+</div>
                                    <div className="text-sm text-gray-600">Countries Served</div>
                                </div>
                                <div className="text-center transform hover:scale-110 transition-all duration-300">
                                    <div className="text-2xl font-bold text-gray-900 mb-1">{stats.accuracy.toFixed(1)}%</div>
                                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Hero Dashboard Mockup */}
                        <div className="lg:col-span-6 mt-16 lg:mt-0">
                            <div
                                className="relative"
                                style={{ transform: `translateY(${-parallaxOffset * 0.1}px)` }}
                            >
                                {/* Floating Cards */}
                                <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-xl p-4 border border-blue-100 animate-float z-20">
                                    <div className="flex items-center">
                                        <UserCheck className="w-8 h-8 text-green-500 mr-3" />
                                        <div>
                                            <div className="text-lg font-bold text-gray-900">245</div>
                                            <div className="text-xs text-gray-600">Present Today</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl p-4 border border-purple-100 animate-float z-20" style={{ animationDelay: '1s' }}>
                                    <div className="flex items-center">
                                        <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
                                        <div>
                                            <div className="text-lg font-bold text-gray-900">98.5%</div>
                                            <div className="text-xs text-gray-600">Efficiency</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Dashboard */}
                                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:rotate-0 transition-all duration-500 hover:scale-105 border border-gray-200">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-14 flex items-center px-6 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                                        <div className="flex space-x-2 relative z-10">
                                            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                                        </div>
                                        <div className="ml-4 text-white text-sm font-semibold relative z-10">SyncWage Dashboard</div>
                                    </div>
                                    <div className="p-8">
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                                <Clock className="w-8 h-8 text-blue-600 mb-2" />
                                                <div className="text-2xl font-bold text-gray-900">08:45</div>
                                                <div className="text-sm text-gray-600">Check-in Time</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                                                <Users className="w-8 h-8 text-green-600 mb-2" />
                                                <div className="text-2xl font-bold text-gray-900">260</div>
                                                <div className="text-sm text-gray-600">Total Staff</div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <span className="text-sm text-gray-700">Today's Tasks</span>
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <span className="text-sm text-gray-700">Payroll Status</span>
                                                <CheckCircle className="w-5 h-5 text-green-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Features Section */}
            <section id="features" className="relative py-24 bg-white overflow-hidden" ref={featuresRef} data-animate>
                {/* Parallax Background */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{ transform: `translateY(${parallaxOffset * 0.15}px) rotate(${scrollY * 0.005}deg)` }}
                >
                    <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                </div>

                <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${getAnimationClass('features')}`}>
                    {/* Section Header */}
                    <div className="text-center mb-16" style={{ transform: `translateY(${-parallaxOffset * 0.05}px)` }}>
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-semibold mb-6 shadow-md hover:shadow-lg transition-all duration-300">
                            <Zap className="w-4 h-4 mr-2 animate-bounce" />
                            Powerful Features
                            <Star className="w-4 h-4 ml-2 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Everything You Need for
                            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Modern HR Management
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                            SyncWage provides comprehensive tools for attendance tracking, payroll management, 
                            leave administration, employee management, and advanced reporting to streamline your HR operations 
                            with cutting-edge technology and intuitive design.
                        </p>
                    </div>

                    {/* Interactive Features */}
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Enhanced Feature Navigation */}
                        <div className="lg:col-span-4 mb-8 lg:mb-0">
                            <div className="space-y-4">
                                {features.map((feature, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveFeature(index)}
                                        className={`w-full text-left p-6 rounded-xl transition-all duration-500 transform hover:scale-105 ${activeFeature === index
                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl border-l-4 border-blue-500 scale-105'
                                            : 'bg-gray-50 hover:bg-white hover:shadow-lg'
                                            }`}
                                        style={{
                                            transform: `translateY(${-parallaxOffset * 0.02 * (index + 1)}px) ${activeFeature === index ? 'scale(1.05)' : 'scale(1)'}`,
                                            transition: 'all 0.5s ease-out'
                                        }}
                                    >
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-xl mr-4 transition-all duration-300 ${activeFeature === index 
                                                ? 'bg-gradient-to-r from-blue-100 to-indigo-100 animate-pulse scale-110' 
                                                : 'bg-gray-100 group-hover:bg-blue-50'
                                                }`}>
                                                <feature.icon className={`w-6 h-6 transition-all duration-300 ${activeFeature === index 
                                                    ? 'text-blue-600 animate-bounce' 
                                                    : 'text-gray-600 group-hover:text-blue-500'
                                                    }`} />
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold mb-1 transition-colors ${activeFeature === index ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {feature.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-2">{feature.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Enhanced Feature Display */}
                        <div className="lg:col-span-8">
                            <div
                                className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-700 hover:shadow-3xl border border-gray-100"
                                style={{ transform: `translateY(${-parallaxOffset * 0.03}px)` }}
                            >
                                <div className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl mr-4 animate-pulse">
                                            {React.createElement(features[activeFeature].icon, {
                                                className: "w-8 h-8 text-blue-600"
                                            })}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{features[activeFeature].title}</h3>
                                            <p className="text-gray-600">{features[activeFeature].description}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                        {features[activeFeature].benefits.map((benefit, index) => (
                                            <div 
                                                key={index} 
                                                className="flex items-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg transform hover:scale-105 transition-all duration-300 hover:shadow-md border border-green-100"
                                            >
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 animate-pulse" />
                                                <span className="text-sm font-medium text-gray-900">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Enhanced Dynamic Interface Mockup */}
                                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                                                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                                                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                                            </div>
                                            <div className="text-xs text-gray-600 bg-green-100 px-3 py-1 rounded-full border border-green-200 animate-bounce">
                                                <Eye className="w-3 h-3 inline mr-1" />
                                                Live Preview
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-lg p-6 shadow-inner">
                                            <div className="mb-4">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                                    {features[activeFeature].mockupContent.title}
                                                    <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                                </h4>
                                                <div className="flex space-x-4 mb-4">
                                                    {Object.entries(features[activeFeature].mockupContent.stats).map(([key, value], index) => (
                                                        <div 
                                                            key={index} 
                                                            className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-blue-100"
                                                        >
                                                            <div className="text-lg font-bold text-blue-700">{value}</div>
                                                            <div className="text-xs text-gray-600 capitalize">{key}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                {features[activeFeature].mockupContent.items.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 transform hover:scale-102"
                                                    >
                                                        <span className="text-sm text-gray-700 font-medium">{item}</span>
                                                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000 animate-pulse"
                                                                style={{
                                                                    width: `${70 + (index * 10)}%`,
                                                                    animationDelay: `${index * 200}ms`
                                                                }}
                                                            />
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

            {/* Enhanced Stats Section */}
            <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden" id="stats" data-animate>
                <div className="absolute inset-0">
                    <div 
                        className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-10 blur-3xl animate-pulse"
                        style={{ transform: `translateY(${parallaxOffset * 0.1}px)` }}
                    />
                    <div 
                        className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl animate-pulse"
                        style={{ transform: `translateY(${-parallaxOffset * 0.1}px)`, animationDelay: '1.5s' }}
                    />
                </div>

                <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${getAnimationClass('stats')}`}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            SyncWage by the Numbers
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join thousands of organizations already using SyncWage to streamline their HR operations 
                            and transform their workplace efficiency with cutting-edge attendance management technology.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div
                            className="text-center transform hover:scale-110 transition-all duration-500 hover:rotate-3"
                            style={{ transform: `translateY(${-parallaxOffset * 0.02}px)` }}
                        >
                            <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <Users className="w-12 h-12 text-blue-600 animate-bounce" />
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.employees.toLocaleString()}+</div>
                            <div className="text-gray-600 font-medium">Employees Managed Daily</div>
                            <div className="mt-2 w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
                        </div>

                        <div
                            className="text-center transform hover:scale-110 transition-all duration-500 hover:-rotate-3"
                            style={{ transform: `translateY(${-parallaxOffset * 0.03}px)` }}
                        >
                            <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <Building2 className="w-12 h-12 text-green-600 animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.companies}+</div>
                            <div className="text-gray-600 font-medium">Companies Trust Us</div>
                            <div className="mt-2 w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
                        </div>

                        <div
                            className="text-center transform hover:scale-110 transition-all duration-500 hover:rotate-3"
                            style={{ transform: `translateY(${-parallaxOffset * 0.04}px)` }}
                        >
                            <div className="bg-gradient-to-br from-yellow-100 to-orange-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <Globe className="w-12 h-12 text-orange-600 animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.countries}+</div>
                            <div className="text-gray-600 font-medium">Countries Worldwide</div>
                            <div className="mt-2 w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full"></div>
                        </div>

                        <div
                            className="text-center transform hover:scale-110 transition-all duration-500 hover:-rotate-3"
                            style={{ transform: `translateY(${-parallaxOffset * 0.05}px)` }}
                        >
                            <div className="bg-gradient-to-br from-purple-100 to-violet-200 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <TrendingUp className="w-12 h-12 text-purple-600 animate-bounce" style={{ animationDelay: '0.6s' }} />
                            </div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.accuracy.toFixed(1)}%</div>
                            <div className="text-gray-600 font-medium">Accuracy Guarantee</div>
                            <div className="mt-2 w-16 h-1 bg-gradient-to-r from-purple-500 to-violet-500 mx-auto rounded-full"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Testimonials Section */}
            <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden" id="testimonials" data-animate>
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ transform: `translateY(${parallaxOffset * 0.08}px) rotate(${scrollY * 0.002}deg)` }}
                >
                    <div className="absolute top-1/4 left-0 w-72 h-72 bg-blue-600 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-purple-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${getAnimationClass('testimonials')}`}>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-6 shadow-md">
                            <Star className="w-4 h-4 mr-2 animate-spin" style={{ animationDuration: '3s' }} />
                            Customer Success Stories
                            <Award className="w-4 h-4 ml-2 text-yellow-500" />
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">
                            Loved by HR Leaders Worldwide
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Don't just take our word for it. See what HR professionals and business leaders 
                            have to say about their SyncWage experience and how it's transformed their operations.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-gray-100"
                                style={{
                                    transform: `translateY(${-parallaxOffset * 0.02 * (index + 1)}px)`,
                                    transition: 'all 0.5s ease-out'
                                }}
                            >
                                <div className="flex items-center mb-6">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className="w-5 h-5 text-yellow-400 fill-current animate-pulse" 
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        />
                                    ))}
                                </div>
                                <blockquote className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                                    "{testimonial.content}"
                                </blockquote>
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mr-4 shadow-md">
                                        <span className="text-blue-700 font-bold text-lg">
                                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                                        <div className="text-gray-600">{testimonial.role}</div>
                                        <div className="text-blue-600 font-semibold text-sm">{testimonial.company}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden" id="cta" data-animate>
                <div
                    className="absolute inset-0 opacity-20"
                    style={{ transform: `translateY(${parallaxOffset * 0.05}px)` }}
                >
                    <div className="absolute top-0 left-1/3 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className={`relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${getAnimationClass('cta')}`}>
                    <div className="inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
                        <Zap className="w-4 h-4 mr-2 animate-bounce" />
                        Start Your Transformation Today
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your
                        <span className="block">HR Operations?</span>
                    </h2>
                    <p className="text-xl text-blue-100 mb-12 leading-relaxed">
                        Join thousands of organizations already using SyncWage to streamline attendance management, 
                        automate payroll processing, and boost workplace efficiency. Start your free trial today 
                        and experience the future of HR technology.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-10 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 flex items-center justify-center group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="relative z-10 flex items-center">
                                Start Free Trial Now
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                            </span>
                        </button>
                        <button className="px-10 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center group transform hover:scale-105">
                            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                            Watch Demo
                        </button>
                    </div>
                    <div className="mt-12 text-blue-100 text-sm">
                        ✓ No credit card required  ✓ 30-day free trial  ✓ Setup in minutes
                    </div>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer className="bg-gray-900 text-white py-16 relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ transform: `translateY(${parallaxOffset * 0.03}px)` }}
                >
                    <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                            <div className="flex items-center mb-6">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                                    <Clock className="w-7 h-7 text-white" />
                                </div>
                                <span className="text-2xl font-bold">SyncWage</span>
                            </div>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Transform your HR operations with comprehensive attendance management, automated payroll processing, 
                                and intelligent workforce analytics. Built for modern businesses of all sizes.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 cursor-pointer transform hover:scale-110">
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 cursor-pointer transform hover:scale-110">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 cursor-pointer transform hover:scale-110">
                                    <Phone className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Platform Links */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-blue-400">Platform</h3>
                            <ul className="space-y-4">
                                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors hover:underline">Features</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Attendance Tracking</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Payroll Management</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Leave Management</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Reports & Analytics</a></li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-blue-400">Company</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">About SyncWage</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Our Mission</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Success Stories</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Press & Media</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Careers</a></li>
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h3 className="text-lg font-bold mb-6 text-blue-400">Support</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Help Center</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Contact Support</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Documentation</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">API Reference</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">System Status</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 mb-4 md:mb-0">
                            © 2025 SyncWage. All rights reserved. Built with ❤️ for modern HR teams.
                        </div>
                        <div className="flex items-center space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Terms of Service</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Privacy Policy</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Add custom CSS for animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .scale-102 {
                    transform: scale(1.02);
                }

                .shadow-3xl {
                    box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
                }
            `}</style>
        </div>
    );
};

export default LandingPage;