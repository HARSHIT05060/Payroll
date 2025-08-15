import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import {
    ArrowLeft,
    Filter,
    RefreshCw,
    Loader2,
    Calendar,
    Download,
    ChevronDown,
    FileDown,
    TrendingUp,
    Users,
    Clock,
    FileSpreadsheet,
    IndianRupee,
    User,
    CalendarX, Calculator
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Pagination from '../../Components/Pagination';
import { Toast } from '../../Components/ui/Toast';
import { useRef } from 'react';
import { exportSalaryReportToPDF } from '../../utils/exportUtils/salary/pdfExportSalary';
import { handlePayrollExportExcel } from '../../utils/exportUtils/salary/exportSalaryReportToExcel';

const MonthlySalaryReport = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Filter states
    const [filters, setFilters] = useState({
        month_year: ''
    });

    const [reportGenerating, setReportGenerating] = useState(false);

    // Report data
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);

    // Toast state
    const [toast, setToast] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
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

    // Calculate summary statistics
    const calculateSummaryStats = (data) => {
        if (!data || data.length === 0) return null;

        const totalEmployees = data.length;
        const totalBaseSalary = data.reduce((sum, emp) => sum + parseFloat(emp.employee_salary || 0), 0);
        const totalPaidSalary = data.reduce((sum, emp) => sum + parseFloat(emp.total_salary || 0), 0);
        const totalOvertimeSalary = data.reduce((sum, emp) => sum + parseFloat(emp.overtime_salary || 0), 0);
        const totalWorkingDays = data.reduce((sum, emp) => sum + parseFloat(emp.working_days || 0), 0);
        const totalPresentDays = data.reduce((sum, emp) => sum + parseFloat(emp.present_days || 0), 0);
        const totalAbsentDays = data.reduce((sum, emp) => sum + parseFloat(emp.absent_days || 0), 0);
        const averageSalary = totalEmployees > 0 ? totalPaidSalary / totalEmployees : 0;

        return {
            totalEmployees,
            totalBaseSalary,
            totalPaidSalary,
            totalOvertimeSalary,
            totalWorkingDays,
            totalPresentDays,
            totalAbsentDays,
            averageSalary
        };
    };

    // Generate monthly salary report
    const generateReport = useCallback(async () => {
        try {
            setReportGenerating(true);
            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            if (!filters.month_year) {
                showToast('Please select a month and year', 'error');
                return;
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('month_year', filters.month_year);

            const response = await api.post('monthly_salary_report_list', formData);

            if (response.data?.success && response.data.data) {
                setReportData(response.data.data);
                setCurrentPage(1);
                showToast('Report generated successfully', 'success');
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
    }, [user?.user_id, filters.month_year]);

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        if (filterName === 'month_year' && value) {
            // Convert Date object to YYYY-MM format
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, '0');
            const formattedDate = `${year}-${month}`;

            setFilters(prev => ({
                ...prev,
                [filterName]: formattedDate
            }));
        } else {
            setFilters(prev => ({
                ...prev,
                [filterName]: value
            }));
        }
    };

    // Format currency with Indian Rupee symbol
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    };


    const handleExportExcelClick = () => {
        handlePayrollExportExcel(
            reportData,
            filters,
            summaryStats,
            showToast,
            setExportDropdown,
            getMonthYearDisplay
        );
    };
    // Handle export PDF (placeholder - you'll need to implement the actual export function)
    const handleExportPDF = () => {
        try {
            if (!reportData || reportData.length === 0) {
                showToast('No data available to export', 'error');
                return;
            }

            const fileName = `monthly_salary_report_${filters.month_year || 'current'}.pdf`;
            const title = `Monthly Salary Report - ${getMonthYearDisplay(filters.month_year)}`;

            const result = exportSalaryReportToPDF(
                reportData,
                fileName,
                title,
                summaryStats,
                filters
            );

            if (result.success) {
                showToast(result.message, 'success');
            } else {
                showToast(result.message, 'error');
            }

            setExportDropdown(false);

        } catch (error) {
            console.error('Error in handleExportPDF:', error);
            showToast('Failed to export PDF: ' + error.message, 'error');
            setExportDropdown(false);
        }
    };
    // Reset filters
    const resetFilters = () => {
        setFilters({
            month_year: ''
        });
        setReportData(null);
        setError(null);
        setCurrentPage(1);
        showToast('Filters reset successfully', 'success');
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

    // Reset page when report data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [reportData]);

    const summaryStats = calculateSummaryStats(reportData);

    // Get month year display text
    const getMonthYearDisplay = (monthYear) => {
        if (!monthYear) return 'Select Month';
        const date = new Date(monthYear + '-01');
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

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
                                            Monthly Salary Report
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onClick={() => setExportDropdown(!exportDropdown)}
                                        disabled={!reportData || reportData.length === 0}
                                        className="flex items-center gap-2 bg-[var(--color-bg-secondary)] text-[var(--color-blue-dark)] hover:bg-[var(--color-bg-primary)] px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                                    left: buttonPosition.left + buttonPosition.width - 192,
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        handleExportExcelClick();
                                                        setExportDropdown(false);
                                                    }}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-primary)]"
                                                >
                                                    <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                                                    Export to Excel
                                                </button>
                                                <button
                                                    onClick={handleExportPDF}
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

                {/* Filters Section */}
                <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-primary)] p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[var(--color-blue-lightest)] rounded-lg">
                            <Filter className="h-5 w-5 text-[var(--color-blue-dark)]" />
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Filter Report</h2>
                        <button
                            onClick={resetFilters}
                            className="ml-auto flex items-center gap-2 px-3 py-1 bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-border-secondary)] transition-colors text-sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reset
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Month Year Filter */}
                        <div>
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-[var(--color-text-primary)]" />
                                <DatePicker
                                    selected={filters.month_year ? new Date(filters.month_year + '-01') : null}
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

                        {/* Apply Filters Button */}
                        <div className="flex items-end">
                            <button
                                onClick={generateReport}
                                disabled={reportGenerating || !filters.month_year}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-blue-darker)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {reportGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Filter className="h-4 w-4" />
                                )}
                                {reportGenerating ? 'Loading...' : 'Generate Report'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Statistics */}
                {summaryStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Total Employees</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{summaryStats.totalEmployees}</p>
                                </div>
                                <Users className="h-8 w-8 text-[var(--color-blue-dark)]" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Total Paid</p>
                                    <p className="text-2xl font-bold text-green-600">{formatCurrency(summaryStats.totalPaidSalary)}</p>
                                </div>
                                <IndianRupee className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Overtime Pay</p>
                                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(summaryStats.totalOvertimeSalary)}</p>
                                </div>
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Average Salary</p>
                                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(summaryStats.averageSalary)}</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Salary Report Results */}
                {reportData && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-lg border border-[var(--color-border-primary)] overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-[var(--color-border-primary)] bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="p-2 bg-[var(--color-bg-secondary-20)] rounded-lg mr-3">
                                        <IndianRupee className="h-6 w-6 text-[var(--color-text-white)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-[var(--color-text-white)]">
                                            Monthly Salary Report
                                        </h3>
                                        <p className="text-sm text-[var(--color-text-white)] opacity-80">
                                            {getMonthYearDisplay(filters.month_year)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-[var(--color-text-white)] opacity-80">Total Records</div>
                                    <div className="text-2xl font-bold text-[var(--color-text-white)]">{reportData.length}</div>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)]">
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                Employee Details
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-center text-sm font-semibold text-[var(--color-text-primary)]">
                                            <div className="flex items-center justify-center gap-2">
                                                <IndianRupee className="h-4 w-4" />
                                                Base Salary
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-center text-sm font-semibold text-[var(--color-text-primary)]">
                                            <div className="flex items-center justify-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                Attendance Summary
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-center text-sm font-semibold text-[var(--color-text-primary)]">
                                            <div className="flex items-center justify-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Overtime Details
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-center text-sm font-semibold text-[var(--color-text-primary)]">
                                            <div className="flex items-center justify-center gap-2">
                                                <CalendarX className="h-4 w-4" />
                                                Week Off
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-center text-sm font-semibold text-[var(--color-text-primary)]">
                                            <div className="flex items-center justify-center gap-2">
                                                <Calculator className="h-4 w-4" />
                                                Subtotal
                                            </div>
                                        </th>
                                        <th className="px-4 py-4 text-center text-sm font-semibold text-[var(--color-text-primary)]">
                                            <div className="flex items-center justify-center gap-2">
                                                <TrendingUp className="h-4 w-4" />
                                                Final Salary
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-border-primary)]">
                                    {currentItems.map((employee, index) => (
                                        <tr key={employee.employee_code || index} className="bg-[var(--color-bg-secondary)]">
                                            {/* Employee Details */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center">
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
                                                            {employee.employee_name || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-primary)] px-2 py-1 rounded-md inline-block">
                                                            {employee.employee_code || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Base Salary */}
                                            <td className="px-4 py-5 text-center">
                                                <div className="bg-[var(--color-bg-primary)] rounded-lg p-3 border border-[var(--color-border-primary)]">
                                                    <div className="text-lg font-bold text-[var(--color-blue-dark)]">
                                                        {formatCurrency(employee.employee_salary)}
                                                    </div>
                                                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                                                        Monthly Base
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Attendance Summary */}
                                            <td className="px-4 py-5">
                                                <div className="bg-[var(--color-bg-primary)] rounded-lg p-3 border border-[var(--color-border-primary)] space-y-2">
                                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                                        <div className="text-center">
                                                            <div className="text-[var(--color-text-secondary)]">Working</div>
                                                            <div className="font-semibold text-[var(--color-blue-dark)]">{employee.working_days || 0}</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-[var(--color-text-secondary)]">Present</div>
                                                            <div className="font-semibold text-green-600">{employee.present_days || 0}</div>
                                                        </div>
                                                        <div className="text-center">
                                                            <div className="text-[var(--color-text-secondary)]">Absent</div>
                                                            <div className="font-semibold text-red-600">{employee.absent_days || 0}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Overtime Details */}
                                            <td className="px-4 py-5 text-center">
                                                <div className="bg-[var(--color-bg-primary)] rounded-lg p-3 border border-[var(--color-border-primary)]">
                                                    <div className="text-sm font-bold text-orange-600 mb-2">
                                                        {formatCurrency(employee.overtime_salary)}
                                                    </div>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Clock className="h-3 w-3 text-orange-600" />
                                                        <span className="text-xs text-[var(--color-text-secondary)]">
                                                            {employee.overtime_days || 0} days
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Week Off */}
                                            <td className="px-4 py-5 text-center">
                                                <div className="bg-[var(--color-bg-primary)] rounded-lg p-3 border border-[var(--color-border-primary)]">
                                                    <div className="text-sm font-bold text-[var(--color-blue-dark)] mb-2">
                                                        {formatCurrency(employee.week_off_salary)}
                                                    </div>
                                                    <div className="flex items-center justify-center gap-1">
                                                        <CalendarX className="h-3 w-3 text-[var(--color-blue-dark)]" />
                                                        <span className="text-xs text-[var(--color-text-secondary)]">
                                                            {employee.week_off_days || 0} days
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Subtotal */}
                                            <td className="px-4 py-5 text-center">
                                                <div className="bg-[var(--color-bg-primary)] rounded-lg p-3 border border-[var(--color-border-primary)]">
                                                    <div className="text-lg font-bold text-[var(--color-text-primary)]">
                                                        {formatCurrency(employee.subtotal_salary)}
                                                    </div>
                                                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                                                        Before Final
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Final Salary */}
                                            <td className="px-4 py-5 text-center">
                                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-2 border-green-200 shadow-sm">
                                                    <div className="text-xl font-bold text-green-700 mb-1">
                                                        {formatCurrency(employee.total_salary)}
                                                    </div>
                                                    <div className="text-xs text-green-600 font-medium">
                                                        Net Payable
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="border-t border-[var(--color-border-primary)] bg-[var(--color-bg-primary)]">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                loading={reportGenerating}
                            />
                        </div>
                    </div>
                )}

                {/* No Data Message */}
                {!reportData && !reportGenerating && !error && filters.month_year && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-primary)] p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-[var(--color-bg-hover)] rounded-full mb-4">
                                <IndianRupee className="h-8 w-8 text-[var(--color-text-secondary)]" />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No Salary Data Found</h3>
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                No salary data available for {getMonthYearDisplay(filters.month_year)}.
                            </p>
                            <div className="text-sm text-[var(--color-text-secondary)] space-y-1">
                                <p>• Try selecting a different month</p>
                                <p>• Or check if payroll has been processed</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Initial Message */}
                {!reportData && !reportGenerating && !error && !filters.month_year && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-primary)] p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-[var(--color-blue-lightest)] rounded-full mb-4">
                                <Calendar className="h-8 w-8 text-[var(--color-blue-dark)]" />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Select Month to Generate Report</h3>
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                Please select a month and year to generate the salary report.
                            </p>
                            <div className="text-sm text-[var(--color-text-secondary)]">
                                <p>Choose the month from the filter above and click "Generate Report"</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {reportGenerating && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-primary)] p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-[var(--color-blue-lightest)] rounded-full mb-4">
                                <Loader2 className="h-8 w-8 text-[var(--color-blue-dark)] animate-spin" />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Generating Report</h3>
                            <p className="text-[var(--color-text-secondary)]">
                                Please wait while we prepare your monthly salary report...
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

export default MonthlySalaryReport;