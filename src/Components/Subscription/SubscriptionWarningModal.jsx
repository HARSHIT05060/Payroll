// Components/SubscriptionWarningModal.jsx
import { useState } from 'react';
import { X, AlertTriangle, Crown, CreditCard, Calendar } from 'lucide-react';

const SubscriptionWarningModal = ({ isOpen, onClose, daysLeft }) => {
    const [dontShowAgain, setDontShowAgain] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        if (dontShowAgain) {
            // Store in localStorage to not show again for this session
            localStorage.setItem('hideSubscriptionWarning', 'true');
        }
        onClose();
    };

    const handleRenew = () => {
        window.location.href = '/planspricing';
    };

    const getUrgencyColor = () => {
        if (daysLeft <= 3) return 'from-red-500 to-red-600';
        if (daysLeft <= 7) return 'from-orange-500 to-orange-600';
        return 'from-yellow-500 to-yellow-600';
    };

    const getUrgencyText = () => {
        if (daysLeft <= 3) return 'Urgent';
        if (daysLeft <= 7) return 'Important';
        return 'Notice';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700 animate-pulse-slow">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${getUrgencyColor()} rounded-full flex items-center justify-center`}>
                            <AlertTriangle className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {getUrgencyText()}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Subscription Expiring Soon
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Days Left Display */}
                    <div className="text-center mb-6">
                        <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${getUrgencyColor()} rounded-full mb-4`}>
                            <span className="text-2xl font-bold text-white">{daysLeft}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {daysLeft === 1 ? '1 Day Left' : `${daysLeft} Days Left`}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Your subscription will expire in {daysLeft === 1 ? '1 day' : `${daysLeft} days`}. 
                            Don't lose access to your important data and features.
                        </p>
                    </div>

                    {/* Features at Risk */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <Crown className="w-4 h-4 mr-2 text-yellow-500" />
                            Features at Risk:
                        </h4>
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
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleRenew}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                        >
                            <CreditCard className="w-5 h-5" />
                            <span>Renew Now</span>
                        </button>
                        
                        <button
                            onClick={handleClose}
                            className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <Calendar className="w-5 h-5" />
                            <span>Remind Me Later</span>
                        </button>
                    </div>

                    {/* Don't Show Again Option */}
                    <div className="mt-4 flex items-center justify-center">
                        <label className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span>Don't show this again today</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionWarningModal;