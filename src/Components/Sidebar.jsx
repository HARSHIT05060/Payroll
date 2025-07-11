import { useState, useEffect } from 'react';
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
    const [lastActiveItem, setLastActiveItem] = useState('dashboard');
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
            ].filter(Boolean)
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
            ].filter(Boolean)
        },

        {
            id: 'payroll',
            label: 'Payroll Pending',
            icon: DollarSign,
            hasSubmenu: true,
            path: '/monthly-payroll',
            tag: 'New',
            submenu: [
                { label: 'Monthly Payroll', path: '/monthly-payroll' },
                { label: 'Finalize Payroll', path: '/Finalize-payroll' },
            ]
        },

        (permissions?.loan_view) && {
            id: 'loans',
            label: 'Loans & Advances',
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
                { label: 'Employee Directory Report', path: '/reports/employee-directory' },
                { label: 'Daily Report', path: '/reports/daily-attendance' },
                { label: 'Monthly Report', path: '/reports/monthly-attendance' },
                { label: 'All Employee Report', path: '/reports/daterangereport' },
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
            ]
        },
        {
            id: 'planspricing',
            label: 'Plans & Pricing',
            icon: Settings,
            hasSubmenu: true,
            path: '/planspricing',
            submenu: [
            ]
        }
    ].filter(Boolean);

    const getActiveItemId = () => {
        for (const item of menuItems) {
            if (item.path && currentPath === item.path) return item.id;
            if (item.submenu) {
                for (const sub of item.submenu) {
                    if (currentPath === sub.path) return item.id;
                }
            }
        }
        return null;
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

    // Function to check if a menu item has an active submenu item
    const hasActiveSubmenuItem = (item) => {
        if (!item.submenu) return false;
        return item.submenu.some(subItem => subItem && currentPath === subItem.path);
    };

    // Function to get the menu item ID that should be expanded based on active submenu
    const getExpandedMenuId = () => {
        for (const item of menuItems) {
            if (hasActiveSubmenuItem(item)) {
                return item.id;
            }
        }
        return null;
    };

    const currentActiveItem = getActiveItemId();
    const activeSubmenuPath = getActiveSubmenuPath();
    const shouldExpandMenuId = getExpandedMenuId();

    // Update last active item when a valid route is found
    useEffect(() => {
        if (currentActiveItem !== null) {
            setLastActiveItem(currentActiveItem);
        }
    }, [currentActiveItem]);

    // Auto-expand submenu when there's an active submenu item
    useEffect(() => {
        if (shouldExpandMenuId) {
            setExpandedSubmenu(shouldExpandMenuId);
        }
    }, [shouldExpandMenuId, currentPath]);

    const activeItem = currentActiveItem || lastActiveItem;

    const handleMenuClick = (item) => {
        const hasActualSubmenu = item.hasSubmenu && item.submenu && item.submenu.length > 0;

        if (hasActualSubmenu) {
            setExpandedSubmenu(expandedSubmenu === item.id ? null : item.id);
            if (item.path) {
                navigate(item.path);
            }
        } else if (item.path) {
            setExpandedSubmenu(null);
            navigate(item.path);
        } else {
            setExpandedSubmenu(null);
        }
    };

    const getSubmenuHeight = (itemId) => {
        const submenu = menuItems.find(item => item.id === itemId)?.submenu;
        if (!submenu) return 0;
        return submenu.length * 40 + 60;
    };

    const hasActualSubmenu = (item) => {
        return item.hasSubmenu && item.submenu && item.submenu.length > 0;
    };

    return (
        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-[var(--color-bg-gradient-start)] to-white border-r border-[var(--color-border-primary)] shadow-lg transition-all duration-300 w-64 z-40">
            <div className="h-[calc(100%-140px)] relative">
                <div className="absolute top-0 left-0 right-0 h-4 z-10 scrollbar-fade-top"></div>

                <div className="h-full overflow-y-auto custom-scrollbar py-4 px-3 pb-6">
                    {menuItems.map((item) => {
                        if (!item) return null;

                        const Icon = item.icon;
                        const isActive = activeItem === item.id;
                        const isExpanded = expandedSubmenu === item.id;
                        const hasSubmenu = hasActualSubmenu(item);

                        return (
                            <div key={item.id} className="mb-1">
                                {hasSubmenu ? (
                                    <div
                                        className={`
                                            relative cursor-pointer rounded-xl transition-all duration-300 group
                                            ${isActive
                                                ? 'bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] text-[var(--color-text-white)] shadow-lg transform scale-[1.02]'
                                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-gradient-start)] hover:shadow-md hover:transform hover:scale-[1.01]'
                                            }
                                        `} 
                                        onClick={() => handleMenuClick(item)}
                                    >
                                        <div className="py-3 px-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`
                                                    p-2 rounded-lg transition-all duration-300
                                                    ${isActive
                                                        ? 'bg-[var(--color-bg-secondary-20)] text-[var(--color-text-white)]'
                                                        : 'bg-[var(--color-bg-gradient-start)] text-[var(--color-text-secondary)] group-hover:bg-[var(--color-blue-lighter)] group-hover:text-[var(--color-blue-dark)]'
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
                                                            ? 'bg-[var(--color-bg-secondary-20)] text-[var(--color-text-white)]'
                                                            : 'bg-gradient-to-r from-[var(--color-success-light)] to-[var(--color-success-lighter)] text-[var(--color-text-success)]'
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
                                                        ${isActive ? 'text-[var(--color-text-white)]' : 'text-[var(--color-text-muted)]'}
                                                    `}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        to={item.path}
                                        className={`
                                            relative block rounded-xl transition-all duration-300 group
                                            ${isActive
                                                ? 'bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] text-[var(--color-text-white)] shadow-lg transform scale-[1.02]'
                                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-gradient-start)] hover:shadow-md hover:transform hover:scale-[1.01]'
                                            }
                                        `}
                                        onClick={() => setExpandedSubmenu(null)}
                                    >
                                        <div className="py-3 px-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className={`
                                                    p-2 rounded-lg transition-all duration-300
                                                    ${isActive
                                                        ? 'bg-[var(--color-bg-secondary-20)] text-[var(--color-text-white)]'
                                                        : 'bg-[var(--color-bg-gradient-start)] text-[var(--color-text-secondary)] group-hover:bg-[var(--color-blue-lighter)] group-hover:text-[var(--color-blue-dark)]'
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
                                                        ? 'bg-[var(--color-bg-secondary-20)] text-[var(--color-text-white)]'
                                                        : 'bg-gradient-to-r from-[var(--color-success-light)] to-[var(--color-success-lighter)] text-[var(--color-text-success)]'
                                                    }
                                                `}>
                                                    {item.tag}
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                )}

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
                                                if (!subItem) return null;

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
                                                                ? 'bg-[var(--color-blue-lighter)] text-[var(--color-blue-darker)] border-[var(--color-blue-medium)] font-medium shadow-sm'
                                                                : 'text-[var(--color-text-secondary)] border-transparent hover:bg-[var(--color-blue-lightest)] hover:text-[var(--color-blue-dark)] hover:border-blue-300'
                                                            }
                                                        `}
                                                        style={{
                                                            animationDelay: `${index * 50}ms`
                                                        }}
                                                    >
                                                        <div className={`
                                                            w-2 h-2 rounded-full mr-3 transition-colors duration-300
                                                            ${isMaster
                                                                ? (isSubmenuActive ? 'bg-[var(--color-yellow)]' : 'bg-[var(--color-yellow-light)] hover:[var(--color-yellow)]')
                                                                : (isSubmenuActive
                                                                    ? 'bg-[var(--color-blue-medium)]'
                                                                    : 'bg-[var(--color-border-secondary)] hover:bg-[var(--color-blue-medium)]'
                                                                )
                                                            }
                                                        `}></div>
                                                        <div className="flex items-center space-x-2">
                                                            {isMaster && (
                                                                <Star size={12} className={`
                                                                    ${isSubmenuActive ? 'text-[var(--color-yellow-dark)]' : 'text-[var(--color-yellow)]'}
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

                    <div className="h-4"></div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-4 z-10 scrollbar-fade-bottom"></div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--color-border-primary)] p-4 bg-gradient-to-r from-[var(--color-bg-primary)] to-[var(--color-blue-lightest)]">
                <div className="flex items-center space-x-3 p-3 bg-[var(--color-bg-secondary)] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="p-2 bg-[var(--color-blue-lighter)] rounded-lg">
                        <Phone size={16} className="text-[var(--color-blue-dark)]" />
                    </div>
                    <div>
                        <p className="text-xs text-[var(--color-text-secondary)] font-medium">Need Help?</p>
                        <p className="text-sm font-semibold text-[var(--color-blue-dark)]">+91 9769922344</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;