import { useState, useEffect } from 'react';
import { Calendar, Users, Edit, Trash2, Plus, X, CheckCircle, ArrowLeft, Info, Search, RefreshCw, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed
import api from '../../api/axiosInstance'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toast } from '../../Components/ui/Toast';
import { ConfirmDialog } from '../../Components/ui/ConfirmDialog';
import Pagination from '../../Components/Pagination';

// Day Status Legend Component
const DayStatusLegend = () => {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Day Status Legend</h3>
            <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm text-gray-600 font-medium">W</span>
                    </div>
                    <span className="text-sm text-gray-600">Week Off</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-500">
                    </div>
                    <span className="text-sm text-gray-600">Occasional Working</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-sm text-white font-medium">D</span>
                    </div>
                    <span className="text-sm text-gray-600">Working Day</span>
                </div>
            </div>
        </div>
    );
};

const ShiftManagement = () => {
    const { user } = useAuth();
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
    const navigate = useNavigate();
    const [employeeModal, setEmployeeModal] = useState({ isOpen: false, employees: [], loading: false, shiftName: '' });
    const [employeeCounts, setEmployeeCounts] = useState({});
    const permissions = useSelector(state => state.permissions) || {};

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalShifts, setTotalShifts] = useState(0);

    // Search functionality with debounce
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            // Reset to first page when searching
            if (searchQuery !== '') {
                setCurrentPage(1);
                fetchShifts(1, searchQuery);
            } else {
                // If search is cleared, fetch normal data
                fetchShifts(currentPage, '');
            }
        }, 500); // Increased debounce time for backend search

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    // Fetch assigned employees for a shift
    const fetchAssignedEmployees = async (shiftId, shiftName) => {
        try {
            setEmployeeModal({ isOpen: true, employees: [], loading: true, shiftName });

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('shift_id', shiftId);

            const response = await api.post('assign_employee_list', formData);

            if (response.data.success) {
                const employees = response.data.data || [];
                setEmployeeModal({
                    isOpen: true,
                    employees: employees,
                    loading: false,
                    shiftName
                });

                // Update the count as well
                setEmployeeCounts(prev => ({
                    ...prev,
                    [shiftId]: employees.length
                }));
            } else {
                showToast(response.data.message || 'Failed to fetch assigned employees', 'error');
                setEmployeeModal({ isOpen: false, employees: [], loading: false, shiftName: '' });
            }
        } catch (error) {
            console.error('Error fetching assigned employees:', error);
            showToast('Failed to load assigned employees. Please try again.', 'error');
            setEmployeeModal({ isOpen: false, employees: [], loading: false, shiftName: '' });
        }
    };

    // Employee Modal Component
    const EmployeeModal = ({ isOpen, onClose, employees, loading, shiftName }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-96">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Assigned Employees - {shiftName}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : employees.length > 0 ? (
                            <div className="max-h-64 overflow-y-auto">
                                <div className="space-y-2">
                                    {employees.map((employee, index) => (
                                        <div key={employee.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {employee.full_name?.charAt(0)?.toUpperCase() || 'E'}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {employee.full_name || 'Unknown Employee'}
                                                </p>
                                                {employee.employee_id && (
                                                    <p className="text-sm text-gray-600">
                                                        ID: {employee.employee_id}
                                                    </p>
                                                )}
                                                {employee.cdate && (
                                                    <p className="text-sm text-gray-500">
                                                        Assigned: {employee.cdate}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">No employees assigned to this shift</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Show toast notification
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Close toast
    const closeToast = () => {
        setToast(null);
    };

    // Get day color and styling based on shift_type
    const getDayStyles = (shiftType) => {
        switch (shiftType) {
            case "1":
                return 'bg-blue-500 text-white'; // Working Day - Blue background with white text
            case "2":
                return 'bg-gray-300 text-gray-600'; // Week Off - Gray background
            case "3":
                return 'bg-white border-2 border-blue-500 text-blue-500'; // Occasional - White background with blue border, no text
            default:
                return 'bg-gray-300 text-gray-600';
        }
    };

    // Check if day should show text (only for working days and week off)
    const shouldShowDayText = (shiftType) => {
        return shiftType === "1" || shiftType === "2";
    };

    // Get day status text
    const getDayStatusText = (shiftType) => {
        switch (shiftType) {
            case "1":
                return 'Working Day';
            case "2":
                return 'Week Off';
            case "3":
                return 'Occasional Working';
            default:
                return 'Week Off';
        }
    };

    // Fetch employee count for a shift
    const fetchEmployeeCount = async (shiftId) => {
        try {
            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('shift_id', shiftId);

            const response = await api.post('assign_employee_list', formData);

            if (response.data.success) {
                const count = response.data.data ? response.data.data.length : 0;
                setEmployeeCounts(prev => ({
                    ...prev,
                    [shiftId]: count
                }));
            }
        } catch (error) {
            console.error('Error fetching employee count:', error);
            setEmployeeCounts(prev => ({
                ...prev,
                [shiftId]: 0
            }));
        }
    };

    // Fetch shifts from API with pagination and search
    const fetchShifts = async (page = 1, search = '') => {
        try {
            // Set appropriate loading state
            if (search !== '') {
                setSearchLoading(true);
            } else {
                setLoading(true);
            }
            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('page', page.toString());

            // Add search parameter if search query exists
            if (search && search.trim() !== '') {
                formData.append('search', search.trim());
            }

            const response = await api.post('shift_list', formData);

            if (response.data.success) {
                const shiftsData = response.data.data || [];
                setShifts(shiftsData);

                // Set pagination data from response
                const paginationData = response.data.pagination || {};
                setTotalPages(paginationData.total_pages || 1);
                setTotalShifts(paginationData.total_records || shiftsData.length);
                setCurrentPage(paginationData.current_page || page);

                // Fetch employee counts for each shift
                shiftsData.forEach(shift => {
                    fetchEmployeeCount(shift.shift_id);
                });
            } else {
                throw new Error(response.data.message || 'Failed to fetch shifts');
            }
        } catch (error) {
            console.error('Error fetching shifts:', error);
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
            } else if (error.response?.status === 403) {
                setError("You don't have permission to view shifts.");
            } else if (error.response?.status >= 500) {
                setError("Server error. Please try again later.");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchShifts(page, searchQuery);
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
        fetchShifts(1, '');
    };

    useEffect(() => {
        fetchShifts(currentPage);
    }, [user]);

    // Handle edit shift
    const handleEditShift = (shiftId) => {
        navigate(`/add-shift?edit=${shiftId}`);
    };

    // Handle delete shift 
    const handleDeleteShift = async (shiftId, shiftName) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Shift',
            message: `Are you sure you want to delete the shift "${shiftName}"? This action cannot be undone.`,
            confirmText: 'Delete',
            type: 'danger',
            onConfirm: async () => {
                try {
                    // Show loading state
                    setConfirmDialog({ isOpen: false });

                    const formData = new FormData();
                    formData.append('user_id', user.user_id);
                    formData.append('shift_id', shiftId);

                    const response = await api.post('shift_delete', formData);

                    if (response.data.success) {
                        showToast('Shift deleted successfully', 'success');

                        // Refresh the current page or go to previous page if current page becomes empty
                        const pageToLoad = shifts.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
                        fetchShifts(pageToLoad, searchQuery);
                    } else {
                        showToast(response.data.message || 'Failed to delete shift', 'error');
                    }
                } catch (error) {
                    console.error('Error deleting shift:', error);
                    showToast('An error occurred while deleting the shift', 'error');
                }
            }
        });
    };

    // Handle assign shift
    const handleAssignShift = () => {
        navigate('/assign-shift');
    };

    // Handle create shift
    const handleCreateShift = () => {
        navigate('/add-shift');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className=" p-6 max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        Shift Management
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-blue-600 overflow-hidden shadow-sm">
                    {/* Header section */}
                    <div className="px-6 py-4 border-b border-blue-200 bg-blue-600">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Calendar className="h-6 w-6 text-white mr-2" />
                                <h3 className="text-lg font-medium text-white">
                                    Available Shifts ({totalShifts})
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search shifts..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white text-sm"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                    {searchLoading && (
                                        <div className="absolute right-3 top-2.5">
                                            <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                {permissions['shift_assign'] &&
                                    <button
                                        onClick={handleAssignShift}
                                        className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        <Users className="h-4 w-4" />
                                        Assign Shift
                                    </button>
                                }
                                {permissions['shift_create'] &&
                                    <button
                                        onClick={handleCreateShift}
                                        className="flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Create Shift
                                    </button>
                                }
                            </div>
                        </div>
                    </div>

                    {/* Day Status Legend */}
                    <div className="p-6 pb-0">
                        <DayStatusLegend />
                    </div>

                    {/* Content section */}
                    {loading ? (
                        <div className="px-6 py-12 text-center">
                            <div className="inline-flex items-center space-x-2 text-gray-500">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span>Loading shifts...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <p className="text-red-700 text-lg font-medium mb-2">Error Loading Shifts</p>
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={() => fetchShifts(currentPage, searchQuery)}
                                    className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Try Again</span>
                                </button>
                            </div>
                        </div>
                    ) : shifts.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-700 text-lg font-medium mb-2">No Shifts Found</p>
                                <p className="text-gray-500 text-sm mb-4">
                                    {searchQuery ? 'No shifts match your search criteria.' : 'You haven\'t created any shifts yet. Create your first shift to get started with shift management.'}
                                </p>
                                {permissions['shift_create'] && !searchQuery && (
                                    <button
                                        onClick={handleCreateShift}
                                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Create First Shift</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Shift Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Shift Days
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assigned Employees
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created On
                                        </th>
                                        {(permissions?.shift_edit || permissions?.shift_delete) && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {shifts.map((shift) => (
                                        <tr key={shift.shift_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <span>{shift.shift_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {shift.shift_days.map((day) => (
                                                        <div key={day.day_id} className="relative group">
                                                            <span
                                                                className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium cursor-help ${getDayStyles(day.shift_type)}`}
                                                            >
                                                                {shouldShowDayText(day.shift_type) ? day.sort_name : (day.sort_name)}
                                                            </span>
                                                            {/* Tooltip */}
                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                                                {getDayStatusText(day.shift_type)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <button
                                                    onClick={() => fetchAssignedEmployees(shift.shift_id, shift.shift_name)}
                                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                                                >
                                                    <span className="font-medium text-lg">
                                                        {employeeCounts[shift.shift_id] || 0}
                                                    </span>
                                                    <Users className="w-4 h-4" />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {shift.created_date}
                                            </td>
                                            {(permissions?.shift_edit || permissions?.shift_delete) && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {permissions['shift_edit'] && (
                                                            <button
                                                                onClick={() => handleEditShift(shift.shift_id, shift.shift_name)}
                                                                className="p-2 rounded-md transition-colors text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                                                                title="Edit Shift"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                        {permissions['shift_delete'] && (
                                                            <button
                                                                onClick={() => handleDeleteShift(shift.shift_id, shift.shift_name)}
                                                                className="p-2 rounded-md transition-colors text-red-600 hover:text-red-900 hover:bg-red-50"
                                                                title="Delete Shift"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Component */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            loading={loading}
                        />
                    )}
                </div>

                {/* Employee Modal */}
                <EmployeeModal
                    isOpen={employeeModal.isOpen}
                    onClose={() => setEmployeeModal({ isOpen: false, employees: [], loading: false, shiftName: '' })}
                    employees={employeeModal.employees}
                    loading={employeeModal.loading}
                    shiftName={employeeModal.shiftName}
                />

                {/* Toast Notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={closeToast}
                    />
                )}

                {/* Confirm Dialog */}
                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    onClose={() => setConfirmDialog({ isOpen: false })}
                    onConfirm={confirmDialog.onConfirm}
                    title={confirmDialog.title}
                    message={confirmDialog.message}
                    confirmText={confirmDialog.confirmText}
                    type={confirmDialog.type}
                />
            </div>
        </div>
    );
};

export default ShiftManagement;