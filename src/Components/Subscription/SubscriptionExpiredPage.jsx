// Components/SubscriptionExpiredPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, RefreshCw, LogOut, Crown, AlertCircle, CheckCircle, XCircle, Mail, Phone, Clock } from 'lucide-react';
import { Toast } from '../ui/Toast'; // Adjust path as needed

const SubscriptionExpiredPage = () => {
    const { logout, user } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [toast, setToast] = useState(null);

    // Security: Disable right-click, inspect element, and keyboard shortcuts
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
            setToast({
                message: 'Right-click is disabled on this page',
                type: 'warning'
            });
        };

        const handleKeyDown = (e) => {
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+Shift+C
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'U') ||
                (e.ctrlKey && e.shiftKey && e.key === 'K') ||
                (e.metaKey && e.altKey && e.key === 'I') // Mac shortcut
            ) {
                e.preventDefault();
                setToast({
                    message: 'Developer tools are disabled',
                    type: 'error'
                });
            }
        };

        const handleSelectStart = (e) => {
            e.preventDefault();
        };

        const handleDragStart = (e) => {
            e.preventDefault();
        };

        // Add event listeners
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('selectstart', handleSelectStart);
        document.addEventListener('dragstart', handleDragStart);

        // Disable console
        const originalConsole = console.log;
        console.log = () => { };

        // Detect developer tools
        const detectDevTools = () => {
            const threshold = 160;
            setInterval(() => {
                if (
                    window.outerHeight - window.innerHeight > threshold ||
                    window.outerWidth - window.innerWidth > threshold
                ) {
                    setToast({
                        message: 'Developer tools detected. Please close them.',
                        type: 'error'
                    });
                }
            }, 500);
        };

        detectDevTools();

        // Cleanup
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('selectstart', handleSelectStart);
            document.removeEventListener('dragstart', handleDragStart);
            console.log = originalConsole;
        };
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Just reload the page to re-check user data
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setToast({
                message: 'Failed to refresh subscription status',
                type: error
            });
            setIsRefreshing(false);
        }
    };

    const handleRecharge = () => {
        try {
            // Redirect to payment/pricing page
            window.location.href = '/planspricing';
        } catch (error) {
            setToast({
                message: 'Failed to redirect to pricing page',
                type: error
            });
        }
    };

    const handleLogout = () => {
        try {
            logout();
        } catch (error) {
            setToast({
                message: 'Failed to logout',
                type: error
            });
        }
    };


    const features = [
        { name: 'Employee Management', icon: CheckCircle, active: false },
        { name: 'Payroll Processing', icon: CheckCircle, active: false },
        { name: 'Reports & Analytics', icon: CheckCircle, active: false },
        { name: 'Leave Management', icon: CheckCircle, active: false },
        { name: 'Shift Management', icon: CheckCircle, active: false },
        { name: 'Time Tracking', icon: CheckCircle, active: false },
    ];

    return (
        <div
            className="subscription-security min-h-screen bg-gradient-to-br from-[var(--color-bg-gradient-start)] via-[var(--color-bg-gradient-end)] to-[var(--color-bg-primary)]"
            style={{
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                WebkitTouchCallout: 'none'
            }}
        >
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-2 gap-12 min-h-screen">

                    {/* Left Side - Header */}
                    <div className="flex flex-col justify-center">
                        <div className="text-left">
                            {/* Main Icon */}
                            <div className="flex justify-start mb-8">
                                <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-error)] to-[var(--color-error-dark)] rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                                    <Crown className="w-12 h-12 text-[var(--color-text-white)]" />
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl md:text-6xl font-bold text-[var(--color-text-primary)] mb-4 animate-pulse">
                                Subscription Expired
                            </h1>

                            {/* Subtitle */}
                            <p className="text-xl md:text-2xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                                Your premium features are temporarily unavailable. Renew now to continue accessing all our powerful tools.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Single Card with All Content */}
                    <div className="flex flex-col justify-center">
                        <div className="bg-[var(--color-bg-card)] rounded-2xl p-8 shadow-custom-hover border border-[var(--color-border-primary)] space-y-8">

                            {/* User Info Section */}
                            <div>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-full flex items-center justify-center">
                                        <span className="text-[var(--color-text-white)] font-bold text-xl">
                                            {user?.full_name?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                                            Welcome back, {user?.full_name}
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)]">
                                            Account ID: {user?.user_id}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {/* What You're Missing Section */}
                            <div>
                                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">
                                    What You're Missing
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-[var(--color-bg-hover)] rounded-lg">
                                            <XCircle className="w-5 h-5 text-[var(--color-error)]" />
                                            <span className="text-[var(--color-text-primary)] font-medium">
                                                {feature.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Divider */}
                            <hr className="border-[var(--color-border-primary)]" />

                            {/* Ready to Continue Section */}
                            <div>
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">
                                        Ready to Continue?
                                    </h3>
                                    <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                                        Renew your subscription to regain access to all premium features.
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleRecharge}
                                        className="w-full bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] text-[var(--color-text-white)] py-3 px-6 rounded-xl font-bold hover:from-[var(--color-blue-dark)] hover:to-[var(--color-blue-darker)] transition-custom flex items-center justify-center space-x-3 shadow-custom transform hover:scale-[1.02]"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        <span>Renew Subscription Now</span>
                                    </button>

                                    <button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="w-full bg-[var(--color-text-secondary)] text-[var(--color-text-white)] py-3 px-6 rounded-xl font-semibold hover:bg-[var(--color-text-primary)] transition-custom flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-custom"
                                    >
                                        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                        <span>{isRefreshing ? 'Checking Status...' : 'Check Status'}</span>
                                    </button>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full border-2 border-[var(--color-border-secondary)] text-[var(--color-text-primary)] py-3 px-6 rounded-xl font-semibold hover:bg-[var(--color-bg-hover)] transition-custom flex items-center justify-center space-x-3"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-[var(--color-border-primary)] mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row justify-between items-start space-y-6 lg:space-y-0">
                        {/* Left side - Copyright and Terms */}
                        <div className="text-center lg:text-left">
                            <p className="text-[var(--color-text-muted)] mb-4">
                                © 2025 Your Company. All rights reserved.
                            </p>
                            <div className="flex flex-wrap justify-center lg:justify-start space-x-4">
                                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm">
                                    Terms of Service
                                </a>
                                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm">
                                    Contact Us
                                </a>
                            </div>
                        </div>

                        {/* Right side - Need Help Section */}
                        <div className="text-center lg:text-right">
                            <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-end justify-center lg:justify-end">
                                {/* Email Support */}
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-text-blue)] to-[var(--color-blue-dark)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Mail className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-text-blue)] transition-colors duration-300">
                                            Email Support
                                        </p>
                                    </div>
                                    <a
                                        href="mailto:support@yourcompany.com"
                                        className="text-[var(--color-text-blue)] hover:text-[var(--color-blue-dark)] text-sm font-medium block transition-colors duration-300 hover:underline"
                                    >
                                        support@yourcompany.com
                                    </a>
                                </div>

                                {/* Phone Support */}
                                <div >
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success-dark)] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            <Phone className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-sm font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-success)] transition-colors duration-300">
                                            Phone Support
                                        </p>
                                    </div>
                                    <a
                                        href="tel:+1234567890"
                                        className="text-[var(--color-success)] hover:text-[var(--color-success-dark)] text-sm font-medium block transition-colors duration-300 hover:underline"
                                    >
                                        +1 (234) 567-890
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SubscriptionExpiredPage;