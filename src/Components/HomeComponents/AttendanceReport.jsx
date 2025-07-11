import React, { useState, useEffect, useCallback } from 'react';
import Pagination from '../Pagination'; // Adjust path as needed
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import {
    Users,
    Clock,
    Calendar,
    UserX,
    Coffee,
    AlertCircle,
    CheckCircle,
    Timer,
    Activity,
    Zap
} from 'lucide-react';

const AttendanceReport = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hoveredSegment, setHoveredSegment] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    const { user } = useAuth();

    // Fetch daily attendance report
    const fetchDailyReport = useCallback(async (date) => {
        if (!user?.user_id) return;

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('date', date);

            const response = await api.post('daily_attendance_report_list', formData);

            if (response.data?.success && response.data.data) {
                setAttendanceData(response.data.data);
                setCurrentPage(1); // Reset to first page when data changes
            } else {
                throw new Error(response.data?.message || 'Failed to fetch daily report');
            }
        } catch (err) {
            const errorMessage = err.message || 'An error occurred while fetching the report';
            setError(errorMessage);
            console.error('Error fetching attendance data:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.user_id]);

    useEffect(() => {
        fetchDailyReport(selectedDate);
    }, [selectedDate, fetchDailyReport]);

    // Calculate pagination
    const totalPages = Math.ceil(attendanceData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = attendanceData.slice(startIndex, startIndex + itemsPerPage);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Calculate statistics from attendance data
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
            // Present employees
            if (employee.status === 'Present') {
                stats.present++;
            }
            // Week off employees
            else if (employee.status === 'Week Off') {
                stats.weekOff++;
            }
            // Absent employees (not present and not week off)
            else if (employee.status !== 'Present' && employee.status !== 'Week Off') {
                stats.absent++;
            }

            // Late employees (have late hours > 0)
            if (parseFloat(employee.late_hours || 0) > 0) {
                stats.late++;
            } else if (employee.status === 'Present') {
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

    // Get attendance status color for table
    const getAttendanceColor = (status) => {
        switch (status) {
            case 'Present': return 'bg-green-500';
            case 'Absent': return 'bg-red-500';
            case 'Week Off': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Present':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Absent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Week Off':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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

    // Get employee initials for avatar
    const getEmployeeInitials = (name) => {
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Get random avatar color
    const getAvatarColor = (name) => {
        const colors = [
            'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
            'bg-teal-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500'
        ];
        const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
        return colors[index];
    };

    const DonutChart = ({ stats }) => {
        const { totalEmployees, present, absent, weekOff } = stats;
        const total = totalEmployees;

        if (total === 0) {
            return (
                <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">No Data</div>
                        <div className="text-sm text-gray-400">No employees found</div>
                    </div>
                </div>
            );
        }

        const presentPercent = (present / total) * 100;
        const absentPercent = (absent / total) * 100;
        const weekOffPercent = (weekOff / total) * 100;

        // Fixed radius - no change on hover to prevent displacement
        const radius = 55;
        const circumference = 2 * Math.PI * radius;

        // Calculate stroke dash arrays and offsets
        const presentStroke = (presentPercent / 100) * circumference;
        const absentStroke = (absentPercent / 100) * circumference;
        const weekOffStroke = (weekOffPercent / 100) * circumference;

        const segments = [
            {
                id: 'present',
                stroke: presentStroke,
                offset: 0,
                color: '#10b981',
                label: 'AT WORK',
                count: present,
                percentage: presentPercent
            },
            {
                id: 'absent',
                stroke: absentStroke,
                offset: -presentStroke,
                color: '#ef4444',
                label: 'ABSENT',
                count: absent,
                percentage: absentPercent
            },
            {
                id: 'weekoff',
                stroke: weekOffStroke,
                offset: -(presentStroke + absentStroke),
                color: '#f59e0b',
                label: 'WEEK OFF',
                count: weekOff,
                percentage: weekOffPercent
            }
        ];

        return (
            <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    {/* Background circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="#f3f4f6"
                        strokeWidth="8"
                        className="animate-pulse"
                        style={{
                            animation: loading ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
                        }}
                    />

                    {/* Render segments */}
                    {segments.map((segment, index) => (
                        segment.stroke > 0 && (
                            <circle
                                key={segment.id}
                                cx="60"
                                cy="60"
                                r={radius}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth={hoveredSegment === segment.id ? "12" : "8"}
                                strokeDasharray={`${segment.stroke} ${circumference}`}
                                strokeDashoffset={segment.offset}
                                strokeLinecap="round"
                                className="transition-all duration-300 ease-in-out cursor-pointer"
                                onMouseEnter={() => setHoveredSegment(segment.id)}
                                onMouseLeave={() => setHoveredSegment(null)}
                                style={{
                                    opacity: hoveredSegment && hoveredSegment !== segment.id ? 0.6 : 1,
                                    filter: hoveredSegment === segment.id ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' : 'none',
                                    animation: !loading ? `drawCircle-${index} 2s ease-out forwards` : 'none',
                                    strokeDasharray: loading ? '0 1000' : `${segment.stroke} ${circumference}`,
                                    animationDelay: `${index * 0.4}s`
                                }}
                            />
                        )
                    ))}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        {hoveredSegment ? (
                            <div className="transition-all duration-300 transform scale-110">
                                <div className="text-3xl font-bold text-gray-800">
                                    {segments.find(s => s.id === hoveredSegment)?.count || 0}
                                </div>
                                <div className="text-xs text-gray-500 font-semibold">
                                    {segments.find(s => s.id === hoveredSegment)?.label}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                    {(segments.find(s => s.id === hoveredSegment)?.percentage || 0).toFixed(1)}%
                                </div>
                            </div>
                        ) : (
                            <div className="transition-all duration-300">
                                <div className="text-4xl font-bold text-gray-800">{total}</div>
                                <div className="text-sm text-gray-500">Total Employees</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading animation styles */}
                <style jsx>{`
                    @keyframes drawCircle-0 {
                        from { stroke-dasharray: 0 1000; }
                        to { stroke-dasharray: ${presentStroke} ${circumference}; }
                    }
                    @keyframes drawCircle-1 {
                        from { stroke-dasharray: 0 1000; }
                        to { stroke-dasharray: ${absentStroke} ${circumference}; }
                    }
                    @keyframes drawCircle-2 {
                        from { stroke-dasharray: 0 1000; }
                        to { stroke-dasharray: ${weekOffStroke} ${circumference}; }
                    }
                `}</style>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Daily Attendance Report</h1>
                            <p className="text-blue-100">Track and monitor employee attendance</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                            <div className="animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Loading Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 h-[700px]">
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 h-[700px]">
                            <div className="flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">Daily Attendance Report</h1>
                            <p className="text-blue-100">Track and monitor employee attendance</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5" />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                            />
                        </div>
                    </div>
                </div>

                {/* Error Content */}
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
                        <p className="text-red-600 text-sm mb-6">{error}</p>
                        <button
                            onClick={() => fetchDailyReport(selectedDate)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
            {/* Header */}
                <div className="flex items-center justify-end space-x-2 ">
                    <Calendar className="w-5 h-5" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                    />
                </div>


            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Chart Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm p-6 h-[700px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">Attendance Overview</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {new Date(selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <DonutChart stats={stats} />

                            {/* Legend */}
                            <div className="flex flex-col space-y-4 mt-8">
                                <div
                                    className="flex items-center space-x-3 cursor-pointer transition-all duration-200 hover:scale-105 p-3 rounded-lg hover:bg-green-50"
                                    onMouseEnter={() => setHoveredSegment('present')}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                >
                                    <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                                    <span className="text-sm text-gray-700 font-medium flex-1">AT WORK</span>
                                    <span className="text-sm text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
                                        {stats.present}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center space-x-3 cursor-pointer transition-all duration-200 hover:scale-105 p-3 rounded-lg hover:bg-red-50"
                                    onMouseEnter={() => setHoveredSegment('absent')}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                >
                                    <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                                    <span className="text-sm text-gray-700 font-medium flex-1">ABSENT</span>
                                    <span className="text-sm text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
                                        {stats.absent}
                                    </span>
                                </div>
                                <div
                                    className="flex items-center space-x-3 cursor-pointer transition-all duration-200 hover:scale-105 p-3 rounded-lg hover:bg-yellow-50"
                                    onMouseEnter={() => setHoveredSegment('weekoff')}
                                    onMouseLeave={() => setHoveredSegment(null)}
                                >
                                    <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                                    <span className="text-sm text-gray-700 font-medium flex-1">WEEK OFF</span>
                                    <span className="text-sm text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
                                        {stats.weekOff}
                                    </span>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-700 mb-4">Performance Metrics</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Attendance Rate</span>
                                        <span className="text-sm font-semibold text-green-600">{stats.productivity}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${stats.productivity}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm h-[700px] flex flex-col">
                        <div className="p-6 border-b border-gray-200 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Employee Details</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {new Date(selectedDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Activity className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                        {attendanceData.length} employees
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-hidden flex flex-col">
                            {attendanceData.length === 0 ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center py-12">
                                        <div className="text-gray-500 text-sm">No attendance data found for the selected date.</div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock In</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clock Out</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Hours</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {paginatedData.map((employee) => (
                                                    <tr key={employee.sno} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-600 flex-shrink-0">
                                                                    {getEmployeeInitials(employee.employee_name)}
                                                                </div>
                                                                <div className="ml-4 min-w-0">
                                                                    <div className="text-sm font-medium text-gray-900 truncate">{employee.employee_name}</div>
                                                                    <div className="text-sm text-gray-500 truncate">{employee.employee_code}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{employee.shift_name}</div>
                                                            <div className="text-xs text-gray-500">{employee.shift_from_time} - {employee.shift_to_time}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatTime(employee.attandance_first_clock_in)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatTime(employee.attandance_last_clock_out)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatHours(employee.attandance_hours)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className={`w-3 h-3 rounded-full mr-2 ${getAttendanceColor(employee.status)}`}></div>
                                                                <span className="text-sm text-gray-900">{employee.status}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex-shrink-0">
                                            <Pagination
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                onPageChange={handlePageChange}
                                                loading={loading}
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReport;