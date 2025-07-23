// utils/pdfExportSalary.js

// Calculate salary summary statistics
export const calculateSalarySummary = (reportData) => {
    const totalEmployees = reportData.length;
    const totalBaseSalary = reportData.reduce((sum, emp) => sum + parseFloat(emp.employee_salary || 0), 0);
    const totalPaidSalary = reportData.reduce((sum, emp) => sum + parseFloat(emp.total_salary || 0), 0);
    const totalOvertimeSalary = reportData.reduce((sum, emp) => sum + parseFloat(emp.overtime_salary || 0), 0);
    const totalWeekOffSalary = reportData.reduce((sum, emp) => sum + parseFloat(emp.week_off_salary || 0), 0);
    const totalPresentDays = reportData.reduce((sum, emp) => sum + parseInt(emp.present_days || 0), 0);
    const totalAbsentDays = reportData.reduce((sum, emp) => sum + parseInt(emp.absent_days || 0), 0);
    const totalWorkingDays = reportData.reduce((sum, emp) => sum + parseInt(emp.working_days || 0), 0);
    const averageSalary = totalEmployees > 0 ? (totalPaidSalary / totalEmployees) : 0;

    return {
        totalEmployees,
        totalBaseSalary: totalBaseSalary.toFixed(2),
        totalPaidSalary: totalPaidSalary.toFixed(2),
        totalOvertimeSalary: totalOvertimeSalary.toFixed(2),
        totalWeekOffSalary: totalWeekOffSalary.toFixed(2),
        totalPresentDays,
        totalAbsentDays,
        totalWorkingDays,
        averageSalary: averageSalary.toFixed(2)
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

// Generate PDF content for salary report
export const generateSalaryPDFContent = (reportData, title, summaryStats, filterInfo = {}, employeeInfo = {}) => {
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
                
                .salary-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                    margin-bottom: 20px;
                }
                
                .salary-table th {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 8px 6px;
                    text-align: center;
                    border: 1px solid #1d4ed8;
                    font-weight: 600;
                    font-size: 10px;
                }
                
                .salary-table td {
                    padding: 6px;
                    border: 1px solid #e2e8f0;
                    text-align: center;
                    font-size: 9px;
                }
                
                .salary-table tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                
                .currency {
                    font-weight: bold;
                    color: #059669;
                }
                
                .employee-info {
                    text-align: left;
                }
                
                .employee-name {
                    font-weight: bold;
                    color: #1e293b;
                }
                
                .employee-code {
                    font-size: 8px;
                    color: #64748b;
                }
                
                .attendance-details {
                    font-size: 8px;
                    line-height: 1.3;
                }
                
                .attendance-present {
                    color: #059669;
                }
                
                .attendance-absent {
                    color: #dc2626;
                }
                
                .attendance-working {
                    color: #2563eb;
                }
                
                .overtime-details {
                    font-size: 8px;
                    line-height: 1.3;
                }
                
                .total-salary {
                    font-weight: bold;
                    font-size: 11px;
                    color: #059669;
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
                        <p class="header-subtitle">${employeeInfo.department ? `Department: ${employeeInfo.department}` : 'Monthly salary breakdown and analysis'}</p>
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
                    <div class="summary-title">Salary Summary</div>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-label">Total Employees</div>
                            <div class="summary-value info">${summaryStats.totalEmployees}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Base Salary</div>
                            <div class="summary-value">₹${parseFloat(summaryStats.totalBaseSalary).toLocaleString('en-IN')}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Paid Salary</div>
                            <div class="summary-value success">₹${parseFloat(summaryStats.totalPaidSalary).toLocaleString('en-IN')}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Overtime</div>
                            <div class="summary-value warning">₹${parseFloat(summaryStats.totalOvertimeSalary).toLocaleString('en-IN')}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Week Off Salary</div>
                            <div class="summary-value purple">₹${parseFloat(summaryStats.totalWeekOffSalary).toLocaleString('en-IN')}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Average Salary</div>
                            <div class="summary-value info">₹${parseFloat(summaryStats.averageSalary).toLocaleString('en-IN')}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Present Days</div>
                            <div class="summary-value success">${summaryStats.totalPresentDays}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Absent Days</div>
                            <div class="summary-value error">${summaryStats.totalAbsentDays}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Working Days</div>
                            <div class="summary-value info">${summaryStats.totalWorkingDays}</div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <table class="salary-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">S.No</th>
                        <th style="width: 15%;">Employee</th>
                        <th style="width: 10%;">Base Salary</th>
                        <th style="width: 12%;">Attendance</th>
                        <th style="width: 12%;">Overtime</th>
                        <th style="width: 12%;">Week Off</th>
                        <th style="width: 10%;">Subtotal</th>
                        <th style="width: 12%;">Total Salary</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.map((employee, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td class="employee-info">
                                <div class="employee-name">${employee.employee_name || 'N/A'}</div>
                                <div class="employee-code">${employee.employee_code || 'N/A'}</div>
                            </td>
                            <td class="currency">₹${parseFloat(employee.employee_salary || 0).toLocaleString('en-IN')}</td>
                            <td class="attendance-details">
                                <div class="attendance-present">P: ${employee.present_days || 0}</div>
                                <div class="attendance-absent">A: ${employee.absent_days || 0}</div>
                                <div class="attendance-working">W: ${employee.working_days || 0}</div>
                            </td>
                            <td class="overtime-details">
                                <div>Days: ${employee.overtime_days || 0}</div>
                                <div class="currency">₹${parseFloat(employee.overtime_salary || 0).toLocaleString('en-IN')}</div>
                            </td>
                            <td class="overtime-details">
                                <div>Days: ${employee.week_off_days || 0}</div>
                                <div class="currency">₹${parseFloat(employee.week_off_salary || 0).toLocaleString('en-IN')}</div>
                            </td>
                            <td class="currency">₹${parseFloat(employee.subtotal_salary || 0).toLocaleString('en-IN')}</td>
                            <td class="total-salary">₹${parseFloat(employee.total_salary || 0).toLocaleString('en-IN')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

        </body>
        </html>
    `;
};

/**
 * Enhanced Export Salary Report to PDF
 * @param {Array} reportData - Array of salary records
 * @param {string} title - Report title
 * @param {Object} filterInfo - Applied filters information
 * @param {Object} employeeInfo - Employee information for header
 */
export const exportToPDF = (reportData, title = 'Monthly Salary Report', filterInfo = {}, employeeInfo = {}) => {
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
        const summaryStats = calculateSalarySummary(reportData);

        // Generate HTML content
        const htmlContent = generateSalaryPDFContent(reportData, title, summaryStats, filterInfo, employeeInfo);

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
export const exportSalaryReportToPDF = (reportData, fileName, title, summaryStats, filterInfo = {}, employeeInfo = {}) => {
    return exportToPDF(reportData, title, filterInfo, employeeInfo);
};