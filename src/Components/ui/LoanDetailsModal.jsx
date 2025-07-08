import { X, FileText } from 'lucide-react';

export const LoanDetailsModal = ({ isOpen, onClose, loanDetails, loading }) => {
    if (!isOpen) return null;

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'overdue':
                return 'bg-[var(--color-error-light)] text-red-800';
            default:
                return 'bg-[var(--color-bg-gradient-start)] text-gray-800';
        }
    };

    const calculateTotalAmount = () => {
        if (!loanDetails || loanDetails.length === 0) return 0;
        return loanDetails.reduce((total, installment) => {
            return total + parseFloat(installment.installment_amount || 0);
        }, 0);
    };

    const getPaidInstallments = () => {
        if (!loanDetails) return 0;
        return loanDetails.filter(installment =>
            installment.payment_status?.toLowerCase() === 'paid'
        ).length;
    };

    const getPendingInstallments = () => {
        if (!loanDetails) return 0;
        return loanDetails.filter(installment =>
            installment.payment_status?.toLowerCase() === 'pending'
        ).length;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--color-border-primary)] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-[var(--color-border-primary)] flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                        Loan Installment Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] p-1"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-2 text-[var(--color-blue-dark)]">
                                <div className="w-6 h-6 border-2 border-[var(--color-blue-dark)] border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading installment details...</span>
                            </div>
                        </div>
                    ) : loanDetails && loanDetails.length > 0 ? (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-[var(--color-blue-lightest)] p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-[var(--color-blue-dark)]">Total Installments</h3>
                                    <p className="text-2xl font-bold text-[var(--color-blue-darkest)]">{loanDetails.length}</p>
                                </div>
                                <div className="bg-[var(--color-success-light)] p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-[var(--color-success-dark)]">Paid Installments</h3>
                                    <p className="text-2xl font-bold text-[var(--color-success-dark)]">{getPaidInstallments()}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-yellow-600">Pending Installments</h3>
                                    <p className="text-2xl font-bold text-yellow-900">{getPendingInstallments()}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-[var(--color-blue-dark)]">Total Amount</h3>
                                    <p className="text-2xl font-bold text-purple-900">
                                        ₹{calculateTotalAmount().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>

                            {/* Installments Table */}
                            <div className="bg-[var(--color-border-primary)] border border-[var(--color-border-primary)] rounded-lg overflow-hidden">
                                <div className="px-4 py-3 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)]">
                                    <h3 className="text-lg font-medium text-[var(--color-text-primary)]">Installment Schedule</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[var(--color-bg-primary)]">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    #
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    Payment Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    Installment Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-[var(--color-border-primary)] divide-y divide-[var(--color-border-divider)]">
                                            {loanDetails.map((installment, index) => (
                                                <tr key={index} className="hover:bg-[var(--color-bg-primary)]">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[var(--color-text-primary)]">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                        {installment.payment_date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                        ₹{parseFloat(installment.installment_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(installment.payment_status)}`}>
                                                            {installment.payment_status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <FileText className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No installment details found</h3>
                            <p className="text-[var(--color-text-secondary)]">There are no installment records for this loan.</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-[var(--color-border-primary)] flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-bg-gradient-start)] hover:bg-[var(--color-bg-gray-light)] rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};