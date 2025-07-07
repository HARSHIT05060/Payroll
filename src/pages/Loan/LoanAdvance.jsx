import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Eye, Edit, Search, RefreshCw, XCircle, CreditCard, ChevronDown, ChevronUp, Users, DollarSign, ArrowLeft, Trash2 } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { Toast } from '../../Components/ui/Toast';
import { LoanDetailsModal } from '../../Components/ui/LoanDetailsModal';
import { ConfirmationModal } from '../../Components/ui/ConfirmationModal';

const SORT_DIRECTIONS = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending'
};

const COLUMN_KEYS = {
    EMPLOYEE_NAME: 'employee_name',
    LOAN_TYPE: 'loan_type',
    AMOUNT: 'amount',
    INTEREST_RATE: 'interest_rate',
    TENURE: 'tenure',
    INSTALLMENT: 'installment_amount',
    OUTSTANDING: 'outstanding',
    STATUS: 'loan_status'
};

const KEY_MAPPING = {
    [COLUMN_KEYS.EMPLOYEE_NAME]: 'employee_full_name',
    [COLUMN_KEYS.LOAN_TYPE]: 'loan_type_name',
    [COLUMN_KEYS.AMOUNT]: 'amount',
    [COLUMN_KEYS.INTEREST_RATE]: 'interest_rate',
    [COLUMN_KEYS.TENURE]: 'tenure',
    [COLUMN_KEYS.INSTALLMENT]: 'installment_amount',
    [COLUMN_KEYS.STATUS]: 'loan_status'
};

const LoanAdvance = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLoans, setFilteredLoans] = useState([]);
    const [filter, setFilter] = useState('All Loans/Advances');
    const [toast, setToast] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: SORT_DIRECTIONS.ASCENDING
    });

    // Dropdown data states
    const [dropdownData, setDropdownData] = useState({
        loan_type_list: [],
        loan_priority_list: [],
        loan_status_list: []
    });
    const [dropdownLoading, setDropdownLoading] = useState(false);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loanDetails, setLoanDetails] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    // Delete confirmation modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [loanToDelete, setLoanToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();
    const permissions = useSelector(state => state.permissions) || {};

    // Toast functions
    const showToast = useCallback((message, type = 'info') => {
        setToast({ message, type });
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    // Dynamic filter options based on API data
    const getFilterOptions = useMemo(() => {
        const baseOptions = ['All Loans/Advances'];
        const statusOptions = dropdownData.loan_status_list.map(status => status.name);
        return [...baseOptions, ...statusOptions];
    }, [dropdownData.loan_status_list]);

    // Calculate outstanding amount
    const calculateOutstandingAmount = useCallback((loan) => {
        try {
            const amount = parseFloat(loan.amount || 0);

            if (loan.loan_status === 'Closed' || loan.status === '0') {
                return 0;
            }

            return amount; // Return original loan amount as outstanding for now
        } catch (error) {
            console.error('Error calculating outstanding amount:', error);
            return 0;
        }
    }, []);

    // Fetch dropdown data from API
    const fetchDropdownData = useCallback(async () => {
        try {
            setDropdownLoading(true);
            const response = await api.post('loan_drop_down_list');

            if (response.data.success) {
                const data = response.data.data;
                setDropdownData({
                    loan_type_list: data.loan_type_list || [],
                    loan_priority_list: data.loan_priority_list || [],
                    loan_status_list: data.loan_status_list || []
                });
            } else {
                showToast(response.data.message || 'Failed to fetch dropdown data', 'error');
            }
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
            showToast('Failed to load dropdown data', 'error');
        } finally {
            setDropdownLoading(false);
        }
    }, [showToast]);

    // Fetch loans from API
    const fetchLoanData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            const response = await api.post('loan_list', formData);

            if (response.data?.success) {
                const loanData = response.data.data || response.data.loans || [];
                setLoans(Array.isArray(loanData) ? loanData : []);
            } else if (Array.isArray(response.data)) {
                setLoans(response.data);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch loan data');
            }

        } catch (error) {
            console.error("Fetch loans error:", error);
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
                setTimeout(() => logout?.(), 2000);
            } else if (error.response?.status === 403) {
                setError("You don't have permission to view loans.");
            } else if (error.response?.status >= 500) {
                setError("Server error. Please try again later.");
            } else {
                setError(errorMessage);
            }
            setLoans([]);
        } finally {
            setLoading(false);
        }
    }, [user, logout]);

    // Search and filter effect
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            let filtered = loans;

            // Apply status filter
            if (filter !== 'All Loans/Advances') {
                filtered = filtered.filter(loan => loan.loan_status === filter);
            }

            // Apply search filter
            if (searchQuery) {
                filtered = filtered.filter(loan => {
                    return Object.values(loan).some(value =>
                        String(value).toLowerCase().includes(searchQuery.toLowerCase())
                    );
                });
            }

            setFilteredLoans(filtered);
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery, loans, filter]);

    // Load dropdown data when component mounts
    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    // Load loan data when component mounts or user changes
    useEffect(() => {
        if (isAuthenticated() && user?.user_id) {
            fetchLoanData();
        }
    }, [isAuthenticated, fetchLoanData, user?.user_id]);

    // Sorting functionality
    const requestSort = useCallback((key) => {
        setSortConfig(prevConfig => {
            const direction = prevConfig.key === key && prevConfig.direction === SORT_DIRECTIONS.ASCENDING
                ? SORT_DIRECTIONS.DESCENDING
                : SORT_DIRECTIONS.ASCENDING;
            return { key, direction };
        });
    }, []);

    // Memoized sorted loans
    const sortedLoans = useMemo(() => {
        const source = filteredLoans;

        if (!sortConfig.key) return source;

        return [...source].sort((a, b) => {
            const actualKey = KEY_MAPPING[sortConfig.key] || sortConfig.key;
            let aValue = a[actualKey] || '';
            let bValue = b[actualKey] || '';

            // Handle numeric sorting for amount, interest rate, tenure, installment
            if (['amount', 'interest_rate', 'tenure', 'installment_amount'].includes(actualKey)) {
                aValue = parseFloat(aValue) || 0;
                bValue = parseFloat(bValue) || 0;
            }

            if (aValue < bValue) {
                return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? 1 : -1;
            }
            return 0;
        });
    }, [filteredLoans, sortConfig]);

    // Action handlers
    const handleAddLoanRedirect = useCallback(() => {
        navigate('/add-loan-advance');
    }, [navigate]);

    const handleViewDetails = useCallback(async (loanId) => {
        try {
            if (!user?.user_id) {
                showToast('User information not available', 'error');
                return;
            }

            setIsModalOpen(true);
            setModalLoading(true);
            setLoanDetails([]);

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('loan_id', loanId);

            const response = await api.post('single_loan_list', formData);

            if (response.data.success) {
                const details = response.data.data || [];
                setLoanDetails(Array.isArray(details) ? details : []);
            } else {
                showToast(response.data.message || 'Failed to fetch loan details', 'error');
                setLoanDetails([]);
            }
        } catch (error) {
            console.error('Error fetching loan details:', error);
            showToast('Failed to load loan details', 'error');
            setLoanDetails([]);
        } finally {
            setModalLoading(false);
        }
    }, [user, showToast]);

    // const handleEdit = useCallback((loanId) => {
    //     navigate(`/add-loan-advance?edit=${loanId}`);
    // }, [navigate]);

    // Delete functionality
    const handleDeleteClick = useCallback((loan) => {
        setLoanToDelete(loan);
        setIsDeleteModalOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!loanToDelete || !user?.user_id) {
            showToast('Unable to delete loan. Missing required information.', 'error');
            return;
        }

        try {
            setDeleteLoading(true);

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('loan_id', loanToDelete.loan_id);

            const response = await api.post('loan_delete', formData);

            if (response.data.success) {
                showToast('Loan deleted successfully', 'success');

                // Remove the deleted loan from the state
                setLoans(prevLoans => prevLoans.filter(loan => loan.loan_id !== loanToDelete.loan_id));

                // Close the modal
                setIsDeleteModalOpen(false);
                setLoanToDelete(null);
            } else {
                showToast(response.data.message || 'Failed to delete loan', 'error');
            }
        } catch (error) {
            console.error('Error deleting loan:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to delete loan';
            showToast(errorMessage, 'error');
        } finally {
            setDeleteLoading(false);
        }
    }, [loanToDelete, user, showToast]);

    const handleDeleteCancel = useCallback(() => {
        setIsDeleteModalOpen(false);
        setLoanToDelete(null);
    }, []);

    const handleFilterChange = useCallback((newFilter) => {
        setFilter(newFilter);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setLoanDetails([]);
        setModalLoading(false);
    }, []);

    // Render sort icon
    const renderSortIcon = useCallback((key) => {
        if (sortConfig.key !== key) {
            return <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />;
        }
        return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ?
            <ChevronUp className="ml-1 h-4 w-4 text-blue-500" /> :
            <ChevronDown className="ml-1 h-4 w-4 text-blue-500" />;
    }, [sortConfig]);

    // Render status badge
    const renderStatusBadge = useCallback((status) => {
        const statusColors = {
            'Approved': 'bg-green-100 text-green-800',
            'Rejected': 'bg-red-100 text-red-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Under Review': 'bg-blue-100 text-blue-800',
            'Closed': 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'
                }`}>
                {status || 'Unknown'}
            </span>
        );
    }, []);

    // Render loan type badge
    const renderLoanTypeBadge = useCallback((loanType) => {
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${loanType === 'Loan'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-green-100 text-green-800'
                }`}>
                {loanType || 'N/A'}
            </span>
        );
    }, []);

    // Format currency
    const formatCurrency = useCallback((amount) => {
        return `₹${parseFloat(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }, []);

    // Redirect if not authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Toast Notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={hideToast}
                    />
                )}

                {/* Loan Details Modal */}
                <LoanDetailsModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    loanDetails={loanDetails}
                    loading={modalLoading}
                />

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Loan"
                    message={`Are you sure you want to delete the loan for ${loanToDelete?.employee_full_name || 'this employee'}? This action cannot be undone.`}
                    confirmText={deleteLoading ? "Deleting..." : "Delete"}
                    cancelText="Cancel"
                    type="danger"
                />

                <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        Loan & Advance Management
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-blue-600 overflow-hidden shadow-sm">
                    {/* Header section */}
                    <div className="px-6 py-3 border-b border-blue-200 bg-blue-600">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <CreditCard className="h-6 w-6 text-white mr-2" />
                                <h3 className="text-lg font-medium text-white">
                                    Total Loans/Advances ({sortedLoans.length})
                                </h3>
                                {(loading || dropdownLoading) && (
                                    <div className="flex items-center gap-2 text-white ml-4">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">
                                            {dropdownLoading ? 'Loading filters...' : 'Loading...'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <select
                                    value={filter}
                                    onChange={(e) => handleFilterChange(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-sm"
                                    disabled={loading || dropdownLoading}
                                >
                                    {getFilterOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>

                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search loans..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-sm"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>

                                {permissions['loan_create'] && (
                                    <button
                                        onClick={handleAddLoanRedirect}
                                        className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                        disabled={loading}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Loan/Advance
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Content section */}
                    {loading ? (
                        <div className="px-6 py-12 text-center">
                            <div className="inline-flex items-center space-x-2 text-gray-500">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span>Loading loans...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <p className="text-red-700 text-lg font-medium mb-2">Error Loading Loans</p>
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={fetchLoanData}
                                    className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Try Again</span>
                                </button>
                            </div>
                        </div>
                    ) : loans.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <DollarSign className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-700 text-lg font-medium mb-2">No Loans Found</p>
                                <p className="text-gray-500 text-sm mb-4">
                                    You haven't added any loans or advances yet. Create your first loan to get started.
                                </p>
                                {permissions['loan_create'] && (
                                    <button
                                        onClick={handleAddLoanRedirect}
                                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Create First Loan</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : sortedLoans.length === 0 ? (
                        <div className="px-6 py-8 text-center text-gray-500">
                            <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">No loans found for the selected filter</p>
                            <p className="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-blue-50">
                                    <tr>
                                        {[
                                            { key: COLUMN_KEYS.EMPLOYEE_NAME, label: 'Employee Name' },
                                            { key: COLUMN_KEYS.LOAN_TYPE, label: 'Loan Type' },
                                            { key: COLUMN_KEYS.AMOUNT, label: 'Amount' },
                                            { key: COLUMN_KEYS.INTEREST_RATE, label: 'Interest Rate' },
                                            { key: COLUMN_KEYS.TENURE, label: 'Tenure (Months)' },
                                            { key: COLUMN_KEYS.INSTALLMENT, label: 'Installment Amount' },
                                            { key: COLUMN_KEYS.OUTSTANDING, label: 'Outstanding Amount' },
                                            { key: COLUMN_KEYS.STATUS, label: 'Status' }
                                        ].map(({ key, label }) => (
                                            <th key={`header-${key}`} className="px-5 py-3 text-left">
                                                <button
                                                    className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                                                    onClick={() => requestSort(key)}
                                                >
                                                    {label}
                                                    {renderSortIcon(key)}
                                                </button>
                                            </th>
                                        ))}
                                        {(permissions?.loan_edit || permissions?.loan_view || permissions?.loan_delete) && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedLoans.map((loan, index) => {
                                        const loanId = loan.loan_id || `loan-${index}`;
                                        const outstandingAmount = calculateOutstandingAmount(loan);

                                        return (
                                            <tr
                                                key={`loan-${loanId}`}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center space-x-2">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <Users className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <span>{loan.employee_full_name || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {renderLoanTypeBadge(loan.loan_type_name)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatCurrency(loan.amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {loan.interest_rate}%
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {loan.tenure} months
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatCurrency(loan.installment_amount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {formatCurrency(outstandingAmount)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {renderStatusBadge(loan.loan_status)}
                                                </td>
                                                {(permissions?.loan_edit || permissions?.loan_view || permissions?.loan_delete) && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            {permissions['loan_view'] && (
                                                                <button
                                                                    onClick={() => handleViewDetails(loan.loan_id)}
                                                                    className="p-2 rounded-md transition-colors text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {/* {permissions['loan_edit'] && (
                                                                <button
                                                                    onClick={() => handleEdit(loan.loan_id)}
                                                                    className="p-2 rounded-md transition-colors text-green-600 hover:text-green-900 hover:bg-green-50"
                                                                    title="Edit Loan"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                            )} */}
                                                            {permissions['loan_delete'] && (
                                                                <button
                                                                    onClick={() => handleDeleteClick(loan)}
                                                                    className="p-2 rounded-md transition-colors text-red-600 hover:text-red-900 hover:bg-red-50"
                                                                    title="Delete Loan"
                                                                    disabled={deleteLoading}
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanAdvance;