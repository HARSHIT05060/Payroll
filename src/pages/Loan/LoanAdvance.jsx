import React, { useState, useEffect } from 'react';
import { Plus, Eye, FileText, Trash2, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'info':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <AlertCircle className="w-5 h-5" />;
            case 'info':
                return <Info className="w-5 h-5" />;
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-md ${getToastStyles()}`}>
            <div className="flex items-start gap-3">
                {getIcon()}
                <div className="flex-1">
                    <p className="font-medium">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const LoanAdvance = () => {
    const [loans, setLoans] = useState([]);
    const [filter, setFilter] = useState('Active Loans/Advances');
    const [toast, setToast] = useState(null);

    const filterOptions = [
        'Active Loans/Advances',
        'Closed Loans/Advances',
        'All Loans/Advances',
        'Pending Approval'
    ];

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

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
            if (filter === 'Closed Loans/Advances') return 0;
            return loan.totalAmount - loan.totalDebit;
        } catch (error) {
            showToast('Error calculating outstanding amount', error);
            return 0;
        }
    };

    const handleDelete = (loanId) => {
        try {
            if (window.confirm('Are you sure you want to delete this loan/advance?')) {
                setLoans(prev => prev.filter(loan => loan.id !== loanId));
                showToast('Loan/Advance deleted successfully', 'success');
            }
        } catch (error) {
            showToast('Failed to delete loan/advance', error);
        }
    };

    const handleViewDetails = (loanId) => {
        try {
            // View details logic here
            console.log(loanId)
            showToast('Loading loan details...', 'info');
        } catch (error) {
            showToast('Failed to load loan details', error);
        }
    };

    const handleGenerateReport = (loanId) => {
        try {
            // Generate report logic here
            console.log(loanId)
            showToast('Generating report...', 'info');
        } catch (error) {
            showToast('Failed to generate report', error);
        }
    };

    const getFilteredLoans = () => {
        try {
            switch (filter) {
                case 'Active Loans/Advances':
                    return loans.filter(loan => loan.status === 'Active' && loan.outstandingAmount > 0);
                case 'Closed Loans/Advances':
                    return loans.filter(loan => loan.status === 'Closed' || loan.outstandingAmount === 0);
                case 'Pending Approval':
                    return loans.filter(loan => loan.approvalStatus === 'Pending');
                default:
                    return loans;
            }
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

            <div className="bg-white rounded-lg shadow-sm">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold text-gray-900">
                                Total Loans/Advances Registered ({totalLoans})
                            </h1>
                            <select
                                value={filter}
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {filterOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleAddLoanRedirect}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={16} />
                            Add Loan/Advance
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Employee Name</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Loan Count</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Amount</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total Debit</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Outstanding Amount</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredLoans.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                        No loans/advances found for the selected filter.
                                    </td>
                                </tr>
                            ) : (
                                filteredLoans.map((loan) => (
                                    <tr key={loan.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{loan.employeeName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{loan.loanCount}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">₹{loan.totalAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">₹{loan.totalDebit.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">₹{calculateOutstandingAmount(loan).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${loan.approvalStatus === 'Approved'
                                                ? 'bg-green-100 text-green-800'
                                                : loan.approvalStatus === 'Rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {loan.approvalStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(loan.id)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleGenerateReport(loan.id)}
                                                    className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                                                    title="Generate Report"
                                                >
                                                    <FileText size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(loan.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
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