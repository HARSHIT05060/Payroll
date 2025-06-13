import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

const AddUser = () => {
    const navigate = useNavigate();
    const [roleName, setRoleName] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    // Compact permission configuration
    const permissionConfig = {
        notifications: {
            title: 'Notifications',
            subtitle: 'Permission settings for Notifications',
            subsections: {
                main: { title: 'NOTIFICATIONS', permissions: ['view', 'quotesApproval', 'inquiryQuotes'] }
            }
        },
        quotation: {
            title: 'Quotation',
            subtitle: 'Permission settings for quotation',
            subsections: {
                createQuotes: { title: 'CREATE QUOTES', permissions: ['view', 'create', 'update', 'delete'] },
                purchaseOrder: { title: 'PURCHASE ORDER', permissions: ['view', 'create', 'update', 'delete', 'showOtherTeamQuotations'] }
            }
        },
        companyDetails: {
            title: 'Company Details',
            subtitle: 'Permission settings for company details',
            subsections: {
                companyProfile: { title: 'COMPANY PROFILE', permissions: ['view', 'companyProfileEdit'] }
            }
        },
        membersRoles: {
            title: 'Members & Roles',
            subtitle: 'Permission settings for members & roles',
            subsections: {
                main: { title: 'MEMBERS & ROLES', permissions: ['view', 'create', 'update', 'delete'] }
            }
        }
    };

    // Initialize permissions state
    const initializePermissions = () => {
        const permissions = {};
        Object.entries(permissionConfig).forEach(([sectionKey, section]) => {
            permissions[sectionKey] = {};
            Object.entries(section.subsections).forEach(([subsectionKey, subsection]) => {
                permissions[sectionKey][subsectionKey] = { selectAll: false };
                subsection.permissions.forEach(permission => {
                    permissions[sectionKey][subsectionKey][permission] = false;
                });
            });
        });
        return permissions;
    };

    const [permissions, setPermissions] = useState(initializePermissions());
    const [expandedSections, setExpandedSections] = useState({});

    // Function to get active checkbox count for a section
    const getActiveCheckboxCount = (sectionKey) => {
        const section = permissions[sectionKey];
        let activeCount = 0;
        let totalCount = 0;

        Object.entries(permissionConfig[sectionKey].subsections).forEach(([subsectionKey, subsection]) => {
            subsection.permissions.forEach(permission => {
                totalCount++;
                if (section[subsectionKey][permission]) {
                    activeCount++;
                }
            });
        });

        return { activeCount, totalCount };
    };

    // Load editing user data
    useEffect(() => {
        const editingUserData = localStorage.getItem('editingUser');
        if (editingUserData) {
            const user = JSON.parse(editingUserData);
            setEditingUser(user);
            setRoleName(user.roleName);

            const userPermissions = initializePermissions();
            if (user.permissions) {
                Object.entries(user.permissions).forEach(([sectionKey, section]) => {
                    if (userPermissions[sectionKey]) {
                        Object.entries(section).forEach(([subsectionKey, perms]) => {
                            if (userPermissions[sectionKey][subsectionKey] && Array.isArray(perms)) {
                                perms.forEach(permission => {
                                    if (Object.prototype.hasOwnProperty.call(userPermissions[sectionKey][subsectionKey], permission)) {
                                        userPermissions[sectionKey][subsectionKey][permission] = true;
                                    }
                                });

                                const allPermissions = permissionConfig[sectionKey].subsections[subsectionKey].permissions;
                                userPermissions[sectionKey][subsectionKey].selectAll = allPermissions.every(p =>
                                    userPermissions[sectionKey][subsectionKey][p]
                                );
                            }
                        });
                    }
                });
            }
            setPermissions(userPermissions);
            localStorage.removeItem('editingUser');
        }
    }, []);

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePermissionChange = (section, subsection, permission) => {
        setPermissions(prev => {
            const newPermissions = { ...prev };
            const subsectionPerms = newPermissions[section][subsection];

            if (permission === 'selectAll') {
                const allSelected = !subsectionPerms[permission];
                permissionConfig[section].subsections[subsection].permissions.forEach(p => {
                    subsectionPerms[p] = allSelected;
                });
                subsectionPerms[permission] = allSelected;
            } else {
                subsectionPerms[permission] = !subsectionPerms[permission];
                const allPermissions = permissionConfig[section].subsections[subsection].permissions;
                subsectionPerms.selectAll = allPermissions.every(p => subsectionPerms[p]);
            }

            return newPermissions;
        });
    };

    const handleSaveChanges = () => {
        if (!roleName.trim()) {
            alert('Please enter a role name');
            return;
        }

        const checkedPermissions = {};
        Object.entries(permissionConfig).forEach(([sectionKey, section]) => {
            checkedPermissions[sectionKey] = {};
            Object.entries(section.subsections).forEach(([subsectionKey, subsection]) => {
                const checkedPerms = subsection.permissions.filter(permission =>
                    permissions[sectionKey][subsectionKey][permission]
                );
                if (checkedPerms.length > 0) {
                    checkedPermissions[sectionKey][subsectionKey] = checkedPerms;
                }
            });
            if (Object.keys(checkedPermissions[sectionKey]).length === 0) {
                delete checkedPermissions[sectionKey];
            }
        });

        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const roleData = {
            id: editingUser?.id || Date.now(),
            roleName,
            permissions: checkedPermissions,
            createdAt: editingUser?.createdAt || new Date().toLocaleDateString()
        };

        const updatedUsers = editingUser
            ? existingUsers.map(user => user.id === editingUser.id ? roleData : user)
            : [...existingUsers, roleData];

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        window.dispatchEvent(new CustomEvent('usersUpdated'));
        navigate('/usermanage');
    };

    const handleCancel = () => {
        localStorage.removeItem('editingUser');
        navigate('/usermanage');
    };

    const formatPermissionName = (permission) => {
        const specialNames = {
            quotesApproval: 'Quotes Approval',
            inquiryQuotes: 'Inquiry Quotes',
            showOtherTeamQuotations: 'Show other team members\' quotations',
            companyProfileEdit: 'Company Profile Edit - (Limited access)'
        };
        return specialNames[permission] || permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    const renderSection = (sectionKey, config) => {
        const isExpanded = expandedSections[sectionKey];
        const { activeCount, totalCount } = getActiveCheckboxCount(sectionKey);

        return (
            <div key={sectionKey} className="mb-6 bg-gray-50 rounded-lg overflow-hidden">
                {/* Clickable Section Header */}
                <div
                    onClick={() => toggleSection(sectionKey)}
                    className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-b border-gray-200"
                >
                    <div>
                        <h3 className="text-sm font-medium text-gray-900">{config.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{config.subtitle}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        {/* Active Checkbox Count */}
                        <div className="flex items-center space-x-2">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${activeCount > 0
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                {activeCount}/{totalCount} Permissions
                            </span>
                            {activeCount > 0 && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                        </div>

                        {/* Chevron Icon */}
                        <div className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200">
                            {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-blue-600 transition-transform duration-200" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-blue-600 transition-transform duration-200" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Smooth Collapsible Content */}
                <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    } overflow-hidden`}>
                    <div className="p-6 space-y-6 bg-white">
                        {Object.entries(config.subsections).map(([subsectionKey, subsection]) => {
                            const subsectionPerms = permissions[sectionKey][subsectionKey];

                            return (
                                <div key={subsectionKey} className="border-l-4 border-blue-100 pl-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-medium text-gray-700">{subsection.title}</h4>
                                        <button
                                            onClick={() => handlePermissionChange(sectionKey, subsectionKey, 'selectAll')}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50"
                                        >
                                            {subsectionPerms.selectAll ? 'Deselect all' : 'Select all'}
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {subsection.permissions.map(permission => (
                                            <label
                                                key={permission}
                                                className="flex items-center space-x-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50 transition-colors duration-150"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={subsectionPerms[permission]}
                                                    onChange={() => handlePermissionChange(sectionKey, subsectionKey, permission)}
                                                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-150"
                                                />
                                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-150">
                                                    {formatPermissionName(permission)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleCancel}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {editingUser ? 'Edit Role' : 'Add New Role'}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {editingUser ? 'Modify existing role permissions' : 'Create a new role with custom permissions'}
                        </p>
                    </div>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleSaveChanges}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 hover:shadow-md"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Details Section */}
                <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Role Details</h2>
                    <p className="text-sm text-gray-500 mb-6">Define the role name for better organization</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
                            <input
                                type="text"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Enter role name"
                            />
                        </div>
                    </div>
                </div>

                {/* Permission Sections */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h2>
                    {Object.entries(permissionConfig).map(([sectionKey, config]) =>
                        renderSection(sectionKey, config)
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddUser;