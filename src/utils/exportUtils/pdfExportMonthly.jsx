import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Enhanced Export Monthly Attendance Report to PDF
 * @param {Array} reportData - Array of attendance records
 * @param {string} fileName - Name for the PDF file
 * @param {string} title - Report title
 * @param {Object} summaryStats - Summary statistics object
 * @param {Object} filterInfo - Applied filters information
 * @param {Object} employeeInfo - Employee information for header
 */
export const exportMonthlyReportToPDF = (reportData, fileName, title, summaryStats, filterInfo = {}, employeeInfo = {}) => {
    try {
        // Create new PDF document in landscape mode for better column fitting
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: 'a4'
        });

        // PDF dimensions
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 40;

        // Colors
        const primaryColor = [59, 130, 246]; // Blue
        const secondaryColor = [248, 250, 252]; // Light gray
        const successColor = [34, 197, 94]; // Green
        const errorColor = [239, 68, 68]; // Red

        // Helper function to add header
        const addHeader = (pageNumber = 1) => {
            // Header background with gradient effect
            doc.setFillColor(...primaryColor);
            doc.rect(0, 0, pageWidth, 90, 'F');

            // Company logo area (if needed)
            doc.setFillColor(255, 255, 255);
            doc.rect(margin, 15, 60, 60, 'F');

            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin + 80, 35);

            // Employee info
            if (employeeInfo.name) {
                doc.setFontSize(14);
                doc.setFont('helvetica', 'normal');
                doc.text(`Employee: ${employeeInfo.name}`, margin + 80, 55);
            }

            // Report period
            if (filterInfo.month_year) {
                doc.setFontSize(12);
                doc.text(`Period: ${filterInfo.month_year}`, margin + 80, 70);
            }

            // Generation info
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}`, margin, pageHeight - 25);

            // Page number
            doc.setFontSize(12);
            doc.text(`Page ${pageNumber}`, pageWidth - margin - 60, 35);

            return 100; // Return Y position after header
        };

        // Helper function to add enhanced summary section
        const addSummarySection = (startY) => {
            if (!summaryStats) return startY;

            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.text('Attendance Summary', margin, startY+10);

            const summaryY = startY + 25;
            const summaryBoxHeight = 120;

            // Summary box background
            doc.setFillColor(...secondaryColor);
            doc.rect(margin, summaryY - 10, pageWidth - (margin * 2), summaryBoxHeight, 'F');

            // Summary border
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(1);
            doc.rect(margin, summaryY - 10, pageWidth - (margin * 2), summaryBoxHeight, 'S');

            // Summary items with better organization
            const summaryItems = [
                { label: 'Total Days:', value: summaryStats.totalDays, color: [75, 85, 99] },
                { label: 'Working Days:', value: summaryStats.workingDays, color: [75, 85, 99] },
                { label: 'Present Days:', value: `${summaryStats.presentDays} (${summaryStats.attendancePercentage}%)`, color: successColor },
                { label: 'Absent Days:', value: summaryStats.absentDays, color: errorColor },
                { label: 'Week Offs:', value: summaryStats.weekoffDays, color: [147, 51, 234] },
                { label: 'Holidays:', value: summaryStats.holidayDays, color: [245, 158, 11] },
                { label: 'Leave Days:', value: summaryStats.leaveDays, color: [245, 158, 11] },
                { label: 'Half Days:', value: summaryStats.halfDayDays, color: [59, 130, 246] },
                { label: 'Late Days:', value: summaryStats.lateDays, color: errorColor },
                { label: 'Overtime Days:', value: summaryStats.overtimeDays, color: successColor },
                { label: 'Total Working Hours:', value: `${summaryStats.totalWorkingHours} hrs`, color: [75, 85, 99] },
                { label: 'Total Overtime Hours:', value: `${summaryStats.totalOvertimeHours} hrs`, color: successColor },
                { label: 'Total Late Hours:', value: `${summaryStats.totalLateHours} hrs`, color: errorColor }
            ];

            // Split summary items into three columns
            const itemsPerColumn = Math.ceil(summaryItems.length / 3);
            const columnWidth = (pageWidth - (margin * 2)) / 3;

            doc.setFontSize(11);

            summaryItems.forEach((item, index) => {
                const columnIndex = Math.floor(index / itemsPerColumn);
                const itemIndex = index % itemsPerColumn;
                const x = margin + 15 + (columnIndex * columnWidth);
                const y = summaryY + 15 + (itemIndex * 18);

                // Label
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(75, 85, 99);
                doc.text(item.label, x, y);

                // Value with color
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(...item.color);
                doc.text(String(item.value), x + 120, y);
            });

            return summaryY + summaryBoxHeight + 30;
        };

        

        // Start PDF generation
        let currentY = addHeader();

        // Add summary section
        currentY = addSummarySection(currentY);

        // Add filter section

        // Add legend section
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Status Legend', margin, currentY);

        const legendY = currentY + 20;
        const legendItems = [
            { status: 'Present', color: [220, 252, 231], textColor: [22, 163, 74] },
            { status: 'Absent', color: [254, 226, 226], textColor: [220, 38, 38] },
            { status: 'Week Off', color: [243, 232, 255], textColor: [147, 51, 234] },
            { status: 'Holiday', color: [255, 237, 213], textColor: [245, 158, 11] },
            { status: 'Leave', color: [254, 249, 195], textColor: [245, 158, 11] },
            { status: 'Half Day', color: [219, 234, 254], textColor: [59, 130, 246] }
        ];

        legendItems.forEach((item, index) => {
            const x = margin + (index * 120);
            const y = legendY;

            // Color box
            doc.setFillColor(...item.color);
            doc.rect(x, y - 8, 15, 12, 'F');
            doc.setDrawColor(...item.textColor);
            doc.setLineWidth(1);
            doc.rect(x, y - 8, 15, 12, 'S');

            // Label
            doc.setTextColor(...item.textColor);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(item.status, x + 20, y);
        });

        currentY = legendY + 40;

        // Prepare table data with separate date and day columns (removed remarks)
        const tableData = reportData.map((record, index) => {
            const date = new Date(record.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const formattedDate = date.toLocaleDateString('en-GB');
            
            return [
                index + 1,
                formattedDate,
                dayName,
                record.shift_status || 'N/A',
                record.status || 'N/A',
                record.attandance_first_clock_in || '-',
                record.attandance_last_clock_out || '-',
                record.attandance_hours ? `${parseFloat(record.attandance_hours).toFixed(2)}h` : '-',
                record.late_hours && parseFloat(record.late_hours) > 0 ? `${parseFloat(record.late_hours).toFixed(2)}h` : '-',
                record.overtime_hours && parseFloat(record.overtime_hours) > 0 ? `${parseFloat(record.overtime_hours).toFixed(2)}h` : '-'
            ];
        });

        // Table headers (removed remarks, added separate day column)
        const headers = [
            'S.No',
            'Date',
            'Day',
            'Shift Status',
            'Attendance\nStatus',
            'Clock In',
            'Clock Out',
            'Working\nHours',
            'Late\nHours',
            'Overtime\nHours'
        ];

        // AutoTable configuration with updated column widths
        const autoTableOptions = {
            startY: currentY,
            head: [headers],
            body: tableData,
            theme: 'striped',
            styles: {
                fontSize: 9,
                cellPadding: 5,
                textColor: [0, 0, 0],
                lineColor: [226, 232, 240],
                lineWidth: 0.5,
                halign: 'center',
                valign: 'middle'
            },
            headStyles: {
                fillColor: primaryColor,
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center',
                valign: 'middle'
            },
            alternateRowStyles: {
                fillColor: [248, 250, 252]
            },
            columnStyles: {
                0: { cellWidth: 40 },  // S.No
                1: { cellWidth: 70 },  // Date
                2: { cellWidth: 50 },  // Day
                3: { cellWidth: 80 },  // Shift Status
                4: { cellWidth: 80 },  // Attendance Status
                5: { cellWidth: 70 },  // Clock In
                6: { cellWidth: 70 },  // Clock Out
                7: { cellWidth: 70 },  // Working Hours
                8: { cellWidth: 70 },  // Late Hours
                9: { cellWidth: 70 }   // Overtime Hours
            },
            margin: { left: margin, right: margin },
            pageBreak: 'auto',
            showHead: 'everyPage',
            didDrawPage: (data) => {
                // Add header to each page
                if (data.pageNumber > 1) {
                    addHeader(data.pageNumber);
                }
            },
            // Custom cell styling based on content
            didParseCell: (data) => {
                // Attendance Status column styling (column index 4 now)
                if (data.column.index === 4) {
                    const status = data.cell.text[0]?.toLowerCase();
                    switch (status) {
                        case 'present':
                            data.cell.styles.fillColor = [220, 252, 231];
                            data.cell.styles.textColor = [22, 163, 74];
                            break;
                        case 'absent':
                            data.cell.styles.fillColor = [254, 226, 226];
                            data.cell.styles.textColor = [220, 38, 38];
                            break;
                        case 'week off':
                        case 'weekoff':
                            data.cell.styles.fillColor = [243, 232, 255];
                            data.cell.styles.textColor = [147, 51, 234];
                            break;
                        case 'holiday':
                            data.cell.styles.fillColor = [255, 237, 213];
                            data.cell.styles.textColor = [245, 158, 11];
                            break;
                        case 'leave':
                            data.cell.styles.fillColor = [254, 249, 195];
                            data.cell.styles.textColor = [245, 158, 11];
                            break;
                        case 'half day':
                            data.cell.styles.fillColor = [219, 234, 254];
                            data.cell.styles.textColor = [59, 130, 246];
                            break;
                        default:
                            data.cell.styles.fillColor = [243, 244, 246];
                            data.cell.styles.textColor = [107, 114, 128];
                    }
                    data.cell.styles.fontStyle = 'bold';
                }

                // Shift Status column styling (column index 3 now)
                if (data.column.index === 3) {
                    const shiftStatus = data.cell.text[0]?.toLowerCase();
                    if (shiftStatus === 'week off' || shiftStatus === 'weekoff') {
                        data.cell.styles.fillColor = [243, 232, 255];
                        data.cell.styles.textColor = [147, 51, 234];
                        data.cell.styles.fontStyle = 'bold';
                    } else if (shiftStatus === 'working day') {
                        data.cell.styles.fillColor = [220, 252, 231];
                        data.cell.styles.textColor = [22, 163, 74];
                    }
                }

                // Day column styling (column index 2)
                if (data.column.index === 2) {
                    const day = data.cell.text[0]?.toLowerCase();
                    if (day === 'sat' || day === 'sun') {
                        data.cell.styles.fillColor = [243, 232, 255];
                        data.cell.styles.textColor = [147, 51, 234];
                        data.cell.styles.fontStyle = 'bold';
                    }
                }

                // Late Hours column styling (column index 8 now)
                if (data.column.index === 8) {
                    const lateHours = data.cell.text[0];
                    if (lateHours !== '-' && parseFloat(lateHours) > 0) {
                        data.cell.styles.fillColor = [254, 249, 195];
                        data.cell.styles.textColor = [245, 158, 11];
                        data.cell.styles.fontStyle = 'bold';
                    }
                }

                // Overtime Hours column styling (column index 9 now)
                if (data.column.index === 9) {
                    const overtimeHours = data.cell.text[0];
                    if (overtimeHours !== '-' && parseFloat(overtimeHours) > 0) {
                        data.cell.styles.fillColor = [220, 252, 231];
                        data.cell.styles.textColor = [22, 163, 74];
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            }
        };

        // Generate table
        doc.autoTable(autoTableOptions);

        // Add footer with additional information
        const finalY = doc.lastAutoTable.finalY + 30;
        
        // Add summary footer
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        doc.text('Summary:', margin, finalY);
        doc.text(`Total Records: ${reportData.length}`, margin, finalY + 15);
        doc.text(`Attendance Rate: ${summaryStats?.attendancePercentage || 'N/A'}%`, margin + 150, finalY + 15);
        doc.text(`Total Working Hours: ${summaryStats?.totalWorkingHours || 'N/A'} hrs`, margin + 300, finalY + 15);

        // Add generation info
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175);
        doc.text(
            `This report was generated by the Attendance Management System on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString()}`,
            margin,
            finalY + 40
        );

        // Save the PDF
        doc.save(fileName);

        return {
            success: true,
            message: 'PDF exported successfully!'
        };

    } catch (error) {
        console.error('Error exporting PDF:', error);
        return {
            success: false,
            message: 'Failed to export PDF: ' + error.message
        };
    }
};

// Legacy export function for backward compatibility
export const exportToPDF = exportMonthlyReportToPDF;