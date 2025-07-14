export const exportToExcel = (data, filename) => {
    if (!data || data.length === 0) {
        console.error('No data to export');
        return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create HTML table with improved styling
    const tableHTML = `
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
            <thead>
                <tr style="background-color: #f0f0f0; font-weight: bold;">
                    ${headers.map(header => `<th style="border: 1px solid #ccc; padding: 8px; text-align: left;">${header}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
                ${data.map(item => `
                    <tr>
                        ${headers.map(header => {
        const cellValue = item[header] || '';
        return `<td style="border: 1px solid #ccc; padding: 8px;">${cellValue}</td>`;
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
