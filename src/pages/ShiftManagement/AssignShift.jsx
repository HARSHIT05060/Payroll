import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Calendar, CheckCircle, AlertCircle, Info, X, Save } from 'lucide-react';
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Enhanced Header */}
                <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm"
                                title="Go Back"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <Calendar size={24} className="text-white" />
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        {editShiftId ? 'Assign Shift' : 'Assign New Shift'}
                                    </h1>
                                    <p className="text-blue-100 text-sm mt-1">
                                        Select an employee and shift to create assignment
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Enhanced Employee Selection */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
                        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Employee Selection</h2>
                                    <p className="text-sm text-slate-600">Choose the employee for shift assignment</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        <Users className="w-4 h-4 inline mr-2" />
                                        Select Employee <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedEmployee}
                                        onChange={(e) => setSelectedEmployee(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white"
                                        disabled={loading}
                                        required
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
                                    <p className="text-xs text-slate-500 mt-2">
                                        Select the employee who will be assigned to the shift
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Shift Selection */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
                        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Shift Selection</h2>
                                    <p className="text-sm text-slate-600">Configure the shift assignment details</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Select Shift <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={selectedShift}
                                        onChange={(e) => setSelectedShift(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm bg-white"
                                        disabled={loading}
                                        required
                                    >
                                        <option value="">
                                            {loading ? 'Loading shifts...' : 'Choose a shift...'}
                                        </option>
                                        {shifts.map((shift) => (
                                            <option key={shift.shift_id} value={shift.shift_id}>
                                                {shift.shift_name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Select the shift schedule for this assignment
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
                        <div className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-3 text-slate-600 bg-slate-100 border border-slate-300 rounded-xl hover:bg-slate-200 hover:border-slate-400 transition-all duration-200 font-medium"
                                        disabled={submitting}
                                    >
                                        <div className="flex items-center gap-2">
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </div>
                                    </button>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={submitting || !selectedEmployee || !selectedShift}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center gap-2">
                                            {submitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 rounded-full animate-spin border-t-white"></div>
                                                    Assigning...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    Assign Shift
                                                </>
                                            )}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
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
        </div>
    );
};

export default AssignShift;