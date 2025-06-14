import { useEffect, useState, useCallback, useMemo } from 'react';
import {
    Pencil,
    FileText,
    ClipboardIcon,
    ChevronDown,
    ChevronUp,
    UserCheck,
    Loader2,
    AlertCircle,
    Users,
    Plus,
    Settings
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';

const SORT_DIRECTIONS = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending'
};

const COLUMN_KEYS = {
    ID: 'id',
    NAME: 'name',
    DEPARTMENT: 'department',
    DESIGNATION: 'designation'
};

const KEY_MAPPING = {
    [COLUMN_KEYS.ID]: 'employee_code',
    [COLUMN_KEYS.NAME]: 'full_name',
    [COLUMN_KEYS.DEPARTMENT]: 'department_name',
    [COLUMN_KEYS.DESIGNATION]: 'designation_name'
};

export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: SORT_DIRECTIONS.ASCENDING
    });
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    // Fetch employees data
    const fetchEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            const response = await api.post('employee_list', formData);

            if (response.data?.success && response.data.data) {
                setEmployees(response.data.data);
            } else if (response.data?.success && response.data.employees) {
                setEmployees(response.data.employees);
            } else if (Array.isArray(response.data)) {
                setEmployees(response.data);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch employees');
            }

        } catch (error) {
            console.error("Fetch employees error:", error);
            const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

            if (error.response?.status === 401) {
                setError("Your session has expired. Please login again.");
                setTimeout(() => logout?.(), 2000);
            } else if (error.response?.status === 403) {
                setError("You don't have permission to view employees.");
            } else if (error.response?.status >= 500) {
                setError("Server error. Please try again later.");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }, [user, logout]);

    useEffect(() => {
        if (isAuthenticated() && user?.user_id) {
            fetchEmployees();
        }
    }, [isAuthenticated, fetchEmployees, user?.user_id]);

    // Sorting functionality
    const requestSort = useCallback((key) => {
        setSortConfig(prevConfig => {
            const direction = prevConfig.key === key && prevConfig.direction === SORT_DIRECTIONS.ASCENDING
                ? SORT_DIRECTIONS.DESCENDING
                : SORT_DIRECTIONS.ASCENDING;
            return { key, direction };
        });
    }, []);

    // Memoized sorted employees
    const sortedEmployees = useMemo(() => {
        if (!sortConfig.key) return employees;

        return [...employees].sort((a, b) => {
            const actualKey = KEY_MAPPING[sortConfig.key] || sortConfig.key;
            const aValue = a[actualKey] || '';
            const bValue = b[actualKey] || '';

            if (aValue < bValue) {
                return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? 1 : -1;
            }
            return 0;
        });
    }, [employees, sortConfig]);

    // Master checkbox state
    const masterCheckboxState = useMemo(() => {
        if (!employees || employees.length === 0) return false;
        return selectedEmployees.length === employees.length;
    }, [selectedEmployees.length, employees]);

    // Checkbox functionality
    const handleSelectAll = useCallback(() => {
        if (!employees || employees.length === 0) return;

        if (masterCheckboxState) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(emp => emp.employee_code || emp.employee_id));
        }
    }, [masterCheckboxState, employees]);

    const handleSelectEmployee = useCallback((employeeId) => {
        setSelectedEmployees(prev => {
            if (prev.includes(employeeId)) {
                return prev.filter(id => id !== employeeId);
            } else {
                return [...prev, employeeId];
            }
        });
    }, []);

    const isSelected = useCallback((employeeId) => {
        return selectedEmployees.includes(employeeId);
    }, [selectedEmployees]);

    // Action handlers
    const handleViewDetails = useCallback((employeeCode) => {
        navigate(`/employee/details/${employeeCode}`);
    }, [navigate]);

    const handleEditEmployee = useCallback((employee_id) => {
        navigate(`/add-employee?edit=${employee_id}`);
    }, [navigate]);


    const handleDuplicate = useCallback((employeeCode) => {
        navigate(`/employee/duplicate/${employeeCode}`);
    }, [navigate]);

    // const handleAssignBranch = useCallback((employeeCode) => {
    //     navigate(`/employee/assign-branch/${employeeCode}`);
    // }, [navigate]);

    // const handleManageMobilePermission = useCallback(() => {
    //     navigate('/employee/mobile-permissions');
    // }, [navigate]);

    const handleBulkAssignBranch = useCallback(() => {
        if (selectedEmployees.length === 0) {
            alert('Please select at least one employee');
            return;
        }
        navigate('/employee/bulk-assign-branch', {
            state: { selectedEmployees }
        });
    }, [selectedEmployees, navigate]);

    // Render sort icon
    const renderSortIcon = useCallback((key) => {
        if (sortConfig.key !== key) {
            return <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />;
        }
        return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ?
            <ChevronUp className="ml-1 h-4 w-4 text-blue-500" /> :
            <ChevronDown className="ml-1 h-4 w-4 text-blue-500" />;
    }, [sortConfig]);


    // Redirect if not authenticated
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow-sm">
                {/* Header section */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Users className="h-6 w-6 text-gray-600 mr-2" />
                            <h1 className="text-xl font-semibold text-gray-900">
                                Employee Management
                            </h1>
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                {employees?.length || 0} {(employees?.length || 0) === 1 ? 'Employee' : 'Employees'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* <button
                                onClick={handleManageMobilePermission}
                                className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <Settings className="h-4 w-4" />
                                Mobile Permissions
                            </button> */}

                            <button
                                onClick={handleBulkAssignBranch}
                                disabled={selectedEmployees.length === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedEmployees.length === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <Users className="h-4 w-4" />
                                Assign Branch
                                {selectedEmployees.length > 0 && (
                                    <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                                        {selectedEmployees.length}
                                    </span>
                                )}
                            </button>

                            <button
                                onClick={() => navigate('/add-employee')}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                Add Employee
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table section */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-3 text-gray-600">Loading employees...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                            <p className="text-red-600 mb-4">{error}</p>
                            <button
                                onClick={fetchEmployees}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="w-12 px-6 py-3">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            checked={masterCheckboxState}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    {[
                                        { key: COLUMN_KEYS.ID, label: 'Employee ID' },
                                        { key: COLUMN_KEYS.NAME, label: 'Name' },
                                        { key: COLUMN_KEYS.DEPARTMENT, label: 'Department' },
                                        { key: COLUMN_KEYS.DESIGNATION, label: 'Designation' }
                                    ].map(({ key, label }) => (
                                        <th key={`header-${key}`} className="px-6 py-3 text-left">
                                            <button
                                                className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                                                onClick={() => requestSort(key)}
                                            >
                                                {label}
                                                {renderSortIcon(key)}
                                            </button>
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Biometrics
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {!sortedEmployees || sortedEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">No employees found</p>
                                            <p className="text-sm">Start by adding your first employee</p>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedEmployees.map((employee, index) => {
                                        const employeeId = employee.employee_code || employee.employee_id || `employee-${index}`;
                                        return (
                                            <tr
                                                key={`emp-${employeeId}`}
                                                className={`hover:bg-gray-50 transition-colors ${isSelected(employeeId) ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        checked={isSelected(employeeId)}
                                                        onChange={() => handleSelectEmployee(employeeId)}
                                                    />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {employee.employee_code || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {employee.full_name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {employee.department_name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {employee.designation_name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {employee.email}
                                                    
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {employee.biometrics_registered ? (
                                                        <div className="flex items-center">
                                                            <UserCheck className="h-4 w-4 text-green-600 mr-2" />
                                                            <span className="text-green-600 font-medium">Registered</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Not Registered</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center gap-2">
                                                        {/* <button
                                                            onClick={() => handleAssignBranch(employeeId)}
                                                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                                                        >
                                                            Assign Branch
                                                        </button> */}
                                                        <button
                                                            onClick={() => handleEditEmployee(employee.employee_id)}
                                                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                            title="Edit Employee"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleViewDetails(employeeId)}
                                                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDuplicate(employeeId)}
                                                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                                            title="Duplicate Employee"
                                                        >
                                                            <ClipboardIcon className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}