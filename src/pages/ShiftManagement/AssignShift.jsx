import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Calendar, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import api from '../../api/axiosInstance'; // Adjust path as needed
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Toast } from '../../Components/ui/Toast';

const AssignShift = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editShiftId = searchParams.get('edit');

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedShift, setSelectedShift] = useState('');

    // Show toast notification
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Close toast
    const closeToast = () => {
        setToast(null);
    };

    // Fetch dropdown data
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
                setShifts(response.data.data.shift_list || []);

                // If editing, pre-select the shift
                if (editShiftId) {
                    setSelectedShift(editShiftId);
                }
            } else {
                showToast(response.data.message || 'Failed to fetch dropdown data', 'error');
            }
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
            showToast('Failed to load dropdown data. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDropdownData();
    }, [user]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedEmployee || !selectedShift) {
            showToast('Please select both employee and shift', 'error');
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('employee_id', selectedEmployee);
            formData.append('shift_id', selectedShift);

            const response = await api.post('assign_shift_employee', formData);

            if (response.data.success) {
                showToast('Shift assigned successfully', 'success');

                // Reset form
                setSelectedEmployee('');
                setSelectedShift('');

                // Optionally navigate back after a delay
                setTimeout(() => {
                    navigate('/shift-management');
                }, 2000);
            } else {
                showToast(response.data.message || 'Failed to assign shift', 'error');
            }
        } catch (error) {
            console.error('Error assigning shift:', error);
            showToast('An error occurred while assigning shift', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate('/shift-management');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Shift Management
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {editShiftId ? 'Assign Shift' : 'Assign New Shift'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Select an employee and shift to create assignment
                    </p>
                </div>

                {/* Assignment Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Employee Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="w-4 h-4 inline mr-2" />
                                Select Employee
                            </label>
                            <select
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Choose an employee...</option>
                                {employees.map((employee) => (
                                    <option key={employee.employee_id} value={employee.employee_id}>
                                        {employee.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Shift Dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Select Shift
                            </label>
                            <select
                                value={selectedShift}
                                onChange={(e) => setSelectedShift(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Choose a shift...</option>
                                {shifts.map((shift) => (
                                    <option key={shift.shift_id} value={shift.shift_id}>
                                        {shift.shift_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || !selectedEmployee || !selectedShift}
                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                            >
                                {submitting ? 'Assigning...' : 'Assign Shift'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}
        </div>
    );
};

export default AssignShift; 