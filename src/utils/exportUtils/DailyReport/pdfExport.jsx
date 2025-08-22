// Format date helper
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Format date for title (e.g., "Fri 22 Aug 2025")
export const formatDateForTitle = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
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

        // Format hours fields - but keep status as-is
        ['attandance_hours', 'late_hours', 'overtime_hours'].forEach(field => {
            if (formattedRecord[field]) {
                const hours = parseFloat(formattedRecord[field]);
                formattedRecord[field] = hours > 0 ? `${hours.toFixed(2)}h` : '-';
            }
        });

        // Keep status exactly as received - no modifications
        // formattedRecord.status remains unchanged

        return formattedRecord;
    });
};

const getStatusClass = (status) => {
    return 'status-default';
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

// Generate enhanced PDF content with BLACK & WHITE THEME
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
                
                .attendance-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                    margin-bottom: 20px;
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
                
                /* SHIFT STYLES */
                .shift-working,
                .shift-weekoff {
                    background: transparent;
                    color: black;
                    font-weight: normal;
                }
                
                /* HOURS HIGHLIGHT STYLES */
                .hours-highlight,
                .overtime-highlight {
                    background: transparent;
                    color: black;
                    font-weight: normal;
                    border: none;
                    text-decoration: none;
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
                        
                        <p class="header-subtitle">${employeeInfo.name ? `Employee: ${employeeInfo.name}` : 'Data export report'}</p>
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
 * Enhanced Export to PDF Function - BLACK & WHITE THEME
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