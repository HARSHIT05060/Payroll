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
    
    // New states for searchable dropdown
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // Show toast notification
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Close toast
    const closeToast = () => {
        setToast(null);
    };

    // Filter employees based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = employees.filter(employee =>
                employee.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.employee_id.toString().includes(searchTerm)
            );
            setFilteredEmployees(filtered);
        } else {
            setFilteredEmployees(employees);
        }
    }, [searchTerm, employees]);

    // Handle employee selection from dropdown
    const handleEmployeeSelect = (employee) => {
        setSelectedEmployee(employee.employee_id);
        setSearchTerm(employee.full_name);
        setIsDropdownOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.employee-dropdown-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                setFilteredEmployees(response.data.data.employee_list || []);

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
                setSearchTerm('');

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
            <div className="min-h-screen bg-[var(--color-bg-primary)]">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-blue-dark)]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Enhanced Header */}
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                                title="Go Back"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <Calendar size={24} className="text-[var(--color-text-white)]" />
                                <div>
                                    <h1 className="text-2xl font-bold text-[var(--color-text-white)]">
                                        {editShiftId ? 'Assign Shift' : 'Assign New Shift'}
                                    </h1>
                                    <p className="text-[var(--color-blue-lighter)] text-sm mt-1">
                                        Select an employee and shift to create assignment
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Enhanced Employee Selection with Searchable Dropdown */}
                    <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg relative z-20">
                        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-[var(--color-text-white)]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Employee Selection</h2>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Choose the employee for shift assignment</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                                <div className="employee-dropdown-container relative">
                                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
                                        <Users className="w-4 h-4 inline mr-2" />
                                        Select Employee <span className="text-[var(--color-error)]">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search employee by name or ID..."
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setIsDropdownOpen(true);
                                                if (!e.target.value) {
                                                    setSelectedEmployee('');
                                                }
                                            }}
                                            onFocus={() => setIsDropdownOpen(true)}
                                            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)] transition-all duration-200 shadow-sm bg-[var(--color-bg-secondary)]"
                                            disabled={loading}
                                            required
                                        />

                                        {isDropdownOpen && filteredEmployees.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 bg-[var(--color-bg-secondary)] border border-slate-300 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto mt-1">
                                                {filteredEmployees.map((employee) => (
                                                    <div
                                                        key={employee.employee_id}
                                                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-200 last:border-b-0 transition-colors"
                                                        onClick={() => handleEmployeeSelect(employee)}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-[var(--color-text-primary)]">
                                                                {employee.full_name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {isDropdownOpen && searchTerm && filteredEmployees.length === 0 && (
                                            <div className="absolute top-full left-0 right-0 bg-[var(--color-bg-secondary)] border border-slate-300 rounded-xl shadow-lg z-50 mt-1">
                                                <div className="p-3 text-[var(--color-text-secondary)] text-center">
                                                    No employees found
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">
                                        Search and select the employee who will be assigned to the shift
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Shift Selection */}
                    <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg relative z-10">
                        <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-[var(--color-bg-primary)] to-[var(--color-bg-secondary)] rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-blue)] to-[var(--color-blue-dark)] rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[var(--color-text-white)]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">Shift Selection</h2>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Configure the shift assignment details</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                                <div>
                                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-3">
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Select Shift <span className="text-[var(--color-error)]">*</span>
                                    </label>
                                    <select
                                        value={selectedShift}
                                        onChange={(e) => setSelectedShift(e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)] transition-all duration-200 shadow-sm bg-[var(--color-bg-secondary)]"
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
                    <div className="bg-[var(--color-bg-secondary)] backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg">
                        <div className="p-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-3 text-[var(--color-text-secondary)] bg-slate-100 border border-slate-300 rounded-xl hover:bg-slate-200 hover:border-slate-400 transition-all duration-200 font-medium"
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
                                        className="px-8 py-3 bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] text-[var(--color-text-white)] rounded-xl hover:from-[var(--color-blue-darker)] hover:to-[var(--color-blue-darkest)] focus:ring-2 focus:ring-[var(--color-blue)] focus:outline-none transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="flex items-center gap-2">
                                            {submitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-[var(--color-border-primary)] rounded-full animate-spin border-t-white"></div>
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