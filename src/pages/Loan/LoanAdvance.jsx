import React, { useState, useEffect } from 'react';
import { Plus, Eye, FileText, Trash2, CheckCircle, AlertCircle, Info, X, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import api from '../../api/axiosInstance'; // Adjust path as needed
import { useSelector } from 'react-redux';
import { Toast } from '../../Components/ui/Toast';
import { LoanDetailsModal } from '../../Components/ui/LoanDetailsModal';

const LoanAdvance = () => {
    const [loans, setLoans] = useState([]);
    const [filter, setFilter] = useState('All Loans/Advances');
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);


    // New states for dynamic dropdown data
    const [dropdownData, setDropdownData] = useState({
        loan_type_list: [],
        loan_priority_list: [],
        loan_status_list: []
    });
    const [dropdownLoading, setDropdownLoading] = useState(false);

    const permissions = useSelector(state => state.permissions) || {};

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loanDetails, setLoanDetails] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    const { user } = useAuth();

    // Dynamic filter options based on API data
    const getFilterOptions = () => {
        const baseOptions = ['All Loans/Advances'];
        const statusOptions = dropdownData.loan_status_list.map(status => status.name);
        return [...baseOptions, ...statusOptions];
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    // Fetch dropdown data from API
    const fetchDropdownData = async () => {
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
            showToast('Failed to load dropdown data. Using default options.', 'error');
        } finally {
            setDropdownLoading(false);
        }
    };

    // Fetch loans from API
    const fetchLoanData = async () => {
        try {
            if (!user?.user_id) {
                return;
            }

            setLoading(true);
            const formData = new FormData();
            formData.append('user_id', user.user_id);

            const response = await api.post('loan_list', formData);

            if (response.data.success) {
                const loanData = response.data.data || response.data.loans || [];
                setLoans(Array.isArray(loanData) ? loanData : []);
            } else {
                showToast(response.data.message || 'Failed to fetch loan data', 'error');
                setLoans([]);
            }
        } catch (err) {
            console.error('Error fetching loan data:', err);
            showToast('Failed to load loan data. Please try again.', 'error');
            setLoans([]);
        } finally {
            setLoading(false);
        }
    };

    // Load dropdown data when component mounts
    useEffect(() => {
        fetchDropdownData();
    }, []);

    // Load loan data when component mounts or user changes
    useEffect(() => {
        if (user?.user_id) {
            fetchLoanData();
        }
    }, [user?.user_id]);

    const handleAddLoanRedirect = () => {
        try {
            // Redirect to add-loan-advance route
            window.location.href = '/add-loan-advance';
        } catch (error) {
            showToast('Failed to navigate to add loan page', error);
        }
    };

    const calculateOutstandingAmount = (loan) => {
        try {
            // Based on API response structure
            const amount = parseFloat(loan.amount || 0);
            const installmentAmount = parseFloat(loan.installment_amount || 0);
            const tenure = parseInt(loan.tenure || 0);

            // Calculate total payable amount (this is simplified - you might need to adjust based on your business logic)
            // eslint-disable-next-line no-unused-vars
            const totalPayable = installmentAmount * tenure;

            // For now, assuming outstanding is the full amount if loan is pending/active
            // You might need to track payments separately
            if (loan.loan_status === 'Closed' || loan.status === '0') {
                return 0;
            }

            return amount; // Return original loan amount as outstanding for now
        } catch (error) {
            console.error('Error calculating outstanding amount:', error);
            return 0;
        }
    };

    // Updated handleViewDetails function
    const handleViewDetails = async (loanId) => {
        try {
            if (!user?.user_id) {
                showToast('User information not available', 'error');
                return;
            }

            console.log('Viewing loan details for ID:', loanId);
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
            showToast('Failed to load loan details. Please try again.', 'error');
            setLoanDetails([]);
        } finally {
            setModalLoading(false);
        }
    };

    // New function to handle edit action
    const handleEdit = (loanId) => {
        try {
            console.log('Edit loan with ID:', loanId);
            // Redirect to add-loan-advance page with edit mode and loan ID
            window.location.href = `/add-loan-advance?edit=true&loanId=${loanId}`;
        } catch (error) {
            console.error('Error handling edit:', error);
            showToast('Failed to edit loan', 'error');
        }
    };
    const closeModal = () => {
        setIsModalOpen(false);
        setLoanDetails([]);
        setModalLoading(false);
    };

    // Updated filtering logic to work with dynamic status list
    const getFilteredLoans = () => {
        try {
            if (filter === 'All Loans/Advances') {
                return loans;
            }

            // Filter by loan status
            return loans.filter(loan => loan.loan_status === filter);
        } catch (error) {
            showToast('Error filtering loans', error);
            return [];
        }
    };

    const handleFilterChange = (newFilter) => {
        try {
            setFilter(newFilter);
            showToast(`Filter changed to: ${newFilter}`, 'info');
        } catch (error) {
            showToast('Failed to change filter', error);
        }
    };

    const filteredLoans = getFilteredLoans();
    const totalLoans = filteredLoans.length;
    const filterOptions = getFilterOptions();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
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

            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Total Loans/Advances Registered ({totalLoans})
                            </h1>
                            {(loading || dropdownLoading) && (
                                <div className="flex items-center gap-2 text-blue-600">
                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm">
                                        {dropdownLoading ? 'Loading filters...' : 'Loading...'}
                                    </span>
                                </div>
                            )}
                            <select
                                value={filter}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading || dropdownLoading}
                            >
                                {filterOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        {permissions['loan_create'] &&
                            <button
                                onClick={handleAddLoanRedirect}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                disabled={loading}
                            >
                                <Plus size={16} />
                                Add Loan/Advance
                            </button>
                        }
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Employee Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Loan Type</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Interest Rate</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Tenure (Months)</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Installment Amount</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Outstanding Amount</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                {(permissions['loan_view'] || permissions['loan_edit']) &&
                                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                                }
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                            Loading loans...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredLoans.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                        No loans/advances found for the selected filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredLoans.map((loan) => (
                                    <tr key={loan.loan_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {loan.employee_full_name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.loan_type_name === 'Loan'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-green-100 text-green-800'
                                                }`}>
                                                {loan.loan_type_name || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ₹{parseFloat(loan.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {loan.interest_rate}%
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {loan.tenure} months
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ₹{parseFloat(loan.installment_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            ₹{calculateOutstandingAmount(loan).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.loan_status === 'Approved'
                                                ? 'bg-green-100 text-green-800'
                                                : loan.loan_status === 'Rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : loan.loan_status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : loan.loan_status === 'Under Review'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {loan.loan_status || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                {permissions['loan_view'] &&
                                                    <button
                                                        onClick={() => handleViewDetails(loan.loan_id)}
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                }
                                                {permissions['loan_edit'] &&
                                                    <button
                                                        onClick={() => handleEdit(loan.loan_id)}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                        title="Edit Loan"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                }
                                                {/* <button
                                                    onClick={() => handleDelete(loan.loan_id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LoanAdvance;