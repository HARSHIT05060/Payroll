// excelExport.js
import * as XLSX from 'xlsx';

export const exportToExcel = (reportData, filename, summaryStats = null) => {
    try {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();
        
        // Create summary sheet if stats are provided
        if (summaryStats) {
            const summaryData = [
                ['Monthly Attendance Report Summary'],
                ['Generated on:', `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`],
                [''],
                ['Summary Statistics'],
                ['Metric', 'Value'],
                ['Total Days', summaryStats.totalDays],
                ['Present Days', `${summaryStats.presentDays} (${summaryStats.attendancePercentage}%)`],
                ['Absent Days', summaryStats.absentDays],
                ['Late Days', summaryStats.lateDays],
                ['Overtime Days', summaryStats.overtimeDays],
                ['Total Working Hours', `${summaryStats.totalWorkingHours}h`],
                ['Total Overtime Hours', `${summaryStats.totalOvertimeHours}h`],
                ['Total Late Hours', `${summaryStats.totalLateHours}h`]
            ];
            
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
            
            // Style the summary sheet
            summarySheet['!cols'] = [
                { width: 25 }, // Column A
                { width: 30 }  // Column B
            ];
            
            // Add summary sheet to workbook
            XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
        }
        
        // Create attendance details sheet
        const attendanceHeaders = [
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
        
        // Prepare attendance data
        const attendanceData = [
            ['Attendance Details'],
            [''],
            attendanceHeaders
        ];
        
        // Add data rows
        reportData.forEach(record => {
            attendanceData.push([
                record.sno || '',
                new Date(record.date).toLocaleDateString(),
                record.employee_name || '',
                record.shift_name || '',
                record.shift_from_time || '',
                record.shift_to_time || '',
                record.attandance_first_clock_in || 'N/A',
                record.attandance_last_clock_out || 'N/A',
                record.attandance_hours || '0',
                record.overtime_hours || '0',
                record.late_hours || '0',
                record.status || 'N/A'
            ]);
        });
        
        const attendanceSheet = XLSX.utils.aoa_to_sheet(attendanceData);
        
        // Set column widths for attendance sheet
        attendanceSheet['!cols'] = [
            { width: 8 },  // S.No
            { width: 12 }, // Date
            { width: 20 }, // Employee Name
            { width: 15 }, // Shift Name
            { width: 15 }, // Shift From Time
            { width: 15 }, // Shift To Time
            { width: 15 }, // Clock In Time
            { width: 15 }, // Clock Out Time
            { width: 15 }, // Working Hours
            { width: 15 }, // Overtime Hours
            { width: 12 }, // Late Hours
            { width: 12 }  // Status
        ];
        
        // Style the header row (row 3, 0-indexed as row 2)
        const headerRow = 2;
        attendanceHeaders.forEach((header, colIndex) => {
            const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: colIndex });
            if (!attendanceSheet[cellAddress]) return;
            
            attendanceSheet[cellAddress].s = {
                font: { bold: true, color: { rgb: "FFFFFF" } },
                fill: { fgColor: { rgb: "428BCA" } },
                alignment: { horizontal: "center" }
            };
        });
        
        // Style data rows with alternating colors and status-based coloring
        for (let rowIndex = 0; rowIndex < reportData.length; rowIndex++) {
            const dataRowIndex = headerRow + 1 + rowIndex;
            const record = reportData[rowIndex];
            
            // Apply alternating row colors
            const isEvenRow = rowIndex % 2 === 0;
            const bgColor = isEvenRow ? "FFFFFF" : "F8F9FA";
            
            for (let colIndex = 0; colIndex < attendanceHeaders.length; colIndex++) {
                const cellAddress = XLSX.utils.encode_cell({ r: dataRowIndex, c: colIndex });
                if (!attendanceSheet[cellAddress]) continue;
                
                let cellStyle = {
                    fill: { fgColor: { rgb: bgColor } },
                    alignment: { horizontal: "center" }
                };
                
                // Special styling for status column
                if (colIndex === 11) { // Status column
                    const status = record.status?.toLowerCase();
                    if (status === 'present') {
                        cellStyle.fill = { fgColor: { rgb: "D4F6DD" } };
                        cellStyle.font = { color: { rgb: "16A34A" } };
                    } else if (status === 'absent') {
                        cellStyle.fill = { fgColor: { rgb: "FEE2E2" } };
                        cellStyle.font = { color: { rgb: "DC2626" } };
                    } else if (status === 'late') {
                        cellStyle.fill = { fgColor: { rgb: "FEF9C3" } };
                        cellStyle.font = { color: { rgb: "A16207" } };
                    }
                }
                
                attendanceSheet[cellAddress].s = cellStyle;
            }
        }
        
        // Add attendance sheet to workbook
        XLSX.utils.book_append_sheet(workbook, attendanceSheet, 'Attendance Details');
        
        // Create a detailed analysis sheet
        const analysisData = [
            ['Detailed Analysis'],
            [''],
            ['Daily Breakdown'],
            ['Date', 'Status', 'Working Hours', 'Overtime Hours', 'Late Hours', 'Clock In', 'Clock Out']
        ];
        
        reportData.forEach(record => {
            analysisData.push([
                new Date(record.date).toLocaleDateString(),
                record.status || 'N/A',
                record.attandance_hours || '0',
                record.overtime_hours || '0',
                record.late_hours || '0',
                record.attandance_first_clock_in || 'N/A',
                record.attandance_last_clock_out || 'N/A'
            ]);
        });
        
        // Add monthly totals
        if (summaryStats) {
            analysisData.push(['']);
            analysisData.push(['Monthly Totals']);
            analysisData.push(['Total Working Hours', summaryStats.totalWorkingHours]);
            analysisData.push(['Total Overtime Hours', summaryStats.totalOvertimeHours]);
            analysisData.push(['Total Late Hours', summaryStats.totalLateHours]);
            analysisData.push(['Attendance Percentage', `${summaryStats.attendancePercentage}%`]);
        }
        
        const analysisSheet = XLSX.utils.aoa_to_sheet(analysisData);
        
        // Set column widths for analysis sheet
        analysisSheet['!cols'] = [
            { width: 15 }, // Date
            { width: 12 }, // Status
            { width: 15 }, // Working Hours
            { width: 15 }, // Overtime Hours
            { width: 12 }, // Late Hours
            { width: 12 }, // Clock In
            { width: 12 }  // Clock Out
        ];
        
        // Add analysis sheet to workbook
        XLSX.utils.book_append_sheet(workbook, analysisSheet, 'Analysis');
        
        // Write the workbook to a file
        XLSX.writeFile(workbook, filename);
        
    } catch (error) {
        console.error('Error generating Excel:', error);
        alert('Error generating Excel report. Please try again.');
    }
};