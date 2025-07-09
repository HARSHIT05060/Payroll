export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
        console.error('No data to export');
        return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvData = [
        headers, // Header row
        ...data.map(item => headers.map(header => item[header] || '')) // Data rows
    ];

    // Convert to CSV format with proper escaping
    const csvContent = csvData.map(row =>
        row.map(cell => {
            // Handle null/undefined values
            if (cell === null || cell === undefined) return '';
            
            // Convert to string and escape quotes
            const cellStr = String(cell).replace(/"/g, '""');
            
            // Wrap in quotes if contains comma, newline, or quote
            if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
                return `"${cellStr}"`;
            }
            
            return cellStr;
        }).join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};