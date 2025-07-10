import React, { useState, useCallback } from 'react';
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
    TrendingDown,
    CheckCircle,
    XCircle
} from 'lucide-react';

const DateRangeReport = () => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);

    const { user } = useAuth();

    // Toast helper functions
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };
    const closeToast = () => {
        setToast(null);
    };

    // Group data by employee
    const groupDataByEmployee = (data) => {
        const grouped = {};

        data.forEach(record => {
            const employeeKey = record.employee_code;
            if (!grouped[employeeKey]) {
                grouped[employeeKey] = {
                    employee_code: record.employee_code,
                    employee_name: record.employee_name,
                    shift_name: record.shift_name,
                    shift_from_time: record.shift_from_time,
                    shift_to_time: record.shift_to_time,
                    shift_working_hours: record.shift_working_hours,
                    records: []
                };
            }
            grouped[employeeKey].records.push(record);
        });

        // Calculate summary for each employee
        Object.keys(grouped).forEach(employeeKey => {
            const employeeData = grouped[employeeKey];
            const records = employeeData.records;

            employeeData.summary = {
                totalDays: records.length,
                presentDays: records.filter(r => r.status === 'Present').length,
                absentDays: records.filter(r => r.status === 'Absent').length,
                weekOffDays: records.filter(r => r.status === 'Week Off').length,
                totalHours: records.reduce((sum, r) => sum + parseFloat(r.attandance_hours || 0), 0).toFixed(2),
                totalOvertimeHours: records.reduce((sum, r) => sum + parseFloat(r.overtime_hours || 0), 0).toFixed(2),
                totalLateHours: records.reduce((sum, r) => sum + parseFloat(r.late_hours || 0), 0).toFixed(2),
                attendancePercentage: records.length > 0 ?
                    ((records.filter(r => r.status === 'Present').length / records.filter(r => r.status !== 'Week Off').length) * 100).toFixed(1) : 0
            };
        });

        return grouped;
    };

    // Calculate summary statistics
    const calculateSummary = (data) => {
        const totalRecords = data.length;
        const uniqueEmployees = new Set(data.map(r => r.employee_code)).size;
        const presentCount = data.filter(r => r.status === 'Present').length;
        const absentCount = data.filter(r => r.status === 'Absent').length;
        const weekOffCount = data.filter(r => r.status === 'Week Off').length;
        const lateCount = data.filter(r => parseFloat(r.late_hours || 0) > 0).length;
        const overtimeCount = data.filter(r => parseFloat(r.overtime_hours || 0) > 0).length;
        const totalHours = data.reduce((sum, r) => sum + parseFloat(r.attandance_hours || 0), 0);
        const totalOvertimeHours = data.reduce((sum, r) => sum + parseFloat(r.overtime_hours || 0), 0);
        const totalLateHours = data.reduce((sum, r) => sum + parseFloat(r.late_hours || 0), 0);

        return {
            totalRecords,
            uniqueEmployees,
            presentCount,
            absentCount,
            weekOffCount,
            lateCount,
            overtimeCount,
            totalHours: totalHours.toFixed(2),
            totalOvertimeHours: totalOvertimeHours.toFixed(2),
            totalLateHours: totalLateHours.toFixed(2)
        };
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Generate PDF content
    const generatePDFContent = (attendanceData, reportSummary, groupedData) => {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Employee Attendance Report</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        color: #333;
                        line-height: 1.4;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #2563eb;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        color: #2563eb;
                        margin: 0;
                        font-size: 24px;
                    }
                    .header p {
                        color: #666;
                        margin: 5px 0;
                    }
                    .date-range {
                        background-color: #f8fafc;
                        padding: 15px;
                        border-radius: 8px;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    .summary-section {
                        background-color: #f8fafc;
                        padding: 20px;
                        border-radius: 8px;
                        margin-bottom: 30px;
                    }
                    .summary-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                        gap: 15px;
                        margin-top: 15px;
                    }
                    .summary-item {
                        text-align: center;
                        padding: 10px;
                        background: white;
                        border-radius: 6px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    }
                    .summary-value {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .summary-label {
                        font-size: 12px;
                        color: #666;
                    }
                    .employee-section {
                        margin-bottom: 40px;
                        page-break-inside: avoid;
                    }
                    .employee-header {
                        background-color: #2563eb;
                        color: white;
                        padding: 15px;
                        border-radius: 8px 8px 0 0;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .employee-info h3 {
                        margin: 0;
                        font-size: 16px;
                    }
                    .employee-info p {
                        margin: 5px 0 0 0;
                        font-size: 12px;
                        opacity: 0.9;
                    }
                    .employee-stats {
                        display: flex;
                        gap: 20px;
                        font-size: 14px;
                    }
                    .employee-summary {
                        background-color: #f1f5f9;
                        padding: 15px;
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 10px;
                        font-size: 12px;
                    }
                    .summary-stat {
                        display: flex;
                        align-items: center;
                        gap: 5px;
                    }
                    .attendance-table {
                        width: 100%;
                        border-collapse: collapse;
                        font-size: 11px;
                    }
                    .attendance-table th {
                        background-color: #f8fafc;
                        padding: 10px 8px;
                        text-align: left;
                        border: 1px solid #e2e8f0;
                        font-weight: 600;
                        color: #475569;
                    }
                    .attendance-table td {
                        padding: 8px;
                        border: 1px solid #e2e8f0;
                    }
                    .attendance-table tr:nth-child(even) {
                        background-color: #f8fafc;
                    }
                    .status-badge {
                        padding: 2px 8px;
                        border-radius: 12px;
                        font-size: 10px;
                        font-weight: 500;
                    }
                    .status-present {
                        background-color: #dcfce7;
                        color: #166534;
                    }
                    .status-absent {
                        background-color: #fef2f2;
                        color: #dc2626;
                    }
                    .status-week-off {
                        background-color: #dbeafe;
                        color: #2563eb;
                    }
                    .page-break {
                        page-break-before: always;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 10px;
                        color: #666;
                        border-top: 1px solid #e2e8f0;
                        padding-top: 15px;
                    }
                    @media print {
                        body { margin: 0; }
                        .page-break { page-break-before: always; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Employee-wise Attendance Report</h1>
                    <p>Comprehensive attendance analysis organized by employee</p>
                </div>

                <div class="date-range">
                    <strong>Report Period: ${formatDate(startDate)} to ${formatDate(endDate)}</strong>
                </div>

                <div class="summary-section">
                    <h2 style="margin-top: 0; color: #2563eb;">Overall Summary</h2>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-value" style="color: #2563eb;">${reportSummary.uniqueEmployees}</div>
                            <div class="summary-label">Employees</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value" style="color: #16a34a;">${reportSummary.presentCount}</div>
                            <div class="summary-label">Present</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value" style="color: #dc2626;">${reportSummary.absentCount}</div>
                            <div class="summary-label">Absent</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value" style="color: #2563eb;">${reportSummary.weekOffCount}</div>
                            <div class="summary-label">Week Off</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value" style="color: #ea580c;">${reportSummary.totalHours}</div>
                            <div class="summary-label">Total Hours</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-value" style="color: #9333ea;">${reportSummary.totalOvertimeHours}</div>
                            <div class="summary-label">Overtime Hours</div>
                        </div>
                    </div>
                </div>

                ${Object.entries(groupedData).map(([employeeCode, employeeData], index) => `
                    <div class="employee-section ${index > 0 ? 'page-break' : ''}">
                        <div class="employee-header">
                            <div class="employee-info">
                                <h3>${employeeData.employee_name} (${employeeData.employee_code})</h3>
                                <p>${employeeData.shift_name} Shift: ${employeeData.shift_from_time} - ${employeeData.shift_to_time}</p>
                            </div>
                            <div class="employee-stats">
                                <div>
                                    <div style="font-weight: bold; font-size: 16px;">${employeeData.summary.attendancePercentage}%</div>
                                    <div style="font-size: 11px;">Attendance</div>
                                </div>
                                <div>
                                    <div style="font-weight: bold; font-size: 16px;">${employeeData.summary.totalHours}</div>
                                    <div style="font-size: 11px;">Total Hours</div>
                                </div>
                            </div>
                        </div>

                        <div class="employee-summary">
                            <div class="summary-stat">
                                <span style="color: #16a34a;">✓</span>
                                <span>Present: ${employeeData.summary.presentDays}</span>
                            </div>
                            <div class="summary-stat">
                                <span style="color: #dc2626;">✗</span>
                                <span>Absent: ${employeeData.summary.absentDays}</span>
                            </div>
                            <div class="summary-stat">
                                <span style="color: #2563eb;">📅</span>
                                <span>Week Off: ${employeeData.summary.weekOffDays}</span>
                            </div>
                            <div class="summary-stat">
                                <span style="color: #ea580c;">🕐</span>
                                <span>Hours: ${employeeData.summary.totalHours}</span>
                            </div>
                            <div class="summary-stat">
                                <span style="color: #9333ea;">⏰</span>
                                <span>Overtime: ${employeeData.summary.totalOvertimeHours}</span>
                            </div>
                            <div class="summary-stat">
                                <span style="color: #dc2626;">⏳</span>
                                <span>Late: ${employeeData.summary.totalLateHours}</span>
                            </div>
                        </div>

                        <table class="attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Clock In</th>
                                    <th>Clock Out</th>
                                    <th>Hours</th>
                                    <th>Overtime</th>
                                    <th>Late</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${employeeData.records.map(record => `
                                    <tr>
                                        <td>${formatDate(record.date)}</td>
                                        <td>
                                            <span class="status-badge ${record.status === 'Present' ? 'status-present' : 
                                                record.status === 'Absent' ? 'status-absent' : 'status-week-off'}">
                                                ${record.status}
                                                ${console.log(record)}
                                                
                                            </span>
                                        </td>
                                        <td>${record.attandance_first_clock_in || '-'}</td>
                                        <td>${record.attandance_last_clock_out || '-'}</td>
                                        <td>${record.attandance_hours || '0'}</td>
                                        <td>${record.overtime_hours || '0'}</td>
                                        <td>${record.late_hours || '0'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `).join('')}

                <div class="footer">
                    <p>Generated on ${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</p>
                    <p>Employee-wise Attendance Report | ${reportSummary.totalRecords} total records</p>
                </div>
            </body>
            </html>
        `;
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
            const htmlContent = generatePDFContent(attendanceData, reportSummary, groupedData);
            
            // Create a new window for PDF generation
            const printWindow = window.open('', '_blank');
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            
            // Wait for content to load then print
            printWindow.onload = () => {
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);
            };

            showToast(`PDF generated successfully! Report contains ${attendanceData.length} records for ${Object.keys(groupedData).length} employees`, 'success');
            
        } catch (err) {
            const errorMessage = err.message || 'An error occurred while generating the report';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }, [user?.user_id, startDate, endDate]);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">PDF Export - Employee Attendance Report</h1>
                            <p className="text-gray-600">Generate and export comprehensive attendance reports directly to PDF</p>
                        </div>
                    </div>

                    {/* Date Range Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={handleGenerateAndExportPDF}
                                disabled={loading}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                {loading ? 'Generating PDF...' : 'Generate & Export PDF'}
                            </button>
                        </div>
                    </div>

                    {/* Status Messages */}
                    {loading && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                <p className="text-blue-700 font-medium">Processing your request...</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <p className="text-red-700 font-medium">Error: {error}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Features Overview */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">PDF Report Features</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-gray-900">Employee-wise Organization</h4>
                                <p className="text-sm text-gray-600">Data grouped by employee with individual summaries</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-gray-900">Comprehensive Analytics</h4>
                                <p className="text-sm text-gray-600">Attendance percentages, hours, overtime, and late tracking</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-gray-900">Daily Records</h4>
                                <p className="text-sm text-gray-600">Complete daily attendance with clock in/out times</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-gray-900">Professional Format</h4>
                                <p className="text-sm text-gray-600">Clean, print-ready PDF with proper styling</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Download className="w-6 h-6 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">How to Use</h3>
                    </div>
                    <ol className="text-gray-600 space-y-3">
                        <li className="flex items-start gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">1</span>
                            <span>Select your desired start and end dates for the report period</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">2</span>
                            <span>Click "Generate & Export PDF" to fetch data and create the report</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">3</span>
                            <span>The system will process the data and automatically open the print dialog</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mt-0.5">4</span>
                            <span>Choose "Save as PDF" or your preferred printer to complete the export</span>
                        </li>
                    </ol>
                    
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                            <span className="text-yellow-800 font-medium">Note:</span>
                        </div>
                        <p className="text-yellow-700 mt-1">The PDF will be generated in a new browser window. Make sure to allow pop-ups for this site to ensure proper functionality.</p>
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
    );
};

export default DateRangeReport;