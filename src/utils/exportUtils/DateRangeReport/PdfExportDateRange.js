// utils/pdfExportDaterange.js

// Group data by employee
export const groupDataByEmployee = (data) => {
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
export const calculateSummary = (data) => {
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
export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Generate enhanced PDF content with BLACK & WHITE THEME
export const generateEnhancedPDFContent = (attendanceData, title, filterInfo = {}, groupedData, reportSummary) => {
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
                    color: #000;
                    line-height: 1.2;
                    font-size: 12px;
                    background: white;
                }
                
                .header {
                    background: white;
                    color: black;
                    padding: 15px 20px;
                    margin-bottom: 20px;
                    position: relative;
                    min-height: 70px;
                    border: 1px solid #ccc;
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
                    border: 1px solid #ccc;
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
                    display: inline-block;
                    color: black;
                }
                
                .export-pdf-btn {
                    background: #fff;
                    color: #000;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 8px 16px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    margin: 16px 0px 5px 16px;
                    vertical-align: middle;
                    transition: background 0.2s, color 0.2s;
                }
                .export-pdf-btn:hover {
                    background: #f0f0f0;
                    color: #000;
                }
                
                .header-subtitle {
                    font-size: 14px;
                    margin: 0 0 5px 0;
                    color: black;
                }
                
                .header-period {
                    font-size: 15px;
                    margin: 0;
                    color: #666;
                }
                
                .header-meta {
                    text-align: right;
                    font-size: 10px;
                    color: black;
                }
                
                .page-info {
                    font-size: 12px;
                    margin-bottom: 5px;
                }
                
                .generation-info {
                    color: #666;
                }
                
                .employee-section {
                    margin-bottom: 35px;
                    page-break-inside: avoid;
                }
                
                .employee-header {
                    background-color: #f8fafc;
                    border: 1px solid #ccc;
                    padding: 8px 15px;
                    margin-bottom: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .employee-info h3 {
                    margin: 0;
                    font-size: 14px;
                    color: #000;
                }
                
                .employee-info p {
                    margin: 2px 0 0 0;
                    font-size: 11px;
                    color: #666;
                }
                
                .employee-stats {
                    display: flex;
                    gap: 15px;
                    font-size: 11px;
                    color: #666;
                }
                
                .stat-item {
                    text-align: center;
                }
                
                .stat-value {
                    font-weight: bold;
                    color: #000;
                    font-size: 12px;
                }
                
                .attendance-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9px;
                    margin-bottom: 15px;
                    border: 1px solid #ccc;
                }
                
                .attendance-table th {
                    background: white;
                    color: black;
                    padding: 8px 6px;
                    text-align: center;
                    border: 1px solid #ccc;
                    font-weight: 600;
                    font-size: 10px;
                }
                
                .attendance-table td {
                    padding: 6px;
                    border: 1px solid #ccc;
                    text-align: center;
                    font-size: 9px;
                    background: white;
                }
                
                .attendance-table tr:nth-child(even) {
                    background-color: #f5f5f5;
                }
                
                .status-badge {
                    padding: 2px 8px;
                    border-radius: 0px;
                    font-size: 8px;
                    font-weight: normal;
                    text-transform: uppercase;
                    border: none;
                    background: transparent;
                    color: black;
                }
                
                /* SIMPLE TEXT-ONLY STATUS STYLES */
                .status-present,
                .status-absent,
                .status-week-off,
                .status-holiday,
                .status-leave,
                .status-half-day,
                .status-late,
                .status-overtime,
                .status-default {
                    background: transparent;
                    color: black;
                    border: none;
                }
                
                .footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 8px;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding: 8px;
                    background: white;
                }
                
                /* HIDE EXPORT BUTTON WHEN PRINTING OR AFTER CLICK */
                .export-pdf-btn.hidden {
                    display: none !important;
                }
                
                /* PRINT OPTIMIZATIONS */
                @media print {
                    body { 
                        margin: 0; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* Hide export button during print */
                    .export-pdf-btn {
                        display: none !important;
                    }
                }
                
                @page {
                    margin: 15mm;
                    size: A4;
                }
            </style>
            <script>
                function exportToPDF() {
                    // Hide the button immediately when clicked
                    const btn = document.querySelector('.export-pdf-btn');
                    if (btn) {
                        btn.classList.add('hidden');
                    }
                    
                    // Trigger print dialog
                    window.print();
                }
                
                // Optional: Show button again after print dialog is closed
                window.addEventListener('afterprint', function() {
                    const btn = document.querySelector('.export-pdf-btn');
                    if (btn) {
                        // Uncomment the line below if you want the button to reappear after printing
                        // btn.classList.remove('hidden');
                    }
                });
            </script>
        </head>
        <body>
            <div class="header">
                <div class="header-content">
                    <div class="logo-area">
                        <span style="color: #000; font-weight: bold;">LOGO</span>
                    </div>  
                    <div class="header-info">
                        <h1 class="header-title">${title}</h1>
                        <p class="header-period">${filterInfo.startDate && filterInfo.endDate ? 
                            `Period: ${new Date(filterInfo.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} to ${new Date(filterInfo.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}` : 
                            'Date Range Report'
                        }</p>
                    </div>
                    <div class="header-meta">
                        <div class="page-info">Page 1</div>
                        <button class="export-pdf-btn" onclick="exportToPDF()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
                                <path d="M14 2v6a2 2 0 0 0 2 2h6"/>
                                <path d="M16 13v5"/>
                                <path d="m19 16-3 3-3-3"/>
                                <path d="M6 2h8a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                            </svg>
                            Export PDF
                        </button>
                        <div class="generation-info">Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>

            ${Object.entries(groupedData).map(([, employeeData], index) => `
                <div class="employee-section">
                    <div class="employee-header">
                        <div class="employee-info">
                            <h3>${employeeData.employee_name} (${employeeData.employee_code})</h3>
                            <p>${employeeData.shift_name} Shift: ${employeeData.shift_from_time} - ${employeeData.shift_to_time}</p>
                        </div>
                        <div class="employee-stats">
                            <div class="stat-item">
                                <div class="stat-value">${employeeData.summary.attendancePercentage}%</div>
                                <div>Attendance</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${employeeData.summary.presentDays}</div>
                                <div>Present</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${employeeData.summary.totalHours}</div>
                                <div>Hours</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${employeeData.summary.totalOvertimeHours}</div>
                                <div>Overtime</div>
                            </div>
                        </div>
                    </div>

                    <table class="attendance-table">
                        <thead>
                            <tr>
                                <th style="width: 14%;">DATE</th>
                                <th style="width: 14%;">STATUS</th>
                                <th style="width: 16%;">CLOCK IN</th>
                                <th style="width: 16%;">CLOCK OUT</th>
                                <th style="width: 13%;">HOURS</th>
                                <th style="width: 13%;">OVERTIME</th>
                                <th style="width: 14%;">LATE</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${employeeData.records.map(record => `
                                <tr>
                                    <td>${new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td>
                                        <span class="status-badge status-default">
                                            ${record.status}
                                        </span>
                                    </td>
                                    <td>${record.attandance_first_clock_in || '-'}</td>
                                    <td>${record.attandance_last_clock_out || '-'}</td>
                                    <td>${record.attandance_hours ? `${record.attandance_hours}h` : '-'}</td>
                                    <td>${record.overtime_hours && parseFloat(record.overtime_hours) > 0 ? `${record.overtime_hours}h` : '-'}</td>
                                    <td>${record.late_hours && parseFloat(record.late_hours) > 0 ? `${record.late_hours}h` : '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `).join('')}

            <div class="footer">
                <p>Employee Attendance Report | ${reportSummary.totalRecords} total records | ${reportSummary.uniqueEmployees} employees</p>
            </div>
        </body>
        </html>
    `;
};

/**
 * Enhanced Export to PDF Function for Date Range Reports
 * @param {Array} data - Array of records to export
 * @param {string} title - Report title
 * @param {Object} filterInfo - Applied filters information (optional)
 * @param {Object} groupedData - Grouped employee data
 * @param {Object} reportSummary - Report summary statistics
 */
export const exportToPDF = (data, title = 'Employee Attendance Report', filterInfo = {}, groupedData = {}, reportSummary = {}) => {
    try {
        // Validate input data
        if (!data || data.length === 0) {
            console.error('No data to export');
            return {
                success: false,
                message: 'No data available to export'
            };
        }

        // Generate HTML content
        const htmlContent = generateEnhancedPDFContent(data, title, filterInfo, groupedData, reportSummary);

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