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
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
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
export const generateEmployeeDirectoryPDFContent = (reportData, title, summaryStats, filterInfo = {}) => {
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
                
                .summary-value.pink {
                    color: #ec4899;
                }
                
                .employee-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                    margin-bottom: 20px;
                }
                
                .employee-table th {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    color: white;
                    padding: 8px 6px;
                    text-align: center;
                    border: 1px solid #1d4ed8;
                    font-weight: 600;
                    font-size: 10px;
                }
                
                .employee-table td {
                    padding: 6px;
                    border: 1px solid #e2e8f0;
                    text-align: center;
                    font-size: 9px;
                }
                
                .employee-table tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                
                .employee-name {
                    font-weight: 600;
                    color: #1e293b;
                    font-size: 10px;
                    margin-bottom: 2px;
                }
                
                .employee-id {
                    font-size: 8px;
                    color: #64748b;
                    font-family: 'Courier New', monospace;
                    background: #f1f5f9;
                    padding: 1px 4px;
                    border-radius: 3px;
                    display: inline-block;
                }
                
                .gender-info {
                    font-size: 8px;
                    color: #64748b;
                    margin-top: 2px;
                }
                
                .contact-info {
                    line-height: 1.3;
                    text-align: left;
                }
                
                .contact-item {
                    font-size: 8px;
                    color: #475569;
                    margin-bottom: 2px;
                }
                
                .status-badge {
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 8px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .status-active {
                    background-color: #dcfce7;
                    color: #166534;
                }
                
                .status-inactive {
                    background-color: #fee2e2;
                    color: #dc2626;
                }
                
                .status-default {
                    background-color: #f3f4f6;
                    color: #6b7280;
                }
                
                .department-tag, .designation-tag, .branch-tag {
                    font-size: 8px;
                    font-weight: 500;
                    padding: 3px 6px;
                    border-radius: 4px;
                    display: inline-block;
                    text-align: center;
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
                        <p class="header-subtitle">Employee Directory Report</p>
                        <p class="header-period">${filterInfo.period || `Period: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}</p>
                    </div>
                    <div class="header-meta">
                        <div class="page-info">Page 1</div>
                        <div class="generation-info">Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>

            ${summaryStats ? `
                <div class="summary-section">
                    <div class="summary-title">Employee Directory Summary</div>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <div class="summary-label">Total Employees</div>
                            <div class="summary-value">${summaryStats.totalEmployees}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Active Employees</div>
                            <div class="summary-value success">${summaryStats.activeEmployees} (${summaryStats.activePercentage}%)</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Inactive Employees</div>
                            <div class="summary-value error">${summaryStats.inactiveEmployees}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Male Employees</div>
                            <div class="summary-value info">${summaryStats.maleCount} (${summaryStats.malePercentage}%)</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Female Employees</div>
                            <div class="summary-value pink">${summaryStats.femaleCount} (${summaryStats.femalePercentage}%)</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Departments</div>
                            <div class="summary-value purple">${Object.keys(summaryStats.departmentCounts).length}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Branches</div>
                            <div class="summary-value warning">${Object.keys(summaryStats.branchCounts).length}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Total Designations</div>
                            <div class="summary-value info">${Object.keys(summaryStats.designationCounts).length}</div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <table class="employee-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">S.No</th>
                        <th style="width: 18%;">Employee Details</th>
                        <th style="width: 15%;">Department</th>
                        <th style="width: 15%;">Designation</th>
                        <th style="width: 12%;">Branch</th>
                        <th style="width: 20%;">Contact Info</th>
                        <th style="width: 10%;">Join Date</th>
                        <th style="width: 5%;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.map((employee, index) => {
                        const joinDate = formatDate(employee.joining_date);
                        
                        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>
                                    <div class="employee-name">${employee.full_name || 'N/A'}</div>
                                    <div class="employee-id">${employee.employee_id || 'N/A'}</div>
                                    <div class="gender-info">${employee.gender || 'N/A'}</div>
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
                                        ${employee.email ? `<div class="contact-item">📧 ${employee.email}</div>` : ''}
                                        ${employee.phone ? `<div class="contact-item">📱 ${employee.phone}</div>` : ''}
                                        ${!employee.email && !employee.phone ? '<div class="contact-item">No contact info</div>' : ''}
                                    </div>
                                </td>
                                <td>${joinDate}</td>
                                <td>
                                    ${generateStatusBadge(employee.status)}
                                </td>
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
                printWindow.close();
            }, 500);
        };

        return {
            success: true,
            message: 'PDF exported successfully!'
        };

    } catch (error) {
        console.error('Error exporting Employee Directory PDF:', error);
        return {
            success: false,
            message: 'Failed to export PDF: ' + error.message
        };
    }
};

// Alternative export name for consistency
export const exportToPDF = exportEmployeeDirectoryToPDF;

// Default export
export default exportEmployeeDirectoryToPDF;