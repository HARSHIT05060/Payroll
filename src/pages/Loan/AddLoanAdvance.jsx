import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Calendar, User, DollarSign, Percent, Clock, FileText, CheckCircle, Users, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import api from '../../api/axiosInstance'; // Adjust path as needed

// Toast Component
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

const AddLoanAdvance = ({
    existingLoan = null,
    onSave = () => { },
}) => {
    const [formData, setFormData] = useState({
        employeeName: '',
        employeeId: '',
        loanType: 'Loan',
        amount: '',
        interestRate: '',
        tenure: '',
        reason: '',
        approvalStatus: 'Pending',
        disbursementDate: '',
        repaymentStartDate: '',
        installmentAmount: '',
        guarantorName: '',
        guarantorContact: '',
        documents: [],
        priority: 'Normal'
    });
    const { user } = useAuth();
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState(null);

    // Toast function
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    // Fetch employee dropdown data
    const fetchDropdownData = async () => {
        try {
            setLoading(true);

            if (!user?.user_id) {
                return;
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            const response = await api.post('assign_shift_list_drop_down', formData);

            if (response.data.success) {
                setEmployees(response.data.data.employee_list || []);
            } else {
                showToast(response.data.message || 'Failed to fetch employee data', 'error');
            }
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
            showToast('Failed to load employee data. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (api && user) {
            fetchDropdownData();
        }
    }, [user, api]);

    // Pre-fill form if editing existing loan
    useEffect(() => {
        if (existingLoan) {
            setFormData({
                employeeName: existingLoan.employeeName || '',
                employeeId: existingLoan.employeeId || '',
                loanType: existingLoan.loanType || 'Loan',
                amount: existingLoan.totalAmount?.toString() || '',
                interestRate: existingLoan.interestRate?.toString() || '',
                tenure: existingLoan.tenure?.toString() || '',
                reason: existingLoan.reason || '',
                approvalStatus: existingLoan.approvalStatus || 'Pending',
                disbursementDate: existingLoan.disbursementDate || '',
                repaymentStartDate: existingLoan.repaymentStartDate || '',
                installmentAmount: existingLoan.installmentAmount?.toString() || '',
                guarantorName: existingLoan.guarantorName || '',
                guarantorContact: existingLoan.guarantorContact || '',
                documents: existingLoan.documents || [],
                priority: existingLoan.priority || 'Normal'
            });

            // Set selected employee if editing
            if (existingLoan.employeeId) {
                setSelectedEmployee(existingLoan.employeeId);
            }
        }
    }, [existingLoan]);

    // Handle employee selection
    const handleEmployeeSelect = (e) => {
        const employeeId = e.target.value;
        setSelectedEmployee(employeeId);

        if (employeeId) {
            const selectedEmp = employees.find(emp => emp.employee_id === employeeId);
            if (selectedEmp) {
                setFormData(prev => ({
                    ...prev,
                    employeeName: selectedEmp.full_name,
                    employeeId: selectedEmp.employee_id
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                employeeName: '',
                employeeId: ''
            }));
        }

        // Clear error when user selects an employee
        if (errors.employeeName) {
            setErrors(prev => ({
                ...prev,
                employeeName: ''
            }));
        }
    };

    // Calculate installment amount when amount, interest rate, or tenure changes
    useEffect(() => {
        if (formData.amount && formData.interestRate && formData.tenure) {
            const principal = parseFloat(formData.amount);
            const rate = parseFloat(formData.interestRate) / 100 / 12; // Monthly rate
            const months = parseInt(formData.tenure);

            if (rate > 0) {
                const installment = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
                setFormData(prev => ({
                    ...prev,
                    installmentAmount: installment.toFixed(2)
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    installmentAmount: (principal / months).toFixed(2)
                }));
            }
        }
    }, [formData.amount, formData.interestRate, formData.tenure]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBack = () => {
        navigate('/loans');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.employeeName.trim()) {
            newErrors.employeeName = 'Employee selection is required';
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = 'Valid amount is required';
        }

        if (formData.loanType === 'Loan') {
            if (!formData.interestRate || parseFloat(formData.interestRate) < 0) {
                newErrors.interestRate = 'Interest rate is required for loans';
            }

            if (!formData.tenure || parseInt(formData.tenure) <= 0) {
                newErrors.tenure = 'Tenure is required for loans';
            }
        }

        if (!formData.reason.trim()) {
            newErrors.reason = 'Reason is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            showToast('Please fix the validation errors before submitting', 'error');
            return;
        }

        setIsSubmitting(true);

        try {
            const loanData = {
                ...formData,
                amount: parseFloat(formData.amount),
                interestRate: parseFloat(formData.interestRate) || 0,
                tenure: parseInt(formData.tenure) || 0,
                installmentAmount: parseFloat(formData.installmentAmount) || 0,
                id: existingLoan?.id || Date.now(),
                createdDate: existingLoan?.createdDate || new Date().toISOString().split('T')[0],
                updatedDate: new Date().toISOString().split('T')[0]
            };

            await onSave(loanData);
            showToast(
                `Loan/Advance ${existingLoan ? 'updated' : 'created'} successfully!`,
                'success'
            );
        } catch (error) {
            console.error('Error saving loan:', error);
            showToast('Failed to save loan/advance. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setFormData({
            employeeName: '',
            employeeId: '',
            loanType: 'Loan',
            amount: '',
            interestRate: '',
            tenure: '',
            reason: '',
            approvalStatus: 'Pending',
            disbursementDate: '',
            repaymentStartDate: '',
            installmentAmount: '',
            guarantorName: '',
            guarantorContact: '',
            documents: [],
            priority: 'Normal'
        });
        setSelectedEmployee('');
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Go Back"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    {existingLoan ? 'Edit Loan/Advance' : 'Add New Loan/Advance'}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {existingLoan ? 'Update existing loan/advance details' : 'Fill in the details to create a new loan/advance'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleReset}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <X size={16} className="inline mr-1" />
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="p-6">
                        <div className="space-y-8">
                            {/* Employee Information */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <User size={20} className="text-blue-600" />
                                    Employee Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Users className="w-4 h-4 inline mr-2" />
                                            Select Employee *
                                        </label>
                                        <select
                                            value={selectedEmployee}
                                            onChange={handleEmployeeSelect}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.employeeName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            disabled={loading}
                                        >
                                            <option value="">
                                                {loading ? 'Loading employees...' : 'Choose an employee...'}
                                            </option>
                                            {employees.map((employee) => (
                                                <option key={employee.employee_id} value={employee.employee_id}>
                                                    {employee.full_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.employeeName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Loan Details */}
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <DollarSign size={20} className="text-green-600" />
                                    Loan/Advance Details
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type *
                                        </label>
                                        <select
                                            name="loanType"
                                            value={formData.loanType}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Loan">Loan</option>
                                            <option value="Advance">Advance</option>
                                            <option value="Emergency Loan">Emergency Loan</option>
                                            <option value="Personal Loan">Personal Loan</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount *
                                        </label>
                                        <input
                                            type="number"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleInputChange}
                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            min="0"
                                            step="0.01"
                                            placeholder="Enter amount"
                                        />
                                        {errors.amount && (
                                            <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priority
                                        </label>
                                        <select
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Normal">Normal</option>
                                            <option value="High">High</option>
                                            <option value="Urgent">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                {formData.loanType === 'Loan' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                                <Percent size={16} />
                                                Interest Rate (%) *
                                            </label>
                                            <input
                                                type="number"
                                                name="interestRate"
                                                value={formData.interestRate}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.interestRate ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                min="0"
                                                step="0.01"
                                                placeholder="Enter interest rate"
                                            />
                                            {errors.interestRate && (
                                                <p className="text-red-500 text-xs mt-1">{errors.interestRate}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                                                <Clock size={16} />
                                                Tenure (Months) *
                                            </label>
                                            <input
                                                type="number"
                                                name="tenure"
                                                value={formData.tenure}
                                                onChange={handleInputChange}
                                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tenure ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                                min="1"
                                                placeholder="Enter tenure"
                                            />
                                            {errors.tenure && (
                                                <p className="text-red-500 text-xs mt-1">{errors.tenure}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Monthly Installment
                                            </label>
                                            <input
                                                type="number"
                                                name="installmentAmount"
                                                value={formData.installmentAmount}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dates and Status */}
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar size={20} className="text-purple-600" />
                                    Dates & Status
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Approval Status
                                        </label>
                                        <select
                                            name="approvalStatus"
                                            value={formData.approvalStatus}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Under Review">Under Review</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Disbursement Date
                                        </label>
                                        <input
                                            type="date"
                                            name="disbursementDate"
                                            value={formData.disbursementDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Repayment Start Date
                                        </label>
                                        <input
                                            type="date"
                                            name="repaymentStartDate"
                                            value={formData.repaymentStartDate}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Guarantor Information */}
                            <div className="bg-orange-50 p-4 rounded-lg">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <CheckCircle size={20} className="text-orange-600" />
                                    Guarantor Information (Optional)
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Guarantor Name
                                        </label>
                                        <input
                                            type="text"
                                            name="guarantorName"
                                            value={formData.guarantorName}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter guarantor name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Guarantor Contact
                                        </label>
                                        <input
                                            type="text"
                                            name="guarantorContact"
                                            value={formData.guarantorContact}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Enter contact number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <FileText size={20} className="text-gray-600" />
                                    Additional Details
                                </h2>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reason *
                                    </label>
                                    <textarea
                                        name="reason"
                                        value={formData.reason}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.reason ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter detailed reason for loan/advance request"
                                    />
                                    {errors.reason && (
                                        <p className="text-red-500 text-xs mt-1">{errors.reason}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Save size={16} />
                                {isSubmitting ? 'Saving...' : (existingLoan ? 'Update' : 'Save')} Loan/Advance
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};

export default AddLoanAdvance;