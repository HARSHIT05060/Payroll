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
    const statusInfo = getStatusInfo(status);
    return `<span class="status-badge ${statusInfo.class}">${statusInfo.text}</span>`;
};

// Get status info for styling and text
export const getStatusInfo = (status) => {
    if (status === 1 || status === '1') {
        return { text: 'Active', class: 'status-active' };
    } else if (status === 2 || status === '2') {
        return { text: 'Inactive', class: 'status-inactive' };
    } else {
        return { text: 'N/A', class: 'status-default' };
    }
};

// Generate PDF content for employee directory - BLACK & WHITE THEME
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
                    font-size: 12px;
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
                
                .summary-section {
                    background-color: #f8f8f8;
                    padding: 20px;
                    margin-bottom: 20px;
                    border-radius: 0px;
                    border: 1px solid #ccc;
                }
                
                .summary-title {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    color: black;
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
                    border-radius: 0px;
                    border: 1px solid #ccc;
                    text-align: center;
                }
                
                .summary-label {
                    font-size: 11px;
                    color: #666;
                    margin-bottom: 5px;
                }
                
                .summary-value {
                    font-size: 16px;
                    font-weight: bold;
                    color: black;
                }
                
                .employee-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                    margin-bottom: 20px;
                    border: 1px solid #ccc;
                }
                
                .employee-table th {
                    background: white;
                    color: black;
                    padding: 8px 6px;
                    text-align: center;
                    border: 1px solid #ccc;
                    font-weight: 600;
                    font-size: 10px;
                }
                
                .employee-table td {
                    padding: 6px;
                    border: 1px solid #ccc;
                    text-align: center;
                    font-size: 9px;
                    background: white;
                }
                
                .employee-table tr:nth-child(even) {
                    background-color: #f5f5f5;
                }
                
                .employee-name {
                    font-weight: 600;
                    color: black;
                    font-size: 10px;
                    margin-bottom: 2px;
                }
                
                .employee-id {
                    font-size: 8px;
                    color: #666;
                    font-family: 'Courier New', monospace;
                    background: #f5f5f5;
                    padding: 1px 4px;
                    border-radius: 0px;
                    display: inline-block;
                }
                
                .gender-info {
                    font-size: 8px;
                    color: #666;
                    margin-top: 2px;
                }
                
                .contact-info {
                    line-height: 1.3;
                    text-align: center;
                }
                
                .contact-item {
                    font-size: 8px;
                    color: black;
                    margin-bottom: 2px;
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
                
                .status-active,
                .status-inactive,
                .status-default {
                    background: transparent;
                    color: black;
                    border: none;
                }
                
                .department-tag, .designation-tag, .branch-tag {
                    font-size: 8px;
                    font-weight: normal;
                    padding: 3px 6px;
                    border-radius: 0px;
                    display: inline-block;
                    text-align: center;
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
                    size: A4 landscape;
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
                        <p class="header-subtitle">Employee Directory Report</p>
                        <p class="header-period">${filterInfo.period || `Period: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}</p>
                    </div>
                    <div class="header-meta">
                        <div class="page-info">Page 1</div>
                        <button class="export-pdf-btn" onclick="exportToPDF()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 6px;">
                                <path d="M14 2v6a2 2 0 0 0 2 2h6"/>
                                <path d="M16 13v5"/>
                                <path d="m19 16-3 3-3-3"/>
                                <path d="M6 2h8a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
                            </svg>
                            Export PDF
                        </button>
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
                            <div class="summary-value">${summaryStats.activeEmployees} (${summaryStats.activePercentage}%)</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Inactive Employees</div>
                            <div class="summary-value">${summaryStats.inactiveEmployees}</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Male Employees</div>
                            <div class="summary-value">${summaryStats.maleCount} (${summaryStats.malePercentage}%)</div>
                        </div>
                        <div class="summary-item">
                            <div class="summary-label">Female Employees</div>
                            <div class="summary-value">${summaryStats.femaleCount} (${summaryStats.femalePercentage}%)</div>
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
        return `
                            <tr>
                                <td>${index + 1}</td>
                                <td>
                                    <div class="employee-name">${employee.full_name || 'N/A'}</div>
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
                                        ${employee.email ? `<div class="contact-item">${employee.email}</div>` : ''}
                                        ${employee.phone ? `<div class="contact-item">${employee.phone}</div>` : ''}
                                        ${!employee.email && !employee.phone ? '<div class="contact-item">No contact info</div>' : ''}
                                    </div>
                                </td>
                                <td>${employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString('en-GB') : 'N/A'}</td>
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
 * Enhanced Export to PDF Function - BLACK & WHITE THEME
 * @param {Array} data - Array of employee records to export
 * @param {string} title - Report title
 * @param {Object} filterInfo - Applied filters information (optional)
 * @param {Object} employeeInfo - Employee information for header (optional)
 */
export const exportToPDF = (data, title = 'Employee Directory', filterInfo = {}, employeeInfo = {}) => {
    try {
        // Validate input data
        if (!data || data.length === 0) {
            console.error('No data to export');
            return {
                success: false,
                message: 'No data available to export'
            };
        }

        // Calculate summary statistics
        const summaryStats = calculateEmployeeDirectorySummary(data);

        // Generate HTML content
        const htmlContent = generateEmployeeDirectoryPDFContent(data, title, summaryStats, filterInfo);

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

/**
 * Export Employee Directory Report to PDF
 * @param {Array} reportData - Array of employee records
 * @param {string} fileName - Name for the PDF file
 * @param {string} title - Report title
 * @param {Object} summaryStats - Summary statistics object
 * @param {Object} filterInfo - Applied filters information
 */
export const exportEmployeeDirectoryToPDF = (reportData, fileName, title, summaryStats, filterInfo = {}) => {
    return exportToPDF(reportData, title, filterInfo);
};

// Default export
export default exportToPDF;