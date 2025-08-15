import React, { useState, useCallback, useMemo } from 'react';
import Pagination from '../Pagination';
import {
    Users, CheckCircle, UserX, Coffee, TrendingUp, Calendar,
    Activity, Search, XCircle, ChevronDown, ChevronUp, Clock, Timer
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDashboardData } from '../../context/DashboardContext';
import { StatusBadge } from '../../Components/Report/ReportComponents';

const SORT_DIRECTIONS = {
    ASCENDING: 'ascending',
    DESCENDING: 'descending'
};

const COLUMN_KEYS = {
    NAME: 'name',
    SHIFT: 'shift',
    CLOCK_IN: 'clockIn',
    CLOCK_OUT: 'clockOut',
    WORK_HOURS: 'workHours',
    STATUS: 'status'
};

const KEY_MAPPING = {
    [COLUMN_KEYS.NAME]: 'employee_name',
    [COLUMN_KEYS.SHIFT]: 'shift_name',
    [COLUMN_KEYS.CLOCK_IN]: 'attandance_first_clock_in',
    [COLUMN_KEYS.CLOCK_OUT]: 'attandance_last_clock_out',
    [COLUMN_KEYS.WORK_HOURS]: 'attandance_hours',
    [COLUMN_KEYS.STATUS]: 'status'
};

const AttendanceReport = () => {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: SORT_DIRECTIONS.ASCENDING
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const { dashboardData, loading, setDate, setYearMonth } = useDashboardData();

    // Extract attendance details from dashboardData
    const attendanceData = useMemo(() => {
        if (!dashboardData || !dashboardData.attendance_details) {
            return [];
        }
        return dashboardData.attendance_details || [];
    }, [dashboardData]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const formattedDate = date.toISOString().split('T')[0]; // yyyy-mm-dd
        const formattedMonth = formattedDate.slice(0, 7); // yyyy-mm
        setDate(formattedDate);
        setYearMonth(formattedMonth);
        setCurrentPage(1);
        setSearchQuery('');
        setStatusFilter('all');
    };


    // Client-side filtering and sorting
    const filteredAndSortedData = useMemo(() => {
        if (!Array.isArray(attendanceData)) return [];

        let filtered = [...attendanceData];

        // Apply search filter
        if (searchQuery.trim()) {
            filtered = filtered.filter(employee =>
                employee.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee.employee_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                employee.shift_name?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(employee => employee.status === statusFilter);
        }

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const actualKey = KEY_MAPPING[sortConfig.key] || sortConfig.key;
                const aValue = a[actualKey] || '';
                const bValue = b[actualKey] || '';

                // Handle time comparison for clock in/out
                if (sortConfig.key === COLUMN_KEYS.CLOCK_IN || sortConfig.key === COLUMN_KEYS.CLOCK_OUT) {
                    const aTime = aValue ? new Date(`2000-01-01 ${aValue}`) : new Date(0);
                    const bTime = bValue ? new Date(`2000-01-01 ${bValue}`) : new Date(0);
                    return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? aTime - bTime : bTime - aTime;
                }

                // Handle numeric comparison for work hours
                if (sortConfig.key === COLUMN_KEYS.WORK_HOURS) {
                    const aNum = parseFloat(aValue) || 0;
                    const bNum = parseFloat(bValue) || 0;
                    return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? aNum - bNum : bNum - aNum;
                }

                // String comparison
                if (aValue < bValue) return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [attendanceData, searchQuery, statusFilter, sortConfig]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle sorting
    const requestSort = useCallback((key) => {
        setSortConfig(prevConfig => {
            const direction = prevConfig.key === key && prevConfig.direction === SORT_DIRECTIONS.ASCENDING
                ? SORT_DIRECTIONS.DESCENDING
                : SORT_DIRECTIONS.ASCENDING;

            return { key, direction };
        });
    }, []);

    // Calculate statistics from attendance data based on status_id
    const calculateStats = () => {
        if (!attendanceData || attendanceData.length === 0) {
            return {
                totalEmployees: 0,
                present: 0,
                absent: 0,
                weekOff: 0,
                late: 0,
                overtime: 0,
                onTime: 0,
                productivity: 0
            };
        }

        const stats = {
            totalEmployees: attendanceData.length,
            present: 0,
            absent: 0,
            weekOff: 0,
            late: 0,
            overtime: 0,
            onTime: 0,
            productivity: 0
        };

        attendanceData.forEach(employee => {
            const statusId = employee.status_id;

            // Count based on status_id: 1 = Present, 2 = Absent, 3 = Week Off
            if (statusId === '1' || statusId === 1) {
                stats.present++;
            } else if (statusId === '2' || statusId === 2) {
                stats.absent++;
            } else if (statusId === '3' || statusId === 3) {
                stats.weekOff++;
            }

            // Late employees (have late hours > 0)
            if (parseFloat(employee.late_hours || 0) > 0) {
                stats.late++;
            } else if (statusId === '1' || statusId === 1) {
                stats.onTime++;
            }

            // Overtime employees (have overtime hours > 0)
            if (parseFloat(employee.overtime_hours || 0) > 0) {
                stats.overtime++;
            }
        });

        // Calculate productivity percentage
        stats.productivity = stats.totalEmployees > 0 ? Math.round((stats.present / stats.totalEmployees) * 100) : 0;

        return stats;
    };

    const stats = calculateStats();

    const getRowStyling = (status) => {
        const statusLower = status?.toLowerCase() || '';

        switch (statusLower) {
            case 'week off':
            case 'weekoff':
                return 'bg-[var(--color-blue-lightest)] border-[var(--color-blue-light)]';
            case 'holiday':
                return 'bg-[var(--color-warning-light)] border-[var(--color-warning)]';
            case 'absent':
                return 'bg-[var(--color-error-light)] border-[var(--color-error)]';
            case 'leave':
                return 'bg-[var(--color-yellow-light)] border-[var(--color-yellow-dark)]';
            case 'half day':
                return 'bg-[var(--color-blue-lighter)] border-[var(--color-blue-dark)]';
            default:
                return '';
        }
    };

    // Format time display
    const formatTime = (time) => {
        if (!time || time === '') return '-';
        return time;
    };

    // Format hours display
    const formatHours = (hours) => {
        if (!hours || hours === '0' || hours === '') return '-';
        return `${hours}h`;
    };

    // Render sort icon
    const renderSortIcon = useCallback((key) => {
        if (sortConfig.key !== key) {
            return <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />;
        }
        return sortConfig.direction === SORT_DIRECTIONS.ASCENDING ?
            <ChevronUp className="ml-1 h-4 w-4 text-blue-600" /> :
            <ChevronDown className="ml-1 h-4 w-4 text-blue-600" />;
    }, [sortConfig]);

    // Clear search
    const handleClearSearch = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    // Handle filter change
    const handleFilterChange = (filterValue) => {
        setStatusFilter(filterValue);
        setCurrentPage(1);
    };

    // Handle clear filters
    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setCurrentPage(1);
    };

    // Status filter options
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'Present', label: 'Present' },
        { value: 'Absent', label: 'Absent' },
        { value: 'Week Off', label: 'Week Off' }
    ];


    const DonutChart = ({ stats, hoveredSegment }) => {
        const data = [
            { name: 'Present', value: stats.present, color: 'var(--color-success)', key: 'present' },
            { name: 'Absent', value: stats.absent, color: 'var(--color-error)', key: 'absent' },
            { name: 'Week Off', value: stats.weekOff, color: 'var(--color-warning)', key: 'weekoff' },
        ];
        const { totalEmployees } = stats;

        if (totalEmployees === 0) {
            return (
                <div className="flex items-center justify-center h-48 text-[var(--color-text-muted)]">
                    <div className="text-center">
                        <Users size={32} className="mx-auto mb-2 opacity-50" />
                        <p className="font-medium">No Data</p>
                        <p className="text-sm">No attendance records for this day.</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="relative w-48 h-48 mx-auto">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke={entry.color}
                                    opacity={hoveredSegment && hoveredSegment !== entry.key ? 0.3 : 1}
                                    strokeWidth={hoveredSegment === entry.key ? 3 : 1}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[var(--color-text-primary)]">{totalEmployees}</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">Employees</span>
                </div>
            </div>
        );
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-primary)]">
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                        <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darkest)] p-6">
                            <div className="animate-pulse">
                                <div className="h-8 bg-[var(--color-bg-secondary-20)] rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-[var(--color-bg-secondary-20)] rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-[var(--color-text-white)] mb-2">DASHBOARD</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-[var(--color-text-white)]" />
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => handleDateChange(date)}
                                dateFormat="dd-MM-yyyy"
                                placeholderText="DD-MM-YYYY"
                                className="w-full bg-[var(--color-bg-secondary-20)] border border-[var(--color-bg-secondary-30)] rounded-lg px-3 py-2 text-sm text-[var(--color-text-white)] placeholder-[var(--color-text-white-90)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bg-secondary-30)]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-secondary)] p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Total Employees</p>
                            <p className="text-xl font-bold text-[var(--color-text-primary)]">{stats.totalEmployees}</p>
                        </div>
                        <div className="p-2 bg-[var(--color-blue-lightest)] rounded-full">
                            <Users className="w-5 h-5 text-[var(--color-blue)]" />
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-secondary)] p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Present</p>
                            <p className="text-xl font-bold text-[var(--color-success)]">{stats.present}</p>
                        </div>
                        <div className="p-2 bg-[var(--color-success-light)] rounded-full">
                            <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-secondary)] p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Absent</p>
                            <p className="text-xl font-bold text-[var(--color-error)]">{stats.absent}</p>
                        </div>
                        <div className="p-2 bg-[var(--color-error-light)] rounded-full">
                            <UserX className="w-5 h-5 text-[var(--color-error)]" />
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-secondary)] p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Week Off</p>
                            <p className="text-xl font-bold text-[var(--color-warning)]">{stats.weekOff}</p>
                        </div>
                        <div className="p-2 bg-[var(--color-warning-light)] rounded-full">
                            <Coffee className="w-5 h-5 text-[var(--color-warning)]" />
                        </div>
                    </div>
                </div>
                <div className="bg-[var(--color-bg-secondary)] rounded-lg border border-[var(--color-border-secondary)] p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Attendance Rate</p>
                            <p className="text-xl font-bold text-[var(--color-blue)]">{stats.productivity}%</p>
                        </div>
                        <div className="p-2 bg-[var(--color-blue-lightest)] rounded-full">
                            <TrendingUp className="w-5 h-5 text-[var(--color-blue)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:items-stretch">
                {/* Chart Section */}
                <div className="lg:col-span-1">
                    <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-sm p-6 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Attendance Overview</h3>
                            <span className="text-sm text-[var(--color-text-muted)] bg-[var(--color-bg-gray-light)] px-3 py-1 rounded-full">
                                {new Date(selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        <DonutChart stats={stats} hoveredSegment={hoveredSegment} setHoveredSegment={setHoveredSegment} />

                        {/* Legend */}
                        <div className="flex flex-col flex-1 justify-center">
                            <div
                                className="flex items-center space-x-3 cursor-pointer transition-all duration-200 hover:scale-105 p-3 rounded-lg hover:bg-[var(--color-success-light)]"
                                onMouseEnter={() => setHoveredSegment('present')}
                                onMouseLeave={() => setHoveredSegment(null)}
                            >
                                <div className="w-4 h-4 bg-[var(--color-success)] rounded-full shadow-sm"></div>
                                <span className="text-sm text-[var(--color-text-secondary)] font-medium flex-1">AT WORK</span>
                                <span className="text-sm text-[var(--color-text-primary)] font-bold">{stats.present}</span>
                            </div>
                            <div
                                className="flex items-center space-x-3 cursor-pointer transition-all duration-200 hover:scale-105 p-3 rounded-lg hover:bg-[var(--color-error-light)]"
                                onMouseEnter={() => setHoveredSegment('absent')}
                                onMouseLeave={() => setHoveredSegment(null)}
                            >
                                <div className="w-4 h-4 bg-[var(--color-error)] rounded-full shadow-sm"></div>
                                <span className="text-sm text-[var(--color-text-secondary)] font-medium flex-1">ABSENT</span>
                                <span className="text-sm text-[var(--color-text-primary)] font-bold">{stats.absent}</span>
                            </div>
                            <div
                                className="flex items-center space-x-3 cursor-pointer transition-all duration-200 hover:scale-105 p-3 rounded-lg hover:bg-[var(--color-warning-light)]"
                                onMouseEnter={() => setHoveredSegment('weekoff')}
                                onMouseLeave={() => setHoveredSegment(null)}
                            >
                                <div className="w-4 h-4 bg-[var(--color-warning)] rounded-full shadow-sm"></div>
                                <span className="text-sm text-[var(--color-text-secondary)] font-medium flex-1">WEEK OFF</span>
                                <span className="text-sm text-[var(--color-text-primary)] font-bold">{stats.weekOff}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2">
                    <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
                        {/* Table Header */}
                        <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] px-6 py-4 border-b border-[var(--color-border-secondary)]">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <h3 className="text-lg font-semibold text-[var(--color-text-white)]">Employee Attendance</h3>

                                {/* Search and Filters */}
                                <div className="flex flex-col sm:flex-row gap-3">
                                    {/* Search Input */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Search employees..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-10 py-2 w-full sm:w-64 border border-[var(--color-border-secondary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-light)] focus:border-transparent bg-[var(--color-bg-primary)]"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={handleClearSearch}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Status Filter */}
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => handleFilterChange(e.target.value)}
                                        className="px-3 py-2 border border-[var(--color-border-secondary)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-blue-light)] focus:border-transparent bg-[var(--color-bg-primary)]"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>

                                    {/* Clear Filters */}
                                    {(searchQuery || statusFilter !== 'all') && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="px-3 py-2 text-sm bg-[var(--color-bg-gray-light)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-bg-hover)] transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto flex-1">
                            <table className="min-w-full divide-y divide-[var(--color-border-primary)] h-full">
                                <thead className="bg-[var(--color-bg-gray-light)]">
                                    <tr className="text-left">
                                        <th
                                            className="px-6 py-3 cursor-pointer select-none hover:bg-[var(--color-bg-hover)] transition-colors"
                                            onClick={() => requestSort(COLUMN_KEYS.NAME)}
                                        >
                                            <div className="flex items-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Employee Name
                                                {renderSortIcon(COLUMN_KEYS.NAME)}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 cursor-pointer select-none hover:bg-[var(--color-bg-hover)] transition-colors"
                                            onClick={() => requestSort(COLUMN_KEYS.SHIFT)}
                                        >
                                            <div className="flex items-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Shift
                                                {renderSortIcon(COLUMN_KEYS.SHIFT)}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 cursor-pointer select-none hover:bg-[var(--color-bg-hover)] transition-colors"
                                            onClick={() => requestSort(COLUMN_KEYS.CLOCK_IN)}
                                        >
                                            <div className="flex items-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Clock In
                                                {renderSortIcon(COLUMN_KEYS.CLOCK_IN)}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 cursor-pointer select-none hover:bg-[var(--color-bg-hover)] transition-colors"
                                            onClick={() => requestSort(COLUMN_KEYS.CLOCK_OUT)}
                                        >
                                            <div className="flex items-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Clock Out
                                                {renderSortIcon(COLUMN_KEYS.CLOCK_OUT)}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 cursor-pointer select-none hover:bg-[var(--color-bg-hover)] transition-colors"
                                            onClick={() => requestSort(COLUMN_KEYS.WORK_HOURS)}
                                        >
                                            <div className="flex items-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Work Hours
                                                {renderSortIcon(COLUMN_KEYS.WORK_HOURS)}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 cursor-pointer select-none hover:bg-[var(--color-bg-hover)] transition-colors"
                                            onClick={() => requestSort(COLUMN_KEYS.STATUS)}
                                        >
                                            <div className="flex items-center text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                                Status
                                                {renderSortIcon(COLUMN_KEYS.STATUS)}
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[var(--color-bg-secondary)] divide-y divide-[var(--color-border-secondary)]">
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((employee, index) => (
                                            <tr
                                                key={`${employee.employee_code}-${index}`}
                                                className={`hover:bg-[var(--color-bg-hover)] transition-colors ${getRowStyling(employee.status)}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8">
                                                            <div className="h-8 w-8 rounded-full bg-[var(--color-blue-light)] flex items-center justify-center">
                                                                <span className="text-sm font-medium text-[var(--color-blue)]">
                                                                    {employee.employee_name?.charAt(0)?.toUpperCase() || 'U'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                                                {employee.employee_name || 'Unknown'}
                                                            </div>
                                                            <div className="text-sm text-[var(--color-text-muted)]">
                                                                {employee.employee_code || 'N/A'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[var(--color-text-primary)]">
                                                        {employee.shift_name || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-[var(--color-text-primary)]">
                                                        <Clock className="w-4 h-4 mr-1 text-[var(--color-text-muted)]" />
                                                        {formatTime(employee.attandance_first_clock_in)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-[var(--color-text-primary)]">
                                                        <Timer className="w-4 h-4 mr-1 text-[var(--color-text-muted)]" />
                                                        {formatTime(employee.attandance_last_clock_out)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[var(--color-text-primary)]">
                                                        {formatHours(employee.attandance_hours)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={employee.status} />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                                                    <Activity className="w-12 h-12 mb-4 opacity-50" />
                                                    <h3 className="text-lg font-medium mb-2">No attendance records found</h3>
                                                    <p className="text-sm">
                                                        {searchQuery || statusFilter !== 'all'
                                                            ? 'Try adjusting your search or filter criteria'
                                                            : 'No attendance data available for the selected date'
                                                        }
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />

                    </div>
                </div>
            </div>
        </>
    );
};

export default AttendanceReport;