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
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Loan Installment Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-2 text-blue-600">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading installment details...</span>
                            </div>
                        </div>
                    ) : loanDetails && loanDetails.length > 0 ? (
                        <>
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-blue-600">Total Installments</h3>
                                    <p className="text-2xl font-bold text-blue-900">{loanDetails.length}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-green-600">Paid Installments</h3>
                                    <p className="text-2xl font-bold text-green-900">{getPaidInstallments()}</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-yellow-600">Pending Installments</h3>
                                    <p className="text-2xl font-bold text-yellow-900">{getPendingInstallments()}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-medium text-purple-600">Total Amount</h3>
                                    <p className="text-2xl font-bold text-purple-900">
                                        ₹{calculateTotalAmount().toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>

                            {/* Installments Table */}
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">Installment Schedule</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    #
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Payment Date
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Installment Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {loanDetails.map((installment, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {installment.payment_date}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No installment details found</h3>
                            <p className="text-gray-500">There are no installment records for this loan.</p>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};