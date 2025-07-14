import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { Toast } from '../../Components/ui/Toast';
import {
    Calendar,
    Download,
    FileText,
    AlertCircle,
    Users,
    Clock,
    TrendingUp,
    CheckCircle,
    ArrowLeft,
    RefreshCw,
    XCircle
} from 'lucide-react';

// Import PDF export utilities
import {
    groupDataByEmployee,
    calculateSummary,
    exportToPDF
} from '../../utils/exportUtils/DateRangeReport/PdfExportDateRange';

const DateRangeReport = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const navigate = useNavigate();
    const { user } = useAuth();

    // Toast helper functions
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    // Generate and export PDF directly
    const handleGenerateAndExportPDF = useCallback(async () => {
        if (!startDate || !endDate) {
            showToast('Please select both start and end dates', 'error');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            showToast('Start date cannot be after end date', 'error');
            return;
        }

        if (!user?.user_id) {
            showToast('User not authenticated', 'error');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Step 1: Fetch data
            showToast('Fetching attendance data...', 'info');
            
            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('start_date', startDate);
            formData.append('end_date', endDate);

            const response = await api.post('data_range_attendance_report_list', formData);

            if (!response.data?.success || !response.data.data) {
                throw new Error(response.data?.message || 'Failed to fetch attendance data');
            }

            const attendanceData = response.data.data;
            
            // Step 2: Process data
            showToast('Processing data...', 'info');
            const groupedData = groupDataByEmployee(attendanceData);
            const reportSummary = calculateSummary(attendanceData);

            // Step 3: Generate PDF
            showToast('Generating PDF...', 'info');
            exportToPDF(attendanceData, reportSummary, groupedData, startDate, endDate);

            showToast(`PDF generated successfully! Report contains ${attendanceData.length} records for ${Object.keys(groupedData).length} employees`, 'success');
            
        } catch (err) {
            const errorMessage = err.message || 'An error occurred while generating the report';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }, [user?.user_id, startDate, endDate]);

    // Handle retry
    const handleRetry = () => {
        setError(null);
        handleGenerateAndExportPDF();
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
                                            Date Range Report
                                        </h1>
                                        <p className="text-[var(--color-text-white)] opacity-90 mt-1">
                                            Generate comprehensive attendance reports for selected date range
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date Range Selection Card */}
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-blue-dark)] overflow-hidden shadow-sm mb-6">
                    <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
                        <div className="flex items-center">
                            <FileText className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                            <h3 className="text-lg font-medium text-[var(--color-text-white)]">
                                PDF Export Settings
                            </h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                    Start Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] focus:border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                                    End Date
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full px-4 py-3 border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] focus:border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={handleGenerateAndExportPDF}
                                    disabled={loading}
                                    className="w-full px-6 py-3 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-blue-darker)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium"
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                            Generating PDF...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-5 h-5" />
                                            Generate & Export PDF
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {loading && (
                            <div className="mt-6 bg-[var(--color-blue-lightest)] border border-[var(--color-blue-light)] rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--color-blue-dark)]"></div>
                                    <p className="text-[var(--color-blue-dark)] font-medium">Processing your request...</p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 bg-[var(--color-error-light)] border border-[var(--color-border-error)] rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <XCircle className="w-5 h-5 text-[var(--color-error)]" />
                                        <div>
                                            <p className="text-[var(--color-error-dark)] font-medium">Error generating report</p>
                                            <p className="text-[var(--color-text-error)] text-sm mt-1">{error}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRetry}
                                        className="flex items-center gap-2 bg-[var(--color-error-light)] text-[var(--color-error-dark)] px-4 py-2 rounded-lg hover:bg-[var(--color-error-lighter)] transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Overview */}
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-blue-dark)] overflow-hidden shadow-sm mb-6">
                    <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
                        <div className="flex items-center">
                            <TrendingUp className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                            <h3 className="text-lg font-medium text-[var(--color-text-white)]">
                                PDF Report Features
                            </h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-primary)]">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">Employee-wise Organization</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Data grouped by employee with individual summaries and attendance patterns</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-primary)]">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">Comprehensive Analytics</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Attendance percentages, hours worked, overtime tracking, and late arrival analysis</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-primary)]">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">Daily Records</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Complete daily attendance records with clock in/out times and status tracking</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-primary)]">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-[var(--color-text-primary)] mb-1">Professional Format</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Clean, print-ready PDF with professional styling and organized layout</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-blue-dark)] overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
                        <div className="flex items-center">
                            <Download className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                            <h3 className="text-lg font-medium text-[var(--color-text-white)]">
                                How to Use
                            </h3>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-primary)]">
                                <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-full flex items-center justify-center text-sm font-medium">1</div>
                                <div>
                                    <h4 className="font-medium text-[var(--color-text-primary)] mb-1">Select Date Range</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Choose your desired start and end dates for the report period using the date pickers above</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-primary)]">
                                <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-full flex items-center justify-center text-sm font-medium">2</div>
                                <div>
                                    <h4 className="font-medium text-[var(--color-text-primary)] mb-1">Generate Report</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Click "Generate & Export PDF" to fetch attendance data and create the comprehensive report</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-primary)]">
                                <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-full flex items-center justify-center text-sm font-medium">3</div>
                                <div>
                                    <h4 className="font-medium text-[var(--color-text-primary)] mb-1">Processing</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">The system will process the data and automatically open the print dialog in a new window</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-[var(--color-bg-primary)] rounded-lg border border-[var(--color-border-primary)]">
                                <div className="flex-shrink-0 w-8 h-8 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-full flex items-center justify-center text-sm font-medium">4</div>
                                <div>
                                    <h4 className="font-medium text-[var(--color-text-primary)] mb-1">Export</h4>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Choose "Save as PDF" or your preferred printer to complete the export process</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-5 h-5 text-yellow-600" />
                                <span className="text-yellow-800 font-medium">Important Note</span>
                            </div>
                            <p className="text-yellow-700 text-sm">The PDF will be generated in a new browser window. Please ensure pop-ups are enabled for this site to guarantee proper functionality and successful report generation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DateRangeReport;