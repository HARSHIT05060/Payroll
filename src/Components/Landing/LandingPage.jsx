import React, { useState, useEffect } from 'react';
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
    MapPin
} from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeFeature, setActiveFeature] = useState(0);
    const [stats, setStats] = useState({ users: 0, companies: 0, countries: 0 });

    // Animated counter effect
    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                users: prev.users < 10000 ? prev.users + 100 : 10000,
                companies: prev.companies < 500 ? prev.companies + 5 : 500,
                countries: prev.countries < 50 ? prev.countries + 1 : 50
            }));
        }, 50);

        setTimeout(() => clearInterval(interval), 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: Users,
            title: "Employee Management",
            description: "Comprehensive employee database with detailed profiles, organizational structure, and role-based access control.",
            image: "/api/placeholder/600/400",
            benefits: ["Complete employee profiles", "Department & branch management", "Role-based permissions"]
        },
        {
            icon: Calendar,
            title: "Leave Management",
            description: "Streamlined leave application and approval process with real-time status tracking and automated notifications.",
            image: "/api/placeholder/600/400",
            benefits: ["Easy leave applications", "Automated approvals", "Balance tracking"]
        },
        {
            icon: Clock,
            title: "Shift Management",
            description: "Flexible shift scheduling with automated assignments and conflict resolution for optimal workforce management.",
            image: "/api/placeholder/600/400",
            benefits: ["Flexible scheduling", "Shift assignments", "Conflict resolution"]
        },
        {
            icon: DollarSign,
            title: "Payroll Processing",
            description: "Automated payroll calculation with tax compliance, deductions, allowances, and comprehensive salary reports.",
            image: "/api/placeholder/600/400",
            benefits: ["Automated calculations", "Tax compliance", "Detailed reports"]
        },
        {
            icon: BarChart3,
            title: "Advanced Reports",
            description: "Comprehensive reporting suite with attendance tracking, performance metrics, and customizable dashboards.",
            image: "/api/placeholder/600/400",
            benefits: ["Real-time analytics", "Custom reports", "Performance insights"]
        },
        {
            icon: Shield,
            title: "Security & Compliance",
            description: "Enterprise-grade security with data encryption, audit trails, and compliance with industry standards.",
            image: "/api/placeholder/600/400",
            benefits: ["Data encryption", "Audit trails", "Compliance ready"]
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "HR Director",
            company: "TechCorp Inc.",
            content: "HRPro has revolutionized our HR processes. The automation features have saved us countless hours and improved accuracy.",
            rating: 5,
            avatar: "/api/placeholder/60/60"
        },
        {
            name: "Michael Chen",
            role: "Operations Manager",
            company: "Global Solutions",
            content: "The reporting capabilities are outstanding. We now have real-time insights into our workforce that drive better decisions.",
            rating: 5,
            avatar: "/api/placeholder/60/60"
        },
        {
            name: "Emily Rodriguez",
            role: "CEO",
            company: "StartupXYZ",
            content: "As a growing company, HRPro scales with us perfectly. The user interface is intuitive and our team adopted it quickly.",
            rating: 5,
            avatar: "/api/placeholder/60/60"
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "$29",
            period: "/month",
            description: "Perfect for small businesses",
            features: [
                "Up to 50 employees",
                "Basic employee management",
                "Leave management",
                "Email support",
                "Basic reports"
            ],
            popular: false
        },
        {
            name: "Professional",
            price: "$79",
            period: "/month",
            description: "For growing companies",
            features: [
                "Up to 200 employees",
                "Advanced HR features",
                "Payroll processing",
                "Shift management",
                "Priority support",
                "Advanced reports",
                "API access"
            ],
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "pricing",
            description: "For large organizations",
            features: [
                "Unlimited employees",
                "Custom integrations",
                "Advanced security",
                "Dedicated support",
                "Custom reports",
                "SLA guarantee",
                "Training included"
            ],
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-blue-lightest)] via-[var(--color-bg-secondary)] to-[var(--color-bg-gradient-end)]"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--color-blue-lighter)]/50 to-transparent"></div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-[var(--color-blue-lighter)] rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-[var(--color-bg-gradient-end)] rounded-full opacity-20 animate-bounce"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                        <div className="lg:col-span-6">
                            {/* Badge */}
                            <div className="inline-flex items-center px-4 py-2 bg-[var(--color-blue-lightest)] text-[var(--color-blue-dark)] rounded-full text-sm font-medium mb-8">
                                <Zap className="w-4 h-4 mr-2" />
                                #1 HR Management Platform
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--color-text-primary)] leading-tight">
                                Streamline Your
                                <span className="block bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] bg-clip-text text-transparent">
                                    HR Operations
                                </span>
                            </h1>

                            {/* Description */}
                            <p className="mt-6 text-xl text-[var(--color-text-secondary)] leading-relaxed">
                                Complete HR management solution with employee tracking, payroll processing,
                                leave management, and powerful analytics. Boost productivity and simplify HR workflows.
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
                                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.users.toLocaleString()}+</div>
                                    <div className="text-sm text-[var(--color-text-secondary)]">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.companies}+</div>
                                    <div className="text-sm text-[var(--color-text-secondary)]">Companies</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-[var(--color-text-primary)]">{stats.countries}+</div>
                                    <div className="text-sm text-[var(--color-text-secondary)]">Countries</div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image/Animation */}
                        <div className="lg:col-span-6 mt-16 lg:mt-0">
                            <div className="relative">
                                {/* Main Dashboard Mockup */}
                                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <div className="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] h-12 flex items-center px-6">
                                        <div className="flex space-x-2">
                                            <div className="w-3 h-3 bg-[var(--color-error)] rounded-full"></div>
                                            <div className="w-3 h-3 bg-[var(--color-warning)] rounded-full"></div>
                                            <div className="w-3 h-3 bg-[var(--color-success)] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="p-8">
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-[var(--color-blue-lightest)] p-4 rounded-lg">
                                                <Users className="w-8 h-8 text-[var(--color-blue)] mb-2" />
                                                <div className="text-2xl font-bold text-[var(--color-text-primary)]">1,234</div>
                                                <div className="text-sm text-[var(--color-text-secondary)]">Employees</div>
                                            </div>
                                            <div className="bg-[var(--color-success-light)] p-4 rounded-lg">
                                                <TrendingUp className="w-8 h-8 text-[var(--color-success)] mb-2" />
                                                <div className="text-2xl font-bold text-[var(--color-text-primary)]">98.5%</div>
                                                <div className="text-sm text-[var(--color-text-secondary)]">Attendance</div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="h-2 bg-[var(--color-blue-lighter)] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--color-blue)] w-3/4 animate-pulse"></div>
                                            </div>
                                            <div className="h-2 bg-[var(--color-success-lighter)] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--color-success)] w-4/5 animate-pulse"></div>
                                            </div>
                                            <div className="h-2 bg-[var(--color-bg-gradient-end)] rounded-full overflow-hidden">
                                                <div className="h-full bg-[var(--color-blue-dark)] w-2/3 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Cards */}
                                <div className="absolute -top-4 -left-4 bg-[var(--color-bg-secondary)] rounded-lg shadow-lg p-4 animate-bounce">
                                    <CheckCircle className="w-6 h-6 text-[var(--color-success)] mb-2" />
                                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">Payroll Complete</div>
                                </div>

                                <div className="absolute -bottom-4 -right-4 bg-[var(--color-bg-secondary)] rounded-lg shadow-lg p-4 animate-pulse">
                                    <Award className="w-6 h-6 text-[var(--color-warning)] mb-2" />
                                    <div className="text-sm font-semibold text-[var(--color-text-primary)]">Top Performer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-[var(--color-bg-primary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-[var(--color-blue-lightest)] text-[var(--color-blue-dark)] rounded-full text-sm font-medium mb-4">
                            <Building2 className="w-4 h-4 mr-2" />
                            Powerful Features
                        </div>
                        <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                            Everything You Need for
                            <span className="block text-[var(--color-blue)]">Modern HR Management</span>
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
                            Our comprehensive platform provides all the tools you need to manage your workforce efficiently and effectively.
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
                                        className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${activeFeature === index
                                                ? 'bg-[var(--color-bg-secondary)] shadow-lg border-l-4 border-[var(--color-blue)]'
                                                : 'bg-[var(--color-bg-secondary)]/50 hover:bg-[var(--color-bg-secondary)] hover:shadow-md'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div className={`p-3 rounded-lg mr-4 ${activeFeature === index ? 'bg-[var(--color-blue-lightest)]' : 'bg-[var(--color-bg-gray-light)]'
                                                }`}>
                                                <feature.icon className={`w-6 h-6 ${activeFeature === index ? 'text-[var(--color-blue)]' : 'text-[var(--color-text-secondary)]'
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
                            <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-8">
                                    <div className="flex items-center mb-6">
                                        <div className="p-4 bg-[var(--color-blue-lightest)] rounded-xl mr-4">
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
                                            <div key={index} className="flex items-center p-4 bg-[var(--color-success-light)] rounded-lg">
                                                <CheckCircle className="w-5 h-5 text-[var(--color-success)] mr-2 flex-shrink-0" />
                                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mock Feature Interface */}
                                    <div className="bg-[var(--color-bg-gray-light)] rounded-xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex space-x-2">
                                                <div className="w-3 h-3 bg-[var(--color-error)] rounded-full"></div>
                                                <div className="w-3 h-3 bg-[var(--color-warning)] rounded-full"></div>
                                                <div className="w-3 h-3 bg-[var(--color-success)] rounded-full"></div>
                                            </div>
                                            <div className="text-xs text-[var(--color-text-muted)]">Live Demo</div>
                                        </div>
                                        <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4">
                                            <div className="animate-pulse">
                                                <div className="h-4 bg-[var(--color-bg-gray-light)] rounded w-3/4 mb-3"></div>
                                                <div className="h-4 bg-[var(--color-bg-gray-light)] rounded w-1/2 mb-3"></div>
                                                <div className="h-4 bg-[var(--color-bg-gray-light)] rounded w-5/6"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-24 bg-[var(--color-bg-secondary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                            Why Choose HRPro?
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto">
                            Join thousands of companies that trust HRPro to manage their workforce efficiently.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Zap,
                                title: "Lightning Fast",
                                description: "Process payroll, manage leaves, and generate reports in seconds, not hours."
                            },
                            {
                                icon: Shield,
                                title: "Secure & Compliant",
                                description: "Enterprise-grade security with compliance to global HR regulations and standards."
                            },
                            {
                                icon: Globe,
                                title: "Cloud-Based Access",
                                description: "Access your HR data anytime, anywhere with our secure cloud-based platform."
                            },
                            {
                                icon: UserCheck,
                                title: "Easy to Use",
                                description: "Intuitive interface that requires minimal training for your HR team."
                            },
                            {
                                icon: TrendingUp,
                                title: "Scalable Solution",
                                description: "Grows with your business from startup to enterprise with flexible plans."
                            },
                            {
                                icon: Award,
                                title: "24/7 Support",
                                description: "Round-the-clock customer support to help you whenever you need assistance."
                            }
                        ].map((benefit, index) => (
                            <div key={index} className="group p-8 bg-[var(--color-bg-primary)] rounded-xl hover:bg-[var(--color-blue-lightest)] transition-all duration-300 hover:shadow-lg">
                                <div className="mb-4">
                                    <benefit.icon className="w-12 h-12 text-[var(--color-blue)] group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-3">{benefit.title}</h3>
                                <p className="text-[var(--color-text-secondary)]">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-gradient-to-br from-[var(--color-blue-lightest)] to-[var(--color-bg-gradient-end)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                            Loved by HR Professionals
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">
                            Don't just take our word for it. See what our customers have to say.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-[var(--color-bg-secondary)] rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
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

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-[var(--color-bg-secondary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">
                            Choose the plan that fits your business needs. No hidden fees, cancel anytime.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className={`relative rounded-2xl p-8 ${plan.popular
                                    ? 'bg-[var(--color-blue)] text-[var(--color-text-white)] shadow-2xl scale-105'
                                    : 'bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-primary)] hover:border-[var(--color-blue)] transition-colors duration-300'
                                }`}>
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                        <span className="bg-[var(--color-warning)] text-[var(--color-text-primary)] px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="text-center">
                                    <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-[var(--color-text-white)]' : 'text-[var(--color-text-primary)]'}`}>
                                        {plan.name}
                                    </h3>
                                    <p className={`mb-6 ${plan.popular ? 'text-[var(--color-blue-lighter)]' : 'text-[var(--color-text-secondary)]'}`}>
                                        {plan.description}
                                    </p>
                                    <div className="mb-8">
                                        <span className={`text-4xl font-bold ${plan.popular ? 'text-[var(--color-text-white)]' : 'text-[var(--color-text-primary)]'}`}>
                                            {plan.price}
                                        </span>
                                        <span className={`${plan.popular ? 'text-[var(--color-blue-lighter)]' : 'text-[var(--color-text-secondary)]'}`}>
                                            {plan.period}
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-center">
                                            <CheckCircle className={`w-5 h-5 mr-3 ${plan.popular ? 'text-[var(--color-blue-lighter)]' : 'text-[var(--color-success)]'}`} />
                                            <span className={`${plan.popular ? 'text-[var(--color-blue-lightest)]' : 'text-[var(--color-text-secondary)]'}`}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${plan.popular
                                        ? 'bg-[var(--color-bg-secondary)] text-[var(--color-blue)] hover:bg-[var(--color-blue-lightest)]'
                                        : 'bg-[var(--color-blue)] text-[var(--color-text-white)] hover:bg-[var(--color-blue-dark)]'
                                    }`}>
                                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)]">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-[var(--color-text-white)] mb-6">
                        Ready to Transform Your HR Operations?
                    </h2>
                    <p className="text-xl text-[var(--color-blue-lightest)] mb-10">
                        Join thousands of companies already using HRPro to streamline their workforce management.
                        Start your free trial today - no credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 bg-[var(--color-bg-secondary)] text-[var(--color-blue)] rounded-xl font-semibold hover:bg-[var(--color-blue-lightest)] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center group"
                        >
                            Start Free Trial
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 border-2 border-[var(--color-text-white)] text-[var(--color-text-white)] rounded-xl font-semibold hover:bg-[var(--color-text-white)] hover:text-[var(--color-blue)] transition-all duration-200 flex items-center justify-center">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[var(--color-text-primary)] text-[var(--color-text-white)] py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-[var(--color-blue)] rounded-lg flex items-center justify-center mr-3">
                                    <Users className="w-6 h-6 text-[var(--color-text-white)]" />
                                </div>
                                <span className="text-2xl font-bold">HRPro</span>
                            </div>
                            <p className="text-[var(--color-text-muted)] mb-6">
                                Streamline your HR operations with our comprehensive management platform.
                                Built for modern businesses of all sizes.
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

                        {/* Product Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Product</h3>
                            <ul className="space-y-4">
                                <li><a href="#features" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Features</a></li>
                                <li><a href="#pricing" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Integrations</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">API Docs</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Changelog</a></li>
                            </ul>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6">Company</h3>
                            <ul className="space-y-4">
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">About Us</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Careers</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Blog</a></li>
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
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">System Status</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Security</a></li>
                                <li><a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-white)] transition-colors">Privacy Policy</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="mt-12 pt-8 border-t border-[var(--color-border-primary)] flex flex-col md:flex-row justify-between items-center">
                        <div className="text-[var(--color-text-muted)] mb-4 md:mb-0">
                            © 2025 HRPro. All rights reserved.
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