import React, { useState, useEffect } from 'react';
import { Check, Star, Users, Shield, Zap, Award, Clock, ArrowRight, Gift, X } from 'lucide-react';

const EnhancedPricingComponent = () => {
    // eslint-disable-next-line no-unused-vars
    const [selectedPlan, setSelectedPlan] = useState('teams');
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    // Set expiration date (48 hours from now for demo)
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (48 * 60 * 60 * 1000));

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = expirationDate.getTime() - now;

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const plans = [
        {
            id: 'basic',
            name: 'Recruit Basic',
            price: 17,
            originalPrice: null,
            period: '/ month (USD)',
            billedYearly: '$220 billed yearly',
            description: 'Get started with essential tools to manage your team efficiently. Ideal for small teams with fundamental needs.',
            status: 'Active',
            statusColor: 'bg-blue-100 text-blue-700',
            features: [
                { name: 'Access to core HR features', included: true },
                { name: 'Employee record management', included: true },
                { name: 'Basic reporting tools', included: true },
                { name: 'Manage up to 10 team members', included: true },
                { name: 'Track employee attendance', included: false },
                { name: 'Assign and monitor tasks', included: false },
                { name: 'Email support', included: false },
                { name: 'Simple onboarding process', included: false },
                { name: 'Designed user-focused interfaces, optimized user', included: false }
            ],
            buttonText: 'Cancel',
            buttonStyle: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200',
            cardStyle: 'bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 shadow-lg'
        },
        {
            id: 'pro',
            name: 'Talent Pro',
            price: 19,
            originalPrice: 26,
            period: '/ month (USD)',
            billedYearly: '$228 billed yearly',
            description: 'A comprehensive solution for growing teams, offering enhanced features to streamline HR processes.',
            status: 'Save 27% 🔥',
            statusColor: 'bg-yellow-400 text-black font-bold',
            popular: true,
            features: [
                { name: 'Access to core HR features', included: true },
                { name: 'Employee record management', included: true },
                { name: 'Basic reporting tools', included: true },
                { name: 'Manage up to 10 team members', included: true },
                { name: 'Track employee attendance', included: true },
                { name: 'Assign and monitor tasks', included: true },
                { name: 'Email support', included: false },
                { name: 'Simple onboarding process', included: false },
                { name: 'Designed user-focused interfaces, optimized user', included: false }
            ],
            buttonText: 'Start 7-days Free Trial',
            buttonStyle: 'bg-white text-gray-800 hover:bg-gray-100 border-2 border-white font-semibold shadow-md transition-all duration-200',
            cardStyle: 'bg-gradient-to-br from-gray-800 to-gray-900 text-white border-2 border-gray-700 shadow-2xl transform scale-105 relative z-10'
        },
        {
            id: 'master',
            name: 'HR Master',
            price: 34,
            originalPrice: null,
            period: '/ month (USD)',
            billedYearly: '$408 billed yearly',
            description: 'Maximize team performance with premium tools and full customization options, perfect for larger organizations.',
            status: 'Popular ⭐',
            statusColor: 'bg-blue-500 text-white font-medium',
            features: [
                { name: 'Access to core HR features', included: true },
                { name: 'Employee record management', included: true },
                { name: 'Basic reporting tools', included: true },
                { name: 'Manage up to 10 team members', included: true },
                { name: 'Track employee attendance', included: true },
                { name: 'Assign and monitor tasks', included: true },
                { name: 'Email support', included: true },
                { name: 'Simple onboarding process', included: true },
                { name: 'Designed user-focused interfaces, optimized user', included: true }
            ],
            buttonText: 'Start 7-days Free Trial',
            buttonStyle: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200',
            cardStyle: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg'
        }
    ];

    const trustIndicators = [
        {
            icon: Shield,
            title: 'Enterprise Security',
            description: 'SOC 2 Type II certified with 256-bit encryption'
        },
        {
            icon: Zap,
            title: '99.9% Uptime',
            description: 'Guaranteed reliability with global infrastructure'
        },
        {
            icon: Users,
            title: '100,000+ Users',
            description: 'Trusted by teams at Fortune 500 companies'
        },
        {
            icon: Award,
            title: 'Award Winning',
            description: 'Best Scheduling Platform 2024 - G2 Leader'
        }
    ];

    const TimeUnit = ({ value, label }) => (
        <div className="text-center">
            <div className="bg-white rounded-lg p-3 shadow-md border-2 border-red-200">
                <div className="text-2xl font-bold text-red-600">{value.toString().padStart(2, '0')}</div>
            </div>
            <div className="text-sm text-red-600 font-medium mt-1">{label}</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Limited Time Offer Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 lg:mb-0">
                            <Gift className="w-6 h-6 mr-3" />
                            <div>
                                <h3 className="font-bold text-lg">Limited Time Offer - 33% OFF Teams Plan!</h3>
                                <p className="text-red-100 text-sm">Don't miss out on this exclusive discount</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">Expires in:</span>
                            </div>
                            <div className="flex space-x-3">
                                <TimeUnit value={timeLeft.days} label="Days" />
                                <TimeUnit value={timeLeft.hours} label="Hours" />
                                <TimeUnit value={timeLeft.minutes} label="Min" />
                                <TimeUnit value={timeLeft.seconds} label="Sec" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="max-w-5xl mx-auto px-6 py-20 text-center">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Star className="w-4 h-4 mr-2" />
                    Trusted by 100,000+ professionals worldwide
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Choose Your Perfect
                    <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"> Scheduling Plan</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Transform your scheduling workflow with our powerful platform. Start free and upgrade as your business grows.
                </p>
                <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                    <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        30-day free trial
                    </div>
                    <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        No credit card required
                    </div>
                    <div className="flex items-center">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        Cancel anytime
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => {
                    const isSelected = selectedPlan === plan.id;
                    const isDark = plan.id === 'pro';

                    return (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl p-5 transition-all duration-200 hover:shadow-md cursor-pointer ${plan.cardStyle} ${isSelected ? 'ring-2 ring-blue-400' : ''
                                }`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {/* Status Badge */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${plan.statusColor}`}>
                                    {plan.status}
                                </div>
                                {plan.popular && (
                                    <div className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-bold">
                                        Popular ⭐
                                    </div>
                                )}
                            </div>

                            {/* Plan Name */}
                            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {plan.name}
                            </h3>

                            {/* Price Section */}
                            <div className="mb-4">
                                <div className="flex items-baseline mb-1">
                                    {plan.originalPrice && (
                                        <span className={`text-lg line-through mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                            ${plan.originalPrice}
                                        </span>
                                    )}
                                    <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        ${plan.price}
                                    </span>
                                    <span className={`text-sm ml-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {plan.period}
                                    </span>
                                </div>
                                <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                    {plan.billedYearly}
                                </p>
                                {plan.originalPrice && (
                                    <p className="text-xs text-green-600 font-semibold mt-1">
                                        Save $7/month
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <p className={`text-xs mb-5 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                {plan.description}
                            </p>

                            {/* Features List */}
                            <div className="space-y-2.5 mb-5">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0 w-4 h-4 mr-2.5 mt-0.5">
                                            {feature.included ? (
                                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            ) : (
                                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-600' : 'bg-gray-200'
                                                    }`}>
                                                    <X className={`w-2.5 h-2.5 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                                                </div>
                                            )}
                                        </div>
                                        <span className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'
                                            } ${!feature.included ? 'opacity-50' : ''}`}>
                                            {feature.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Action Button */}
                            <button
                                className={`w-full py-3 px-4 rounded-lg text-xs font-medium ${plan.buttonStyle}`}
                            >
                                {plan.buttonText}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Trust Indicators */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Why 100,000+ professionals choose us
                        </h2>
                        <p className="text-xl text-gray-600">Join the world's most trusted scheduling platform</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {trustIndicators.map((item, index) => (
                            <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                                    <item.icon className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-3 text-lg">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-gray-600">Everything you need to know about our pricing and features</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                q: "Can I change my plan anytime?",
                                a: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately for upgrades, or at your next billing cycle for downgrades."
                            },
                            {
                                q: "Do you offer refunds?",
                                a: "We offer a 30-day money-back guarantee on all paid plans. If you're not completely satisfied, we'll refund your payment, no questions asked."
                            },
                            {
                                q: "How secure is my data?",
                                a: "Your data security is our top priority. We use enterprise-grade 256-bit encryption, are SOC 2 Type II certified, and comply with GDPR and CCPA regulations."
                            },
                            {
                                q: "What kind of support do you provide?",
                                a: "All plans include email support with 24-hour response time. Teams get priority support, and Enterprise customers get dedicated 24/7 phone and chat support."
                            },
                            {
                                q: "Is there a setup fee?",
                                a: "No setup fees ever! We also provide free migration assistance from your current scheduling tool and free onboarding for Teams and Enterprise plans."
                            },
                            {
                                q: "Can I cancel anytime?",
                                a: "Yes, you can cancel your subscription at any time. There are no cancellation fees, and you'll continue to have access to your plan until the end of your billing period."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">{faq.q}</h3>
                                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to transform your scheduling?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Join thousands of professionals who've already made the switch
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors inline-flex items-center">
                        Start Your Free Trial Today
                        <ArrowRight className="w-6 h-6 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EnhancedPricingComponent;