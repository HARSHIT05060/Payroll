// utils/enhancedPdfExport.js

// Format date helper
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Get dynamic table headers from data
export const getTableHeaders = (data) => {
    if (!data || data.length === 0) return [];

    const headers = Object.keys(data[0]);

    // Add S.No column if not present
    if (!headers.includes('S.No') && !headers.includes('s_no')) {
        headers.unshift('S.No');
    }

    return headers;
};

// Format table data
export const formatTableData = (data) => {
    if (!data || data.length === 0) return [];

    return data.map((record, index) => {
        const formattedRecord = { ...record };

        // Add S.No if not present
        if (!formattedRecord['S.No'] && !formattedRecord['s_no']) {
            formattedRecord['S.No'] = index + 1;
        }

        // Format date fields
        if (formattedRecord.date) {
            formattedRecord.date = formatDate(formattedRecord.date);
        }

        // Format hours fields
        ['attandance_hours', 'late_hours', 'overtime_hours'].forEach(field => {
            if (formattedRecord[field]) {
                const hours = parseFloat(formattedRecord[field]);
                formattedRecord[field] = hours > 0 ? `${hours.toFixed(2)}h` : '-';
            }
        });

        return formattedRecord;
    });
};

// Helper functions for styling
const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
        case 'present': return 'status-present';
        case 'absent': return 'status-absent';
        case 'week off': case 'weekoff': return 'status-week-off';
        case 'holiday': return 'status-holiday';
        case 'leave': return 'status-leave';
        case 'half day': return 'status-half-day';
        case 'late': return 'status-late';
        case 'overtime': return 'status-overtime';
        default: return 'status-default';
    }
};

const getShiftClass = (shiftStatus) => {
    const shiftLower = shiftStatus?.toLowerCase();
    if (shiftLower === 'working day') return 'shift-working';
    if (shiftLower === 'week off' || shiftLower === 'weekoff') return 'shift-weekoff';
    return '';
};

const getHoursClass = (header, value) => {
    const headerLower = header.toLowerCase();
    if (value !== '-' && parseFloat(value) > 0) {
        if (headerLower.includes('late')) return 'hours-highlight';
        if (headerLower.includes('overtime')) return 'overtime-highlight';
    }
    return '';
};

// Generate enhanced PDF content
export const generateEnhancedPDFContent = (reportData, title, filterInfo = {}, employeeInfo = {}) => {
    const headers = getTableHeaders(reportData);
    const formattedData = formatTableData(reportData);

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
                    display: inline-block;
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
                
                .status-late {
                    background-color: #fef9c3;
                    color: #ca8a04;
                }
                
                .status-overtime {
                    background-color: #dcfce7;
                    color: #166534;
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
                        
                        <p class="header-subtitle">${employeeInfo.name ? `Employee: ${employeeInfo.name}` : 'Data export report'}</p>
                        <p class="header-period">${filterInfo.period || filterInfo.month_year ? `Period: ${filterInfo.period || filterInfo.month_year}` : ''}</p>
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

            <table class="attendance-table">
                <thead>
                    <tr>
                        ${headers.map(header => `<th>${header.replace('_', ' ').toUpperCase()}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${formattedData.map((record) => {
        return `
                            <tr>
                                ${headers.map(header => {
            const value = record[header] || '-';

            // Apply special styling for status columns
            if (header.toLowerCase().includes('status')) {
                const statusClass = getStatusClass(value);
                return `<td><span class="status-badge ${statusClass}">${value}</span></td>`;
            }

            // Apply special styling for shift columns
            if (header.toLowerCase().includes('shift')) {
                const shiftClass = getShiftClass(value);
                return `<td class="${shiftClass}">${value}</td>`;
            }

            // Apply special styling for hours columns
            if (header.toLowerCase().includes('hours')) {
                const hoursClass = getHoursClass(header, value);
                return `<td class="${hoursClass}">${value}</td>`;
            }

            return `<td>${value}</td>`;
        }).join('')}
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
 * Enhanced Export to PDF Function
 * @param {Array} data - Array of records to export
 * @param {string} title - Report title
 * @param {Object} filterInfo - Applied filters information (optional)
 * @param {Object} employeeInfo - Employee information for header (optional)
 */
export const exportToPDF = (data, title = 'Daily Report', filterInfo = {}, employeeInfo = {}) => {
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
        const htmlContent = generateEnhancedPDFContent(data, title, filterInfo, employeeInfo);

        // Create a new window for PDF generation
        const printWindow = window.open('', '_blank');
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Wait for content to load then print
        // printWindow.onload = () => {
        //     setTimeout(() => {
        //         printWindow.print();
        //         printWindow.close();
        //     }, 500);
        // };

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

// Additional utility functions for compatibility

/**
 * Calculate monthly summary statistics (for compatibility with monthly reports)
 * @param {Array} reportData - Array of attendance records
 */
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

