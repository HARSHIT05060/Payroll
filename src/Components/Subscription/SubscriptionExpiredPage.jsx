// Components/SubscriptionExpiredPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, RefreshCw, LogOut, Crown, AlertCircle } from 'lucide-react';
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

    const subscriptionDays = parseInt(user?.subscriptions_days || 0);

    return (
        <div
            className="subscription-security min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4"
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

            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
                {/* Icon */}
                <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Subscription Expired
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your subscription has expired. Please renew to continue using our services.
                    </p>
                </div>

                {/* Status Info */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-semibold text-red-700 dark:text-red-400">
                            Status: Expired
                        </span>
                    </div>
                    {subscriptionDays <= 0 && (
                        <p className="text-xs text-red-600 dark:text-red-400">
                            Your subscription expired {Math.abs(subscriptionDays)} days ago
                        </p>
                    )}
                </div>

                {/* User Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Welcome back, <span className="font-semibold text-gray-900 dark:text-white">{user?.full_name}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Account ID: {user?.user_id}
                    </p>
                </div>

                {/* Features Lost */}
                <div className="text-left mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        What you're missing:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                            Employee Management
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                            Payroll Processing
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                            Reports & Analytics
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                            Leave Management
                        </li>
                        <li className="flex items-center">
                            <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                            Shift Management
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleRecharge}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                    >
                        <CreditCard className="w-5 h-5" />
                        <span>Renew Subscription</span>
                    </button>

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? 'Checking...' : 'Check Status'}</span>
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Support */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        Need help? Contact support at{' '}
                        <a href="mailto:support@yourcompany.com" className="text-blue-600 hover:underline">
                            support@yourcompany.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionExpiredPage;