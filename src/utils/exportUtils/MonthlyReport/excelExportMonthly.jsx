// utils/excelExportEnhanced.js - Black & White Theme

// Group data by employee (enhanced version)
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
            workingDays: records.filter(r => r.shift_status === 'Working Day').length,
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

// Calculate summary statistics (enhanced version)
export const calculateSummary = (data) => {
    const totalRecords = data.length;
    const uniqueEmployees = new Set(data.map(r => r.employee_code)).size;
    const workingDays = data.filter(r => r.shift_status === 'Working Day').length;
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
        workingDays,
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

// Format date helper function
export const formatDate = (dateInput) => {
    const date = new Date(dateInput);

    if (Object.prototype.toString.call(date) !== '[object Date]' || isNaN(date.getTime())) {
        return 'Invalid Date';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
};

/**
 * Enhanced Export to Excel function with Black & White Theme
 * @param {Array} attendanceData - Array of attendance objects to export
 * @param {string} startDate - Start date for the report
 * @param {string} endDate - End date for the report
 * @param {string} filename - Name of the file (without extension)
 * @param {Object} options - Configuration options for the report
 */
export const exportToExcel = (attendanceData, startDate, endDate, filename = 'attendance_report', options = {}) => {
    if (!attendanceData || attendanceData.length === 0) {
        console.error('No data to export');
        throw new Error('No data available to export');
    }

    // Default options
    const defaultOptions = {
        showTitle: true,
        showSummary: true,
        showEmployeeDetails: true,
        reportTitle: 'Employee Attendance Report'
    };
    
    const finalOptions = { ...defaultOptions, ...options };

    const groupedData = groupDataByEmployee(attendanceData);
    const reportSummary = calculateSummary(attendanceData);

    // Prepare data for Excel export
    const excelData = [];

    // Format dates properly
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const currentDate = new Date().toLocaleDateString('en-GB');
    const currentTime = new Date().toLocaleTimeString();

    // Add report header if enabled
    if (finalOptions.showTitle) {
        excelData.push(['', '', '', '',
            finalOptions.reportTitle, '', '', '', '', '', ''
        ]);
        excelData.push([
            '',
            `Period: ${formattedStartDate} to ${formattedEndDate}`,
            `Generated: ${currentDate} ${currentTime}`,
            '',
            `Total Records: ${reportSummary.totalRecords}`,
            `Total Employees: ${reportSummary.uniqueEmployees}`,
            '', '', '', '', ''
        ]);
    }

    // Add empty row
    excelData.push(['']);

    // Add summary statistics if enabled
    if (finalOptions.showSummary) {
        excelData.push(['Summary Statistics', '', '', '', '', '', '', '', '', '', '']);
        excelData.push(['Present Days', reportSummary.presentCount, '', 'Absent Days', reportSummary.absentCount, '', 'Week Off Days', reportSummary.weekOffCount, '', '', '']);
        excelData.push(['Working Days', reportSummary.workingDays, '', 'Late Days', reportSummary.lateCount, '', 'Overtime Days', reportSummary.overtimeCount, '', '', '']);
        excelData.push(['Total Hours', reportSummary.totalHours, '', 'Overtime Hours', reportSummary.totalOvertimeHours, '', 'Late Hours', reportSummary.totalLateHours, '', '', '']);
    }

    // Add empty rows
    excelData.push(['']);
    excelData.push(['']);

    // Add detailed attendance data for each employee if enabled
    if (finalOptions.showEmployeeDetails) {
        Object.entries(groupedData).forEach(([, employeeData]) => {
            // Employee header
            excelData.push([
                `Employee: ${employeeData.employee_name} (${employeeData.employee_code})`,
                `Shift: ${employeeData.shift_name}`,
                `Time: ${employeeData.shift_from_time} - ${employeeData.shift_to_time}`,
                `Attendance: ${employeeData.summary.attendancePercentage}%`,
                `Present: ${employeeData.summary.presentDays}`,
                `Working Days: ${employeeData.summary.workingDays}`,
                `Hours: ${employeeData.summary.totalHours}`,
                `Overtime: ${employeeData.summary.totalOvertimeHours}`,
                '', '', ''
            ]);

            // Attendance table headers
            excelData.push([
                'Date',
                'Status',
                'Clock In',
                'Clock Out',
                'Working Hours',
                'Overtime Hours',
                'Late Hours',
                'Remarks',
                '', '', ''
            ]);

            // Employee attendance records
            employeeData.records.forEach(record => {
                excelData.push([
                    formatDate(record.date),
                    record.status || 'N/A',
                    record.attandance_first_clock_in || '--',
                    record.attandance_last_clock_out || '--',
                    record.attandance_hours || '0',
                    record.overtime_hours || '0',
                    record.late_hours || '0',
                    record.remarks || '--',
                    '', '', ''
                ]);
            });

            // Add empty rows between employees
            excelData.push(['']);
            excelData.push(['']);
        });
    }

    // Convert to HTML table format with black and white theme
    const tableHTML = `
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; border: 2px solid #000;">
            <tbody>
                ${excelData.map((row, rowIndex) => `
                    <tr>
                        ${row.map((cell, cellIndex) => {
        // Base style for all cells
        let cellStyle = "border: 1px solid #000; padding: 8px; text-align: center;";

        // Report title row
        if (rowIndex === 0 && cellIndex === 4) {
            cellStyle += " color: #000; font-weight: bold; font-size: 20px; text-align: center; border: 2px solid #000;";
        }
        // Date and generated info row
        else if (rowIndex === 1 && (cellIndex === 1 || cellIndex === 2 || cellIndex === 4 || cellIndex === 5)) {
            cellStyle += " font-weight: bold; font-size: 14px; border: 1px solid #666;";
        }
        // Summary statistics header
        else if (cell === 'Summary Statistics') {
            cellStyle += " background-color: #f0f0f0; font-weight: bold; font-size: 16px; text-align: center; border: 2px solid #000;";
        }
        // Summary statistics data rows
        else if ((rowIndex >= 4 && rowIndex <= 6) && cell !== '' && 
                 cell !== 'Present Days' && cell !== 'Absent Days' && cell !== 'Week Off Days' && 
                 cell !== 'Working Days' && cell !== 'Late Days' && cell !== 'Overtime Days' && 
                 cell !== 'Total Hours' && cell !== 'Overtime Hours' && cell !== 'Late Hours') {
            if (typeof cell === 'number' || (!isNaN(parseFloat(cell)) && isFinite(cell))) {
                cellStyle += " font-weight: bold; font-size: 14px; border: 1px solid #333;";
            }
        }
        // Summary statistics labels
        else if (cell === 'Present Days' || cell === 'Absent Days' || cell === 'Week Off Days' || 
                 cell === 'Working Days' || cell === 'Late Days' || cell === 'Overtime Days' || 
                 cell === 'Total Hours' || cell === 'Overtime Hours' || cell === 'Late Hours') {
            cellStyle += " font-weight: bold; text-align: left; border: 1px solid #333;";
        }
        // Employee header rows
        else if (typeof cell === 'string' && cell.startsWith('Employee:')) {
            cellStyle += " background-color: #f5f5f5; font-weight: bold; font-size: 16px; text-align: left; border: 2px solid #000;";
        }
        // Employee info (Shift, Time, Attendance, etc.)
        else if (typeof cell === 'string' && (cell.startsWith('Shift:') || cell.startsWith('Time:') || 
                                             cell.startsWith('Attendance:') || cell.startsWith('Present:') || 
                                             cell.startsWith('Working Days:') || cell.startsWith('Hours:') || 
                                             cell.startsWith('Overtime:'))) {
            cellStyle += " background-color: #f8f8f8; font-weight: bold; font-size: 14px; text-align: left; border: 1px solid #333;";
        }
        // Table headers (Date, Status, etc.)
        else if (cell === 'Date' || cell === 'Status' || cell === 'Clock In' || cell === 'Clock Out' ||
                 cell === 'Working Hours' || cell === 'Overtime Hours' || cell === 'Late Hours' || cell === 'Remarks') {
            cellStyle += " background-color: #000; color: #fff; font-weight: bold; text-align: center; border: 2px solid #000; font-size: 14px;";
        }
        // Status column styling for data rows
        else if (cell === 'Present') {
            cellStyle += " background-color: #f9f9f9; font-weight: bold; text-align: center; border: 1px solid #333;";
        } 
        else if (cell === 'Absent') {
            cellStyle += " background-color: #e0e0e0; font-weight: bold; text-align: center; border: 2px solid #666;";
        } 
        else if (cell === 'Week Off') {
            cellStyle += " background-color: #f5f5f5; font-style: italic; font-weight: bold; text-align: center; border: 1px solid #333;";
        }
        // Overtime Hours column styling
        else if (cell !== '--' && cell !== '0' && cell !== '' && 
                 (rowIndex > 0 && excelData[rowIndex - 1] && 
                  excelData[rowIndex - 1].includes('Overtime Hours') && cellIndex === 5)) {
            if (parseFloat(cell) > 0) {
                cellStyle += " background-color: #f8f8f8; font-weight: bold; text-align: center; border: 2px solid #333;";
            }
        }
        // Late Hours column styling
        else if (cell !== '--' && cell !== '0' && cell !== '' && 
                 (rowIndex > 0 && excelData[rowIndex - 1] && 
                  excelData[rowIndex - 1].includes('Late Hours') && cellIndex === 6)) {
            if (parseFloat(cell) > 0) {
                cellStyle += " background-color: #f0f0f0; font-weight: bold; text-align: center; border: 2px solid #333;";
            }
        }
        // Date column styling
        else if (rowIndex > 0 && excelData[rowIndex - 1] && 
                 excelData[rowIndex - 1].includes('Date') && cellIndex === 0 && 
                 cell !== '' && !cell.startsWith('Employee:')) {
            cellStyle += " font-weight: bold; text-align: left; border: 1px solid #333;";
        }
        // Regular data cells
        else if (cell !== '' && rowIndex > 0) {
            cellStyle += " text-align: center; border: 1px solid #666;";
        }

        return `<td style="${cellStyle}">${cell || ''}</td>`;
    }).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Generate filename with formatted dates
    const filenameSuffix = `${formattedStartDate.replace(/\//g, '_')}_to_${formattedEndDate.replace(/\//g, '_')}`;

    // Create and download file
    const blob = new Blob([tableHTML], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${filenameSuffix}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};