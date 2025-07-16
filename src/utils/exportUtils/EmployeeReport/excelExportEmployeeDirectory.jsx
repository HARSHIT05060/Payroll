/**
 * Excel export function for Employee Directory Report
 * @param {Array} data - Array of employee objects to export
 * @param {string} filename - Name of the file (without extension)
 */
export const exportToExcel = (data, filename) => {
    if (!data || data.length === 0) {
        console.error('No data to export');
        throw new Error('No data available to export');
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Prepare data for Excel export
    const excelData = [];

    // Add report header
    excelData.push(['', '', '', '', '',
        'Employee Directory Report', '', '', '', 
    ]);
    excelData.push([
        '','',
        '',
        `Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}`,
        '',
        '',
        `Total Employees: ${data.length}`,
        
    ]);

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
        // Table headers row
        else if (rowIndex === 3) {
            cellStyle += " background-color: #2563eb; color: white; font-weight: bold; text-align: center; min-height: 35px; height: 30px;";
        }
        // Status column styling
        else if (rowIndex > 3 && cellIndex === headers.indexOf('Status')) {
            if (cell === 'Active') {
                cellStyle += " background-color: #dcfce7; color: #166534; text-align: center;";
            } else if (cell === 'Inactive') {
                cellStyle += " background-color: #fef2f2; color: #dc2626; text-align: center;";
            } else if (cell === 'Unknown') {
                cellStyle += " background-color: #f3f4f6; color: #6b7280; text-align: center;";
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