export const exportToPDF = (data, filename, title, summaryStats = null) => {
    if (!data || data.length === 0) {
        console.error('No data to export');
        return;
    }

    const headers = Object.keys(data[0]);

    const summarySection = summaryStats ? `
        <div class="summary">
            <div class="summary-item">
                <div class="summary-icon">👥</div>
                <h3>Total Employees</h3>
                <p>${summaryStats.total || 0}</p>
            </div>
            <div class="summary-item present-card">
                <div class="summary-icon">✅</div>
                <h3>Present</h3>
                <p class="present">${summaryStats.present || 0}</p>
            </div>
            <div class="summary-item absent-card">
                <div class="summary-icon">❌</div>
                <h3>Absent</h3>
                <p class="absent">${summaryStats.absent || 0}</p>
            </div>
            <div class="summary-item late-card">
                <div class="summary-icon">⏰</div>
                <h3>Late</h3>
                <p class="late">${summaryStats.late || 0}</p>
            </div>
            <div class="summary-item overtime-card">
                <div class="summary-icon">⏱️</div>
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
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body { 
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                    margin: 0; 
                    padding: 0; 
                    line-height: 1.6;
                    color: #1f2937;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
                
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    min-height: 100vh;
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
                }
                
                .header { 
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    animation: pulse 4s ease-in-out infinite;
                }
                
                @keyframes pulse {
                    0%, 100% { transform: scale(0.8); opacity: 0.5; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                }
                
                .header-content {
                    position: relative;
                    z-index: 2;
                }
                
                .header h1 { 
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .header p { 
                    font-size: 16px;
                    opacity: 0.9;
                    font-weight: 500;
                }
                
                .main-content {
                    padding: 40px 30px;
                }
                
                .summary { 
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px; 
                }
                
                .summary-item { 
                    text-align: center; 
                    padding: 25px 20px; 
                    background: white; 
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    border: 1px solid #e5e7eb;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    position: relative;
                    overflow: hidden;
                }
                
                .summary-item::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: #e5e7eb;
                }
                
                .summary-item.present-card::before {
                    background: linear-gradient(90deg, #10b981, #059669);
                }
                
                .summary-item.absent-card::before {
                    background: linear-gradient(90deg, #ef4444, #dc2626);
                }
                
                .summary-item.late-card::before {
                    background: linear-gradient(90deg, #f59e0b, #d97706);
                }
                
                .summary-item.overtime-card::before {
                    background: linear-gradient(90deg, #3b82f6, #2563eb);
                }
                
                .summary-item:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                .summary-icon {
                    font-size: 24px;
                    margin-bottom: 10px;
                    opacity: 0.8;
                }
                
                .summary-item h3 { 
                    margin: 0 0 12px 0; 
                    color: #6b7280; 
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                
                .summary-item p { 
                    margin: 0; 
                    font-size: 28px; 
                    font-weight: 700;
                    line-height: 1;
                }
                
                .present { color: #10b981; }
                .absent { color: #ef4444; }
                .late { color: #f59e0b; }
                .overtime { color: #3b82f6; }
                
                .section-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 2px solid #e5e7eb;
                }
                
                .table-container {
                    overflow-x: auto;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    background: white;
                }
                
                table { 
                    width: 100%; 
                    border-collapse: collapse; 
                    font-size: 13px;
                    background: white;
                }
                
                th, td { 
                    border: 1px solid #f3f4f6; 
                    padding: 16px 12px; 
                    text-align: left;
                    word-wrap: break-word;
                }
                
                th { 
                    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
                    font-weight: 600;
                    color: #374151;
                    text-transform: uppercase;
                    font-size: 11px;
                    letter-spacing: 0.05em;
                    border-bottom: 2px solid #e5e7eb;
                }
                
                tr:nth-child(even) { 
                    background-color: #f9fafb; 
                }
                
                tr:hover {
                    background-color: #f3f4f6;
                    transform: scale(1.001);
                    transition: all 0.2s ease;
                }
                
                .status-present { 
                    color: #10b981; 
                    font-weight: 600; 
                    background: rgba(16, 185, 129, 0.1);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                }
                
                .status-absent { 
                    color: #ef4444; 
                    font-weight: 600; 
                    background: rgba(239, 68, 68, 0.1);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                }
                
                .status-late { 
                    color: #f59e0b; 
                    font-weight: 600; 
                    background: rgba(245, 158, 11, 0.1);
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 12px;
                }
                
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 12px;
                    border-top: 1px solid #e5e7eb;
                    padding: 30px;
                    background: #f9fafb;
                }
                
                .print-button {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white; 
                    padding: 14px 28px; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    margin-top: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                
                .print-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
                }
                
                .legend {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }
                
                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: white;
                    border-radius: 6px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .legend-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                }
                
                .legend-present { background: #10b981; }
                .legend-absent { background: #ef4444; }
                .legend-late { background: #f59e0b; }
                .legend-overtime { background: #3b82f6; }
                
                @media print {
                    body { 
                        margin: 0; 
                        padding: 0;
                        background: white;
                    }
                    
                    .container {
                        box-shadow: none;
                    }
                    
                    .no-print { 
                        display: none !important; 
                    }
                    
                    .header {
                        background: #3b82f6 !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    .summary {
                        grid-template-columns: repeat(5, 1fr);
                        gap: 15px;
                    }
                    
                    .summary-item {
                        padding: 15px 10px;
                        box-shadow: none;
                        border: 1px solid #e5e7eb;
                    }
                    
                    .summary-item p {
                        font-size: 20px;
                    }
                    
                    table {
                        font-size: 11px;
                    }
                    
                    th, td {
                        padding: 8px 6px;
                    }
                    
                    .main-content {
                        padding: 20px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="header-content">
                        <h1>${title || 'Attendance Report'}</h1>
                        <p>Generated on ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })}</p>
                    </div>
                </div>
                
                <div class="main-content">
                    ${summarySection}
                    
                    ${summaryStats ? `
                    <div class="legend">
                        <div class="legend-item">
                            <div class="legend-color legend-present"></div>
                            <span>Present</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color legend-absent"></div>
                            <span>Absent</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color legend-late"></div>
                            <span>Late</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color legend-overtime"></div>
                            <span>Overtime</span>
                        </div>
                    </div>
                    ` : ''}
                    
                    <h2 class="section-title">Attendance Details</h2>
                    
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
        return `<td><span class="${statusClass}">${cellValue}</span></td>`;
    }).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="no-print" style="text-align: center; padding: 30px;">
                    <button class="print-button" onclick="window.print()">
                        🖨️ Print Report
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