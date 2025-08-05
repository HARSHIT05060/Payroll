import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { Calendar, Users, Building, Award, User, XCircle, CalendarX, FileText, Download, ArrowLeft, Filter, RefreshCw, AlertCircle, CheckCircle, Clock, BarChart3, Loader2, ChevronDown, FileDown, FileSpreadsheet, Coffee } from 'lucide-react';
import { SearchableDropdown, StatusBadge, SummaryCard } from '../../Components/Report/ReportComponents';
import Pagination from '../../Components/Pagination';
import { Toast } from '../../Components/ui/Toast';
import { exportMonthlyReportToPDF } from '../../utils/exportUtils/MonthlyReport/pdfExportMonthly';
import { exportToExcel } from '../../utils/exportUtils/MonthlyReport/excelExportMonthly';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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

    // Toast state
    const [toast, setToast] = useState(null);

    // Pagination states - simplified
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Fixed items per page
    const [exportDropdown, setExportDropdown] = useState(false);

    // Refs for dropdown positioning
    const buttonRef = useRef(null);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 });

    // Toast helper function
    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    // Update button position when export dropdown is opened
    useEffect(() => {
        if (exportDropdown && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setButtonPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [exportDropdown]);

    // Enhanced summary statistics calculation based on shift data
    const calculateSummaryStats = (data) => {
        if (!data || data.length === 0) return null;

        const totalDays = data.length;

        // Calculate working days based on shift_status
        const workingDays = data.filter(item =>
            item.shift_status?.toLowerCase() === 'working day'
        ).length;

        const weekoffDays = data.filter(item => {
            const shiftStatus = item.shift_status?.toLowerCase() || '';
            const status = item.status?.toLowerCase() || '';
            return shiftStatus === 'week off' || status === 'week off' || status === 'weekoff';
        }).length;

        // Calculate attendance stats
        const presentDays = data.filter(item => item.status?.toLowerCase() === 'present').length;
        const absentDays = data.filter(item => item.status?.toLowerCase() === 'absent').length;
        const holidayDays = data.filter(item => item.status?.toLowerCase() === 'holiday').length;
        const leaveDays = data.filter(item => item.status?.toLowerCase() === 'leave').length;
        const halfDayDays = data.filter(item => item.status?.toLowerCase() === 'half day').length;
        const lateDays = data.filter(item => parseFloat(item.late_hours || 0) > 0).length;
        const overtimeDays = data.filter(item => parseFloat(item.overtime_hours || 0) > 0).length;

        // Calculate hours
        const totalWorkingHours = data.reduce((sum, item) => sum + parseFloat(item.attandance_hours || 0), 0);
        const totalOvertimeHours = data.reduce((sum, item) => sum + parseFloat(item.overtime_hours || 0), 0);
        const totalLateHours = data.reduce((sum, item) => sum + parseFloat(item.late_hours || 0), 0);

        // Calculate attendance percentage based on working days only
        const attendancePercentage = workingDays > 0 ? ((presentDays + halfDayDays) / workingDays * 100).toFixed(1) : '0.0';

        return {
            totalDays,
            workingDays, // Days marked as "Working Day" in shift_status
            weekoffDays, // Days marked as "Week off" in shift_status
            presentDays,
            absentDays,
            holidayDays,
            leaveDays,
            halfDayDays,
            lateDays,
            overtimeDays,
            totalWorkingHours: totalWorkingHours.toFixed(2),
            totalOvertimeHours: totalOvertimeHours.toFixed(2),
            totalLateHours: totalLateHours.toFixed(2),
            attendancePercentage
        };
    };

    // Fetch dropdown data for branches, departments, and designations
    const fetchDropdownData = useCallback(async () => {
        try {
            setDropdownLoading(true);
            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            const response = await api.post('employee_drop_down_list', formData);

            if (response.data?.success && response.data.data) {
                const data = response.data.data;

                // Format branches
                const formattedBranches = (data.branch_list || []).map(branch => ({
                    id: branch.branch_id,
                    name: branch.name
                }));
                setBranches(formattedBranches);

                // Format departments
                const formattedDepartments = (data.department_list || []).map(dept => ({
                    id: dept.department_id,
                    name: dept.name
                }));
                setDepartments(formattedDepartments);

                // Format designations
                const formattedDesignations = (data.designation_list || []).map(desig => ({
                    id: desig.designation_id,
                    name: desig.name
                }));
                setDesignations(formattedDesignations);

            } else {
                throw new Error(response.data?.message || 'Failed to fetch dropdown data');
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to load filter options';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setDropdownLoading(false);
        }
    }, [user?.user_id]);

    // Fetch employees based on selected filters
    const fetchEmployees = useCallback(async () => {
        try {
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
                const employeeList = data.employee_list || [];
                const formattedEmployees = employeeList.map(emp => ({
                    id: emp.employee_id,
                    name: `${emp.full_name} - EMP_ID: ${emp.employee_id}`
                }));

                setEmployees(formattedEmployees);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch employees');
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to load employees';
            setError(errorMessage);
            showToast(errorMessage, 'error');
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
                showToast('Report generated successfully!', 'success');
            } else {
                throw new Error(response.data?.message || 'Failed to generate report');
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to generate report';
            setError(errorMessage);
            showToast(errorMessage, 'error');
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
        setCurrentPage(1);
        showToast('Filters reset successfully', 'success');
    };

    // Updated handleExportPDF function for the Monthly Report component
    const handleExportPDF = () => {
        if (!reportData) {
            showToast('No data available to export', 'error');
            return;
        }

        try {
            const summaryStats = calculateSummaryStats(reportData);
            const selectedEmployee = employees.find(emp => emp.id === filters.employee_id);

            // Extract employee name from the dropdown format
            const employeeName = selectedEmployee?.name || 'Unknown Employee';
            const cleanEmployeeName = employeeName.split(' - EMP_ID:')[0]; // Remove EMP_ID part for display

            let title = '';

            if (filters.month_year) {
                const [year, month] = filters.month_year.split('-'); // e.g., "2025-07"
                if (year && month) {
                    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                    const monthIndex = parseInt(month, 10) - 1;
                    const formatted = `${monthNames[monthIndex]} , ${year}`;
                    title = `MONTHLY REPORT ${formatted}`;
                } else {
                    title = "MONTHLY REPORT - INVALID DATE";
                }
            } else {
                title = "MONTHLY REPORT - DATE MISSING";
            }

            // Prepare employee info
            const employeeInfo = {
                name: cleanEmployeeName,
                id: filters.employee_id
            };

            // Prepare filter info with better formatting
            const filterInfo = {
                'Month/Year': filters.month_year ? new Date(filters.month_year + '-01').toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long'
                }) : 'N/A',
                'Employee': cleanEmployeeName,
                'Employee ID': filters.employee_id,
                'Branch': filters.branch_id ? branches.find(b => b.id === filters.branch_id)?.name || filters.branch_id : 'All Branches',
                'Department': filters.department_id ? departments.find(d => d.id === filters.department_id)?.name || filters.department_id : 'All Departments',
                'Designation': filters.designation_id ? designations.find(d => d.id === filters.designation_id)?.name || filters.designation_id : 'All Designations'
            };

            const result = exportMonthlyReportToPDF(
                reportData,
                `attendance_report_${cleanEmployeeName.replace(/\s+/g, '_')}_${filters.month_year}.pdf`,
                title,
                summaryStats,
                filterInfo,
                employeeInfo
            );

            if (result.success) {
                showToast('PDF exported successfully!', 'success');
            } else {
                throw new Error(result.message || 'Failed to export PDF');
            }
        } catch (err) {
            showToast(err.message || 'Failed to export PDF', 'error');
        }
        setExportDropdown(false);
    };

    const handleExportExcel = () => {
        if (!reportData) {
            showToast('No data available to export', 'error');
            return;
        }

        try {
            exportToExcel(reportData, 'report', {
                showTitle: true,
                showSummary: true,
                showEmployeeDetails: true,
                reportTitle: 'Monthly Attendance Report'
            });
            showToast('Excel exported successfully!', 'success');
        } catch (error) {
            showToast('Failed to export Excel', error);
        }
        setExportDropdown(false);
    };

    // Get row styling based on status
    const getRowStyling = (status) => {
        const statusLower = status?.toLowerCase() || '';

        switch (statusLower) {
            case 'week off':
            case 'weekoff':
                return 'bg-[var(--color-blue-lightest)] border-l-4 border-[var(--color-blue-light)]';
            case 'holiday':
                return 'bg-[var(--color-warning-light)] border-l-4 border-[var(--color-warning)]';
            case 'absent':
                return 'bg-[var(--color-error-light)] border-l-4 border-[var(--color-error)]';
            case 'leave':
                return 'bg-[var(--color-yellow-light)] border-l-4 border-[var(--color-yellow-dark)]';
            case 'half day':
                return 'bg-[var(--color-blue-lighter)] border-l-4 border-[var(--color-blue-dark)]';
            default:
                return '';
        }
    };


    // Pagination logic
    const totalItems = reportData?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reportData?.slice(indexOfFirstItem, indexOfLastItem) || [];

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Initial load of dropdown data
    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    // Fetch employees when filters change
    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Reset page when report data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [reportData]);

    const summaryStats = calculateSummaryStats(reportData);

    // Get selected month for display
    const selectedMonth = filters.month_year ? new Date(filters.month_year + '-01') : new Date();

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/reports')}
                                    className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                                >
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h1 className="text-2xl font-bold text-[var(--color-text-white)]">
                                            Monthly Attendance Report
                                        </h1>
                                        <p className="text-[var(--color-text-white)] opacity-90 mt-1">
                                            {selectedMonth.toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onClick={() => setExportDropdown(!exportDropdown)}
                                        className="flex items-center gap-2 bg-[var(--color-bg-secondary)] text-[var(--color-blue-dark)] hover:bg-[var(--color-bg-primary)] px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        <Download className="h-4 w-4" />
                                        Export
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    {/* Portal Dropdown */}
                                    {exportDropdown && createPortal(
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setExportDropdown(false)}
                                            />
                                            <div
                                                className="fixed z-50 bg-[var(--color-bg-secondary)] rounded-lg shadow-2xl border border-[var(--color-border-secondary)] py-2 min-w-48"
                                                style={{
                                                    top: buttonPosition.top + 10,
                                                    left: buttonPosition.left + buttonPosition.width - 192, // 192px = w-48
                                                }}
                                            >
                                                <button
                                                    onClick={handleExportExcel}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
                                                >
                                                    <FileSpreadsheet className="h-4 w-4 text-[var(--color-blue)]" />
                                                    Export to Excel
                                                </button>
                                                <button
                                                    onClick={handleExportPDF}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
                                                >
                                                    <FileDown className="h-4 w-4 text-[var(--color-error)]" />
                                                    Export to PDF
                                                </button>
                                            </div>
                                        </>,
                                        document.body
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[var(--color-blue-lightest)] rounded-lg">
                            <Filter className="h-5 w-5 text-[var(--color-blue-dark)]" />
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Report Filters</h2>
                        <button
                            onClick={resetFilters}
                            className="ml-auto flex items-center gap-2 px-3 py-1 bg-[var(--color-bg-gray-light)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reset
                        </button>
                    </div>

                    {dropdownLoading && (
                        <div className="flex items-center gap-2 mb-4 text-[var(--color-text-secondary)]">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading filter options...</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Month Year Filter */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                Month & Year *
                            </label>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-[var(--color-text-primary)]" />
                                <DatePicker
                                    selected={filters.month_year}
                                    onChange={(date) => handleFilterChange('month_year', date)}
                                    dateFormat="MMMM yyyy"
                                    showMonthYearPicker
                                    showFullMonthYearPicker
                                    className="month-picker-input"
                                    placeholderText="Select month and year"
                                    maxDate={new Date()}
                                    showPopperArrow={false}
                                />
                            </div>
                        </div>

                        {/* Branch Filter */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <Building className="inline h-4 w-4 mr-1" />
                                Branch
                            </label>
                            <select
                                value={filters.branch_id}
                                onChange={(e) => handleFilterChange('branch_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent text-[var(--color-text-primary)]"
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
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <Users className="inline h-4 w-4 mr-1" />
                                Department
                            </label>
                            <select
                                value={filters.department_id}
                                onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent text-[var(--color-text-primary)]"
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
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <Award className="inline h-4 w-4 mr-1" />
                                Designation
                            </label>
                            <select
                                value={filters.designation_id}
                                onChange={(e) => handleFilterChange('designation_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent text-[var(--color-text-primary)]"
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
                            <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                <User className="inline h-4 w-4 mr-1" />
                                Employee  <span className="text-[var(--color-error)]">*</span>
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
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-blue-darker)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* Enhanced Summary Statistics */}
                {summaryStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Total Days</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{summaryStats.totalDays}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-[var(--color-blue)]" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Working Days</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{summaryStats.workingDays}</p>
                                </div>
                                <Clock className="h-8 w-8 text-[var(--color-blue-darker)]" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Present Days</p>
                                    <p className="text-2xl font-bold text-[var(--color-success)]">{summaryStats.presentDays}</p>
                                    {summaryStats.attendancePercentage && (
                                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                            {summaryStats.attendancePercentage}%
                                        </p>
                                    )}
                                </div>
                                <CheckCircle className="h-8 w-8 text-[var(--color-success)]" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Absent Days</p>
                                    <p className="text-2xl font-bold text-[var(--color-error)]">{summaryStats.absentDays}</p>
                                </div>
                                <XCircle className="h-8 w-8 text-[var(--color-error)]" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Week Offs</p>
                                    <p className="text-2xl font-bold text-[var(--color-blue-dark)]">{summaryStats.weekoffDays}</p>
                                </div>
                                <CalendarX className="h-8 w-8 text-[var(--color-blue-dark)]" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Working Hours</p>
                                    <p className="text-2xl font-bold text-[var(--color-blue-darker)]">{summaryStats.totalWorkingHours}</p>
                                </div>
                                <Clock className="h-8 w-8 text-[var(--color-blue-darker)]" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Results */}
                {reportData && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <CheckCircle className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                                    <h3 className="text-lg font-medium text-[var(--color-text-white)]">
                                        Monthly Attendance Details
                                    </h3>
                                </div>

                                <div className="flex items-center gap-3">
                                    <p className="text-[var(--color-text-white)] text-sm">
                                        {reportData.length} records found for {filters.month_year}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Legend */}
                        <div className="mb-6 p-4 bg-[var(--color-bg-primary)] rounded-lg">
                            <h4 className="text-sm font-medium text-[var(--color-text-primary)] mb-3">Status Legend:</h4>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[var(--color-success-light)] border border-[var(--color-success-lighter)] rounded"></div>
                                    <span className="text-sm text-[var(--color-text-secondary)]">Present</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[var(--color-error-light)] border border-[var(--color-error-lighter)] rounded"></div>
                                    <span className="text-sm text-[var(--color-text-secondary)]">Absent</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[var(--color-blue-lightest)] border border-[var(--color-blue-lighter)] rounded"></div>
                                    <span className="text-sm text-[var(--color-text-secondary)]">Weekoff</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[var(--color-warning-light)] border border-[var(--color-warning-lighter)] rounded"></div>
                                    <span className="text-sm text-[var(--color-text-secondary)]">Holiday</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[var(--color-yellow-light)] border border-[var(--color-yellow)] rounded"></div>
                                    <span className="text-sm text-[var(--color-text-secondary)]">Leave</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-[var(--color-blue-lightest)] border border-[var(--color-blue-lighter)] rounded"></div>
                                    <span className="text-sm text-[var(--color-text-secondary)]">Half Day</span>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] text-sm">
                                <thead className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-secondary)]">
                                    <tr>
                                        {['Date', 'Day', 'Status', 'Check In', 'Check Out', 'Working Hours', 'Late Hours', 'Overtime'].map((heading) => (
                                            <th
                                                key={heading}
                                                className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-secondary)]">
                                    {currentItems.map((item, index) => (
                                        <tr
                                            key={index}
                                            className={`hover:bg-[var(--color-bg-hover)] transition-colors ${getRowStyling(item.status)}`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text-primary)]">
                                                {new Date(item.date).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text-primary)]">
                                                {new Date(item.date).toLocaleDateString('en-GB', {
                                                    weekday: 'short'
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text-primary)]">
                                                {item.attandance_first_clock_in || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text-primary)]">
                                                {item.attandance_last_clock_out || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-[var(--color-text-primary)]">
                                                {item.attandance_hours ? `${parseFloat(item.attandance_hours).toFixed(2)}h` : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.late_hours && parseFloat(item.late_hours) > 0 ? (
                                                    <span className="text-[var(--color-error)] font-medium">
                                                        {parseFloat(item.late_hours).toFixed(2)}h
                                                    </span>
                                                ) : (
                                                    <span className="text-[var(--color-text-primary)]">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.overtime_hours && parseFloat(item.overtime_hours) > 0 ? (
                                                    <span className="text-[var(--color-success)] font-medium">
                                                        {parseFloat(item.overtime_hours).toFixed(2)}h
                                                    </span>
                                                ) : (
                                                    <span className="text-[var(--color-text-primary)]">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>


                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            loading={reportGenerating}
                        />
                    </div>
                )}

                {/* No Data Message */}
                {!reportData && !reportGenerating && !error && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-[var(--color-bg-primary)] rounded-full mb-4">
                                <BarChart3 className="h-8 w-8 text-[var(--color-text-muted)]" />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No Report Generated</h3>
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                Select an employee and generate a report to view monthly attendance data.
                            </p>
                            <div className="text-sm text-[var(--color-text-secondary)]">
                                <p>• Choose a month and year</p>
                                <p>• Select an employee from the dropdown</p>
                                <p>• Click "Generate Report" to view attendance details</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {reportGenerating && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-[var(--color-blue-lightest)] rounded-full mb-4">
                                <Loader2 className="h-8 w-8 text-[var(--color-blue)] animate-spin" />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Generating Report</h3>
                            <p className="text-[var(--color-text-secondary)]">
                                Please wait while we prepare your monthly attendance report...
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {/* Toast Component */}
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

export default MonthlyReport;