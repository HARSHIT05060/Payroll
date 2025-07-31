import React from 'react';
import { Check, Star, Users, Shield, Zap, Award, ArrowRight, Gift, AlertTriangle, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PricingComponent = () => {
    const { user } = useAuth();
    
    // Parse subscription data
    const subscriptionDays = parseInt(user?.subscriptions_days) || 0;
    const subscriptionStatus = parseInt(user?.subscriptions_status) || 0;
    
    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (subscriptionDays * 24 * 60 * 60 * 1000));

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
            description: 'Best Attendance Platform 2024 - G2 Leader'
        }
    ];

    const getUserInitials = (name) => {
        if (!name || name === 'Unknown User') return 'U';
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusInfo = (status, days) => {
        if (status === 1) {
            if (days <= 0) {
                return {
                    text: 'Expired',
                    bgColor: 'bg-red-100',
                    textColor: 'text-red-800',
                    isActive: false,
                    isExpired: true,
                    isExpiringSoon: false
                };
            } else if (days <= 7) {
                return {
                    text: 'Expiring Soon',
                    bgColor: 'bg-yellow-100',
                    textColor: 'text-yellow-800',
                    isActive: true,
                    isExpired: false,
                    isExpiringSoon: true
                };
            } else {
                return {
                    text: 'Active',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-800',
                    isActive: true,
                    isExpired: false,
                    isExpiringSoon: false
                };
            }
        } else {
            return {
                text: 'Inactive',
                bgColor: 'bg-gray-100',
                textColor: 'text-gray-800',
                isActive: false,
                isExpired: false,
                isExpiringSoon: false
            };
        }
    };

    const statusInfo = getStatusInfo(subscriptionStatus, subscriptionDays);

    const getBannerConfig = () => {
        if (statusInfo.isExpired) {
            return {
                bgClass: 'bg-gradient-to-r from-red-600 to-red-700',
                icon: AlertTriangle,
                title: 'Subscription Expired!',
                description: 'Renew now to continue using our services',
                textColorClass: 'text-red-100'
            };
        } else if (statusInfo.isExpiringSoon) {
            return {
                bgClass: 'bg-gradient-to-r from-yellow-600 to-orange-600',
                icon: Gift,
                title: 'Subscription Expiring Soon!',
                description: 'Renew before expiration to avoid interruption',
                textColorClass: 'text-yellow-100'
            };
        } else if (statusInfo.isActive) {
            return {
                bgClass: 'bg-gradient-to-r from-green-600 to-green-700',
                icon: Gift,
                title: 'Active Subscription',
                description: 'Your subscription is active and running smoothly',
                textColorClass: 'text-green-100'
            };
        } else {
            return {
                bgClass: 'bg-gradient-to-r from-gray-600 to-gray-700',
                icon: AlertTriangle,
                title: 'Inactive Subscription',
                description: 'Activate your subscription to access all features',
                textColorClass: 'text-gray-100'
            };
        }
    };

    const bannerConfig = getBannerConfig();
    const BannerIcon = bannerConfig.icon;

    const getDaysColor = () => {
        if (subscriptionDays <= 0) return 'text-red-400';
        if (subscriptionDays <= 7) return 'text-yellow-400';
        return 'text-green-400';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-bg-primary)] to-[var(--color-blue-lightest)]">
            {/* Subscription Status Banner */}
            <div className={`${bannerConfig.bgClass} text-[var(--color-text-white)] py-6`}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center">
                            <BannerIcon className="w-6 h-6 mr-3" />
                            <div className="text-center">
                                <h3 className="font-bold text-lg">
                                    {bannerConfig.title}
                                </h3>
                                <p className={`${bannerConfig.textColorClass} text-sm`}>
                                    {bannerConfig.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="max-w-5xl mx-auto px-6 py-20 text-center">
                <div className="inline-flex items-center bg-[var(--color-blue-dark)] text-[var(--color-text-white)] px-4 py-2 rounded-full text-sm font-medium mb-6">
                    <Star className="w-4 h-4 mr-2" />
                    Trusted by 100,000+ professionals worldwide
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-[var(--color-text-primary)] mb-6 leading-tight">
                    Your Subscription
                    <span className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darkest)] bg-clip-text text-transparent"> Status</span>
                </h1>
                <p className="text-xl text-[var(--color-text-secondary)] mb-8 max-w-3xl mx-auto leading-relaxed">
                    Manage your attendance system subscription and stay updated with your account status.
                </p>
            </div>

            {/* User Subscription Card */}
            <div className="max-w-4xl mx-auto px-6 mb-20">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-[var(--color-text-white)] border-2 border-gray-700 shadow-2xl rounded-2xl p-8 relative">
                    {/* Status Badge */}
                    <div className="flex justify-between items-start mb-6">
                        <div className={`px-4 py-2 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                            {statusInfo.text} Status
                        </div>
                        <div className="px-3 py-1 bg-blue-500 text-[var(--color-text-white)] rounded-full text-sm font-bold">
                            Current Plan
                        </div>
                    </div>

                    {/* User Info Section */}
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="w-16 h-16 bg-[var(--color-blue)] rounded-full flex items-center justify-center text-[var(--color-text-white)] text-xl font-bold">
                            {getUserInitials(user?.full_name)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-[var(--color-text-white)]">
                                {user?.full_name || user?.name || user?.username || 'User'}
                            </h2>
                            <p className="text-gray-300">
                                {user?.email || user?.username || user?.number || 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Subscription Details - Single Column */}
                    <div className="mb-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[var(--color-text-white)] flex items-center">
                                <Calendar className="w-5 h-5 mr-2" />
                                Subscription Information
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                                    <span className="text-gray-300">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                                        {statusInfo.text}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                                    <span className="text-gray-300">Days Remaining:</span>
                                    <span className={`font-mono font-bold text-lg ${getDaysColor()}`}>
                                        {subscriptionDays} days
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                                    <span className="text-gray-300">Expires On:</span>
                                    <span className="font-mono text-[var(--color-text-white)]">
                                        {expirationDate.toLocaleDateString('en-GB')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {statusInfo.isExpired ? (
                            <button className="flex-1 bg-red-600 hover:bg-red-700 text-[var(--color-text-white)] py-3 px-6 rounded-lg font-semibold transition-colors">
                                Renew Subscription
                            </button>
                        ) : statusInfo.isExpiringSoon ? (
                            <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-[var(--color-text-white)] py-3 px-6 rounded-lg font-semibold transition-colors">
                                Extend Subscription
                            </button>
                        ) : statusInfo.isActive ? (
                            <button className="flex-1 bg-[var(--color-blue)] hover:bg-[var(--color-blue-dark)] text-[var(--color-text-white)] py-3 px-6 rounded-lg font-semibold transition-colors">
                                Manage Subscription
                            </button>
                        ) : (
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-[var(--color-text-white)] py-3 px-6 rounded-lg font-semibold transition-colors">
                                Activate Subscription
                            </button>
                        )}
                        <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-[var(--color-text-white)] py-3 px-6 rounded-lg font-semibold transition-colors">
                            View Usage Details
                        </button>
                    </div>
                </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-[var(--color-bg-secondary)] py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            Why 100,000+ professionals choose us
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">Join the world's most trusted attendance platform</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {trustIndicators.map((item, index) => (
                            <div key={index} className="text-center group hover:scale-105 transition-transform duration-200">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 group-hover:from-blue-200 group-hover:to-blue-300 transition-colors">
                                    <item.icon className="w-8 h-8 text-[var(--color-blue-dark)]" />
                                </div>
                                <h3 className="font-bold text-[var(--color-text-primary)] mb-3 text-lg">{item.title}</h3>
                                <p className="text-[var(--color-text-secondary)] leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-[var(--color-bg-primary)] py-20">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-[var(--color-text-secondary)]">Everything you need to know about your subscription</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                q: "How do I renew my subscription?",
                                a: "You can easily renew your subscription through your account dashboard. We also send reminder emails before expiration to help you stay on track."
                            },
                            {
                                q: "What happens when my subscription expires?",
                                a: "When your subscription expires, you'll lose access to premium features but your data remains safe. You can reactivate anytime to restore full access."
                            },
                            {
                                q: "Can I upgrade my subscription plan?",
                                a: "Yes! You can upgrade your plan at any time. The changes take effect immediately and you'll only pay the prorated difference."
                            },
                            {
                                q: "Is my data secure?",
                                a: "Absolutely. We use enterprise-grade encryption and are SOC 2 Type II certified. Your attendance data is protected with the highest security standards."
                            },
                            {
                                q: "Do you offer refunds?",
                                a: "We offer a 30-day money-back guarantee on all subscriptions. If you're not satisfied, contact our support team for a full refund."
                            },
                            {
                                q: "How can I contact support?",
                                a: "Our support team is available 24/7 via email, chat, and phone. Premium subscribers get priority support with faster response times."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-[var(--color-bg-secondary)] rounded-2xl p-8 hover:shadow-lg transition-shadow">
                                <h3 className="font-bold text-[var(--color-text-primary)] mb-4 text-lg">{faq.q}</h3>
                                <p className="text-[var(--color-text-secondary)] leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darkest)] py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-[var(--color-text-white)] mb-6">
                        Need help with your subscription?
                    </h2>
                    <p className="text-xl text-[var(--color-text-white)] mb-8">
                        Our support team is here to assist you with any questions or concerns
                    </p>
                    <button className="bg-[var(--color-bg-secondary)] text-[var(--color-blue-dark)] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-bg-gradient-start)] transition-colors inline-flex items-center">
                        Contact Support
                        <ArrowRight className="w-6 h-6 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PricingComponent;