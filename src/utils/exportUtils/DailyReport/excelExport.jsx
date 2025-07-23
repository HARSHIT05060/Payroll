/**
 * Excel export function for Daily Attendance Report
 * @param {Array} data - Array of attendance objects to export
 * @param {string} reportDate - Selected date for the report
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToExcel = (data, reportDate, filename) => {
    if (!data || data.length === 0) {
        console.error('No data to export');
        throw new Error('No data available to export');
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Calculate summary statistics
    const totalEmployees = data.length;
    const presentCount = data.filter(emp => emp.Status === 'Present').length;
    const absentCount = data.filter(emp => emp.Status === 'Absent').length;
    const weekOffCount = data.filter(emp => emp.Status === 'Week Off').length;
    const lateCount = data.filter(emp => emp['Late Hours'] !== '--' && parseFloat(emp['Late Hours']) > 0).length;
    const overtimeCount = data.filter(emp => emp['Overtime Hours'] !== '--' && parseFloat(emp['Overtime Hours']) > 0).length;

    // Prepare data for Excel export
    const excelData = [];

    // Add report header
    excelData.push(['', '', '', '', '',
        'Daily Attendance Report', '', '', '', '', '', ''
    ]);
    excelData.push([
        '',
        `Date: ${reportDate}`,
        `Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}`,
        '',
        '',
        `Total Employees: ${totalEmployees}`,
        '', '', '', '', '', ''
    ]);

    // Add empty row
    excelData.push(['']);

    // Add summary statistics
    excelData.push(['Summary Statistics', '', '', '', '', '', '', '', '', '', '', '']);
    excelData.push(['Present', presentCount, '', 'Absent', absentCount, '', 'Week Off', weekOffCount, '', '', '', '']);
    excelData.push(['Late Employees', lateCount, '', 'Overtime Employees', overtimeCount, '', '', '', '', '', '', '']);

    // Add empty row
    excelData.push(['']);

    // Add table headers
    excelData.push(headers);

    // Add employee data rows
    data.forEach(employee => {
        excelData.push(headers.map(header => employee[header] || ''));
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
        if (rowIndex === 0 && cellIndex === 5) {
            cellStyle += " background-color: #2563eb; color: white; font-weight: bold; font-size: 25px; text-align: center;";
        }
        // Summary statistics header
        else if (cell === 'Summary Statistics') {
            cellStyle += " background-color: #f8fafc; font-weight: bold; color: #2563eb; text-align: center; font-size: 20px;";
        }
        // Table headers row
        else if (rowIndex === 7) {
            cellStyle += " background-color: #2563eb; color: white; font-weight: bold; text-align: center;";
        }
        // Status column styling
        else if (rowIndex > 7 && cellIndex === headers.indexOf('Status')) {
            if (cell === 'Present') {
                cellStyle += " background-color: #dcfce7; color: #166534; text-align: center;";
            } else if (cell === 'Absent') {
                cellStyle += " background-color: #fef2f2; color: #dc2626; text-align: center;";
            } else if (cell === 'Week Off') {
                cellStyle += " background-color: #dbeafe; color: #2563eb; text-align: center;";
            }
        }
        // Late Hours column styling
        else if (rowIndex > 7 && cellIndex === headers.indexOf('Late Hours')) {
            if (cell !== '--' && parseFloat(cell) > 0) {
                cellStyle += " background-color: #fef3c7; color: #d97706; text-align: center;";
            }
        }
        // Overtime Hours column styling
        else if (rowIndex > 7 && cellIndex === headers.indexOf('Overtime Hours')) {
            if (cell !== '--' && parseFloat(cell) > 0) {
                cellStyle += " background-color: #e0e7ff; color: #3730a3; text-align: center;";
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