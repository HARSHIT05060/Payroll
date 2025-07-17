// Components/SubscriptionGuard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import SubscriptionExpiredPage from './SubscriptionExpiredPage';
import SubscriptionWarningModal from './SubscriptionWarningModal';

const SubscriptionGuard = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [showWarningModal, setShowWarningModal] = useState(false);

    useEffect(() => {
        // Simply set loading to false after checking user
        setIsLoading(false);
        
        // Check if we need to show warning modal
        if (user && isAuthenticated()) {
            const subscriptionStatus = parseInt(user?.subscriptions_status || 0);
            const subscriptionDays = parseInt(user?.subscriptions_days || 0);
            // Show warning if subscription is active (status 1) but expiring in 15 days or less
            if (subscriptionStatus === 1 && subscriptionDays <= 15 && subscriptionDays > 0) {
                setShowWarningModal(true);
            }
        }
    }, [user, isAuthenticated]);

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Not authenticated - show login or children
    if (!isAuthenticated()) {
        return children;
    }

    // Get subscription status from user data
    const subscriptionStatus = parseInt(user?.subscriptions_status || 0);

    // Subscription expired (status 2)
    if (subscriptionStatus === 2) {
        return <SubscriptionExpiredPage />;
    }

    // Subscription active (status 1) or any other status - show app with potential warning
    return (
        <>
            {children}
            {showWarningModal && (
                <SubscriptionWarningModal
                    isOpen={showWarningModal}
                    onClose={() => setShowWarningModal(false)}
                    daysLeft={parseInt(user?.subscriptions_days || 0)}
                />
            )}
        </>
    );
};

export default SubscriptionGuard;