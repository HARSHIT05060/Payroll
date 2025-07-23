import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';
import api from '../api/axiosInstance';
import { Toast } from '../Components/ui/Toast';

const DashboardContext = createContext();

export const DashboardProvider = ({ children, user, date }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null); // Toast state

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
    };

    const handleToastClose = () => {
        setToast(null);
    };

    const fetchDashboardData = useCallback(async () => {
        if (!user?.user_id || !date) return;

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('date', date); // e.g., "2025-06-01"
            formData.append('year_month', date.slice(0, 7)); // e.g., "2025-06"

            const response = await api.post('dashboard', formData);

            if (response.data?.success && response.data.data) {
                setDashboardData(response.data.data);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch dashboard data');
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || err.message || 'An error occurred';
            showToast(errorMessage, 'error'); // ✅ Use your Toast
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.user_id, date]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const value = {
        dashboardData,
        loading,
        refetch: fetchDashboardData,
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={handleToastClose}
                />
            )}
        </DashboardContext.Provider>
    );
};

export const useDashboardData = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboardData must be used within a DashboardProvider');
    }
    return context;
};
