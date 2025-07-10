import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportAttendanceReport = async (attendanceData, filename = 'attendance_report') => {
    try {
        // Validate input data
        if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
            throw new Error('No attendance data provided');
        }

        console.log('Processing attendance data:', attendanceData.length, 'records');

        // Group data by employee
        const groupedData = groupDataByEmployee(attendanceData);
        console.log('Grouped data:', Object.keys(groupedData).length, 'employees');

        // Calculate overall summary
        const summary = calculateOverallSummary(attendanceData);
        console.log('Summary calculated:', summary);

        // Create PDF document
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;

        // Title
        doc.setFontSize(20);
        doc.setTextColor(44, 62, 80);
        doc.text('Employee-wise Attendance Report', pageWidth / 2, 20, { align: 'center' });

        // Date range
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        const startDate = new Date(Math.min(...attendanceData.map(d => new Date(d.date))));
        const endDate = new Date(Math.max(...attendanceData.map(d => new Date(d.date))));
        const dateRange = `${formatDate(startDate)} to ${formatDate(endDate)}`;
        doc.text(dateRange, pageWidth / 2, 28, { align: 'center' });

        // Overall Summary Section
        doc.setFontSize(14);
        doc.setTextColor(44, 62, 80);
        doc.text('Overall Summary', 20, 45);

        // Summary table
        const summaryData = [
            ['Total Employees', summary.uniqueEmployees],
            ['Total Records', summary.totalRecords],
            ['Present Days', summary.presentCount],
            ['Absent Days', summary.absentCount],
            ['Week Off Days', summary.weekOffCount],
            ['Total Hours', summary.totalHours],
            ['Total Overtime Hours', summary.totalOvertimeHours],
            ['Total Late Hours', summary.totalLateHours]
        ];

        doc.autoTable({
            startY: 50,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: [52, 152, 219], textColor: 255 },
            margin: { left: 20, right: 20 },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 30, halign: 'center' }
            }
        });

        let currentY = doc.lastAutoTable.finalY + 20;

        // Employee-wise data
        Object.entries(groupedData).forEach(([employeeData], index) => {
            try {
                console.log(`Processing employee ${index + 1}:`, employeeData.employee_name);

                // Check if we need a new page
                if (currentY > pageHeight - 100) {
                    doc.addPage();
                    currentY = 20;
                }

                // Employee header
                doc.setFontSize(14);
                doc.setTextColor(44, 62, 80);
                doc.text(`${employeeData.employee_name} (${employeeData.employee_code})`, 20, currentY);

                currentY += 8;

                // Shift info
                doc.setFontSize(10);
                doc.setTextColor(100, 100, 100);
                doc.text(`${employeeData.shift_name} Shift: ${employeeData.shift_from_time} - ${employeeData.shift_to_time}`, 20, currentY);

                currentY += 15;

                // Validate summary exists
                if (!employeeData.summary) {
                    console.error('Missing summary for employee:', employeeData.employee_name);
                    throw new Error(`Missing summary data for employee ${employeeData.employee_name}`);
                }

                // Employee summary
                const empSummaryData = [
                    ['Present Days', employeeData.summary.presentDays || 0],
                    ['Absent Days', employeeData.summary.absentDays || 0],
                    ['Week Off Days', employeeData.summary.weekOffDays || 0],
                    ['Total Hours', employeeData.summary.totalHours || '0'],
                    ['Overtime Hours', employeeData.summary.totalOvertimeHours || '0'],
                    ['Late Hours', employeeData.summary.totalLateHours || '0'],
                    ['Attendance %', (employeeData.summary.attendancePercentage || '0') + '%']
                ];

                doc.autoTable({
                    startY: currentY,
                    head: [['Metric', 'Value']],
                    body: empSummaryData,
                    theme: 'striped',
                    headStyles: { fillColor: [46, 125, 50], textColor: 255 },
                    margin: { left: 20, right: 20 },
                    styles: { fontSize: 8 },
                    columnStyles: {
                        0: { cellWidth: 60 },
                        1: { cellWidth: 25, halign: 'center' }
                    }
                });

                currentY = doc.lastAutoTable.finalY + 10;

                // Daily records table
                const dailyRecordsData = employeeData.records.map(record => [
                    formatDate(record.date),
                    record.status,
                    record.attandance_first_clock_in || '-',
                    record.attandance_last_clock_out || '-',
                    record.attandance_hours || '0',
                    record.overtime_hours || '0',
                    record.late_hours || '0'
                ]);

                doc.autoTable({
                    startY: currentY,
                    head: [['Date', 'Status', 'Clock In', 'Clock Out', 'Hours', 'OT', 'Late']],
                    body: dailyRecordsData,
                    theme: 'grid',
                    headStyles: { fillColor: [84, 110, 122], textColor: 255, fontSize: 8 },
                    margin: { left: 20, right: 20 },
                    styles: { fontSize: 7 },
                    columnStyles: {
                        0: { cellWidth: 22 },
                        1: { cellWidth: 18, halign: 'center' },
                        2: { cellWidth: 20, halign: 'center' },
                        3: { cellWidth: 20, halign: 'center' },
                        4: { cellWidth: 15, halign: 'center' },
                        5: { cellWidth: 15, halign: 'center' },
                        6: { cellWidth: 15, halign: 'center' }
                    },
                    didParseCell: function (data) {
                        if (data.column.index === 1) {
                            // Color code status
                            const status = data.cell.text[0];
                            if (status === 'Present') {
                                data.cell.styles.fillColor = [232, 245, 233];
                                data.cell.styles.textColor = [46, 125, 50];
                            } else if (status === 'Absent') {
                                data.cell.styles.fillColor = [255, 235, 238];
                                data.cell.styles.textColor = [198, 40, 40];
                            } else if (status === 'Week Off') {
                                data.cell.styles.fillColor = [227, 242, 253];
                                data.cell.styles.textColor = [30, 136, 229];
                            }
                        }
                    }
                });

                currentY = doc.lastAutoTable.finalY + 25;

            } catch (employeeError) {
                console.error('Error processing employee:', employeeData.employee_name, employeeError);
                throw new Error(`Failed to process employee ${employeeData.employee_name}: ${employeeError.message}`);
            }
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth - 40, pageHeight - 10);
        }

        // Save the PDF
        doc.save(`${filename}.pdf`);

        return true;

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF report');
    }
};

// Helper function to group data by employee
const groupDataByEmployee = (data) => {
    const grouped = {};

    data.forEach(record => {
        const employeeKey = record.employee_code;
        if (!grouped[employeeKey]) {
            grouped[employeeKey] = {
                employee_code: record.employee_code,
                employee_name: record.employee_name,
                shift_name: record.shift_name,
                shift_from_time: record.shift_from_time,
                shift_to_time: record.shift_to_time,
                shift_working_hours: record.shift_working_hours,
                records: []
            };
        }
        grouped[employeeKey].records.push(record);
    });

    // Calculate summary for each employee
    Object.keys(grouped).forEach(employeeKey => {
        const employeeData = grouped[employeeKey];
        const records = employeeData.records;

        employeeData.summary = {
            totalDays: records.length,
            presentDays: records.filter(r => r.status === 'Present').length,
            absentDays: records.filter(r => r.status === 'Absent').length,
            weekOffDays: records.filter(r => r.status === 'Week Off').length,
            totalHours: records.reduce((sum, r) => sum + parseFloat(r.attandance_hours || 0), 0).toFixed(2),
            totalOvertimeHours: records.reduce((sum, r) => sum + parseFloat(r.overtime_hours || 0), 0).toFixed(2),
            totalLateHours: records.reduce((sum, r) => sum + parseFloat(r.late_hours || 0), 0).toFixed(2),
            attendancePercentage: records.length > 0 ?
                ((records.filter(r => r.status === 'Present').length / records.filter(r => r.status !== 'Week Off').length) * 100).toFixed(1) : 0
        };
    });

    return grouped;
};

// Helper function to calculate overall summary
const calculateOverallSummary = (data) => {
    const totalRecords = data.length;
    const uniqueEmployees = new Set(data.map(r => r.employee_code)).size;
    const presentCount = data.filter(r => r.status === 'Present').length;
    const absentCount = data.filter(r => r.status === 'Absent').length;
    const weekOffCount = data.filter(r => r.status === 'Week Off').length;
    const totalHours = data.reduce((sum, r) => sum + parseFloat(r.attandance_hours || 0), 0);
    const totalOvertimeHours = data.reduce((sum, r) => sum + parseFloat(r.overtime_hours || 0), 0);
    const totalLateHours = data.reduce((sum, r) => sum + parseFloat(r.late_hours || 0), 0);

    return {
        totalRecords,
        uniqueEmployees,
        presentCount,
        absentCount,
        weekOffCount,
        totalHours: totalHours.toFixed(2),
        totalOvertimeHours: totalOvertimeHours.toFixed(2),
        totalLateHours: totalLateHours.toFixed(2)
    };
};

// Helper function to format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};