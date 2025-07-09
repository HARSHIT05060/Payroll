import { useNavigate } from 'react-router-dom';
import {
    Calendar,
    Clock,
    Users,
    TrendingUp,
    BarChart3,
    Activity,
    CheckCircle,
    Eye,
    Plus,
    ArrowLeft,
    FileText,
    Download,
    PieChart,
    Target,
    DollarSign,
    Award,
    Building,
    Timer,
    UserCheck,
    AlertCircle
} from 'lucide-react';

const AllReports = () => {
    const navigate = useNavigate();

    const availableReports = [
        {
            id: 'daily-attendance',
            title: 'Daily Attendance Report',
            icon: Calendar,
            color: 'from-blue-500 to-blue-600',
            description: 'View daily attendance records for all employees',
            path: '/reports/daily-attendance',
            apiEndpoint: 'daily_attendance_report_list',
            category: 'attendance',
            isAvailable: true,
            features: [
                'Employee attendance status',
                'Clock in/out times',
                'Working hours tracking',
                'Overtime calculations',
                'Late arrival tracking',
                'Export to CSV, Excel & PDF'
            ]
        },
        {
            id: 'attendance-summary',
            title: 'Attendance Summary',
            icon: BarChart3,
            color: 'from-purple-500 to-purple-600',
            description: 'Generate attendance summaries for different periods',
            path: '/reports/Monthly-attendance',
            apiEndpoint: 'daily_attendance_report_list',
            category: 'attendance',
            isAvailable: true,
            features: [
                'Weekly attendance trends',
                'Monthly summaries',
                'Attendance rate calculations',
                'Department-wise analysis',
                'Export to CSV/PDF'
            ]
        },
        {
            id: 'employee-list',
            title: 'Employee Directory',
            icon: Users,
            color: 'from-green-500 to-green-600',
            description: 'Complete employee information and records',
            path: '/reports/employee-directory',
            apiEndpoint: 'employee_list',
            category: 'employees',
            isAvailable: true,
            features: [
                'Employee profiles',
                'Contact information',
                'Department assignments',
                'Job roles and positions',
                'Employment status',
                'Export employee data'
            ]
        },

    ];

    const comingSoonReports = [
        {
            id: 'payroll-summary',
            title: 'Payroll Summary',
            icon: DollarSign,
            color: 'from-orange-500 to-orange-600',
            description: 'Comprehensive payroll calculations and summaries',
            category: 'payroll',
            isAvailable: false,
            plannedFeatures: [
                'Salary calculations',
                'Deductions tracking',
                'Tax calculations',
                'Pay slip generation',
                'Bonus calculations'
            ]
        },
        {
            id: 'performance-reports',
            title: 'Performance Reports',
            icon: TrendingUp,
            color: 'from-indigo-500 to-indigo-600',
            description: 'Employee performance analytics and evaluations',
            category: 'performance',
            isAvailable: false,
            plannedFeatures: [
                'Performance metrics',
                'Goal tracking',
                'Evaluation reports',
                'Growth analysis',
                'KPI dashboard'
            ]
        },
    ];

    const handleReportClick = (report) => {
        if (report.isAvailable) {
            navigate(report.path);
        }
    };

    const handleNavigateBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleNavigateBack}
                                className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-[var(--color-text-white)]">
                                        Reports Dashboard
                                    </h1>
                                    <p className="text-[var(--color-text-white)] opacity-80 text-sm">
                                        Generate and view comprehensive employee reports
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Available Reports Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[var(--color-blue-lighter)] rounded-lg">
                            <CheckCircle className="h-5 w-5 text-[var(--color-blue-dark)]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Available Reports</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-blue-lightest)] rounded-full">
                            <span className="text-sm font-medium text-[var(--color-blue-dark)]">
                                {availableReports.length} Reports
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {availableReports.map((report) => (
                            <div key={report.id} className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-primary)] overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105">
                                {/* Report Header */}
                                <div className={`bg-gradient-to-r ${report.color} p-6`}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <report.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                                            <p className="text-white/80 text-sm mt-1">{report.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Report Content */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h4 className="font-medium text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-[var(--color-blue-dark)]" />
                                            Features:
                                        </h4>
                                        <ul className="text-sm text-[var(--color-text-secondary)] space-y-2">
                                            {report.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <CheckCircle className="h-3 w-3 text-[var(--color-blue-dark)] flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-primary)]">
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-blue-dark)]">
                                            <CheckCircle className="h-4 w-4" />
                                            <span className="font-medium">Available</span>
                                        </div>
                                        <button
                                            onClick={() => handleReportClick(report)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-blue-darker)] transition-colors"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Coming Soon Reports Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-[var(--color-bg-gray-light)] rounded-lg">
                            <Clock className="h-5 w-5 text-[var(--color-text-muted)]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Coming Soon</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-[var(--color-bg-gray-light)] rounded-full">
                            <span className="text-sm font-medium text-[var(--color-text-muted)]">
                                {comingSoonReports.length} Reports
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {comingSoonReports.map((report) => (
                            <div key={report.id} className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-primary)] overflow-hidden opacity-75 hover:opacity-85 transition-opacity">
                                {/* Report Header */}
                                <div className={`bg-gradient-to-r ${report.color} p-6 relative`}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg">
                                            <report.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                                            <p className="text-white/80 text-sm mt-1">{report.description}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <div className="px-2 py-1 bg-white/20 rounded-full text-xs text-white font-medium">
                                            Soon
                                        </div>
                                    </div>
                                </div>

                                {/* Report Content */}
                                <div className="p-6">
                                    <div className="mb-4">
                                        <h4 className="font-medium text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                                            <Target className="h-4 w-4 text-[var(--color-text-muted)]" />
                                            Planned Features:
                                        </h4>
                                        <ul className="text-sm text-[var(--color-text-secondary)] space-y-2">
                                            {report.plannedFeatures.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3 text-[var(--color-text-muted)] flex-shrink-0" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-primary)]">
                                        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                                            <Clock className="h-4 w-4" />
                                            <span className="font-medium">Coming Soon</span>
                                        </div>
                                        <button
                                            disabled
                                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-gray-light)] text-[var(--color-text-muted)] rounded-lg cursor-not-allowed"
                                        >
                                            <AlertCircle className="h-4 w-4" />
                                            Not Available
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllReports;