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
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Generate PDF content
export const generatePDFContent = (attendanceData, reportSummary, groupedData, startDate, endDate) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Employee Attendance Report</title>
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
                
                .employee-section {
                    margin-bottom: 25px;
                    page-break-inside: avoid;
                }
                
                .employee-header {
                    background-color: #f8fafc;
                    padding: 8px 15px;
                    border-left: 4px solid #2563eb;
                    margin-bottom: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .employee-info h3 {
                    margin: 0;
                    font-size: 14px;
                    color: #2563eb;
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
                    color: #2563eb;
                    font-size: 12px;
                }
                
                .attendance-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9px;
                    margin-bottom: 15px;
                }
                
                .attendance-table th {
                    background-color: #f1f5f9;
                    padding: 4px 6px;
                    text-align: left;
                    border: 1px solid #e2e8f0;
                    font-weight: 600;
                    color: #475569;
                    font-size: 9px;
                }
                
                .attendance-table td {
                    padding: 3px 6px;
                    border: 1px solid #e2e8f0;
                    font-size: 9px;
                }
                
                .attendance-table tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                
                .status-badge {
                    padding: 1px 6px;
                    border-radius: 8px;
                    font-size: 8px;
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
                    .page-break { 
                        page-break-before: always; 
                    }
                    .header {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .employee-section {
                        page-break-inside: avoid;
                    }
                }
                
                @page {
                    margin: 15mm;
                    size: A4;
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
                        <h1 class="header-title">Employee Attendance Report</h1>
                        <p class="header-subtitle">Comprehensive attendance analysis</p>
                        <p class="header-period">Period: ${formatDate(startDate)} to ${formatDate(endDate)}</p>
                    </div>
                    <div class="header-meta">
                        <div class="page-info">Page 1</div>
                        <div class="generation-info">Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>

            ${Object.entries(groupedData).map(([, employeeData], index) => `
                <div class="employee-section ${index > 0 ? 'page-break' : ''}">
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
                                <th style="width: 12%;">Date</th>
                                <th style="width: 12%;">Status</th>
                                <th style="width: 13%;">Clock In</th>
                                <th style="width: 13%;">Clock Out</th>
                                <th style="width: 10%;">Hours</th>
                                <th style="width: 10%;">Overtime</th>
                                <th style="width: 10%;">Late</th>
                                <th style="width: 20%;">Remarks</th>
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
                                        </span>
                                    </td>
                                    <td>${record.attandance_first_clock_in || '-'}</td>
                                    <td>${record.attandance_last_clock_out || '-'}</td>
                                    <td>${record.attandance_hours || '0'}</td>
                                    <td>${record.overtime_hours || '0'}</td>
                                    <td>${record.late_hours || '0'}</td>
                                    <td>${record.remarks || '-'}</td>
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

// Export PDF function
export const exportToPDF = (attendanceData, reportSummary, groupedData, startDate, endDate) => {
    const htmlContent = generatePDFContent(attendanceData, reportSummary, groupedData, startDate, endDate);

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
};