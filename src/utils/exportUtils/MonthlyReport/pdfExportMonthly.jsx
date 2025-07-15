// utils/pdfExportMonthly.js

// Calculate monthly summary statistics
export const calculateMonthlySummary = (reportData) => {
    const totalDays = reportData.length;
    const workingDays = reportData.filter(r => r.shift_status === 'Working Day').length;
    const presentDays = reportData.filter(r => r.status === 'Present').length;
    const absentDays = reportData.filter(r => r.status === 'Absent').length;
    const weekoffDays = reportData.filter(r => r.status === 'Week Off').length;
    const holidayDays = reportData.filter(r => r.status === 'Holiday').length;
    const leaveDays = reportData.filter(r => r.status === 'Leave').length;
    const halfDayDays = reportData.filter(r => r.status === 'Half Day').length;
    const lateDays = reportData.filter(r => parseFloat(r.late_hours || 0) > 0).length;
    const overtimeDays = reportData.filter(r => parseFloat(r.overtime_hours || 0) > 0).length;
    const totalWorkingHours = reportData.reduce((sum, r) => sum + parseFloat(r.attandance_hours || 0), 0);
    const totalOvertimeHours = reportData.reduce((sum, r) => sum + parseFloat(r.overtime_hours || 0), 0);
    const totalLateHours = reportData.reduce((sum, r) => sum + parseFloat(r.late_hours || 0), 0);
    const attendancePercentage = workingDays > 0 ? ((presentDays / workingDays) * 100).toFixed(1) : 0;

    return {
        totalDays,
        workingDays,
        presentDays,
        absentDays,
        weekoffDays,
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

// Format date
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Generate PDF content for monthly report
export const generateMonthlyPDFContent = (reportData, title, summaryStats, filterInfo = {}, employeeInfo = {}) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    color: #333;
                    line-height: 1.2;
                    font-size: 12px;
                }
                
                .header {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 15px 20px;
                    margin-bottom: 20px;
                    position: relative;
                    min-height: 70px;
                }
                
                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .logo-area {
                    width: 60px;
                    height: 60px;
                    background: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 20px;
                }
                
                .header-info {
                    flex: 1;
                }
                
                .header-title {
                    font-size: 22px;
                    font-weight: bold;
                    margin: 0 0 8px 0;
                }
                
                .export-pdf-btn {
                    background: #fff;
                    color: #2563eb;
                    border: 1px solid white;
                    border-radius: 5px;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    margin: 16px 0px 5px 16px;
                    vertical-align: middle;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
                    transition: background 0.2s, color 0.2s;
                }
                .export-pdf-btn:hover {
                    background: #2563eb;
                    color: #fff;
                }
                
                .header-subtitle {
                    font-size: 14px;
                    margin: 0 0 5px 0;
                    opacity: 0.9;
                }
                
                .header-period {
                    font-size: 12px;
                    margin: 0;
                    opacity: 0.8;
                }
                
                .header-meta {
                    text-align: right;
                    font-size: 10px;
                }
                
                .page-info {
                    font-size: 12px;
                    margin-bottom: 5px;
                }
                
                .generation-info {
                    opacity: 0.8;
                }
                
                .summary-section {
                    background-color: #f8fafc;
                    padding: 20px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    border-left: 4px solid #2563eb;
                }
                
                .summary-title {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    color: #2563eb;
                }
                
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .summary-item {
                    background: white;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                    text-align: center;
                }
                
                .summary-label {
                    font-size: 11px;
                    color: #64748b;
                    margin-bottom: 5px;
                }
                
                .summary-value {
                    font-size: 16px;
                    font-weight: bold;
                    color: #1e293b;
                }
                
                .summary-value.success {
                    color: #22c55e;
                }
                
                .summary-value.error {
                    color: #ef4444;
                }
                
                .summary-value.warning {
                    color: #f59e0b;
                }
                
                .summary-value.info {
                    color: #3b82f6;
                }
                
                .summary-value.purple {
                    color: #8b5cf6;
                }
                
                .legend-section {
                    margin-bottom: 20px;
                }
                
                .legend-title {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #2563eb;
                }
                
                .legend-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .legend-color {
                    width: 16px;
                    height: 16px;
                    border-radius: 4px;
                    border: 1px solid #e2e8f0;
                }
                
                .legend-text {
                    font-size: 11px;
                    font-weight: 500;
                }
                
                .attendance-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                    margin-bottom: 20px;
                }
                
                .attendance-table th {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 8px 6px;
                    text-align: center;
                    border: 1px solid #1d4ed8;
                    font-weight: 600;
                    font-size: 10px;
                }
                
                .attendance-table td {
                    padding: 6px;
                    border: 1px solid #e2e8f0;
                    text-align: center;
                    font-size: 9px;
                }
                
                .attendance-table tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                
                .status-badge {
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 8px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .status-present {
                    background-color: #dcfce7;
                    color: #166534;
                }
                
                .status-absent {
                    background-color: #fee2e2;
                    color: #dc2626;
                }
                
                .status-week-off {
                    background-color: #f3e8ff;
                    color: #7c3aed;
                }
                
                .status-holiday {
                    background-color: #fef3c7;
                    color: #d97706;
                }
                
                .status-leave {
                    background-color: #fef9c3;
                    color: #ca8a04;
                }
                
                .status-half-day {
                    background-color: #dbeafe;
                    color: #2563eb;
                }
                
                .status-default {
                    background-color: #f3f4f6;
                    color: #6b7280;
                }
                
                .shift-working {
                    background-color: #dcfce7;
                    color: #166534;
                }
                
                .shift-weekoff {
                    background-color: #f3e8ff;
                    color: #7c3aed;
                }
                
                .hours-highlight {
                    background-color: #fef9c3;
                    color: #ca8a04;
                    font-weight: bold;
                }
                
                .overtime-highlight {
                    background-color: #dcfce7;
                    color: #166534;
                    font-weight: bold;
                }
                
                .footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 8px;
                    color: #666;
                    border-top: 1px solid #e2e8f0;
                    padding: 8px;
                    background: white;
                }
                
                @media print {
                    body { 
                        margin: 0; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .header {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .summary-section {
                        page-break-inside: avoid;
                    }
                    .export-pdf-btn {
                        display: none;
                    }
                }
                
                @page {
                    margin: 15mm;
                    size: A4 landscape;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="header-content">
                    <div class="logo-area">
                        <span style="color: #2563eb; font-weight: bold;">LOGO</span>
                    </div>
                    <div class="header-info">
                        <h1 class="header-title">${title}</h1>
                        <p class="header-subtitle">${employeeInfo.name ? `Employee: ${employeeInfo.name}` : 'Monthly attendance analysis'}</p>
                        <p class="header-period">${filterInfo.month_year ? `Period: ${filterInfo.month_year}` : ''}</p>
                    </div>
                    <div class="header-meta">
                        <div class="page-info">Page 1</div>
                        <button class="export-pdf-btn" onclick="window.print()">
                            <svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-file-down" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;"><path d="M14 2v6a2 2 0 0 0 2 2h6"/><path d="M16 13v5"/><path d="m19 16-3 3-3-3"/><path d="M6 2h8a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
                            Export PDF
                        </button>
                        <div class="generation-info">Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>

            ${summaryStats ? `
                <div class="summary-section">
                    <div class="summary-title">Attendance Summary</div>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-label">Total Days</div>
                            <div class="summary-value">${summaryStats.totalDays}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Working Days</div>
                            <div class="summary-value">${summaryStats.workingDays}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Present Days</div>
                            <div class="summary-value success">${summaryStats.presentDays} (${summaryStats.attendancePercentage}%)</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Absent Days</div>
                            <div class="summary-value error">${summaryStats.absentDays}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Week Offs</div>
                            <div class="summary-value purple">${summaryStats.weekoffDays}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Working Hours</div>
                            <div class="summary-value">${summaryStats.totalWorkingHours} hrs</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Overtime Hours</div>
                            <div class="summary-value success">${summaryStats.totalOvertimeHours} hrs</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Late Hours</div>
                            <div class="summary-value error">${summaryStats.totalLateHours} hrs</div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <table class="attendance-table">
                <thead>
                    <tr>
                        <th style="width: 8%;">S.No</th>
                        <th style="width: 12%;">Date</th>
                        <th style="width: 15%;">Shift Status</th>
                        <th style="width: 15%;">Attendance Status</th>
                        <th style="width: 12%;">Clock In</th>
                        <th style="width: 12%;">Clock Out</th>
                        <th style="width: 10%;">Working Hours</th>
                        <th style="width: 8%;">Late Hours</th>
                        <th style="width: 8%;">Overtime Hours</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.map((record, index) => {
        const date = new Date(record.date);
        const formattedDate = date.toLocaleDateString('en-GB');

        // Status badge classes
        const getStatusClass = (status) => {
            switch (status?.toLowerCase()) {
                case 'present': return 'status-present';
                case 'absent': return 'status-absent';
                case 'week off': case 'weekoff': return 'status-week-off';
                case 'holiday': return 'status-holiday';
                case 'leave': return 'status-leave';
                case 'half day': return 'status-half-day';
                default: return 'status-default';
            }
        };

        const getShiftClass = (shiftStatus) => {
            if (shiftStatus?.toLowerCase() === 'working day') return 'shift-working';
            if (shiftStatus?.toLowerCase() === 'week off' || shiftStatus?.toLowerCase() === 'weekoff') return 'shift-weekoff';
            return '';
        };

        const lateHours = parseFloat(record.late_hours || 0);
        const overtimeHours = parseFloat(record.overtime_hours || 0);

        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${formattedDate}</td>
                                <td class="${getShiftClass(record.shift_status)}">${record.shift_status || 'N/A'}</td>
                                <td>
                                    <span class="status-badge ${getStatusClass(record.status)}">
                                        ${record.status || 'N/A'}
                                    </span>
                                </td>
                                <td>${record.attandance_first_clock_in || '-'}</td>
                                <td>${record.attandance_last_clock_out || '-'}</td>
                                <td>${record.attandance_hours ? `${parseFloat(record.attandance_hours).toFixed(2)}h` : '-'}</td>
                                <td class="${lateHours > 0 ? 'hours-highlight' : ''}">${lateHours > 0 ? `${lateHours.toFixed(2)}h` : '-'}</td>
                                <td class="${overtimeHours > 0 ? 'overtime-highlight' : ''}">${overtimeHours > 0 ? `${overtimeHours.toFixed(2)}h` : '-'}</td>
                            </tr>
                        `;
    }).join('')}
                </tbody>
            </table>

        </body>
        </html>
    `;
};

/**
 * Enhanced Export Monthly Attendance Report to PDF
 * @param {Array} reportData - Array of attendance records
 * @param {string} title - Report title
 * @param {Object} filterInfo - Applied filters information
 * @param {Object} employeeInfo - Employee information for header
 */
export const exportToPDF = (reportData, title = 'Monthly Attendance Report', filterInfo = {}, employeeInfo = {}) => {
    try {
        // Validate input data
        if (!reportData || reportData.length === 0) {
            console.error('No data to export');
            return {
                success: false,
                message: 'No data available to export'
            };
        }

        // Calculate summary statistics
        const summaryStats = calculateMonthlySummary(reportData);

        // Generate HTML content
        const htmlContent = generateMonthlyPDFContent(reportData, title, summaryStats, filterInfo, employeeInfo);

        // Create a new window for PDF generation
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        return {
            success: true,
            message: 'PDF exported successfully!'
        };

    } catch (error) {
        console.error('Error exporting PDF:', error);
        return {
            success: false,
            message: 'Failed to export PDF: ' + error.message
        };
    }
};

// Legacy function for backward compatibility
export const exportMonthlyReportToPDF = (reportData, fileName, title, summaryStats, filterInfo = {}, employeeInfo = {}) => {
    return exportToPDF(reportData, title, filterInfo, employeeInfo);
};