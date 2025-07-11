import { useState } from 'react';
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
    ArrowLeft,
    Target,
    DollarSign,
    AlertCircle
} from 'lucide-react';
import { Toast } from '../../Components/ui/Toast'; // Adjust import path as needed

const AllReports = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    const availableReports = [
        {
            id: 'employee-list',
            title: 'Employee Directory',
            icon: Users,
            color: 'from-green-500 to-green-600',
            description: 'Complete employee information and records',
            path: '/reports/employee-directory',
            category: 'employees',
            isAvailable: true,
            features: [
                'Employee profiles with detailed information',
                'Contact information and communication details',
                'Department assignments and organizational structure',
                'Job roles and position hierarchy',
                'Employment status and current records',
                'Branch location and office assignments',
                'Employee ID management and tracking',
                'Gender demographics and statistics',
                'Multi-format export (Excel, PDF)',
                'Professional PDF reports with company branding'
            ]
        },
        {
            id: 'daily-attendance',
            title: 'Daily Attendance Report',
            icon: Calendar,
            color: 'from-blue-500 to-blue-600',
            description: 'Comprehensive daily attendance tracking with detailed employee records',
            path: '/reports/daily-attendance',
            category: 'attendance',
            isAvailable: true,
            features: [
                'Real-time employee attendance status tracking',
                'Detailed clock in/out timestamps and records',
                'Automatic working hours calculation and analysis',
                'Overtime hours tracking and comprehensive analysis',
                'Late arrival detection and detailed reporting',
                'Date range filtering and custom period selection',
                'Department-wise filtering and organizational breakdown',
                'Status-based color coding and visual indicators',
                'Multi-format export (Excel, PDF)',
                'Professional PDF reports with summary statistics'
            ]
        },
        {
            id: 'monthly-attendance',
            title: 'Monthly Attendance Summary',
            icon: BarChart3,
            color: 'from-purple-500 to-purple-600',
            description: 'Detailed monthly attendance analysis with comprehensive statistics',
            path: '/reports/monthly-attendance',
            category: 'attendance',
            isAvailable: true,
            features: [
                'Complete monthly attendance overview and analysis',
                'Attendance rate calculations and percentage metrics',
                'Working days vs. present days detailed analysis',
                'Week-off and holiday tracking with calendar integration',
                'Leave days and half-day calculations and summaries',
                'Late hours and overtime comprehensive summaries',
                'Department and employee-wise detailed breakdowns',
                'Visual status indicators and comprehensive legends',
                'Multi-format export (Excel, PDF)',
                'Enhanced PDF export with professional styling'
            ]
        },
        {
            id: 'date-range-report',
            title: 'Date Range Report',
            icon: Calendar,
            color: 'from-orange-500 to-orange-600',
            description: 'Generate comprehensive attendance reports for selected date range',
            path: '/reports/daterangereport',
            category: 'attendance',
            isAvailable: true,
            features: [
                'Employee-wise data organization and smart grouping',
                'Individual employee attendance patterns and trends',
                'Comprehensive analytics and performance metrics',
                'Hours worked tracking and detailed calculations',
                'Overtime tracking and comprehensive analysis',
                'Late arrival detection and detailed reporting',
                'Complete daily attendance records and history',
                'Detailed clock in/out times with status tracking',
                'Professional PDF format with clean styling',
                'Print-ready reports with organized layout'
            ]
        }
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

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const hideToast = () => {
        setToast(null);
    };

    const handleReportClick = (report) => {
        if (report.isAvailable) {
            try {
                navigate(report.path);
            } catch (error) {
                showToast('Failed to navigate to report. Please try again.', error);
            }
        } else {
            showToast('This report is not available yet.', 'warning');
        }
    };

    const handleNavigateBack = () => {
        try {
            navigate(-1);
        } catch (error) {
            showToast('Failed to navigate back. Please try again.', error);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Toast Component */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}

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
                            <div key={report.id} className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-primary)] overflow-hidden hover:shadow-md transition-all duration-300 hover:scale-105 flex flex-col h-full">
                                {/* Report Header - Fixed Height */}
                                <div className={`bg-gradient-to-r ${report.color} p-6 h-32 flex items-center`}>
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                                            <report.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-white line-clamp-1">{report.title}</h3>
                                            <p className="text-white/80 text-sm mt-1 line-clamp-2 leading-relaxed">{report.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Report Content - Flexible grow area */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex-1">
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

                                    {/* Sticky Footer - Always at bottom */}
                                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--color-border-primary)]">
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
                                            onClick={() => handleReportClick(report)}
                                            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-gray-light)] text-[var(--color-text-muted)] rounded-lg hover:bg-[var(--color-bg-gray-darker)] hover:text-[var(--color-text-primary)] transition-colors"
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