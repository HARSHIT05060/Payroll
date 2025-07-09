import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import {
    Calendar,
    Users,
    Building,
    Award,
    User,
    Search,
    FileText,
    Download,
    ArrowLeft,
    Filter,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Clock,
    BarChart3,
    Loader2,
    ChevronDown,
    X,
    FileDown,
    Eye,
    TrendingUp,
    Activity
} from 'lucide-react';

// Import your export functions (you'll need to create these files)
import { exportToPDF } from '../../utils/exportUtils/pdfExportMonthly';
// import { exportToCSV } from '../../utils/exportToCSV';
// import { exportToExcel } from '../../utils/exportToExcel';

// Mock export functions for demonstration
const exportToCSV = (data, filename) => {
    console.log('Exporting to CSV:', { data, filename });
    // Your CSV export logic here
};

const exportToExcel = (data, filename) => {
    console.log('Exporting to Excel:', { data, filename });
    // Your Excel export logic here
};

// Searchable Dropdown Component
const SearchableDropdown = ({
    options,
    value,
    onChange,
    placeholder,
    disabled,
    displayKey = 'name',
    valueKey = 'id',
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(option => option[valueKey] === value);
    const displayText = selectedOption ? selectedOption[displayKey] : '';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
    };

    const handleClear = () => {
        onChange('');
        setSearchTerm('');
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div
                className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent text-gray-900 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && setIsOpen(true)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        {isOpen ? (
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent outline-none"
                                placeholder={placeholder}
                                autoFocus
                            />
                        ) : (
                            <span className={displayText ? 'text-gray-900' : 'text-gray-500'}>
                                {displayText || placeholder}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {value && !disabled && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClear();
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        )}
                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                            No options found
                        </div>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <div
                                key={option[valueKey]}
                                className={`px-3 py-2 cursor-pointer text-sm transition-colors ${index === highlightedIndex
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleSelect(option)}
                            >
                                {option[displayKey]}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'present':
                return { color: 'bg-green-100 text-green-800', icon: CheckCircle };
            case 'absent':
                return { color: 'bg-red-100 text-red-800', icon: AlertCircle };
            case 'late':
                return { color: 'bg-yellow-100 text-yellow-800', icon: Clock };
            default:
                return { color: 'bg-gray-100 text-gray-800', icon: Activity };
        }
    };

    const config = getStatusConfig(status);
    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
            <IconComponent className="h-3 w-3" />
            {status}
        </span>
    );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon: Icon, color, percentage }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                {percentage && (
                    <p className="text-xs text-gray-500 mt-1">
                        {percentage}% of total days
                    </p>
                )}
            </div>
            {Icon && (
                <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
            )}
        </div>
    </div>
);

const MonthlyReport = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Filter states
    const [filters, setFilters] = useState({
        branch_id: '',
        department_id: '',
        designation_id: '',
        employee_id: '',
        month_year: new Date().toISOString().slice(0, 7)
    });

    // Dropdown data states
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [dropdownLoading, setDropdownLoading] = useState(false);
    const [reportGenerating, setReportGenerating] = useState(false);

    // Report data
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    // Calculate summary statistics
    const calculateSummaryStats = (data) => {
        if (!data || data.length === 0) return null;

        const totalDays = data.length;
        const presentDays = data.filter(item => item.status?.toLowerCase() === 'present').length;
        const absentDays = data.filter(item => item.status?.toLowerCase() === 'absent').length;
        const lateDays = data.filter(item => parseFloat(item.late_hours || 0) > 0).length;
        const overtimeDays = data.filter(item => parseFloat(item.overtime_hours || 0) > 0).length;

        const totalWorkingHours = data.reduce((sum, item) => sum + parseFloat(item.attandance_hours || 0), 0);
        const totalOvertimeHours = data.reduce((sum, item) => sum + parseFloat(item.overtime_hours || 0), 0);
        const totalLateHours = data.reduce((sum, item) => sum + parseFloat(item.late_hours || 0), 0);

        return {
            totalDays,
            presentDays,
            absentDays,
            lateDays,
            overtimeDays,
            totalWorkingHours: totalWorkingHours.toFixed(2),
            totalOvertimeHours: totalOvertimeHours.toFixed(2),
            totalLateHours: totalLateHours.toFixed(2),
            attendancePercentage: ((presentDays / totalDays) * 100).toFixed(1)
        };
    };

    // Fetch dropdown data
    const fetchDropdownData = useCallback(async () => {
        try {
            setDropdownLoading(true);
            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            if (filters.branch_id) formData.append('branch_id', filters.branch_id);
            if (filters.department_id) formData.append('department_id', filters.department_id);
            if (filters.designation_id) formData.append('designation_id', filters.designation_id);

            const response = await api.post('report_employee_list_drop_down', formData);

            if (response.data?.success && response.data.data) {
                const data = response.data.data;
                setBranches(data.branches || []);
                setDepartments(data.departments || []);
                setDesignations(data.designations || []);

                const employeeList = data.employee_list || [];
                const formattedEmployees = employeeList.map(emp => ({
                    id: emp.employee_id,
                    name: `${emp.full_name} (${emp.employee_id})`
                }));
                setEmployees(formattedEmployees);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch dropdown data');
            }
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
            setError(err.message || 'Failed to load filter options');
        } finally {
            setDropdownLoading(false);
        }
    }, [user?.user_id, filters.branch_id, filters.department_id, filters.designation_id]);

    // Generate monthly report
    const generateReport = useCallback(async () => {
        try {
            setReportGenerating(true);
            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            if (!filters.employee_id) {
                throw new Error('Please select an employee');
            }

            if (!filters.month_year) {
                throw new Error('Please select a month and year');
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('month_year', filters.month_year);
            formData.append('employee_id', filters.employee_id);

            const response = await api.post('monthly_attendance_report_list', formData);

            if (response.data?.success && response.data.data) {
                setReportData(response.data.data);
                setCurrentPage(1); // Reset to first page
            } else {
                throw new Error(response.data?.message || 'Failed to generate report');
            }
        } catch (err) {
            console.error('Error generating report:', err);
            setError(err.message || 'Failed to generate report');
        } finally {
            setReportGenerating(false);
        }
    }, [user?.user_id, filters.month_year, filters.employee_id]);

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));

        // Reset dependent filters
        if (filterName === 'branch_id') {
            setFilters(prev => ({
                ...prev,
                department_id: '',
                designation_id: '',
                employee_id: ''
            }));
        } else if (filterName === 'department_id') {
            setFilters(prev => ({
                ...prev,
                designation_id: '',
                employee_id: ''
            }));
        } else if (filterName === 'designation_id') {
            setFilters(prev => ({
                ...prev,
                employee_id: ''
            }));
        }
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            branch_id: '',
            department_id: '',
            designation_id: '',
            employee_id: '',
            month_year: new Date().toISOString().slice(0, 7)
        });
        setReportData(null);
        setError(null);
    };

    // Export functions
    const handleExportPDF = () => {
        if (!reportData) return;

        const summaryStats = calculateSummaryStats(reportData);
        const selectedEmployee = employees.find(emp => emp.id === filters.employee_id);
        const title = `Monthly Attendance Report - ${selectedEmployee?.name || 'Employee'} (${filters.month_year})`;

        exportToPDF(reportData, `attendance_report_${filters.month_year}.pdf`, title, summaryStats);
    };

    const handleExportCSV = () => {
        if (!reportData) return;
        exportToCSV(reportData, `attendance_report_${filters.month_year}.csv`);
    };

    const handleExportExcel = () => {
        if (!reportData) return;
        exportToExcel(reportData, `attendance_report_${filters.month_year}.xlsx`);
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reportData?.slice(indexOfFirstItem, indexOfLastItem) || [];
    const totalPages = Math.ceil((reportData?.length || 0) / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    const summaryStats = calculateSummaryStats(reportData);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-white hover:text-gray-100 transition-colors bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <BarChart3 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        Monthly Attendance Report
                                    </h1>
                                    <p className="text-white/80 text-sm">
                                        Generate detailed monthly attendance reports for employees
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Filter className="h-5 w-5 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Report Filters</h2>
                        <button
                            onClick={resetFilters}
                            className="ml-auto flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reset
                        </button>
                    </div>

                    {dropdownLoading && (
                        <div className="flex items-center gap-2 mb-4 text-gray-600">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading filter options...</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Month Year Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                Month & Year *
                            </label>
                            <input
                                type="month"
                                value={filters.month_year}
                                onChange={(e) => handleFilterChange('month_year', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                required
                            />
                        </div>

                        {/* Branch Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Building className="inline h-4 w-4 mr-1" />
                                Branch
                            </label>
                            <select
                                value={filters.branch_id}
                                onChange={(e) => handleFilterChange('branch_id', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Branches</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Users className="inline h-4 w-4 mr-1" />
                                Department
                            </label>
                            <select
                                value={filters.department_id}
                                onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Departments</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Designation Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Award className="inline h-4 w-4 mr-1" />
                                Designation
                            </label>
                            <select
                                value={filters.designation_id}
                                onChange={(e) => handleFilterChange('designation_id', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Designations</option>
                                {designations.map((designation) => (
                                    <option key={designation.id} value={designation.id}>
                                        {designation.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Employee Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <User className="inline h-4 w-4 mr-1" />
                                Employee *
                            </label>
                            <SearchableDropdown
                                options={employees}
                                value={filters.employee_id}
                                onChange={(value) => handleFilterChange('employee_id', value)}
                                placeholder="Search and select employee..."
                                disabled={dropdownLoading}
                                displayKey="name"
                                valueKey="id"
                            />
                        </div>

                        {/* Generate Report Button */}
                        <div className="flex items-end">
                            <button
                                onClick={generateReport}
                                disabled={reportGenerating || !filters.employee_id || !filters.month_year}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {reportGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <FileText className="h-4 w-4" />
                                )}
                                {reportGenerating ? 'Generating...' : 'Generate Report'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <span className="text-red-700 font-medium">Error</span>
                        </div>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Summary Statistics */}
                {summaryStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <SummaryCard
                            title="Total Days"
                            value={summaryStats.totalDays}
                            icon={Calendar}
                            color="text-blue-600"
                        />
                        <SummaryCard
                            title="Present Days"
                            value={summaryStats.presentDays}
                            icon={CheckCircle}
                            color="text-green-600"
                            percentage={summaryStats.attendancePercentage}
                        />
                        <SummaryCard
                            title="Absent Days"
                            value={summaryStats.absentDays}
                            icon={AlertCircle}
                            color="text-red-600"
                        />
                        <SummaryCard
                            title="Working Hours"
                            value={summaryStats.totalWorkingHours}
                            icon={Clock}
                            color="text-purple-600"
                        />
                    </div>
                )}

                {/* Report Results */}
                {reportData && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Monthly Attendance Report
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        {reportData.length} records found for {filters.month_year}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleExportPDF}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                    <FileDown className="h-4 w-4" />
                                    PDF
                                </button>
                                <button
                                    onClick={handleExportCSV}
                                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                    <FileDown className="h-4 w-4" />
                                    CSV
                                </button>
                                <button
                                    onClick={handleExportExcel}
                                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                >
                                    <FileDown className="h-4 w-4" />
                                    Excel
                                </button>
                            </div>
                        </div>

                        {/* Attendance Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">S.No</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Employee</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Shift</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Shift Time</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Clock In</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Clock Out</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Working Hours</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Overtime</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Late Hours</th>
                                        <th className="border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((record, index) => (
                                        <tr key={record.sno} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">{record.sno}</td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                <div>
                                                    <div className="font-medium">{record.employee_name}</div>
                                                </div>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                <div>
                                                    <div className="font-medium">{record.shift_name}</div>
                                                </div>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                <div className="text-xs">
                                                    <div>{record.shift_from_time} - {record.shift_to_time}</div>
                                                </div>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                <span className={`px-2 py-1 rounded text-xs ${record.attandance_first_clock_in
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {record.attandance_first_clock_in || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                <span className={`px-2 py-1 rounded text-xs ${record.attandance_last_clock_out
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {record.attandance_last_clock_out || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                <span className="font-medium">{record.attandance_hours}h</span>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                <span className={`px-2 py-1 rounded text-xs ${parseFloat(record.overtime_hours) > 0
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {record.overtime_hours}h
                                                </span>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                <span className={`px-2 py-1 rounded text-xs ${parseFloat(record.late_hours) > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {record.late_hours}h
                                                </span>
                                            </td>
                                            <td className="border border-gray-200 px-4 py-3 text-sm text-gray-900">
                                                <StatusBadge status={record.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">
                                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, reportData.length)} of {reportData.length} entries
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1 rounded-lg transition-colors ${currentPage === pageNum
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* No Data Message */}
                {!reportData && !reportGenerating && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="p-3 bg-gray-50 rounded-full w-16 h-16 mx-auto mb-4">
                            <FileText className="h-10 w-10 text-gray-400 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Report Generated</h3>
                        <p className="text-gray-600 mb-6">
                            Please select an employee and month to generate the attendance report.
                        </p>
                        <button
                            onClick={generateReport}
                            disabled={!filters.employee_id || !filters.month_year}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
                        >
                            <BarChart3 className="h-5 w-5" />
                            Generate Report
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};



export default MonthlyReport;