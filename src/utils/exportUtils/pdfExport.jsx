export const exportToPDF = (data, filename, title, summaryStats = null) => {
    if (!data || data.length === 0) {
        console.error('No data to export');
        return;
    }

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create summary section if stats are provided
    const summarySection = summaryStats ? `
        <div class="summary">
            <div class="summary-item">
                <h3>Total Employees</h3>
                <p>${summaryStats.total || 0}</p>
            </div>
            <div class="summary-item">
                <h3>Present</h3>
                <p class="present">${summaryStats.present || 0}</p>
            </div>
            <div class="summary-item">
                <h3>Absent</h3>
                <p class="absent">${summaryStats.absent || 0}</p>
            </div>
            <div class="summary-item">
                <h3>Late</h3>
                <p class="late">${summaryStats.late || 0}</p>
            </div>
            <div class="summary-item">
                <h3>Overtime</h3>
                <p class="overtime">${summaryStats.overtime || 0}</p>
            </div>
        </div>
    ` : '';

    const printWindow = window.open('', '_blank');
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title || 'Report'}</title>
            <meta charset="utf-8">
            <style>
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    line-height: 1.6;
                    color: #333;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .header { 
                    text-align: center; 
                    margin-bottom: 30px; 
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e5e7eb;
                }
                .header h1 { 
                    color: #1f2937; 
                    margin-bottom: 10px; 
                    font-size: 28px;
                    font-weight: 700;
                }
                .header p { 
                    color: #6b7280; 
                    margin: 0; 
                    font-size: 16px;
                }
                .summary { 
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px; 
                }
                .summary-item { 
                    text-align: center; 
                    padding: 20px; 
                    background: #f9fafb; 
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                .summary-item h3 { 
                    margin: 0 0 10px 0; 
                    color: #374151; 
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .summary-item p { 
                    margin: 0; 
                    font-size: 32px; 
                    font-weight: 700;
                    line-height: 1;
                }
                .present { color: #10b981; }
                .absent { color: #ef4444; }
                .late { color: #f59e0b; }
                .overtime { color: #3b82f6; }
                .table-container {
                    overflow-x: auto;
                    margin-top: 20px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                }
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    font-size: 12px;
                    background: white;
                }
                th, td { 
                    border: 1px solid #e5e7eb; 
                    padding: 12px 8px; 
                    text-align: left;
                    word-wrap: break-word;
                }
                th { 
                    background-color: #f9fafb; 
                    font-weight: 600;
                    color: #374151;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.05em;
                }
                tr:nth-child(even) { 
                    background-color: #f9fafb; 
                }
                tr:hover {
                    background-color: #f3f4f6;
                }
                .status-present { color: #10b981; font-weight: 600; }
                .status-absent { color: #ef4444; font-weight: 600; }
                .status-late { color: #f59e0b; font-weight: 600; }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 12px;
                    border-top: 1px solid #e5e7eb;
                    padding-top: 20px;
                }
                .print-button {
                    background: #3b82f6; 
                    color: white; 
                    padding: 12px 24px; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: background-color 0.2s;
                    margin-top: 20px;
                }
                .print-button:hover {
                    background: #2563eb;
                }
                @media print {
                    body { 
                        margin: 0; 
                        padding: 15px;
                    }
                    .no-print { 
                        display: none !important; 
                    }
                    .summary {
                        grid-template-columns: repeat(5, 1fr);
                        gap: 10px;
                    }
                    .summary-item {
                        padding: 10px;
                    }
                    .summary-item p {
                        font-size: 24px;
                    }
                    table {
                        font-size: 10px;
                    }
                    th, td {
                        padding: 6px 4px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>${title || 'Report'}</h1>
                    <p>Generated on ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</p>
                </div>
                
                ${summarySection}
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                ${headers.map(header => `<th>${header}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${data.map(item => `
                                <tr>
                                    ${headers.map(header => {
        const cellValue = item[header] || '';
        const statusClass = header === 'Status' ? `status-${String(cellValue).toLowerCase()}` : '';
        return `<td class="${statusClass}">${cellValue}</td>`;
    }).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div class="footer">
                    <p>Report generated by Attendance Management System</p>
                </div>
                
                <div class="no-print" style="text-align: center;">
                    <button class="print-button" onclick="window.print()">
                        Print Report
                    </button>
                </div>
            </div>
        </body>
        </html>
    `;

    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();

        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
        }, 500);
    } else {
        console.error('Unable to open print window. Please check popup blockers.');
    }
};