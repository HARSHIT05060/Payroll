import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    Users,
    TrendingUp,
    Download,
    Search,
    RefreshCw,
    ArrowLeft,
    Eye,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
    User,
    Timer,
    Activity,
    FileText,
    FileSpreadsheet,
    FileDown,
    ChevronDown,
    CalendarX
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { createPortal } from 'react-dom';
import { exportToExcel } from '../../utils/exportUtils/DailyReport/excelExport';
import { exportToPDF } from '../../utils/exportUtils/DailyReport/pdfExport';
import { Toast } from '../../Components/ui/Toast'; // Adjust path as needed
import { StatusBadge } from '../../Components/Report/ReportComponents';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "../../Components/Loader/LoadingSpinner"



const DailyReport = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [exportDropdown, setExportDropdown] = useState(false);
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();
    const { user } = useAuth();
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
    const buttonRef = useRef(null);

    // Toast helper functions
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };
    const closeToast = () => {
        setToast(null);
    };

    useEffect(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setButtonPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
                height: rect.height
            });
        }
    }, [exportDropdown]);

    const formatDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);

    };

    // Fetch daily attendance report
    const fetchDailyReport = useCallback(async (date) => {
        if (!user?.user_id) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('date', date);

            const response = await api.post('daily_attendance_report_list', formData);

            if (response.data?.success && response.data.data) {
                setAttendanceData(response.data.data);
            } else {
                throw new Error(response.data?.message || 'Failed to fetch daily report');
            }
        } catch (err) {
            const errorMessage = err.message || 'An error occurred while fetching the report';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }, [user?.user_id]);

    // Initial load and date change
    useEffect(() => {
        fetchDailyReport(formatDate(selectedDate));
    }, [selectedDate]);

    // Filter and search logic
    const filteredData = useMemo(() => {
        return attendanceData.filter(employee => {
            const matchesSearch = employee.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee.employee_code?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesFilter = filterStatus === 'all' ||
                (filterStatus === 'present' && employee.status === 'Present') ||
                (filterStatus === 'absent' && employee.status !== 'Present' && employee.status !== 'Week Off') ||
                (filterStatus === 'weekoff' && employee.status === 'Week Off') ||
                (filterStatus === 'late' && parseFloat(employee.late_hours || 0) > 0) ||
                (filterStatus === 'overtime' && parseFloat(employee.overtime_hours || 0) > 0);

            return matchesSearch && matchesFilter;
        });
    }, [attendanceData, searchQuery, filterStatus]);

    // Calculate summary stats
    const summaryStats = useMemo(() => {
        const total = attendanceData.length;
        const present = attendanceData.filter(emp => emp.status === 'Present').length;
        const weekOff = attendanceData.filter(emp => emp.status === 'Week Off').length;
        const absent = attendanceData.filter(emp => emp.status !== 'Present' && emp.status !== 'Week Off').length;
        const late = attendanceData.filter(emp => parseFloat(emp.late_hours || 0) > 0).length;
        const overtime = attendanceData.filter(emp => parseFloat(emp.overtime_hours || 0) > 0).length;

        return { total, present, absent, weekOff, late, overtime };
    }, [attendanceData]);

    const getTimeColor = (employee) => {
        const isLate = parseFloat(employee.late_hours || 0) > 0;
        const hasOvertime = parseFloat(employee.overtime_hours || 0) > 0;
        const isWeekOff = employee.status === 'Week Off';

        if (isWeekOff) {
            return 'text-[var(--color-text-blue)] font-medium';
        }
        if (isLate) {
            return 'text-[var(--color-warning-dark)] font-medium';
        }
        if (hasOvertime) {
            return 'text-[var(--color-blue-dark)] font-medium';
        }
        return 'text-[var(--color-text-primary)]';
    };

    // Format time
    const formatTime = (time) => {
        if (!time) return '--';
        return time;
    };

    // Handle employee details view
    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

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

    const handleExportToExcel = useCallback(() => {
        try {
            if (!filteredData || filteredData.length === 0) {
                showToast('No data available to export', 'error');
                return;
            }

            // Transform the data for Excel export
            const exportData = filteredData.map(emp => ({
                'S.No': emp.sno,
                'Employee Name': emp.employee_name,
                'Employee Code': emp.employee_code || '',
                'Shift': emp.shift_name,
                'Shift Time': `${emp.shift_from_time} - ${emp.shift_to_time}`,
                'Clock In': emp.attandance_first_clock_in || '--',
                'Clock Out': emp.attandance_last_clock_out || '--',
                'Working Hours': `${emp.shift_working_hours}h`,
                'Attendance Hours': `${emp.attandance_hours}h`,
                'Overtime Hours': emp.overtime_hours && parseFloat(emp.overtime_hours) > 0 ? `${emp.overtime_hours}h` : '--',
                'Late Hours': emp.late_hours && parseFloat(emp.late_hours) > 0 ? `${emp.late_hours}h` : '--',
                'Status': emp.status === 'Present' ? 'Present' : emp.status === 'Week Off' ? 'Week Off' : 'Absent'
            }));

            // Generate filename with selected date
            const fileName = `daily_attendance_report_${selectedDate}`;

            // Export to Excel
            exportToExcel(exportData, selectedDate, fileName);

            showToast('Excel exported successfully!', 'success');
            setExportDropdown(false);

        } catch (error) {
            console.error('Error in handleExportToExcel:', error);
            showToast('Failed to export Excel: ' + error.message, 'error');
            setExportDropdown(false);
        }
    }, [filteredData, selectedDate]);

    const handleExportToPDF = useCallback(() => {
        try {
            const exportData = filteredData.map(emp => ({
                'S.No': emp.sno,
                'Employee Name': emp.employee_name,
                'Employee Code': emp.employee_code || '',
                'Shift': emp.shift_name,
                'Shift Time': `${emp.shift_from_time} - ${emp.shift_to_time}`,
                'Clock In': emp.attandance_first_clock_in || '--',
                'Clock Out': emp.attandance_last_clock_out || '--',
                'Working Hours': `${emp.shift_working_hours}h`,
                'Attendance Hours': `${emp.attandance_hours}h`,
                'Overtime Hours': emp.overtime_hours && parseFloat(emp.overtime_hours) > 0 ? `${emp.overtime_hours}h` : '--',
                'Late Hours': emp.late_hours && parseFloat(emp.late_hours) > 0 ? `${emp.late_hours}h` : '--',
                'Status': emp.status === 'Present' ? 'Present' : emp.status === 'Week Off' ? 'Week Off' : 'Absent'
            }));

            const fileName = `daily_attendance_report_${selectedDate}`;
            const title = `Daily Attendance Report - ${new Date(selectedDate).toLocaleDateString('en-GB')}`;
            exportToPDF(exportData, fileName, title);
            showToast('PDF exported successfully', 'success');
            setExportDropdown(false);
        } catch (err) {
            showToast('Failed to export PDF', err);
        }
    }, [filteredData, selectedDate]);

    // Clear search
    const handleClearSearch = useCallback(() => {
        setSearchQuery('');
    }, []);

    // Handle retry
    const handleRetry = () => {
        setError(null);
        fetchDailyReport(selectedDate);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Toast Component */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}
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
                                            Daily Attendance Report
                                        </h1>
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
                                                    onClick={() => {
                                                        handleExportToExcel();
                                                        setExportDropdown(false);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
                                                >
                                                    <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                                                    Export to Excel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleExportToPDF();
                                                        setExportDropdown(false);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
                                                >
                                                    <FileDown className="h-4 w-4 text-red-600" />
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

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Total Employees</p>
                                <p className="text-2xl font-bold text-[var(--color-text-primary)]">{summaryStats.total}</p>
                            </div>
                            <Users className="h-8 w-8 text-[var(--color-blue-dark)]" />
                        </div>
                    </div>
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Present</p>
                                <p className="text-2xl font-bold text-green-600">{summaryStats.present}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Absent</p>
                                <p className="text-2xl font-bold text-red-600">{summaryStats.absent}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Week Off</p>
                                <p className="text-2xl font-bold text-purple-600">{summaryStats.weekOff}</p>
                            </div>
                            <CalendarX className="h-8 w-8 text-purple-600" />
                        </div>
                    </div>
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Late Arrivals</p>
                                <p className="text-2xl font-bold text-yellow-600">{summaryStats.late}</p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-yellow-600" />
                        </div>
                    </div>
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Overtime</p>
                                <p className="text-2xl font-bold text-blue-600">{summaryStats.overtime}</p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-blue-dark)] overflow-hidden shadow-sm">
                    {/* Header section */}
                    <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <Activity className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                                <h3 className="text-lg font-medium text-[var(--color-text-white)]">
                                    Daily Attendance Details
                                </h3>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-5 h-5 text-[var(--color-text-white)]" />
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date) => handleDateChange(date)}
                                        dateFormat="dd-MM-yyyy"
                                        placeholderText="DD-MM-YYYY"
                                        className="w-full bg-[var(--color-bg-secondary-20)] border border-[var(--color-bg-secondary-30)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-white)] placeholder-[var(--color-text-white-90)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bg-secondary-30)]"
                                    />
                                </div>

                                <div className="relative w-full sm:w-64">
                                    <input
                                        type="text"
                                        placeholder="Search employees..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-10 py-2 border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-text-white)] focus:border-[var(--color-border-primary)] text-sm"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[var(--color-text-muted)]" />
                                    {searchQuery && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="absolute right-3 top-2.5 h-4 w-4 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-text-white)] focus:border-[var(--color-border-primary)] text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="present">Present</option>
                                    <option value="absent">Absent</option>
                                    <option value="weekoff">Week Off</option>
                                    <option value="late">Late</option>
                                    <option value="overtime">Overtime</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="">
                            <LoadingSpinner />
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-[var(--color-error-light)] border border-[var(--color-border-error)] rounded-lg p-6">
                                <XCircle className="w-12 h-12 text-[var(--color-error)] mx-auto mb-4" />
                                <p className="text-[var(--color-error-dark)] text-lg font-medium mb-2">Error Loading Report</p>
                                <p className="text-[var(--color-text-error)] mb-4">{error}</p>
                                <button
                                    onClick={handleRetry}
                                    className="inline-flex items-center space-x-2 bg-[var(--color-error-light)] text-[var(--color-error-dark)] px-4 py-2 rounded-md hover:bg-[var(--color-error-lighter)] transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>Try Again</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    {!loading && !error && (
                        <>
                            {filteredData.length === 0 ? (
                                <div className="px-6 py-12 text-center">
                                    <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg p-8">
                                        <div className="w-16 h-16 bg-[var(--color-bg-gray-light)] rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Users className="w-8 h-8 text-[var(--color-text-muted)]" />
                                        </div>
                                        <p className="text-[var(--color-text-secondary)] text-lg font-medium mb-2">
                                            {searchQuery ? 'No employees found' : 'No Attendance Data'}
                                        </p>
                                        <p className="text-[var(--color-text-secondary)] text-sm mb-4">
                                            {searchQuery
                                                ? `No employees match your search "${searchQuery}". Try different search terms.`
                                                : 'No attendance data available for the selected date.'
                                            }
                                        </p>
                                        {searchQuery && (
                                            <button
                                                onClick={handleClearSearch}
                                                className="inline-flex items-center space-x-2 bg-[var(--color-bg-gradient-start)] text-[var(--color-text-secondary)] px-4 py-2 rounded-md hover:bg-[var(--color-bg-gray-light)] transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                <span>Clear Search</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full divide-y divide-[var(--color-border-divider)]">
                                        <thead className="bg-[var(--color-blue-lightest)]">
                                            <tr>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">S.No</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Employee</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Shift</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Shift Time</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Clock In</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Clock Out</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Working Hours</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Attendance Hours</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Status</th>
                                                <th className="text-center py-3 px-4 text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-divider)]">
                                            {filteredData.map((employee, index) => {
                                                const timeColorClass = getTimeColor(employee);
                                                return (
                                                    <tr
                                                        key={index}
                                                        className={`hover:bg-[var(--color-bg-hover)] transition-colors ${getRowStyling(employee.status)}`}
                                                    >
                                                        <td className="text-center py-4 px-4 text-sm text-[var(--color-text-primary)]">{employee.sno}</td>
                                                        <td className="text-center py-4 px-4 text-sm font-medium text-[var(--color-text-primary)]">{employee.employee_name}</td>
                                                        <td className="text-center py-4 px-4 text-sm text-[var(--color-text-primary)]">{employee.shift_name}</td>
                                                        <td className="text-center py-4 px-4 text-sm text-[var(--color-text-primary)]">
                                                            {employee.shift_from_time} - {employee.shift_to_time}
                                                        </td>
                                                        <td className={`text-center py-4 px-4 text-sm ${timeColorClass}`}>
                                                            {formatTime(employee.attandance_first_clock_in)}
                                                        </td>
                                                        <td className={`text-center py-4 px-4 text-sm ${timeColorClass}`}>
                                                            {formatTime(employee.attandance_last_clock_out)}
                                                        </td>
                                                        <td className="text-center py-4 px-4 text-sm text-[var(--color-text-primary)]">{employee.shift_working_hours}h</td>
                                                        <td className="text-center py-4 px-4 text-sm text-[var(--color-text-primary)]">{employee.attandance_hours}h</td>
                                                        <td className="py-4 px-4">
                                                            <StatusBadge status={employee.status} />
                                                        </td>
                                                        <td className="py-4 px-4 text-center">
                                                            <button
                                                                onClick={() => handleViewDetails(employee)}
                                                                className="inline-flex items-center space-x-1 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] px-3 py-1 rounded-md hover:bg-[var(--color-blue-darker)] transition-colors text-sm"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                <span>View</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {/* Summary at bottom */}
                <div className="px-6 py-4 border-t border-[var(--color-border-divider)] bg-[var(--color-bg-primary)]">
                    <div className="flex justify-end items-center text-sm text-[var(--color-text-secondary)]">
                        <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                Present ({summaryStats.present})
                            </span>
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                Absent ({summaryStats.absent})
                            </span>
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                Late ({summaryStats.late})
                            </span>
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                Overtime ({summaryStats.overtime})
                            </span><span className="flex items-center">
                                <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                                Week Off ({summaryStats.weekOff})
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Employee Details Modal */}
            {isModalOpen && selectedEmployee && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-[var(--color-bg-secondary)] rounded-lg max-w-2xl w-full shadow-xl">
                            <div className="px-6 py-4 border-b border-[var(--color-border-primary)]">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">Employee Details</h3>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                                    >
                                        <XCircle className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                            <div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">Employee Name</p>
                                                <p className="font-medium text-[var(--color-text-primary)]">{selectedEmployee.employee_name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <BarChart3 className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                            <div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">Employee Code</p>
                                                <p className="font-medium text-[var(--color-text-primary)]">{selectedEmployee.employee_code || 'N/A'}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                            <div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">Shift</p>
                                                <p className="font-medium text-[var(--color-text-primary)]">{selectedEmployee.shift_name}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Timer className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                            <div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">Shift Time</p>
                                                <p className="font-medium text-[var(--color-text-primary)]">
                                                    {selectedEmployee.shift_from_time} - {selectedEmployee.shift_to_time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Activity className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                            <div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">Clock In</p>
                                                <p className={`font-medium ${getTimeColor(selectedEmployee)}`}>
                                                    {formatTime(selectedEmployee.attandance_first_clock_in)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Activity className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                            <div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">Clock Out</p>
                                                <p className={`font-medium ${getTimeColor(selectedEmployee)}`}>
                                                    {formatTime(selectedEmployee.attandance_last_clock_out)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Timer className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                            <div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">Working Hours</p>
                                                <p className="font-medium text-[var(--color-text-primary)]">{selectedEmployee.shift_working_hours}h</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Clock className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                            <div>
                                                <p className="text-sm text-[var(--color-text-secondary)]">Attendance Hours</p>
                                                <p className="font-medium text-[var(--color-text-primary)]">{selectedEmployee.attandance_hours}h</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {selectedEmployee.overtime_hours && parseFloat(selectedEmployee.overtime_hours) > 0 && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex items-center space-x-2">
                                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                                <div>
                                                    <p className="text-sm text-blue-600">Overtime Hours</p>
                                                    <p className="font-medium text-blue-700">{selectedEmployee.overtime_hours}h</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedEmployee.late_hours && parseFloat(selectedEmployee.late_hours) > 0 && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                            <div className="flex items-center space-x-2">
                                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                                <div>
                                                    <p className="text-sm text-yellow-600">Late Hours</p>
                                                    <p className="font-medium text-yellow-700">{selectedEmployee.late_hours}h</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );
};

export default DailyReport;