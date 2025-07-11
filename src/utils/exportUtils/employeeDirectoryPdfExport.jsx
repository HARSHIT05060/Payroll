// utils/employeeDirectoryPdfExport.js

// Calculate employee directory summary statistics
export const calculateEmployeeDirectorySummary = (reportData) => {
    if (!reportData || reportData.length === 0) return null;

    const totalEmployees = reportData.length;
    const activeEmployees = reportData.filter(emp => emp.status?.toLowerCase() === 'active').length;
    const inactiveEmployees = reportData.filter(emp => emp.status?.toLowerCase() === 'inactive').length;

    // Gender distribution
    const maleCount = reportData.filter(emp => emp.gender?.toLowerCase() === 'male').length;
    const femaleCount = reportData.filter(emp => emp.gender?.toLowerCase() === 'female').length;

    // Department distribution
    const departmentCounts = {};
    reportData.forEach(emp => {
        if (emp.department_name) {
            departmentCounts[emp.department_name] = (departmentCounts[emp.department_name] || 0) + 1;
        }
    });

    // Branch distribution
    const branchCounts = {};
    reportData.forEach(emp => {
        if (emp.branch_name) {
            branchCounts[emp.branch_name] = (branchCounts[emp.branch_name] || 0) + 1;
        }
    });

    // Designation distribution
    const designationCounts = {};
    reportData.forEach(emp => {
        if (emp.designation_name) {
            designationCounts[emp.designation_name] = (designationCounts[emp.designation_name] || 0) + 1;
        }
    });

    // Calculate percentages
    const activePercentage = totalEmployees > 0 ? ((activeEmployees / totalEmployees) * 100).toFixed(1) : 0;
    const malePercentage = totalEmployees > 0 ? ((maleCount / totalEmployees) * 100).toFixed(1) : 0;
    const femalePercentage = totalEmployees > 0 ? ((femaleCount / totalEmployees) * 100).toFixed(1) : 0;

    return {
        totalEmployees,
        activeEmployees,
        inactiveEmployees,
        maleCount,
        femaleCount,
        departmentCounts,
        branchCounts,
        designationCounts,
        activePercentage,
        malePercentage,
        femalePercentage
    };
};

// Format date for display
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

// Generate status badge HTML
export const generateStatusBadge = (status) => {
    const statusClass = getStatusClass(status);
    return `<span class="status-badge ${statusClass}">${status || 'N/A'}</span>`;
};

// Get status class for styling
export const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'active': return 'status-active';
        case 'inactive': return 'status-inactive';
        default: return 'status-default';
    }
};

// Generate PDF content for employee directory
export const generateEmployeeDirectoryPDFContent = (reportData, title, summaryStats) => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB');
    const formattedTime = currentDate.toLocaleTimeString('en-GB', { hour12: false });
    const monthYear = currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    margin: 0;
                    padding: 0;
                    color: #2c3e50;
                    line-height: 1.2;
                    font-size: 10px;
                    background-color: #ffffff;
                }
                
                .header {
                    background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
                    color: white;
                    padding: 12px 20px;
                    margin-bottom: 15px;
                    border-radius: 0 0 8px 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .logo-area {
                    width: 50px;
                    height: 50px;
                    background: rgba(255,255,255,0.15);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 15px;
                    font-size: 10px;
                    font-weight: bold;
                    color: white;
                    border: 2px solid rgba(255,255,255,0.3);
                }
                
                .header-info {
                    flex: 1;
                }
                
                .header-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 4px 0;
                    letter-spacing: 0.5px;
                }
                
                .header-subtitle {
                    font-size: 11px;
                    margin: 0 0 2px 0;
                    opacity: 0.9;
                    font-weight: 400;
                }
                
                .header-period {
                    font-size: 10px;
                    margin: 0;
                    opacity: 0.8;
                    font-weight: 500;
                }
                
                .header-meta {
                    text-align: right;
                    font-size: 9px;
                    opacity: 0.9;
                }
                
                .summary-section {
                    background: #f8fafc;
                    padding: 15px;
                    margin-bottom: 15px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                
                .summary-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 12px;
                    color: #1e3a8a;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 12px;
                    margin-bottom: 10px;
                }
                
                .summary-item {
                    background: white;
                    padding: 10px;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                    text-align: center;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }
                
                .summary-label {
                    font-size: 8px;
                    color: #64748b;
                    margin-bottom: 4px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }
                
                .summary-value {
                    font-size: 14px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 2px;
                }
                
                .summary-percentage {
                    font-size: 8px;
                    color: #64748b;
                    font-weight: 400;
                }
                
                .summary-value.success { color: #059669; }
                .summary-value.error { color: #dc2626; }
                .summary-value.warning { color: #d97706; }
                .summary-value.info { color: #2563eb; }
                .summary-value.purple { color: #7c3aed; }
                .summary-value.pink { color: #ec4899; }
                
                .employee-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 9px;
                    margin-bottom: 15px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                    border-radius: 6px;
                    overflow: hidden;
                    background: white;
                }
                
                .employee-table th {
                    background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
                    color: white;
                    padding: 8px 6px;
                    text-align: left;
                    font-weight: 600;
                    font-size: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    border-bottom: 2px solid #1e40af;
                }
                
                .employee-table td {
                    padding: 6px;
                    border-bottom: 1px solid #f1f5f9;
                    font-size: 8px;
                    vertical-align: middle;
                }
                
                .employee-table tr:nth-child(even) {
                    background-color: #f8fafc;
                }
                
                .employee-table tr:hover {
                    background-color: #f1f5f9;
                }
                
                .employee-name {
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 9px;
                    margin-bottom: 1px;
                }
                
                .employee-id {
                    font-size: 7px;
                    color: #64748b;
                    font-family: 'Courier New', monospace;
                    background: #f1f5f9;
                    padding: 1px 3px;
                    border-radius: 3px;
                }
                
                .employee-details {
                    line-height: 1.3;
                }
                
                .gender-info {
                    font-size: 7px;
                    color: #64748b;
                    margin-top: 2px;
                }
                
                .contact-info {
                    line-height: 1.2;
                }
                
                .contact-item {
                    font-size: 7px;
                    color: #475569;
                    margin-bottom: 1px;
                    display: flex;
                    align-items: center;
                    gap: 3px;
                }
                
                .contact-icon {
                    font-size: 8px;
                    width: 8px;
                    text-align: center;
                }
                
                .status-badge {
                    padding: 2px 6px;
                    border-radius: 8px;
                    font-size: 7px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    border: 1px solid transparent;
                }
                
                .status-active {
                    background: #dcfce7;
                    color: #166534;
                    border-color: #bbf7d0;
                }
                
                .status-inactive {
                    background: #fee2e2;
                    color: #dc2626;
                    border-color: #fecaca;
                }
                
                .status-default {
                    background: #f3f4f6;
                    color: #6b7280;
                    border-color: #d1d5db;
                }
                
                .department-tag, .designation-tag, .branch-tag {
                    font-size: 7px;
                    font-weight: 500;
                    padding: 2px 5px;
                    border-radius: 4px;
                    text-align: center;
                    line-height: 1.2;
                }
                
                .department-tag {
                    background: #dbeafe;
                    color: #1e40af;
                }
                
                .designation-tag {
                    background: #fef3c7;
                    color: #d97706;
                }
                
                .branch-tag {
                    background: #f3e8ff;
                    color: #7c3aed;
                }
                
                .footer {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 8px;
                    color: #64748b;
                    border-top: 1px solid #e2e8f0;
                    padding: 8px;
                    background: white;
                    box-shadow: 0 -1px 3px rgba(0,0,0,0.1);
                }
                
                .report-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    padding: 8px 12px;
                    background: #f8fafc;
                    border-radius: 6px;
                    border-left: 3px solid #3b82f6;
                }
                
                .report-period {
                    font-size: 10px;
                    font-weight: 600;
                    color: #1e40af;
                }
                
                .report-count {
                    font-size: 9px;
                    color: #64748b;
                }
                
                @media print {
                    body { 
                        margin: 0; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .header, .employee-table th, .status-badge {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .summary-section {
                        page-break-inside: avoid;
                    }
                    .employee-table {
                        page-break-inside: auto;
                    }
                    .employee-table tr {
                        page-break-inside: avoid;
                    }
                }
                
                @page {
                    margin: 12mm;
                    size: A4 landscape;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="header-content">
                    <div class="logo-area">
                        LOGO
                    </div>
                    <div class="header-info">
                        <h1 class="header-title">${title}</h1>
                        <p class="header-subtitle">Employee Directory Report</p>
                        <p class="header-period">Period: ${monthYear}</p>
                    </div>
                    <div class="header-meta">
                        <div>Report Date: ${formattedDate}</div>
                        <div>Generated: ${formattedTime}</div>
                    </div>
                </div>
            </div>

            <div class="report-meta">
                <div class="report-period">Monthly Employee Directory - ${monthYear}</div>
                <div class="report-count">Total Records: ${reportData.length} employees</div>
            </div>

            ${summaryStats ? `
                <div class="summary-section">
                    <div class="summary-title">
                        📊 Employee Statistics Summary
                    </div>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-label">Total Staff</div>
                            <div class="summary-value info">${summaryStats.totalEmployees}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Active</div>
                            <div class="summary-value success">${summaryStats.activeEmployees}</div>
                            <div class="summary-percentage">${summaryStats.activePercentage}%</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Male</div>
                            <div class="summary-value info">${summaryStats.maleCount}</div>
                            <div class="summary-percentage">${summaryStats.malePercentage}%</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Female</div>
                            <div class="summary-value pink">${summaryStats.femaleCount}</div>
                            <div class="summary-percentage">${summaryStats.femalePercentage}%</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Departments</div>
                            <div class="summary-value purple">${Object.keys(summaryStats.departmentCounts).length}</div>
                            <div class="summary-percentage">Active</div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <table class="employee-table">
                <thead>
                    <tr>
                        <th style="width: 4%;">No.</th>
                        <th style="width: 20%;">Employee Details</th>
                        <th style="width: 16%;">Department</th>
                        <th style="width: 16%;">Designation</th>
                        <th style="width: 12%;">Branch</th>
                        <th style="width: 20%;">Contact Info</th>
                        <th style="width: 8%;">Join Date</th>
                        <th style="width: 4%;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.map((employee, index) => {
                        const joinDate = formatDate(employee.joining_date);
                        
                        return `
                            <tr>
                                <td style="text-align: center; font-weight: 600; color: #64748b;">${index + 1}</td>
                                <td>
                                    <div class="employee-details">
                                        <div class="employee-name">${employee.full_name || 'N/A'}</div>
                                        <div class="employee-id">ID: ${employee.employee_id || 'N/A'}</div>
                                        <div class="gender-info">${employee.gender || 'N/A'}</div>
                                    </div>
                                </td>
                                <td>
                                    <div class="department-tag">${employee.department_name || 'N/A'}</div>
                                </td>
                                <td>
                                    <div class="designation-tag">${employee.designation_name || 'N/A'}</div>
                                </td>
                                <td>
                                    <div class="branch-tag">${employee.branch_name || 'N/A'}</div>
                                </td>
                                <td>
                                    <div class="contact-info">
                                        ${employee.email ? `
                                            <div class="contact-item">
                                                <span class="contact-icon">📧</span>
                                                <span>${employee.email}</span>
                                            </div>
                                        ` : ''}
                                        ${employee.phone ? `
                                            <div class="contact-item">
                                                <span class="contact-icon">📱</span>
                                                <span>${employee.phone}</span>
                                            </div>
                                        ` : ''}
                                        ${!employee.email && !employee.phone ? '<span style="color: #9ca3af;">No contact</span>' : ''}
                                    </div>
                                </td>
                                <td style="text-align: center; font-family: monospace; font-size: 8px;">
                                    ${joinDate}
                                </td>
                                <td style="text-align: center;">
                                    ${generateStatusBadge(employee.status)}
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>

            <div class="footer">
                <p>Employee Directory Report - ${monthYear} | Generated: ${formattedDate} at ${formattedTime} | Records: ${reportData.length} | Confidential</p>
            </div>
        </body>
        </html>
    `;
};

/**
 * Export Employee Directory Report to PDF
 * @param {Array} reportData - Array of employee records
 * @param {string} fileName - Name for the PDF file
 * @param {string} title - Report title
 * @param {Object} summaryStats - Summary statistics object
 * @param {Object} filterInfo - Applied filters information
 */
export const exportEmployeeDirectoryToPDF = (reportData, fileName, title, summaryStats, filterInfo = {}) => {
    try {
        // Validate input data
        if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
            throw new Error('No employee data available for export');
        }

        // Calculate summary stats if not provided
        if (!summaryStats) {
            summaryStats = calculateEmployeeDirectorySummary(reportData);
        }

        // Generate HTML content
        const htmlContent = generateEmployeeDirectoryPDFContent(
            reportData,
            title || 'Employee Directory',
            summaryStats,
            filterInfo
        );

        // Create a new window for PDF generation
        const printWindow = window.open('', '_blank');

        if (!printWindow) {
            throw new Error('Unable to open print window. Please check popup blocker settings.');
        }

        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load then print
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
                // Close window after printing
                setTimeout(() => {
                    printWindow.close();
                }, 1000);
            }, 500);
        };

        // Handle print window errors
        printWindow.onerror = (error) => {
            console.error('Print window error:', error);
            printWindow.close();
        };

        return {
            success: true,
            message: 'PDF export initiated successfully! Check your browser\'s print dialog.'
        };

    } catch (error) {
        console.error('Error exporting Employee Directory PDF:', error);
        return {
            success: false,
            message: 'Failed to export PDF: ' + error.message
        };
    }
};

// Default export
export default exportEmployeeDirectoryToPDF;