// utils/payrollExcelExport.js - Black & White Theme

// Group data by employee (if needed for payroll)
export const groupPayrollDataByEmployee = (data) => {
    const grouped = {};

    data.forEach(record => {
        const employeeKey = record.employee_code || record.id;
        if (!grouped[employeeKey]) {
            grouped[employeeKey] = {
                employee_code: record.employee_code || record.id,
                employee_name: record.employee_name || record.name || record.Name,
                department: record.department || '',
                designation: record.designation || '',
                records: []
            };
        }
        grouped[employeeKey].records.push(record);
    });

    return grouped;
};

// Calculate payroll summary statistics
export const calculatePayrollSummary = (data) => {
    const totalEmployees = data.length;
    const totalBaseSalary = data.reduce((sum, r) => sum + parseFloat(r.employee_salary || 0), 0);
    const totalWorkingDays = data.reduce((sum, r) => sum + parseFloat(r.working_days || 0), 0);
    const totalWeekOffDays = data.reduce((sum, r) => sum + parseFloat(r.week_off_days || 0), 0);
    const totalPresentDays = data.reduce((sum, r) => sum + parseFloat(r.present_days || 0), 0);
    const totalAbsentDays = data.reduce((sum, r) => sum + parseFloat(r.absent_days || 0), 0);
    const totalOvertimeDays = data.reduce((sum, r) => sum + parseFloat(r.overtime_days || 0), 0);
    const totalSubtotalSalary = data.reduce((sum, r) => sum + parseFloat(r.subtotal_salary || 0), 0);
    const totalOvertimeSalary = data.reduce((sum, r) => sum + parseFloat(r.overtime_salary || 0), 0);
    const totalWeekOffSalary = data.reduce((sum, r) => sum + parseFloat(r.week_off_salary || 0), 0);
    const totalNetSalary = data.reduce((sum, r) => sum + parseFloat(r.total_salary || 0), 0);

    return {
        totalEmployees,
        totalBaseSalary: totalBaseSalary.toFixed(2),
        totalWorkingDays: totalWorkingDays.toFixed(0),
        totalWeekOffDays: totalWeekOffDays.toFixed(0),
        totalPresentDays: totalPresentDays.toFixed(0),
        totalAbsentDays: totalAbsentDays.toFixed(0),
        totalOvertimeDays: totalOvertimeDays.toFixed(0),
        totalSubtotalSalary: totalSubtotalSalary.toFixed(2),
        totalOvertimeSalary: totalOvertimeSalary.toFixed(2),
        totalWeekOffSalary: totalWeekOffSalary.toFixed(2),
        totalNetSalary: totalNetSalary.toFixed(2)
    };
};

// Format currency for display
export const formatCurrency = (amount) => {
    return parseFloat(amount || 0).toFixed(2);
};

// Format date
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
 * Export payroll to Excel function - Black & White Theme
 * @param {Array} payrollData - Array of payroll objects to export
 * @param {string} monthYear - Month and year for the report
 * @param {string} filename - Name of the file (without extension)
 * @param {string} title - Report title
 * @param {Function} getMonthYearDisplay - Function to format month/year display
 */
export const exportPayrollToExcel = (
    payrollData,
    monthYear = null,
    filename = 'payroll_report',
    title = 'Monthly Salary Report',
    getMonthYearDisplay = null
) => {
    if (!payrollData || payrollData.length === 0) {
        console.error('No data to export');
        throw new Error('No data available to export');
    }

    const payrollSummary = calculatePayrollSummary(payrollData);
    const monthDisplay = getMonthYearDisplay ? getMonthYearDisplay(monthYear) : (monthYear || 'Current Period');
    const currentDate = new Date().toLocaleDateString('en-GB');
    const currentTime = new Date().toLocaleTimeString();

    // Prepare data for Excel export
    const excelData = [];

    // Add report header
    excelData.push(['', '', '', '',
        title, '', '', '', '', '', '', '', ''
    ]);
    excelData.push([
        '',
        `Period: ${monthDisplay}`,
        `Generated: ${currentDate} ${currentTime}`,
        '',
        `Total Employees: ${payrollSummary.totalEmployees}`,
        `Total Net Salary: ₹${payrollSummary.totalNetSalary}`,
        '', '', '', '', '', '', ''
    ]);

    // Add empty row
    excelData.push(['']);

    // Add summary statistics
    excelData.push(['Payroll Summary', '', '', '', '', '', '', '', '', '', '', '', '']);
    excelData.push(['Payroll Month', monthDisplay, '', 'Total Employees', payrollSummary.totalEmployees, '', '', '', '', '', '', '', '']);
    excelData.push(['Total Base Salary', `₹${payrollSummary.totalBaseSalary}`, '', 'Total Working Days', payrollSummary.totalWorkingDays, '', '', '', '', '', '', '', '']);
    excelData.push(['Total Present Days', payrollSummary.totalPresentDays, '', 'Total Absent Days', payrollSummary.totalAbsentDays, '', '', '', '', '', '', '', '']);
    excelData.push(['Total Week Off Days', payrollSummary.totalWeekOffDays, '', 'Total Overtime Days', payrollSummary.totalOvertimeDays, '', '', '', '', '', '', '', '']);
    excelData.push(['Total Subtotal Salary', `₹${payrollSummary.totalSubtotalSalary}`, '', 'Total Overtime Salary', `₹${payrollSummary.totalOvertimeSalary}`, '', '', '', '', '', '', '', '']);
    excelData.push(['Total Week Off Salary', `₹${payrollSummary.totalWeekOffSalary}`, '', 'NET PAYROLL AMOUNT', `₹${payrollSummary.totalNetSalary}`, '', '', '', '', '', '', '', '']);

    // Add empty rows
    excelData.push(['']);
    excelData.push(['']);

    // Add detailed payroll data headers
    excelData.push([
        'NO.',
        'Employee Code',
        'Employee Name',
        'Base Salary',
        'Working Days',
        'Week Off Days',
        'Present Days',
        'Absent Days',
        'Overtime Days',
        'Subtotal Salary',
        'Overtime Salary',
        'Week Off Salary',
        'Total Salary'
    ]);

    // Add payroll data rows
    payrollData.forEach((record, index) => {
        excelData.push([
            index + 1,
            record.employee_code || '',
            record.employee_name || '',
            `₹${formatCurrency(record.employee_salary)}`,
            record.working_days || 0,
            record.week_off_days || 0,
            record.present_days || 0,
            record.absent_days || 0,
            record.overtime_days || 0,
            `₹${formatCurrency(record.subtotal_salary)}`,
            `₹${formatCurrency(record.overtime_salary)}`,
            `₹${formatCurrency(record.week_off_salary)}`,
            `₹${formatCurrency(record.total_salary)}`
        ]);
    });

    // Add totals row
    excelData.push([
        '',
        '',
        'TOTAL',
        `₹${payrollSummary.totalBaseSalary}`,
        payrollSummary.totalWorkingDays,
        payrollSummary.totalWeekOffDays,
        payrollSummary.totalPresentDays,
        payrollSummary.totalAbsentDays,
        payrollSummary.totalOvertimeDays,
        `₹${payrollSummary.totalSubtotalSalary}`,
        `₹${payrollSummary.totalOvertimeSalary}`,
        `₹${payrollSummary.totalWeekOffSalary}`,
        `₹${payrollSummary.totalNetSalary}`
    ]);

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
        // Payroll summary header
        else if (cell === 'Payroll Summary') {
            cellStyle += " background-color: #f0f0f0; font-weight: bold; font-size: 16px; text-align: center; border: 2px solid #000;";
        }
        // Summary statistics data rows
        else if ((rowIndex >= 4 && rowIndex <= 9) && cell !== '' && 
                 cell !== 'Payroll Month' && cell !== 'Total Employees' && cell !== 'Total Base Salary' && 
                 cell !== 'Total Working Days' && cell !== 'Total Present Days' && cell !== 'Total Absent Days' && 
                 cell !== 'Total Week Off Days' && cell !== 'Total Overtime Days' && cell !== 'Total Subtotal Salary' && 
                 cell !== 'Total Overtime Salary' && cell !== 'Total Week Off Salary' && cell !== 'NET PAYROLL AMOUNT') {
            if (typeof cell === 'number' || (!isNaN(parseFloat(cell)) && isFinite(cell)) || 
                (typeof cell === 'string' && (cell.includes('₹') || !isNaN(parseFloat(cell))))) {
                cellStyle += " font-weight: bold; font-size: 14px; border: 1px solid #333;";
            }
        }
        // Summary statistics labels
        else if (cell === 'Payroll Month' || cell === 'Total Employees' || cell === 'Total Base Salary' || 
                 cell === 'Total Working Days' || cell === 'Total Present Days' || cell === 'Total Absent Days' || 
                 cell === 'Total Week Off Days' || cell === 'Total Overtime Days' || cell === 'Total Subtotal Salary' || 
                 cell === 'Total Overtime Salary' || cell === 'Total Week Off Salary') {
            cellStyle += " font-weight: bold; text-align: left; border: 1px solid #333;";
        }
        // NET PAYROLL AMOUNT highlight
        else if (cell === 'NET PAYROLL AMOUNT') {
            cellStyle += " background-color: #f5f5f5; font-weight: bold; font-size: 16px; text-align: left; border: 2px solid #000;";
        }
        // Table headers
        else if (cell === 'NO.' || cell === 'Employee Code' || cell === 'Employee Name' || cell === 'Base Salary' ||
                 cell === 'Working Days' || cell === 'Week Off Days' || cell === 'Present Days' || cell === 'Absent Days' ||
                 cell === 'Overtime Days' || cell === 'Subtotal Salary' || cell === 'Overtime Salary' ||
                 cell === 'Week Off Salary' || cell === 'Total Salary') {
            cellStyle += " background-color: #000; color: #fff; font-weight: bold; text-align: center; border: 2px solid #000; font-size: 14px;";
        }
        // Totals row
        else if (cell === 'TOTAL') {
            cellStyle += " background-color: #f5f5f5; font-weight: bold; font-size: 16px; text-align: center; border: 2px solid #000;";
        }
        // Totals row values
        else if (rowIndex === excelData.length - 1 && cell !== '' && cell !== 'TOTAL') {
            if (typeof cell === 'string' && cell.includes('₹')) {
                cellStyle += " background-color: #f8f8f8; font-weight: bold; border: 1px solid #000;";
            } else {
                cellStyle += " background-color: #f8f8f8; font-weight: bold; border: 1px solid #000;";
            }
        }

        return `<td style="${cellStyle}">${cell}</td>`;
    }).join('') }
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // Create downloadable Excel file
    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
