import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportSalaryReportToExcel = async (
    reportData,
    fileName = "Payroll_Report.xlsx",
    title = "Payroll Report",
    summaryStats = {},
    filterInfo = {}
) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Payroll");

    // Define styles
    const headerStyle = {
        font: { bold: true, color: { argb: "FFFFFFFF" }, size: 12 },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF4F81BD" } },
        border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
        },
    };

    const cellStyle = {
        border: {
            top: { style: "thin", color: { argb: "FFD3D3D3" } },
            left: { style: "thin", color: { argb: "FFD3D3D3" } },
            bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
            right: { style: "thin", color: { argb: "FFD3D3D3" } },
        },
        alignment: { horizontal: "center", vertical: "middle" },
        font: { size: 11 },
    };

    const totalStyle = {
        font: { bold: true, size: 12, color: { argb: "FF000000" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFD700" } },
        border: {
            top: { style: "thick", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thick", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
        },
    };

    const summaryHeaderStyle = {
        font: { bold: true, size: 14, color: { argb: "FFFFFFFF" } },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E8B57" } },
        border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
        },
    };

    const summaryStyle = {
        font: { bold: true, size: 11 },
        alignment: { horizontal: "left", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F8FF" } },
        border: {
            top: { style: "thin", color: { argb: "FF000000" } },
            left: { style: "thin", color: { argb: "FF000000" } },
            bottom: { style: "thin", color: { argb: "FF000000" } },
            right: { style: "thin", color: { argb: "FF000000" } },
        },
    };

    // Add title with enhanced styling
    worksheet.mergeCells("A1", "J1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = title;
    titleCell.font = { size: 18, bold: true, color: { argb: "FF4F81BD" } };
    titleCell.alignment = { horizontal: "center", vertical: "middle" };
    titleCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0F8FF" } };
    titleCell.border = {
        top: { style: "thick", color: { argb: "FF4F81BD" } },
        left: { style: "thick", color: { argb: "FF4F81BD" } },
        bottom: { style: "thick", color: { argb: "FF4F81BD" } },
        right: { style: "thick", color: { argb: "FF4F81BD" } },
    };

    // Set row height for title
    worksheet.getRow(1).height = 35;

    // Add filter info (if any)
    let currentRow = 3;
    if (filterInfo && Object.keys(filterInfo).length > 0) {
        worksheet.getCell(`A${currentRow}`).value = "Filters Applied:";
        worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 };
        currentRow++;
        
        Object.entries(filterInfo).forEach(([key, val]) => {
            worksheet.getCell(`A${currentRow}`).value = `${key}: ${val}`;
            worksheet.getCell(`A${currentRow}`).font = { size: 11 };
            currentRow++;
        });
        currentRow += 1; // Add spacing
    }

    // Define headers based on the image structure
    const headers = [
        "NO.", "Name", "Basic salary", "Attendance days", "Daily salary amount", 
        "Attendance salary", "Overtime wages", "Night shift subsidy", 
        "Full Attendance Award", "Deduction", "Net salary"
    ];

    // Add headers
    const headerRow = worksheet.getRow(currentRow);
    headerRow.values = headers;
    headerRow.eachCell((cell) => {
        Object.assign(cell, { style: headerStyle });
    });
    headerRow.height = 30;

    // Add data rows
    const dataStartRow = currentRow + 1;
    reportData.forEach((item, index) => {
        const row = worksheet.getRow(dataStartRow + index);
        // Map your data structure to match the headers
        row.values = [
            index + 1, // NO.
            item.name || item.Name || `Name ${index + 1}`,
            item.basic_salary || item.basicSalary || 0,
            item.attendance_days || item.attendanceDays || 0,
            item.daily_salary_amount || item.dailySalaryAmount || 0,
            item.attendance_salary || item.attendanceSalary || 0,
            item.overtime_wages || item.overtimeWages || 0,
            item.night_shift_subsidy || item.nightShiftSubsidy || 0,
            item.full_attendance_award || item.fullAttendanceAward || 0,
            item.deduction || item.Deduction || 0,
            item.net_salary || item.netSalary || 0
        ];
        
        row.eachCell((cell, colNumber) => {
            Object.assign(cell, { style: cellStyle });
            // Format currency columns
            if (colNumber >= 3 && colNumber <= 11) {
                cell.numFmt = '#,##0.00';
            }
        });
        row.height = 25;
    });

    // Calculate totals
    const totalRow = dataStartRow + reportData.length;
    const totals = calculateTotals(reportData);
    
    // Add totals row
    const totalRowObj = worksheet.getRow(totalRow);
    totalRowObj.values = [
        "", "TOTAL", 
        totals.basic_salary,
        totals.attendance_days,
        totals.daily_salary_amount,
        totals.attendance_salary,
        totals.overtime_wages,
        totals.night_shift_subsidy,
        totals.full_attendance_award,
        totals.deduction,
        totals.net_salary
    ];
    
    totalRowObj.eachCell((cell, colNumber) => {
        Object.assign(cell, { style: totalStyle });
        if (colNumber >= 3 && colNumber <= 11) {
            cell.numFmt = '#,##0.00';
        }
    });
    totalRowObj.height = 30;

    // Add summary section
    const summaryStartRow = totalRow + 3;
    
    // Summary header
    worksheet.mergeCells(`A${summaryStartRow}`, `C${summaryStartRow}`);
    const summaryHeaderCell = worksheet.getCell(`A${summaryStartRow}`);
    summaryHeaderCell.value = "PAYROLL SUMMARY";
    Object.assign(summaryHeaderCell, { style: summaryHeaderStyle });
    worksheet.getRow(summaryStartRow).height = 30;

    // Summary details
    const summaryData = [
        ["Total Employees", reportData.length],
        ["Total Basic Salary", totals.basic_salary],
        ["Total Attendance Salary", totals.attendance_salary],
        ["Total Overtime", totals.overtime_wages],
        ["Total Night Shift Subsidy", totals.night_shift_subsidy],
        ["Total Full Attendance Award", totals.full_attendance_award],
        ["Total Deductions", totals.deduction],
        ["NET PAYROLL AMOUNT", totals.net_salary]
    ];

    summaryData.forEach((item, index) => {
        const row = worksheet.getRow(summaryStartRow + index + 1);
        row.values = [item[0], "", item[1]];
        
        row.getCell(1).style = summaryStyle;
        row.getCell(2).style = summaryStyle;
        row.getCell(3).style = summaryStyle;
        
        // Format currency
        if (index > 0) {
            row.getCell(3).numFmt = '#,##0.00';
        }
        
        // Highlight the net total
        if (index === summaryData.length - 1) {
            row.eachCell((cell) => {
                cell.font = { bold: true, size: 12, color: { argb: "FFFFFFFF" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2E8B57" } };
            });
        }
        
        row.height = 25;
    });

    // Adjust column widths
    const columnWidths = [8, 15, 12, 12, 12, 12, 12, 12, 12, 12, 12];
    worksheet.columns.forEach((col, index) => {
        col.width = columnWidths[index] || 12;
    });

    // Add some formatting touches
    worksheet.views = [
        {
            state: 'frozen',
            xSplit: 0,
            ySplit: currentRow,
            topLeftCell: `A${currentRow + 1}`,
            activeCell: 'A1'
        }
    ];

    // Export file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, fileName);

    return { success: true, message: "Excel file exported successfully!" };
};

// Helper function to calculate totals
const calculateTotals = (data) => {
    return data.reduce((totals, item) => {
        return {
            basic_salary: totals.basic_salary + (parseFloat(item.basic_salary || item.basicSalary) || 0),
            attendance_days: totals.attendance_days + (parseFloat(item.attendance_days || item.attendanceDays) || 0),
            daily_salary_amount: totals.daily_salary_amount + (parseFloat(item.daily_salary_amount || item.dailySalaryAmount) || 0),
            attendance_salary: totals.attendance_salary + (parseFloat(item.attendance_salary || item.attendanceSalary) || 0),
            overtime_wages: totals.overtime_wages + (parseFloat(item.overtime_wages || item.overtimeWages) || 0),
            night_shift_subsidy: totals.night_shift_subsidy + (parseFloat(item.night_shift_subsidy || item.nightShiftSubsidy) || 0),
            full_attendance_award: totals.full_attendance_award + (parseFloat(item.full_attendance_award || item.fullAttendanceAward) || 0),
            deduction: totals.deduction + (parseFloat(item.deduction || item.Deduction) || 0),
            net_salary: totals.net_salary + (parseFloat(item.net_salary || item.netSalary) || 0)
        };
    }, {
        basic_salary: 0,
        attendance_days: 0,
        daily_salary_amount: 0,
        attendance_salary: 0,
        overtime_wages: 0,
        night_shift_subsidy: 0,
        full_attendance_award: 0,
        deduction: 0,
        net_salary: 0
    });
};

// Updated handler function
export const handleExportExcel = async (reportData, filters, summaryStats, showToast, setExportDropdown, getMonthYearDisplay) => {
    try {
        if (!reportData || reportData.length === 0) {
            showToast('No data available to export', 'error');
            return;
        }

        const fileName = `payroll_report_${filters.month_year || 'current'}.xlsx`;
        const title = `Payroll Report - ${getMonthYearDisplay ? getMonthYearDisplay(filters.month_year) : 'Current Period'}`;

        const result = await exportSalaryReportToExcel(
            reportData,
            fileName,
            title,
            summaryStats,
            filters
        );

        if (result.success) {
            showToast(result.message, 'success');
        } else {
            showToast(result.message || 'Export failed', 'error');
        }

        setExportDropdown(false);

    } catch (error) {
        console.error('Error in handleExportExcel:', error);
        showToast('Failed to export Excel: ' + error.message, 'error');
        setExportDropdown(false);
    }
};