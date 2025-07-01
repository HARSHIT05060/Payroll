import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Users,
    Clock,
    Calendar,
    CheckSquare,
    DollarSign,
    Briefcase,
    BarChart2,
    FileText,
    User,
    Settings,
    Phone,
    ChevronRight,
    Star
} from 'lucide-react';
import { useSelector } from 'react-redux';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [expandedSubmenu, setExpandedSubmenu] = useState(null);
    const navigate = useNavigate();
    const permissions = useSelector(state => state.permissions) || {};

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: Home,
            path: '/home',
        },

        (permissions?.employee_view) && {
            id: 'employees',
            label: 'Employees',
            icon: Users,
            hasSubmenu: true,
            path: '/employee',
            submenu: [
                permissions?.employee_view && { label: 'Employee List', path: '/employee' },
                (permissions?.employee_create || permissions?.employee_view) && { label: 'Add Employee', path: '/add-employee' },
                permissions?.department_view && { label: 'Department', path: '/departments' },
                permissions?.designation_view && { label: 'Designation', path: '/designation' },
                permissions?.branch_view && { label: 'Branch', path: '/branches' },
            ].filter(Boolean) // remove false values from submenu
        },

        (permissions?.shift_view) && {
            id: 'shift',
            label: 'Shift Management',
            icon: Clock,
            hasSubmenu: true,
            path: "/shift-management",
            submenu: [
                permissions?.employee_view && { label: 'Shifts', path: '/shift-management' },
                (permissions?.shift_create) && { label: 'Add Shift', path: '/add-shift' },
            ].filter(Boolean)
        },

        (permissions?.leave_view) && {
            id: 'leaves',
            label: 'Leaves & Holidays',
            icon: Calendar,
            hasSubmenu: true,
            path: '/leavestatusPage',
            submenu: [
                (permissions?.leave_view) && { label: 'Leave Requests', path: '/leavestatusPage' },
                (permissions?.leave_create) && { label: 'Leave Application', path: '/leaveapplication' },
                // { label: 'Holiday Calendar', path: '/holidaycalender' },
                // { label: 'Policy', path: '/leaves/policy' }
            ].filter(Boolean)
        },

        {
            id: 'payroll',
            label: 'Payroll Pending',
            icon: DollarSign,
            hasSubmenu: true,
            path: '/bulk-attendance',
            tag: 'New',
            submenu: [
                { label: 'Bulk Attendance', path: '/bulk-attendance' },
                { label: 'Monthly Payroll', path: '/monthly-payroll' },
                { label: 'Finalize Payroll', path: '/Finalize-payroll' },
            ]
        },

        (permissions?.loan_view) && {
            id: 'loans',
            label: 'Loans & Advances (edit work pending)',
            icon: Briefcase,
            hasSubmenu: true,
            path: '/loans',
            submenu: [
                (permissions?.loan_view) && { label: 'Loans & Advances', path: '/loans' },
                (permissions?.loan_create) && { label: 'Add Loan/Advance', path: '/add-loan-advance' },
            ]
        },

        {
            id: 'reports',
            label: 'Reports Pending',
            icon: BarChart2,
            hasSubmenu: true,
            path: '/reports',
            submenu: [
                { label: 'All Reports', path: '/reports' },
                { label: 'Attendance', path: '/reports/attendance' },
                { label: 'Performance', path: '/reports/performance' },
                { label: 'Financial', path: '/reports/financial' }
            ]
        },

        (permissions?.user_view || permissions?.user_roles_view) && {
            id: 'user',
            label: 'User Management',
            icon: User,
            hasSubmenu: true,
            path: '/usermanage',
            submenu: [
                (permissions?.user_view) && { label: 'Users', path: '/usermanage' },
                (permissions?.user_roles_view) && { label: 'Roles', path: '/role' },
            ]
        },

        {
            id: 'configuration',
            label: 'Configuration Pending',
            icon: Settings,
            hasSubmenu: true,
            path: '/configuration',
            submenu: [
                // { label: 'Master', path: '/configuration' },
                // { label: 'Company Profile', path: '/configuration/profile' },
                // { label: 'Notifications', path: '/configuration/notifications' },
                // { label: 'Integrations', path: '/configuration/integrations' }
            ]
        }
    ].filter(Boolean); // Remove any false menu items

    const getActiveItemId = () => {
        for (const item of menuItems) {
            if (item.path && currentPath === item.path) return item.id;
            if (item.submenu) {
                for (const sub of item.submenu) {
                    if (currentPath === sub.path) return item.id;
                }
            }
        }
        return 'dashboard'; // default fallback
    };

    const getActiveSubmenuPath = () => {
        for (const item of menuItems) {
            if (item.submenu) {
                for (const sub of item.submenu) {
                    if (currentPath === sub.path) return sub.path;
                }
            }
        }
        return null;
    };

    const activeItem = getActiveItemId();
    const activeSubmenuPath = getActiveSubmenuPath();

    const handleMenuClick = (item) => {
        // Check if item has actual submenu
        const hasActualSubmenu = item.hasSubmenu && item.submenu && item.submenu.length > 0;

        if (hasActualSubmenu) {
            setExpandedSubmenu(expandedSubmenu === item.id ? null : item.id);
            // Navigate to main path if it exists
            if (item.path) {
                navigate(item.path);
            }
        } else if (item.path) {
            // Navigate to path for items without submenu or with empty submenu
            setExpandedSubmenu(null);
            navigate(item.path);
        } else {
            setExpandedSubmenu(null);
        }
    };

    const getSubmenuHeight = (itemId) => {
        const submenu = menuItems.find(item => item.id === itemId)?.submenu;
        if (!submenu) return 0;
        return submenu.length * 40 + 60; // 40px per item + padding
    };

    const hasActualSubmenu = (item) => {
        return item.hasSubmenu && item.submenu && item.submenu.length > 0;
    };

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-slate-50 to-white border-r border-gray-200 shadow-lg transition-all duration-300 w-64 z-40">
            {/* Scrollable Navigation Container */}
            <div className="h-[calc(100%-140px)] relative">
                {/* Top fade overlay */}
                <div className="absolute top-0 left-0 right-0 h-4 z-10 scrollbar-fade-top"></div>

                {/* Scrollable content */}
                <div className="h-full overflow-y-auto custom-scrollbar py-4 px-3 pb-6">
                    {menuItems.map((item) => {
                        if (!item) return null; // Skip false/null items

                        const Icon = item.icon;
                        const isActive = activeItem === item.id;
                        const isExpanded = expandedSubmenu === item.id;
                        const hasSubmenu = hasActualSubmenu(item);

                        return (
                            <div key={item.id} className="mb-1">
                                {hasSubmenu ? (
                                    // Menu item with submenu
                                    <div
                                        className={`
                                            relative cursor-pointer rounded-xl transition-all duration-300 group
                                            ${isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                                                : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-[1.01]'
                                            }
                                        `}
                                        onClick={() => handleMenuClick(item)}
                                    >
                                        <div className="py-3 px-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`
                                                    p-2 rounded-lg transition-all duration-300
                                                    ${isActive
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                                    }
                                                `}>
                                                    <Icon size={16} />
                                                </div>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {item.tag && (
                                                    <span className={`
                                                        text-xs px-2 py-1 rounded-full font-medium transition-all duration-300
                                                        ${isActive
                                                            ? 'bg-white/20 text-white'
                                                            : 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700'
                                                        }
                                                    `}>
                                                        {item.tag}
                                                    </span>
                                                )}
                                                <ChevronRight
                                                    size={16}
                                                    className={`
                                                        transform transition-all duration-300 ease-in-out
                                                        ${isExpanded ? 'rotate-90' : 'rotate-0'}
                                                        ${isActive ? 'text-white' : 'text-gray-400'}
                                                    `}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Menu item without submenu (using Link)
                                    <Link
                                        to={item.path}
                                        className={`
                                            relative block rounded-xl transition-all duration-300 group
                                            ${isActive
                                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-[1.02]'
                                                : 'text-gray-700 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-[1.01]'
                                            }
                                        `}
                                        onClick={() => setExpandedSubmenu(null)}
                                    >
                                        <div className="py-3 px-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`
                                                    p-2 rounded-lg transition-all duration-300
                                                    ${isActive
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600'
                                                    }
                                                `}>
                                                    <Icon size={16} />
                                                </div>
                                                <span className="text-sm font-medium">{item.label}</span>
                                            </div>
                                            {item.tag && (
                                                <span className={`
                                                    text-xs px-2 py-1 rounded-full font-medium transition-all duration-300
                                                    ${isActive
                                                        ? 'bg-white/20 text-white'
                                                        : 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700'
                                                    }
                                                `}>
                                                    {item.tag}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                )}

                                {/* Animated Submenu */}
                                {hasSubmenu && (
                                    <div
                                        className="overflow-hidden transition-all duration-500 ease-in-out"
                                        style={{
                                            maxHeight: isExpanded ? `${getSubmenuHeight(item.id)}px` : '0px',
                                            opacity: isExpanded ? 1 : 0,
                                        }}
                                    >
                                        <div className="ml-6 mt-2 space-y-2">
                                            {item.submenu?.map((subItem, index) => {
                                                if (!subItem) return null; // Skip false/null subitems

                                                const isSubmenuActive = activeSubmenuPath === subItem.path;
                                                const isMaster = subItem.label === 'Master';

                                                return (
                                                    <Link
                                                        key={index}
                                                        to={subItem.path}
                                                        className={`
                                                            flex items-center py-2 px-4 text-sm rounded-lg 
                                                            transition-all duration-300 hover:shadow-sm
                                                            border-l-2 hover:pl-6
                                                            ${isSubmenuActive
                                                                ? 'bg-blue-100 text-blue-700 border-blue-400 font-medium shadow-sm'
                                                                : 'text-gray-600 border-transparent hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                                                            }
                                                        `}
                                                        style={{
                                                            animationDelay: `${index * 50}ms`
                                                        }}
                                                    >
                                                        <div className={`
                                                            w-2 h-2 rounded-full mr-3 transition-colors duration-300
                                                            ${isMaster
                                                                ? (isSubmenuActive ? 'bg-yellow-400' : 'bg-yellow-300 hover:bg-yellow-400')
                                                                : (isSubmenuActive ? 'bg-blue-400' : 'bg-gray-300 hover:bg-blue-400')
                                                            }
                                                        `}></div>
                                                        <div className="flex items-center space-x-2">
                                                            {isMaster && (
                                                                <Star size={12} className={`
                                                                    ${isSubmenuActive ? 'text-yellow-500' : 'text-yellow-400'}
                                                                `} />
                                                            )}
                                                            <span>{subItem.label}</span>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Extra padding at bottom for better scrolling */}
                    <div className="h-4"></div>
                </div>

                {/* Bottom fade overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-4 z-10 scrollbar-fade-bottom"></div>
            </div>

            {/* Enhanced Footer */}
            <div className="absolute bottom-0 left-0 right-0 border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Phone size={16} className="text-blue-600" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium">Need Help?</p>
                        <p className="text-sm font-semibold text-blue-600">+91 9769922344</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;