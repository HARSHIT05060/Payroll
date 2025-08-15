import React, { useState, useMemo } from 'react';
import {
    Users, CheckCircle, UserX, Calendar, Search, Coffee
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useDashboardData } from '../../context/DashboardContext';
import { StatusBadge } from '../../Components/Report/ReportComponents';
import Pagination from '../Pagination';

const AttendanceReport = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const { dashboardData, loading: dashboardLoading, setDate, setYearMonth } = useDashboardData();

    const ROWS_PER_PAGE = 5;

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
        setSearchQuery('');
        setStatusFilter('all');
        setCurrentPage(1); // Reset to first page when changing date
    };

    // Calculate statistics from attendance data based on status_id
    const calculateStats = () => {
        if (!attendanceData || attendanceData.length === 0) {
            return {
                totalEmployees: 0,
                present: 0,
                absent: 0,
                weekOff: 0
            };
        }

        const stats = {
            totalEmployees: attendanceData.length,
            present: 0,
            absent: 0,
            weekOff: 0
        };

        attendanceData.forEach(employee => {
            const statusId = employee.status_id;

            if (statusId === '1' || statusId === 1) {
                stats.present++;
            } else if (statusId === '2' || statusId === 2) {
                stats.absent++;
            } else if (statusId === '3' || statusId === 3) {
                stats.weekOff++;
            }
        });

        return stats;
    };

    const stats = calculateStats();

    const filteredData = useMemo(() => {
        let data = [...attendanceData];
        if (searchQuery) {
            data = data.filter(e => e.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (statusFilter !== 'all') {
            data = data.filter(e => e.status === statusFilter);
        }
        return data;
    }, [attendanceData, searchQuery, statusFilter]);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Create empty rows to fill up to 5 rows
    const emptyRowsNeeded = Math.max(0, ROWS_PER_PAGE - paginatedData.length);
    const emptyRows = Array.from({ length: emptyRowsNeeded }, (_, index) => ({ isEmpty: true, id: `empty-${index}` }));
    const displayData = [...paginatedData, ...emptyRows];

    // Handle pagination
    const handlePageChange = (page) => {
        setLoading(true);
        setCurrentPage(page);
        // Simulate loading delay
        setTimeout(() => {
            setLoading(false);
        }, 200);
    };

    // Reset current page when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    // eslint-disable-next-line no-unused-vars
    const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
        <div className="bg-[var(--color-bg-secondary)] p-3 rounded-xl border border-[var(--color-border-secondary)] flex items-center gap-3 transition hover:shadow-md hover:-translate-y-0.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColor}`}>
                <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
                <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
                <p className="text-lg font-bold text-[var(--color-text-primary)]">{value}</p>
            </div>
        </div>
    );

    const DonutChart = ({ stats }) => {
        const data = [
            { name: 'Present', value: stats.present, color: 'var(--color-success)' },
            { name: 'Absent', value: stats.absent, color: 'var(--color-error)' },
            { name: 'Week Off', value: stats.weekOff, color: 'var(--color-warning)' },
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
                            {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />)}
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

    if (dashboardLoading) {
        return (
            <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg p-8 border border-[var(--color-border-secondary)]">
                <div className="flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-blue)] mx-auto mb-4"></div>
                        <div className="text-[var(--color-text-secondary)]">Loading Dashboard...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-bg-secondary)] rounded-2xl">
            {/* Header */}
            <div className="bg-[var(--color-blue)] text-white p-4 rounded-xl mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">DASHBOARD</h1>
                </div>
                <div className="flex items-center gap-2 relative">
                    <Calendar className="w-5 h-5 text-white" />
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd-MM-yyyy"
                        placeholderText="DD-MM-YYYY"
                        className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-44"
                    />
                </div>
            </div>
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-3">
                {/* Employee List Table */}
                <div className="lg:col-span-2">
                    {/* Stats Grid - Above the table */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                        <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} color="text-[var(--color-blue)]" bgColor="bg-[var(--color-blue-lightest)]" />
                        <StatCard icon={CheckCircle} label="Present" value={stats.present} color="text-[var(--color-success)]" bgColor="bg-[var(--color-success-light)]" />
                        <StatCard icon={UserX} label="Absent" value={stats.absent} color="text-[var(--color-error)]" bgColor="bg-[var(--color-error-light)]" />
                        <StatCard icon={Coffee} label="Week Off" value={stats.weekOff} color="text-[var(--color-warning)]" bgColor="bg-[var(--color-warning-light)]" />
                    </div>

                    {/* Table with blue header */}
                    <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-sm overflow-hidden">
                        {/* Blue Header with title and controls */}
                        <div className="bg-[var(--color-blue)] text-white px-6 py-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">Employee Attendance</h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" />
                                        <input
                                            type="text"
                                            placeholder="Search employees..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-48 bg-white/20 border border-white/30 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                    </div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                                    >
                                        <option value="all" className="text-black">All Status</option>
                                        <option value="Present" className="text-black">Present</option>
                                        <option value="Absent" className="text-black">Absent</option>
                                        <option value="Week Off" className="text-black">Week Off</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-[var(--color-bg-secondary)]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Employee Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Shift</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Clock In</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Clock Out</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Work Hours</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-primary)] uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[var(--color-border-secondary)]">
                                    {displayData.map((emp, i) => {
                                        if (emp.isEmpty) {
                                            return (
                                                <tr key={emp.id} className="h-16">
                                                    <td className="px-6 py-4" colSpan="6">
                                                        <div className="h-12"></div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                        
                                        return (
                                            <tr key={i} className="hover:bg-[var(--color-bg-hover)] transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                                            {emp.employee_name || 'Unknown'}
                                                        </div>
                                                        <div className="text-sm text-[var(--color-text-muted)]">
                                                            {emp.employee_code || 'N/A'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[var(--color-text-primary)]">
                                                        {emp.shift_name || 'day'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[var(--color-text-primary)]">
                                                        {emp.attandance_first_clock_in || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[var(--color-text-primary)]">
                                                        {emp.attandance_last_clock_out || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[var(--color-text-primary)]">
                                                        {emp.attandance_hours ? `${emp.attandance_hours}h` : '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={emp.status} />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            
                            {filteredData.length === 0 && (
                                <div className="text-center py-12 bg-white">
                                    <p className="font-medium text-[var(--color-text-secondary)]">No records found.</p>
                                    <p className="text-sm text-[var(--color-text-muted)]">Try adjusting your filters.</p>
                                </div>
                            )}
                        </div>
                        
                        {/* Pagination */}
                        {filteredData.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                                loading={loading}
                                className="mt-4"
                            />
                        )}
                    </div>
                </div>

                {/* Daily Overview Chart - Moved up */}
                <div className="bg-[var(--color-bg-primary)] p-4 rounded-xl">
                    <h3 className="font-semibold mb-4 text-center text-[var(--color-text-primary)]">Daily Overview</h3>
                    <DonutChart stats={stats} />
                    <div className="mt-4 space-y-2">
                        {Object.entries({ Present: stats.present, Absent: stats.absent, 'Week Off': stats.weekOff }).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors">
                                <div className="flex items-center gap-2">
                                    <StatusBadge status={key} />
                                </div>
                                <span className="font-semibold text-[var(--color-text-primary)]">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;