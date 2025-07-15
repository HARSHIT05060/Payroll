// utils/excelExportDaterange.js

// Group data by employee (reused from PDF export)
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

// Calculate summary statistics (reused from PDF export)
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




// Export to Excel function
export const exportToExcel = (attendanceData, startDate, endDate, filename = 'attendance_report') => {
    if (!attendanceData || attendanceData.length === 0) {
        console.error('No data to export');
        return;
    }

    const groupedData = groupDataByEmployee(attendanceData);
    const reportSummary = calculateSummary(attendanceData);

    // Prepare data for Excel export
    const excelData = [];

    // Add report header
    excelData.push(['', '',
        'Employee Attendance Report', '', '', '',
    ]);
    excelData.push([
        '',
        `Period: ${formatDate(startDate)} to ${formatDate(endDate)}`,
        `Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}`,
        '',
        `Total Records: ${reportSummary.totalRecords}`,
        `Total Employees: ${reportSummary.uniqueEmployees}`
    ]);

    // Add empty row
    excelData.push(['']);

    // Add summary statistics
    excelData.push(['Summary Statistics', '', '', '', '', '']);
    excelData.push(['Present Days', reportSummary.presentCount, '', 'Absent Days', reportSummary.absentCount, '']);
    excelData.push(['Week Off Days', reportSummary.weekOffCount, '', 'Late Days', reportSummary.lateCount, '']);
    excelData.push(['Total Hours', reportSummary.totalHours, '', 'Overtime Hour', reportSummary.totalOvertimeHours, '']);
    excelData.push(['Late Hour', reportSummary.totalLateHours, '', 'Overtime Days', reportSummary.overtimeCount, '']);

    // Add empty row
    excelData.push(['']);
    excelData.push(['']);

    // Add detailed attendance data for each employee
    Object.entries(groupedData).forEach(([, employeeData]) => {
        // Employee header
        excelData.push([
            `Employee: ${employeeData.employee_name} (${employeeData.employee_code})`,
            `Shift: ${employeeData.shift_name}`,
            `Time: ${employeeData.shift_from_time} - ${employeeData.shift_to_time}`,
            `Attendance: ${employeeData.summary.attendancePercentage}%`,
            `Present: ${employeeData.summary.presentDays}`,
            `Hours: ${employeeData.summary.totalHours}`
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
            'Remarks'
        ]);

        // Employee attendance records
        employeeData.records.forEach(record => {
            excelData.push([
                formatDate(record.date),
                record.status || 'N/A',
                record.attandance_first_clock_in || '-',
                record.attandance_last_clock_out || '-',
                record.attandance_hours || '0',
                record.overtime_hours || '0',
                record.late_hours || '0',
                record.remarks || '-'
            ]);
        });

        // Add empty row between employees
        excelData.push(['']);
        excelData.push(['']);
    });

    // Convert to HTML table format
    const tableHTML = `
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
            <tbody>
                ${excelData.map((row, rowIndex) => `
                    <tr>
                        ${row.map((cell, cellIndex) => {
        // Style for headers and important rows
        let cellStyle = "border: 1px solid #ccc; padding: 8px; text-align: center;";

        // Report title row
        if (rowIndex === 0 && cellIndex === 2) {
            cellStyle += " background-color: #2563eb; color: white; font-weight: bold; font-size: 25px; text-align: center;";
        }
        // Summary statistics header
        else if (cell === 'Summary Statistics') {
            cellStyle += " background-color: #f8fafc; font-weight: bold; color: #2563eb; text-align: center;font-size: 20px;";
        }
        // Employee header rows
        else if (typeof cell === 'string' && cell.startsWith('Employee:')) {
            cellStyle += " background-color: #f8fafc; font-weight: bold; color: #2563eb; text-align: center;font-size: 20px;";
        }
        // Table headers (Date, Status, etc.)
        else if (cell === 'Date' || cell === 'Status' || cell === 'Clock In' || cell === 'Clock Out' ||
            cell === 'Working Hours' || cell === 'Overtime Hours' || cell === 'Late Hours' || cell === 'Remarks') {
            cellStyle += " background-color: #2563eb; color: white; font-weight: bold; text-align: center;";
        }
        // Status column styling
        else if (rowIndex > 0 && excelData[rowIndex - 1] && excelData[rowIndex - 1][1] === 'Status' && cellIndex === 1) {
            if (cell === 'Present') {
                cellStyle += " background-color: #dcfce7; color: #166534; text-align: center;";
            } else if (cell === 'Absent') {
                cellStyle += " background-color: #fef2f2; color: #dc2626;text-align: center;";
            } else if (cell === 'Week Off') {
                cellStyle += " background-color: #dbeafe; color: #2563eb; text-align: center;";
            }
        }

        return `<td style="${cellStyle}">${cell}</td>`;
    }).join('')}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Create and download file
    const blob = new Blob([tableHTML], {
        type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.xls`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};