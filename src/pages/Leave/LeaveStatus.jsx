import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import api from '../../api/axiosInstance';
import { Toast } from '../../Components/ui/Toast';

// Lucide React Icons
import {
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    Eye,
    RefreshCw,
    Search,
    Users,
    ChevronDown,
    ChevronUp,
    FileText,
    AlertCircle,
    Plus,
    X,
    User,
    CalendarDays,
    Timer,
    MessageSquare,
    AlertTriangle,
    ArrowLeft
} from 'lucide-react';

const SORT_DIRECTIONS = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending'
};

const COLUMN_KEYS = {
    NAME: 'name',
    LEAVE_TYPE: 'leave_type',
    START_DATE: 'start_date',
    END_DATE: 'end_date',
    TOTAL_DAYS: 'total_days',
    STATUS: 'status'
};

const KEY_MAPPING = {
    [COLUMN_KEYS.NAME]: 'full_name',
    [COLUMN_KEYS.LEAVE_TYPE]: 'leave_type',
    [COLUMN_KEYS.START_DATE]: 'start_date',
    [COLUMN_KEYS.END_DATE]: 'end_date',
    [COLUMN_KEYS.TOTAL_DAYS]: 'total_days',
    [COLUMN_KEYS.STATUS]: 'status'
};

const STATUS_CONFIG = {
    '1': {
        name: 'Pending',
        icon: Clock,
        bgColor: 'bg-[var(--color-warning-light)]',
        textColor: 'text-[var(--color-warning-dark)]"',
        tabColor: 'text-[var(--color-warning)]',
        borderColor: 'border-[var(--color-warning-lighter)]'
    },
    '2': {
        name: 'Approved',
        icon: CheckCircle,
        bgColor: 'bg-[var(--color-success-light)]',
        textColor: 'text-[var(--color-success-dark)]',
        tabColor: 'text-[var(--color-success)]',
        borderColor: 'border-[var(--color-success-lighter)]'
    },
    '3': {
        name: 'Rejected',
        icon: XCircle,
        bgColor: 'bg-[var(--color-error-light)]',
        textColor: 'text-red-800',
        tabColor: 'text-[var(--color-text-error)]',
        borderColor: 'border-[var(--color-border-error)]'
    }
};

const DetailCard = ({ icon, label, value, bg }) => (
    <div className="bg-[var(--color-bg-primary)] rounded-lg p-4 border border-[var(--color-border-primary)]">
        <div className="flex items-center space-x-3 mb-2">
            <div className={`w-8 h-8 bg-${bg}-100 rounded-full flex items-center justify-center`}>
                {icon}
            </div>
            <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</h4>
        </div>
        <p className="text-lg font-semibold text-[var(--color-text-primary)] ml-11">{value}</p>
    </div>
);

const NoteCard = ({ icon, title, content, color }) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4 mb-6`}>
        <div className="flex items-start space-x-3">
            <div className={`w-8 h-8 bg-${color}-100 rounded-full flex items-center justify-center mt-0.5`}>
                {icon}
            </div>
            <div className="flex-1">
                <h4 className={`text-sm font-medium text-${color}-800 mb-2`}>{title}</h4>
                <p className={`text-sm text-${color}-700 leading-relaxed`}>{content}</p>
            </div>
        </div>
    </div>
);


const LeaveManagement = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const permissions = useSelector(state => state.permissions) || {};
    const navigate = useNavigate();

    // State management
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('1');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: SORT_DIRECTIONS.ASCENDING
    });

    // Modal states
    const [rejectionModal, setRejectionModal] = useState({
        isOpen: false,
        leaveData: null,
        reason: ''
    });
    const [viewModal, setViewModal] = useState({
        isOpen: false,
        leaveData: null
    });

    // Toast state
    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success'
    });

    // Toast functions
    const showToast = useCallback((message, type = 'success') => {
        setToast({ show: true, message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({ ...prev, show: false }));
    }, []);

    // Fetch leave requests
    const fetchLeaveRequests = useCallback(async (status = selectedStatus) => {
        if (!user?.user_id) {
            setError('User ID not available');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('status', status);

            const response = await api.post('/leave_list', formData);

            if (response.data.success) {
                setLeaveRequests(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch leave requests');
            }
        } catch (error) {
            console.error("Fetch leave requests error:", error);
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
                setTimeout(() => logout?.(), 2000);
            } else if (error.response?.status === 403) {
                setError("You don't have permission to view leave requests.");
            } else if (error.response?.status >= 500) {
                setError("Server error. Please try again later.");
            } else {
                setError(errorMessage);
            }
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }, [user, selectedStatus, logout, showToast]);

    // Search and filter effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const filtered = leaveRequests.filter(leave => {
                return Object.values(leave).some(value =>
                    String(value).toLowerCase().includes(searchQuery.toLowerCase())
                );
            });
            setFilteredRequests(filtered);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, leaveRequests]);

    // Initial data fetch
    useEffect(() => {
        if (isAuthenticated() && user?.user_id) {
            fetchLeaveRequests();
        }
    }, [isAuthenticated, fetchLeaveRequests, user?.user_id, selectedStatus]);

    // Sorting functionality
    const requestSort = useCallback((key) => {
        setSortConfig(prevConfig => {
            const direction = prevConfig.key === key && prevConfig.direction === SORT_DIRECTIONS.ASCENDING
                ? SORT_DIRECTIONS.DESCENDING
                : SORT_DIRECTIONS.ASCENDING;
            return { key, direction };
        });
    }, []);

    // Memoized sorted leave requests
    const sortedLeaveRequests = useMemo(() => {
        const source = searchQuery ? filteredRequests : leaveRequests;

        if (!sortConfig.key) return source;

        return [...source].sort((a, b) => {
            const actualKey = KEY_MAPPING[sortConfig.key] || sortConfig.key;
            let aValue = a[actualKey] || '';
            let bValue = b[actualKey] || '';

            // Special handling for dates
            if (sortConfig.key === COLUMN_KEYS.START_DATE || sortConfig.key === COLUMN_KEYS.END_DATE) {
                aValue = parseDate(aValue);
                bValue = parseDate(bValue);
            }

            if (aValue < bValue) {
                return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? 1 : -1;
            }
            return 0;
        });
    }, [leaveRequests, filteredRequests, sortConfig, searchQuery]);

    // Date parsing and formatting
    const parseDate = useCallback((dateString) => {
        if (!dateString) return new Date(0);
        const [day, month, year] = dateString.split('-');
        return new Date(year, month - 1, day);
    }, []);

    const formatDate = useCallback((dateString) => {
        try {
            const date = parseDate(dateString);
            return date.toLocaleDateString('en-GB');
        } catch (error) {
            console.log(error)
            return dateString;
        }
    }, [parseDate]);

    // Action handlers
    const handleTabChange = useCallback((status) => {
        setSelectedStatus(status);
        setSortConfig({ key: null, direction: SORT_DIRECTIONS.ASCENDING });
        setSearchQuery('');
    }, []);

    const handleView = useCallback((leave) => {
        setViewModal({
            isOpen: true,
            leaveData: { ...leave, totalDays: leave.total_days }
        });
    }, []);

    const handleApprove = useCallback(async (leaveId) => {
        if (!user?.user_id) {
            showToast('User authentication required', 'error');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('status', '2');
            formData.append('leave_id', leaveId);
            formData.append('reject_reason', '');

            const response = await api.post('/change_leave_status', formData);

            if (response.data.success) {
                showToast('Leave request approved successfully!', 'success');
                fetchLeaveRequests();
            } else {
                showToast(response.data.message || 'Failed to approve leave request', 'error');
            }
        } catch (error) {
            console.error("Error approving leave request:", error);
            showToast('Failed to approve leave request. Please try again.', 'error');
        }
    }, [user, showToast, fetchLeaveRequests]);

    const handleReject = useCallback((leave) => {
        setRejectionModal({
            isOpen: true,
            leaveData: leave,
            reason: ''
        });
    }, []);

    const submitRejection = useCallback(async () => {
        if (!user?.user_id) {
            showToast('User authentication required', 'error');
            return;
        }

        if (!rejectionModal.reason.trim()) {
            showToast('Please provide a reason for rejection.', 'warning');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('status', '3');
            formData.append('leave_id', rejectionModal.leaveData.leave_id);
            formData.append('reject_reason', rejectionModal.reason);

            const response = await api.post('/change_leave_status', formData);

            if (response.data.success) {
                showToast('Leave request rejected successfully!', 'success');
                setRejectionModal({ isOpen: false, leaveData: null, reason: '' });
                fetchLeaveRequests();
            } else {
                showToast(response.data.message || 'Failed to reject leave request', 'error');
            }
        } catch (error) {
            console.error("Error rejecting leave request:", error);
            showToast('Failed to reject leave request. Please try again.', 'error');
        }
    }, [user, rejectionModal, showToast, fetchLeaveRequests]);

    // Status chip component
    const StatusChip = useCallback(({ status }) => {
        const config = STATUS_CONFIG[status];
        if (!config) return null;

        const IconComponent = config.icon;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${config.bgColor} ${config.textColor}`}>
                <IconComponent className="w-3 h-3 mr-1" />
                {config.name}
            </span>
        );
    }, []);

    // Render sort icon
    const renderSortIcon = useCallback((key) => {
        if (sortConfig.key !== key) {
            return <ChevronDown className="ml-1 h-4 w-4 text-[var(--color-text-muted)]" />;
        }
        return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ?
            <ChevronUp className="ml-1 h-4 w-4 text-[var(--color-blue)]" /> :
            <ChevronDown className="ml-1 h-4 w-4 text-[var(--color-blue)]" />;
    }, [sortConfig]);

    // Redirect if not authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="p-6 max-w-7xl mx-auto">
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-[var(--color-text-white)]">
                                        Leave Management
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-blue-dark)] overflow-hidden shadow-sm">
                    {/* Header section with tabs */}
                    <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <FileText className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                                <h3 className="text-lg font-medium text-[var(--color-text-white)]">Leave Requests</h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search leave requests..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-secondary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-text-white)] focus:border-[var(--color-border-primary)] text-sm"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-text-muted)]" />
                                </div>

                                {permissions['leave_create'] && (
                                    <button
                                        onClick={() => navigate('/leaveapplication')}
                                        className="flex items-center gap-2 bg-[var(--color-bg-secondary)] text-[var(--color-blue-dark)] hover:bg-[var(--color-bg-primary)] px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Leave
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status Tabs */}
                        <div className="flex space-x-1">
                            {Object.entries(STATUS_CONFIG).map(([statusValue, config]) => {
                                const IconComponent = config.icon;
                                return (
                                    <button
                                        key={statusValue}
                                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${selectedStatus === statusValue
                                            ? 'bg-[var(--color-bg-secondary)] text-[var(--color-blue-dark)]'
                                            : 'text-[var(--color-text-white)] hover:bg-[var(--color-blue-darker)]'
                                            }`}
                                        onClick={() => handleTabChange(statusValue)}
                                    >
                                        <IconComponent className="mr-2 h-4 w-4" />
                                        {config.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content section */}
                    {loading ? (
                        <div className="px-6 py-12 text-center">
                            <div className="inline-flex items-center space-x-2 text-[var(--color-text-secondary)]">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span>Loading leave requests...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-[var(--color-error-light)] border border-[var(--color-border-error)] rounded-lg p-6">
                                <AlertCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
                                <p className="text-[var(--color-error-dark)] text-lg font-medium mb-2">Error Loading Leave Requests</p>
                                <p className="text-[var(--color-text-error)] mb-4">{error}</p>
                                <button
                                    onClick={() => fetchLeaveRequests()}
                                    className="inline-flex items-center space-x-2 bg-[var(--color-error-light)] text-[var(--color-error-dark)] px-4 py-2 rounded-md hover:bg-[var(--color-error-lighter)] transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Try Again</span>
                                </button>
                            </div>
                        </div>
                    ) : leaveRequests.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-8">
                                <div className="w-16 h-16 bg-[var(--color-bg-gray-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-[var(--color-text-muted)]" />
                                </div>
                                <p className="text-[var(--color-text-secondary)] text-lg font-medium mb-2">No {STATUS_CONFIG[selectedStatus]?.name} Leave Requests</p>
                                <p className="text-[var(--color-text-secondary)] text-sm mb-4">
                                    There are no leave requests with {STATUS_CONFIG[selectedStatus]?.name.toLowerCase()} status.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[var(--color-border-divider)]">
                                <thead className="bg-[var(--color-blue-lightest)]">
                                    <tr>
                                        {[
                                            { key: COLUMN_KEYS.NAME, label: 'Employee Name' },
                                            { key: COLUMN_KEYS.LEAVE_TYPE, label: 'Leave Type' },
                                            { key: COLUMN_KEYS.START_DATE, label: 'Start Date' },
                                            { key: COLUMN_KEYS.END_DATE, label: 'End Date' },
                                            { key: COLUMN_KEYS.TOTAL_DAYS, label: 'Total Days' },
                                            { key: COLUMN_KEYS.STATUS, label: 'Status' }
                                        ].map(({ key, label }) => (
                                            <th key={`header-${key}`} className="px-6 py-3 text-left">
                                                <button
                                                    className="flex items-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider hover:text-[var(--color-text-secondary)]"
                                                    onClick={() => requestSort(key)}
                                                >
                                                    {label}
                                                    {renderSortIcon(key)}
                                                </button>
                                            </th>
                                        ))}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-divider)]">
                                    {!sortedLeaveRequests || sortedLeaveRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center text-[var(--color-text-secondary)]">
                                                <FileText className="h-12 w-12 mx-auto mb-4 text-[var(--color-text-muted)]" />
                                                <p className="text-lg font-medium">No leave requests found</p>
                                                <p className="text-sm">Try adjusting your search or filters</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedLeaveRequests.map((leave, index) => {
                                            const leaveId = leave.leave_id || `leave-${index}`;
                                            return (
                                                <tr
                                                    key={`leave-${leaveId}`}
                                                    className="hover:bg-[var(--color-bg-primary)] transition-colors"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-8 h-8 bg-[var(--color-blue-lighter)] rounded-full flex items-center justify-center">
                                                                <Users className="w-4 h-4 text-[var(--color-blue-dark)]" />
                                                            </div>
                                                            <span>{leave.full_name || 'Unknown Employee'}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        {leave.leave_type || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1 text-[var(--color-text-muted)]" />
                                                            {formatDate(leave.start_date)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1 text-[var(--color-text-muted)]" />
                                                            {formatDate(leave.end_date)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        <span className="font-medium">{leave.total_days || 0}</span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                        <StatusChip status={leave.status} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleView(leave)}
                                                                className="p-2 rounded-md transition-colors text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-primary)]"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>

                                                            {leave.status === '1' && (
                                                                <>
                                                                    {permissions['leave_approved'] && (
                                                                        <button
                                                                            onClick={() => handleApprove(leave.leave_id)}
                                                                            className="p-2 rounded-md transition-colors text-[var(--color-success-dark)] hover:text-[var(--color-success-dark)] hover:bg-[var(--color-success-light)]"
                                                                            title="Approve Leave"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                    {permissions['leave_rejected'] && (
                                                                        <button
                                                                            onClick={() => handleReject(leave)}
                                                                            className="p-2 rounded-md transition-colors text-[var(--color-text-error)] hover:text-red-900 hover:bg-[var(--color-error-light)]"
                                                                            title="Reject Leave"
                                                                        >
                                                                            <XCircle className="w-4 h-4" />
                                                                        </button>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Rejection Modal */}
                {rejectionModal.isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-xl w-full max-w-md">
                            <div className="p-6 border-b">
                                <h2 className="text-lg font-medium">Provide Reason for Rejection</h2>
                            </div>
                            <div className="p-6">
                                <textarea
                                    className="w-full border border-[var(--color-border-secondary)] rounded-md p-3 h-32 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)]"
                                    placeholder="Enter rejection reason"
                                    value={rejectionModal.reason}
                                    onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                                />
                            </div>
                            <div className="p-4 bg-[var(--color-bg-primary)] flex justify-end space-x-3 rounded-b-lg">
                                <button
                                    className="px-4 py-2 text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-md shadow-sm hover:bg-[var(--color-bg-primary)]"
                                    onClick={() => setRejectionModal({ isOpen: false, leaveData: null, reason: '' })}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 text-[var(--color-text-white)] bg-[var(--color-error-dark)] border border-transparent rounded-md shadow-sm hover:bg-[var(--color-error-darker)]"
                                    onClick={submitRejection}
                                >
                                    Submit Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced View Modal */}
                {viewModal.isOpen && viewModal.leaveData && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex custom-scrollbar items-center justify-center p-4 z-50">
                        <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-[var(--color-bg-secondary)] bg-opacity-20 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-[var(--color-text-white)]" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-[var(--color-text-white)]">Leave Request Details</h2>
                                            <p className="text-sm text-[var(--color-blue-lighter)]">Employee Information</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setViewModal({ isOpen: false, leaveData: null })}
                                        className="p-2 hover:bg-[var(--color-bg-secondary)] hover:bg-opacity-20 rounded-full transition"
                                    >
                                        <X className="w-5 h-5 text-[var(--color-text-white)]" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto flex-1">
                                {/* Employee Info */}
                                <div className="bg-[var(--color-blue-lightest)] border border-[var(--color-blue-light)] rounded-lg p-4 mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-[var(--color-blue-dark)] rounded-full flex items-center justify-center">
                                            <User className="w-6 h-6 text-[var(--color-text-white)]" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                                                {viewModal.leaveData.full_name}
                                            </h3>
                                            <div className="mt-1">
                                                <StatusChip status={viewModal.leaveData.status} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Leave Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <DetailCard
                                        icon={<FileText className="w-4 h-4 text-[var(--color-blue-dark)]" />}
                                        label="Leave Type"
                                        value={viewModal.leaveData.leave_type}
                                        bg="indigo"
                                    />
                                    <DetailCard
                                        icon={<Timer className="w-4 h-4 text-[var(--color-blue-dark)]" />}
                                        label="Total Duration"
                                        value={`${viewModal.leaveData.totalDays} ${viewModal.leaveData.totalDays === 1 ? 'Day' : 'Days'}`}
                                        bg="purple"
                                    />
                                    <DetailCard
                                        icon={<CalendarDays className="w-4 h-4 text-[var(--color-success-dark)]" />}
                                        label="Start Date"
                                        value={formatDate(viewModal.leaveData.start_date)}
                                        bg="green"
                                    />
                                    <DetailCard
                                        icon={<CalendarDays className="w-4 h-4 text-[var(--color-text-error)]" />}
                                        label="End Date"
                                        value={formatDate(viewModal.leaveData.end_date)}
                                        bg="red"
                                    />
                                </div>

                                {/* Reason */}
                                {viewModal.leaveData.reason && (
                                    <NoteCard
                                        icon={<MessageSquare className="w-4 h-4 text-[var(--color-warning-dark)]" />}
                                        title="Leave Reason"
                                        color="amber"
                                        content={viewModal.leaveData.reason}
                                    />
                                )}

                                {/* Rejection Reason */}
                                {viewModal.leaveData.status === '3' && viewModal.leaveData.reject_reason && (
                                    <NoteCard
                                        icon={<AlertTriangle className="w-4 h-4 text-[var(--color-text-error)]" />}
                                        title="Rejection Reason"
                                        color="red"
                                        content={viewModal.leaveData.reject_reason}
                                    />
                                )}

                                {/* Application Date */}
                                {viewModal.leaveData.applied_date && (
                                    <div className="border-t pt-4 mt-4 text-sm text-[var(--color-text-secondary)] flex justify-between">
                                        <span>Application submitted on:</span>
                                        <span className="font-medium">{formatDate(viewModal.leaveData.applied_date)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-[var(--color-bg-primary)] px-6 py-4 border-t flex justify-between items-center rounded-b-2xl">
                                <div className="flex space-x-3">
                                    {viewModal.leaveData.status === '1' && (
                                        <>
                                            {permissions['leave_approved'] && (
                                                <button
                                                    onClick={() => {
                                                        handleApprove(viewModal.leaveData.leave_id);
                                                        setViewModal({ isOpen: false, leaveData: null });
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-[var(--color-text-white)] bg-[var(--color-success-medium)] rounded-md shadow hover:bg-[var(--color-success-dark)] transition"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2 inline" />
                                                    Approve
                                                </button>
                                            )}
                                            {permissions['leave_rejected'] && (
                                                <button
                                                    onClick={() => {
                                                        setViewModal({ isOpen: false, leaveData: null });
                                                        handleReject(viewModal.leaveData);
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-[var(--color-text-white)] bg-[var(--color-error-dark)] rounded-md shadow hover:bg-[var(--color-error-darker)] transition"
                                                >
                                                    <XCircle className="w-4 h-4 mr-2 inline" />
                                                    Reject
                                                </button>
                                            )}
                                        </>
                                    )}
                                    <button
                                        onClick={() => setViewModal({ isOpen: false, leaveData: null })}
                                        className="px-4 py-2 text-sm font-medium bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-secondary)] rounded-md shadow hover:bg-[var(--color-bg-gradient-start)] transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Toast Component */}
                {toast.show && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )}
            </div>
        </div>
    );
};

export default LeaveManagement;