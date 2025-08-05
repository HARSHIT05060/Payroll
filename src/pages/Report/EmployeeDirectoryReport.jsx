import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import {
    Users,
    Building,
    Award,
    User,
    ArrowLeft,
    Filter,
    RefreshCw,
    Loader2,
    UserCheck,
    Mail,
    Phone,
    Download,
    ChevronDown,
    Briefcase,
    DollarSign,
    FileDown,
    FileSpreadsheet
} from 'lucide-react';
import Pagination from '../../Components/Pagination';
import { Toast } from '../../Components/ui/Toast';
import { useRef } from 'react';
import { exportEmployeeDirectoryToPDF, calculateEmployeeDirectorySummary } from '../../utils/exportUtils/EmployeeReport/employeeDirectoryPdfExport';
import { exportToExcel } from '../../utils/exportUtils/EmployeeReport/excelExportEmployeeDirectory';

const EmployeeDirectoryReport = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    // Filter states
    const [filters, setFilters] = useState({
        branch_id: '',
        department_id: '',
        designation_id: '',
        employee_type_id: '',
        salary_type_id: '',
        gender_id: '',
        status_id: ''
    });

    // Dropdown data states
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [designations, setDesignations] = useState([]);
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [salaryTypes, setSalaryTypes] = useState([]);
    const [genders, setGenders] = useState([]);
    const [status, setStatus] = useState([]);

    const [dropdownLoading, setDropdownLoading] = useState(false);
    const [reportGenerating, setReportGenerating] = useState(false);

    // Report data
    const [reportData, setReportData] = useState(null);
    const [error, setError] = useState(null);

    // Toast state
    const [toast, setToast] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [exportDropdown, setExportDropdown] = useState(false);

    // Refs for dropdown positioning 
    const buttonRef = useRef(null);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 });

    // Toast helper function
    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };
    // Update button position when export dropdown is opened
    useEffect(() => {
        if (exportDropdown && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setButtonPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [exportDropdown]);

    // Calculate summary statistics
    const calculateSummaryStats = (data) => {
        if (!data || data.length === 0) return null;

        const totalEmployees = data.length;
        const activeEmployees = data.filter(emp => emp.status === 1 || emp.status === '1').length;
        const inactiveEmployees = data.filter(emp => emp.status === 2 || emp.status === '2').length;

        // Gender distribution
        const maleCount = data.filter(emp => emp.gender?.toLowerCase() === 'male').length;
        const femaleCount = data.filter(emp => emp.gender?.toLowerCase() === 'female').length;

        // Department distribution
        const departmentCounts = {};
        data.forEach(emp => {
            if (emp.department_name) {
                departmentCounts[emp.department_name] = (departmentCounts[emp.department_name] || 0) + 1;
            }
        });

        return {
            totalEmployees,
            activeEmployees,
            inactiveEmployees,
            maleCount,
            femaleCount,
            departmentCounts
        };
    };

    // Fetch dropdown data
    const fetchDropdownData = useCallback(async () => {
        try {
            setDropdownLoading(true);
            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            const response = await api.post('employee_drop_down_list', formData);

            if (response.data?.success && response.data.data) {
                const data = response.data.data;

                // Format branches
                const formattedBranches = (data.branch_list || []).map(branch => ({
                    id: branch.branch_id,
                    name: branch.name
                }));
                setBranches(formattedBranches);

                // Format departments
                const formattedDepartments = (data.department_list || []).map(dept => ({
                    id: dept.department_id,
                    name: dept.name
                }));
                setDepartments(formattedDepartments);

                // Format designations
                const formattedDesignations = (data.designation_list || []).map(desig => ({
                    id: desig.designation_id,
                    name: desig.name
                }));
                setDesignations(formattedDesignations);

                // Format employee types if available
                if (data.employee_type_list) {
                    const formattedEmployeeTypes = data.employee_type_list.map(type => ({
                        id: type.employee_type_id,
                        name: type.name
                    }));
                    setEmployeeTypes(formattedEmployeeTypes);
                }

                // Format salary types if available
                if (data.salary_type_list) {
                    const formattedSalaryTypes = data.salary_type_list.map(type => ({
                        id: type.salary_type_id,
                        name: type.name
                    }));
                    setSalaryTypes(formattedSalaryTypes);
                }
                if (data.gender_list) {
                    const formattedgenderTypes = data.gender_list.map(type => ({
                        id: type.gender_id,
                        name: type.name
                    }));
                    setGenders(formattedgenderTypes);
                }
                if (data.emp_status_list) {
                    const formattedStatusTypes = data.emp_status_list.map(type => ({
                        id: type.status_id,
                        name: type.name
                    }));
                    setStatus(formattedStatusTypes);
                }

            } else {
                throw new Error(response.data?.message || 'Failed to fetch dropdown data');
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to load filter options';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setDropdownLoading(false);
        }
    }, [user?.user_id]);

    // Generate employee directory report
    const generateReport = useCallback(async () => {
        try {
            setReportGenerating(true);
            setError(null);

            if (!user?.user_id) {
                throw new Error('User ID is required');
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            // Add filters to form data
            if (filters.branch_id) formData.append('branch_id', filters.branch_id);
            if (filters.department_id) formData.append('department_id', filters.department_id);
            if (filters.designation_id) formData.append('designation_id', filters.designation_id);
            if (filters.employee_type_id) formData.append('employee_type_id', filters.employee_type_id);
            if (filters.salary_type_id) formData.append('salary_type_id', filters.salary_type_id);
            if (filters.gender_id) formData.append('gender_id', filters.gender_id);
            if (filters.status_id) formData.append('status_id', filters.status_id);

            const response = await api.post('employee_list_report', formData);

            if (response.data?.success && response.data.data) {
                setReportData(response.data.data);
                setCurrentPage(1);
            } else {
                throw new Error(response.data?.message || 'Failed to generate report');
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to generate report';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setReportGenerating(false);
        }
    }, [user?.user_id, filters]);

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleExportPDF = () => {
        try {
            if (!reportData || reportData.length === 0) {
                showToast('No data available to export', 'error');
                return;
            }

            // Calculate summary statistics
            const summaryStats = calculateEmployeeDirectorySummary(reportData);

            // Create filter info object with readable names
            const filterInfo = {};

            if (filters.branch_id) {
                const branch = branches.find(b => b.id === filters.branch_id);
                filterInfo.Branch = branch ? branch.name : filters.branch_id;
            }

            if (filters.department_id) {
                const department = departments.find(d => d.id === filters.department_id);
                filterInfo.Department = department ? department.name : filters.department_id;
            }

            if (filters.designation_id) {
                const designation = designations.find(d => d.id === filters.designation_id);
                filterInfo.Designation = designation ? designation.name : filters.designation_id;
            }

            if (filters.employee_type_id) {
                const employeeType = employeeTypes.find(et => et.id === filters.employee_type_id);
                filterInfo['Employee Type'] = employeeType ? employeeType.name : filters.employee_type_id;
            }

            if (filters.salary_type_id) {
                const salaryType = salaryTypes.find(st => st.id === filters.salary_type_id);
                filterInfo['Salary Type'] = salaryType ? salaryType.name : filters.salary_type_id;
            }

            if (filters.gender_id) {
                const gender = genders.find(g => g.id === filters.gender_id);
                filterInfo.Gender = gender ? gender.name : filters.gender_id;
            }

            if (filters.status_id) {
                const statusItem = status.find(s => s.id === filters.status_id);
                filterInfo.Status = statusItem ? statusItem.name : filters.status_id;
            }

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const fileName = `Employee_Directory_Report_${timestamp}.pdf`;

            // Export to PDF
            const result = exportEmployeeDirectoryToPDF(
                reportData,
                fileName,
                'Employee Directory Report',
                summaryStats,
                filterInfo
            );

            if (result.success) {
                showToast('PDF export initiated successfully!', 'success');
            } else {
                showToast(result.message, 'error');
            }

            setExportDropdown(false);

        } catch (error) {
            console.error('Error in handleExportPDF:', error);
            showToast('Failed to export PDF: ' + error.message, 'error');
            setExportDropdown(false);
        }
    };

    const handleExportExcel = useCallback(() => {
        try {
            if (!reportData || reportData.length === 0) {
                showToast('No data available to export', 'error');
                return;
            }

            // Transform the data for Excel export
            const exportData = reportData.map((employee, index) => ({
                'S.No': index + 1,
                'Employee Name': employee.full_name || '',
                'Employee Code': employee.employee_code || '',
                'Department': employee.department_name || '',
                'Designation': employee.designation_name || '',
                'Branch': employee.branch_name || '',
                'Email': employee.email || '',
                'Phone': employee.mobile_number || '',
                'Gender': employee.gender || '',
                'Date of Joining': employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString('en-GB') : '',
                'Employee Type': employee.employee_type || '',
                'Salary Type': employee.salary_type || '',
                'Status': employee.status === 1 || employee.status === '1' ? 'Active' :
                    employee.status === 2 || employee.status === '2' ? 'Inactive' : 'Unknown'
            }));

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const fileName = `Employee_Directory_Report_${timestamp}`;

            // Export to Excel
            exportToExcel(exportData, fileName);

            showToast('Excel export completed successfully!', 'success');
            setExportDropdown(false);

        } catch (error) {
            console.error('Error in handleExportExcel:', error);
            showToast('Failed to export Excel: ' + error.message, 'error');
            setExportDropdown(false);
        }
    }, [reportData]);

    // Reset filters
    const resetFilters = () => {
        setFilters({
            branch_id: '',
            department_id: '',
            designation_id: '',
            employee_type_id: '',
            salary_type_id: '',
            gender_id: '',
            status_id: ''
        });
        setReportData(null);
        setError(null);
        setCurrentPage(1);
        showToast('Filters reset successfully', 'success');
    };


    // Pagination logic
    const totalItems = reportData?.length || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = reportData?.slice(indexOfFirstItem, indexOfLastItem) || [];

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Initial load of dropdown data
    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    // Auto-generate report on component mount
    useEffect(() => {
        if (!dropdownLoading && user?.user_id) {
            generateReport();
        }
    }, [dropdownLoading, user?.user_id]);

    // Reset page when report data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [reportData]);

    const summaryStats = calculateSummaryStats(reportData);

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/reports')}
                                    className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                                >
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h1 className="text-2xl font-bold text-[var(--color-text-white)]">
                                            Employee Directory
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <button
                                        ref={buttonRef}
                                        onClick={() => setExportDropdown(!exportDropdown)}
                                        className="flex items-center gap-2 bg-[var(--color-bg-secondary)] text-[var(--color-blue-dark)] hover:bg-[var(--color-bg-primary)] px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        <Download className="h-4 w-4" />
                                        Export
                                        <ChevronDown className="h-4 w-4" />
                                    </button>

                                    {/* Portal Dropdown */}
                                    {exportDropdown && createPortal(
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setExportDropdown(false)}
                                            />
                                            <div
                                                className="fixed z-50 bg-[var(--color-bg-secondary)] rounded-lg shadow-2xl border border-[var(--color-border-secondary)] py-2 min-w-48"
                                                style={{
                                                    top: buttonPosition.top + 10,
                                                    left: buttonPosition.left + buttonPosition.width - 192, // 192px = w-48
                                                }}
                                            >
                                                <button
                                                    onClick={handleExportExcel}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)]"
                                                >
                                                    <FileSpreadsheet className="h-4 w-4 text-[var(--color-success)]" />
                                                    Export to Excel
                                                </button>
                                                <button
                                                    onClick={handleExportPDF}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-[var(--color-bg-hover)] transition-colors text-[var(--color-text-secondary)]"
                                                >
                                                    <FileDown className="h-4 w-4 text-[var(--color-error)]" />
                                                    Export to PDF
                                                </button>
                                            </div>
                                        </>,
                                        document.body
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Statistics */}
                {summaryStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Total Employees</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{summaryStats.totalEmployees}</p>
                                </div>
                                <Users className="h-8 w-8 text-[var(--color-blue)]" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Active</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{summaryStats.activeEmployees}</p>
                                </div>
                                <UserCheck className="h-8 w-8 text-[var(--color-success)]" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Male</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{summaryStats.maleCount}</p>
                                </div>
                                <User className="h-8 w-8 text-[var(--color-blue)]" />
                            </div>
                        </div>
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6 shadow-sm border border-[var(--color-border-primary)]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Female</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{summaryStats.femaleCount}</p>
                                </div>
                                <User className="h-8 w-8 text-pink-500" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters Section */}
                <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[var(--color-blue-lightest)] rounded-lg">
                            <Filter className="h-5 w-5 text-[var(--color-blue-dark)]" />
                        </div>
                        <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Filter Employees</h2>
                        <button
                            onClick={resetFilters}
                            className="ml-auto flex items-center gap-2 px-3 py-1 bg-[var(--color-bg-gray-light)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors text-sm"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reset
                        </button>
                    </div>

                    {dropdownLoading && (
                        <div className="flex items-center gap-2 mb-4 text-[var(--color-text-secondary)]">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Loading filter options...</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Branch Filter */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                <Building className="inline h-4 w-4 mr-1" />
                                Branch
                            </label>
                            <select
                                value={filters.branch_id}
                                onChange={(e) => handleFilterChange('branch_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] focus:border-transparent text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Branches</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                <Users className="inline h-4 w-4 mr-1" />
                                Department
                            </label>
                            <select
                                value={filters.department_id}
                                onChange={(e) => handleFilterChange('department_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] focus:border-transparent text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Departments</option>
                                {departments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Designation Filter */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                <Award className="inline h-4 w-4 mr-1" />
                                Designation
                            </label>
                            <select
                                value={filters.designation_id}
                                onChange={(e) => handleFilterChange('designation_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] focus:border-transparent text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Designations</option>
                                {designations.map((designation) => (
                                    <option key={designation.id} value={designation.id}>
                                        {designation.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Employee Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                <Briefcase className="inline h-4 w-4 mr-1" />
                                Employee Type
                            </label>
                            <select
                                value={filters.employee_type_id}
                                onChange={(e) => handleFilterChange('employee_type_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] focus:border-transparent text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Employee Types</option>
                                {employeeTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Salary Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                <DollarSign className="inline h-4 w-4 mr-1" />
                                Salary Type
                            </label>
                            <select
                                value={filters.salary_type_id}
                                onChange={(e) => handleFilterChange('salary_type_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] focus:border-transparent text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Salary Types</option>
                                {salaryTypes.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Gender Filter */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                <User className="inline h-4 w-4 mr-1" />
                                Gender
                            </label>
                            <select
                                value={filters.gender_id}
                                onChange={(e) => handleFilterChange('gender_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] focus:border-transparent text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Genders</option>
                                {genders.map((gender) => (
                                    <option key={gender.id} value={gender.id}>
                                        {gender.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                <User className="inline h-4 w-4 mr-1" />
                                Status
                            </label>
                            <select
                                value={filters.status_id}
                                onChange={(e) => handleFilterChange('status_id', e.target.value)}
                                className="w-full px-3 py-2 bg-[var(--color-bg-secondary)] border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-dark)] focus:border-transparent text-[var(--color-text-primary)]"
                                disabled={dropdownLoading}
                            >
                                <option value="">All Status</option>
                                {status.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Apply Filters Button */}
                        <div className="flex items-end">
                            <button
                                onClick={generateReport}
                                disabled={reportGenerating}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-blue-darker)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {reportGenerating ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Filter className="h-4 w-4" />
                                )}
                                {reportGenerating ? 'Loading...' : 'Apply Filters'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Employee Directory Results */}
                {reportData && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] overflow-hidden">
                        <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-[var(--color-blue-dark)]">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <Users className="h-6 w-6 text-[var(--color-text-white)] mr-2" />
                                    <h3 className="text-lg font-medium text-[var(--color-text-white)]">
                                        Employee Directory
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Table Container */}
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[1200px]">
                                <thead className="bg-[var(--color-bg-gray-light)] border-b border-[var(--color-border-secondary)]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                            Employee
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                            ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                            Designation
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                            Branch
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                            Contact
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">
                                            Join Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-secondary)]">
                                    {currentItems.map((employee, index) => (
                                        <tr key={employee.employee_id || index} className="hover:bg-[var(--color-bg-hover)] transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 relative">
                                                        <div className="h-10 w-10 rounded-full bg-[var(--color-blue-dark)] flex items-center justify-center">
                                                            <span className="text-sm font-medium text-[var(--color-text-white)]">
                                                                {employee.full_name?.charAt(0) || 'N'}
                                                            </span>
                                                        </div>
                                                        {/* Status indicator */}
                                                        <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${employee.status === 1 || employee.status === '1'
                                                            ? 'bg-green-500'
                                                            : employee.status === 2 || employee.status === '2'
                                                                ? 'bg-red-500'
                                                                : 'bg-gray-400'
                                                            }`}></div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                                            {employee.full_name || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-[var(--color-text-muted)]">
                                                            {employee.gender || 'N/A'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                {employee.employee_code || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                {employee.department_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                {employee.designation_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                {employee.branch_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                <div className="space-y-1">
                                                    {employee.email && (
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="h-3 w-3 text-[var(--color-text-muted)]" />
                                                            <span className="text-xs">{employee.email}</span>
                                                        </div>
                                                    )}
                                                    {employee.phone && (
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="h-3 w-3 text-[var(--color-text-muted)]" />
                                                            <span className="text-xs">{employee.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-primary)]">
                                                {employee.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString('en-GB') : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            loading={reportGenerating}
                        />
                    </div>
                )}

                {/* No Data Message */}
                {!reportData && !reportGenerating && !error && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-[var(--color-bg-gray-light)] rounded-full mb-4">
                                <Users className="h-8 w-8 text-[var(--color-text-muted)]" />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No Employees Found</h3>
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                No employees match your current filter criteria.
                            </p>
                            <div className="text-sm text-[var(--color-text-muted)]">
                                <p>• Try adjusting your filters</p>
                                <p>• Or reset filters to see all employees</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {reportGenerating && (
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-secondary)] p-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <div className="p-3 bg-[var(--color-blue-lightest)] rounded-full mb-4">
                                <Loader2 className="h-8 w-8 text-[var(--color-blue)] animate-spin" />
                            </div>
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">Generating Report</h3>
                            <p className="text-[var(--color-text-secondary)]">
                                Please wait while we prepare your monthly attendance report...
                            </p>
                        </div>
                    </div>
                )}
            </div>
            {/* Toast Component */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}
        </div>
    );
};

export default EmployeeDirectoryReport;