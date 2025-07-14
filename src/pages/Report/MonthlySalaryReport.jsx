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
    Mail,
    Phone
} from 'lucide-react';
import Pagination from '../../Components/Pagination';
import { Toast } from '../../Components/ui/Toast';
import { useRef } from 'react';
import { exportSalaryReportToPDF } from '../../utils/exportUtils/salary/pdfExportSalary';
import { handleExportExcel } from '../../utils/exportUtils/salary/exportSalaryReportToExcel';

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
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
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
        handleExportExcel(
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
        <div className="min-h-screen bg-gray-50">
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
                                        <p className="text-[var(--color-text-white)] opacity-90 mt-1">
                                            {getMonthYearDisplay(filters.month_year)} salary breakdown
                                        </p>
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
                                                className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 py-2 min-w-48"
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
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700"
                                                >
                                                    <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                                                    Export to Excel
                                                </button>
                                                <button
                                                    onClick={handleExportPDF}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700"
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
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Filter className="h-5 w-5 text-[var(--color-blue-dark)]" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">Filter Report</h2>
                        <button
                            onClick={resetFilters}
                            className="ml-auto flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reset
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Month Year Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="inline h-4 w-4 mr-1" />
                                Month & Year
                            </label>
                            <input
                                type="month"
                                value={filters.month_year}
                                onChange={(e) => handleFilterChange('month_year', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                                placeholder="Select month and year"
                            />
                        </div>

                        {/* Apply Filters Button */}
                        <div className="flex items-end">
                            <button
                                onClick={generateReport}
                                disabled={reportGenerating || !filters.month_year}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-blue-dark)] text-white rounded-lg hover:bg-[var(--color-blue-darker)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                                <Users className="h-8 w-8 text-blue-600" />
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
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <IndianRupee className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                                    <h3 className="text-lg font-medium text-[var(--color-text-white)]">
                                        Monthly Salary Report - {getMonthYearDisplay(filters.month_year)}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px]">
                                            Employee
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                            Base Salary
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            Attendance
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            Overtime
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            Week Off
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                            Subtotal
                                        </th>
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                            Total Salary
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {currentItems.map((employee, index) => (
                                        <tr key={employee.employee_code || index} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4 whitespace-nowrap min-w-[150px]">
                                                <div className="flex items-center">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {employee.employee_name || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {employee.employee_code || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[100px]">
                                                <div className="font-medium">
                                                    {formatCurrency(employee.employee_salary)}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">
                                                <div className="space-y-1">
                                                    <div className="text-xs">
                                                        <span className="text-gray-600">P: </span>
                                                        <span className="font-medium text-green-600">{employee.present_days || 0}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className="text-gray-600">A: </span>
                                                        <span className="font-medium text-red-600">{employee.absent_days || 0}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className="text-gray-600">W: </span>
                                                        <span className="font-medium text-blue-600">{employee.working_days || 0}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">
                                                <div className="space-y-1">
                                                    <div className="text-xs">
                                                        <span className="text-gray-600">Days: </span>
                                                        <span className="font-medium">{employee.overtime_days || 0}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className="text-gray-600">Amt: </span>
                                                        <span className="font-medium text-orange-600">{formatCurrency(employee.overtime_salary)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">
                                                <div className="space-y-1">
                                                    <div className="text-xs">
                                                        <span className="text-gray-600">Days: </span>
                                                        <span className="font-medium">{employee.week_off_days || 0}</span>
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className="text-gray-600">Amt: </span>
                                                        <span className="font-medium text-blue-600">{formatCurrency(employee.week_off_salary)}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[100px]">
                                                <div className="font-medium">
                                                    {formatCurrency(employee.subtotal_salary)}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 min-w-[120px]">
                                                <div className="text-base font-bold text-green-600">
                                                    {formatCurrency(employee.total_salary)}
                                                </div>
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
                {!reportData && !reportGenerating && !error && filters.month_year && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-gray-50 rounded-full mb-4">
                                <IndianRupee className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Salary Data Found</h3>
                            <p className="text-gray-600 mb-4">
                                No salary data available for {getMonthYearDisplay(filters.month_year)}.
                            </p>
                            <div className="text-sm text-gray-500 space-y-1">
                                <p>• Try selecting a different month</p>
                                <p>• Or check if payroll has been processed</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Initial Message */}
                {!reportData && !reportGenerating && !error && !filters.month_year && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-blue-50 rounded-full mb-4">
                                <Calendar className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Select Month to Generate Report</h3>
                            <p className="text-gray-600 mb-4">
                                Please select a month and year to generate the salary report.
                            </p>
                            <div className="text-sm text-gray-500">
                                <p>Choose the month from the filter above and click "Generate Report"</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {reportGenerating && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-blue-50 rounded-full mb-4">
                                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Report</h3>
                            <p className="text-gray-600">
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