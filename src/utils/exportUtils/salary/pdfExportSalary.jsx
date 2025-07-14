export const generateSalaryPDFContent = (reportData, title, summaryStats, filterInfo = {}) => {
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
                        <p class="header-subtitle">Monthly salary breakdown and analysis</p>
                        <p class="header-period">${filterInfo.month_year ? `Period: ${filterInfo.month_year}` : ''}</p>
                    </div>
                    <div class="header-meta">
                        <div class="page-info">Page 1</div>
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
                            <div class="summary-value">₹${summaryStats.totalBaseSalary.toLocaleString('en-IN')}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Paid Salary</div>
                            <div class="summary-value success">₹${summaryStats.totalPaidSalary.toLocaleString('en-IN')}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Overtime</div>
                            <div class="summary-value warning">₹${summaryStats.totalOvertimeSalary.toLocaleString('en-IN')}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Average Salary</div>
                            <div class="summary-value purple">₹${summaryStats.averageSalary.toLocaleString('en-IN')}</div>
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

export const exportSalaryReportToPDF = (reportData, fileName, title, summaryStats, filterInfo = {}) => {
    try {
        // Generate HTML content
        const htmlContent = generateSalaryPDFContent(reportData, title, summaryStats, filterInfo);

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