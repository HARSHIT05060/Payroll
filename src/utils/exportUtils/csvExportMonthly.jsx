// csvExport.js
export const exportToCSV = (reportData, filename, summaryStats = null) => {
    try {
        let csvContent = '';
        
        // Add title and timestamp
        csvContent += `Monthly Attendance Report\n`;
        csvContent += `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n\n`;
        
        // Add summary statistics if provided
        if (summaryStats) {
            csvContent += `Summary Statistics\n`;
            csvContent += `Metric,Value\n`;
            csvContent += `Total Days,${summaryStats.totalDays}\n`;
            csvContent += `Present Days,"${summaryStats.presentDays} (${summaryStats.attendancePercentage}%)"\n`;
            csvContent += `Absent Days,${summaryStats.absentDays}\n`;
            csvContent += `Late Days,${summaryStats.lateDays}\n`;
            csvContent += `Overtime Days,${summaryStats.overtimeDays}\n`;
            csvContent += `Total Working Hours,${summaryStats.totalWorkingHours}h\n`;
            csvContent += `Total Overtime Hours,${summaryStats.totalOvertimeHours}h\n`;
            csvContent += `Total Late Hours,${summaryStats.totalLateHours}h\n\n`;
        }
        
        // Add attendance details header
        csvContent += `Attendance Details\n`;
        
        // CSV headers
        const headers = [
            'S.No',
            'Date',
            'Employee Name',
            'Shift Name',
            'Shift From Time',
            'Shift To Time',
            'Clock In Time',
            'Clock Out Time',
            'Working Hours',
            'Overtime Hours',
            'Late Hours',
            'Status'
        ];
        
        csvContent += headers.join(',') + '\n';
        
        // Add data rows
        reportData.forEach(record => {
            const row = [
                record.sno || '',
                new Date(record.date).toLocaleDateString(),
                `"${record.employee_name || ''}"`, // Quoted to handle commas in names
                `"${record.shift_name || ''}"`,
                record.shift_from_time || '',
                record.shift_to_time || '',
                record.attandance_first_clock_in || 'N/A',
                record.attandance_last_clock_out || 'N/A',
                record.attandance_hours || '0',
                record.overtime_hours || '0',
                record.late_hours || '0',
                record.status || 'N/A'
            ];
            
            csvContent += row.join(',') + '\n';
        });
        
        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error('Error generating CSV:', error);
        alert('Error generating CSV report. Please try again.');
    }
};