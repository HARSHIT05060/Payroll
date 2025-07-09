import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Edit,
    UserPlus,
    User,
    Shield,
    ChevronDown,
    ChevronUp,
    Save,
    X,
    Settings
} from "lucide-react";
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../../Components/ui/Toast';
import { ConfirmDialog } from '../../Components/ui/ConfirmDialog';
import { useRef } from 'react';

const AddRole = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { roleId } = useParams();
    const location = useLocation();

    // Get role data from navigation state
    const roleDataFromState = location.state?.roleData;
    const roleIdFromState = location.state?.roleId;

    const [name, setName] = useState('');
    const [permissionConfig, setPermissionConfig] = useState({});
    const [permissions, setPermissions] = useState({});
    const [expandedSections, setExpandedSections] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });
    const submitInProgressRef = useRef(false);

    // Determine if we're in edit mode and get the current role ID
    const isEditMode = Boolean(roleId) || Boolean(roleIdFromState);
    const currentRoleId = roleId || roleIdFromState;

    console.log('Edit Mode:', isEditMode);
    console.log('Current Role ID:', currentRoleId);
    console.log('Role ID from params:', roleId);
    console.log('Role ID from state:', roleIdFromState);

    // Toast helper functions
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    // Find view permission in a subsection
    const findViewPermission = (sectionKey, subsectionKey) => {
        const subsection = permissionConfig[sectionKey]?.subsections[subsectionKey];
        if (!subsection) return null;

        return subsection.permissions.find(perm =>
            perm.key.toLowerCase().includes('view') ||
            perm.key.toLowerCase().includes('list') ||
            perm.title.toLowerCase().includes('view') ||
            perm.title.toLowerCase().includes('list')
        );
    };

    // Fetch permissions from API
    const fetchPermissions = async () => {
        try {
            setLoading(true);
            const response = await api.post('permission_list', {});

            if (response.data.success && response.data.data) {
                const config = transformApiDataToConfig(response.data.data);
                setPermissionConfig(config);
                return config;
            } else {
                throw new Error(response.data.message || 'Failed to fetch permissions');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            showToast('Failed to load permissions', 'error');
            return null;
        }
    };

    // Fetch role permissions using user_role_id - FIXED VERSION
    const fetchRolePermissions = async (roleId) => {
        try {
            console.log('Fetching role permissions for roleId:', roleId);

            // Create FormData correctly
            const formData = new FormData();
            formData.append('user_roles_id', String(roleId));
            formData.append('user_id', String(user.user_id));

            console.log('Sending request with:', {
                user_roles_id: String(roleId),
                user_id: String(user.user_id)
            });

            const response = await api.post('permission_list', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('Role permissions response:', response.data);

            if (response.data?.success && response.data.data) {
                const rolePermissionIds = [];

                response.data.data.forEach(section => {
                    if (section.permission_name_items && Array.isArray(section.permission_name_items)) {
                        section.permission_name_items.forEach(item => {
                            // Check for different possible access indicators
                            const hasAccess = item.has_access === 1 ||
                                item.has_access === "1" ||
                                item.has_access === true ||
                                item.has_access === "true";

                            if (hasAccess && item.main_permission_items_id) {
                                rolePermissionIds.push(parseInt(item.main_permission_items_id));
                            }
                        });
                    }
                });

                console.log('Extracted role permission IDs:', rolePermissionIds);
                return rolePermissionIds;
            }

            console.warn('No valid role permissions data found');
            return [];
        } catch (error) {
            console.error('Error fetching role permissions:', error);
            showToast('Failed to load role permissions', 'error');
            return [];
        }
    };

    // Fetch role data for editing (basic info only) - IMPROVED VERSION
    const fetchRoleData = async (roleId) => {
        try {
            console.log('Fetching role data for roleId:', roleId);

            // First try to use role data from state if it matches
            if (roleDataFromState &&
                (roleDataFromState.user_roles_id == roleId || roleDataFromState.id == roleId)) {
                console.log('Using role data from state:', roleDataFromState);
                return roleDataFromState;
            }

            // If no state data or it doesn't match, fetch from API
            const formData = new FormData();
            formData.append('user_id', String(user.user_id));

            const response = await api.post('user_roles_list', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log('Roles list response:', response.data);

            if (response.data?.success && response.data.data) {
                const roleData = response.data.data.find(role => {
                    // Try different possible ID fields
                    const matchesId = role.user_roles_id == roleId ||
                        role.user_roles_id === parseInt(roleId) ||
                        role.id == roleId ||
                        role.id === parseInt(roleId);

                    console.log('Comparing role:', role, 'with roleId:', roleId, 'matches:', matchesId);
                    return matchesId;
                });

                if (roleData) {
                    console.log('Found role data:', roleData);
                    return roleData;
                } else {
                    console.error('Role not found in the list. Available roles:', response.data.data);
                    throw new Error('Role not found in the list');
                }
            } else {
                throw new Error(response.data?.message || 'Failed to fetch role data');
            }
        } catch (err) {
            console.error('Error fetching role data:', err);
            setError(err.response?.data?.message || err.message);
            showToast('Failed to load role data', 'error');
            return null;
        }
    };

    // Transform API data to component config format
    const transformApiDataToConfig = (apiData) => {
        const config = {};

        apiData.forEach(section => {
            const sectionKey = section.permission_name_title.toLowerCase().replace(/\s+/g, '');

            config[sectionKey] = {
                title: section.permission_name_title,
                subtitle: `Permission settings for ${section.permission_name_title.toLowerCase()}`,
                id: section.main_permission_id,
                subsections: {
                    main: {
                        title: section.permission_name_title.toUpperCase(),
                        permissions: section.permission_name_items.map(item => ({
                            key: item.items_name_input,
                            title: item.main_permission_items_title,
                            id: parseInt(item.main_permission_items_id)
                        }))
                    }
                }
            };
        });

        return config;
    };

    // Initialize permissions state based on config
    const initializePermissions = (config) => {
        const permissions = {};
        Object.entries(config).forEach(([sectionKey, section]) => {
            permissions[sectionKey] = {};
            Object.entries(section.subsections).forEach(([subsectionKey, subsection]) => {
                permissions[sectionKey][subsectionKey] = { selectAll: false };
                subsection.permissions.forEach(permission => {
                    permissions[sectionKey][subsectionKey][permission.key] = false;
                });
            });
        });
        return permissions;
    };

    // Apply role permissions using permission_items_id array - IMPROVED VERSION
    const applyRolePermissions = (rolePermissionIds, config) => {
        console.log('Applying role permissions:', rolePermissionIds);
        const userPermissions = initializePermissions(config);

        if (rolePermissionIds && rolePermissionIds.length > 0) {
            Object.entries(config).forEach(([sectionKey, section]) => {
                Object.entries(section.subsections).forEach(([subsectionKey, subsection]) => {
                    let sectionSelectedCount = 0;

                    subsection.permissions.forEach(permission => {
                        if (rolePermissionIds.includes(permission.id)) {
                            console.log(`Setting permission ${permission.key} to true for section ${sectionKey}`);
                            userPermissions[sectionKey][subsectionKey][permission.key] = true;
                            sectionSelectedCount++;
                        }
                    });

                    const totalPermissions = subsection.permissions.length;
                    userPermissions[sectionKey][subsectionKey].selectAll = sectionSelectedCount === totalPermissions;

                    console.log(`Section ${sectionKey}: ${sectionSelectedCount}/${totalPermissions} permissions selected`);
                });
            });
        }

        console.log('Final applied permissions:', userPermissions);
        return userPermissions;
    };

    // Load component data on mount - IMPROVED VERSION
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('Loading data... Edit mode:', isEditMode, 'Role ID:', currentRoleId);

                // First, always fetch the permission configuration
                const config = await fetchPermissions();
                if (!config) {
                    console.error('Failed to load permission config');
                    return;
                }

                console.log('Permission config loaded:', config);

                if (isEditMode && currentRoleId) {
                    console.log('Loading data for edit mode');

                    // Fetch role data
                    const roleData = await fetchRoleData(currentRoleId);
                    if (!roleData) {
                        console.error('Failed to load role data');
                        setError('Failed to load role data');
                        return;
                    }

                    // Set the role name
                    const roleName = roleData.name || roleData.role_name || '';
                    console.log('Setting role name:', roleName);
                    setName(roleName);

                    // Fetch and apply role permissions
                    const rolePermissionIds = await fetchRolePermissions(currentRoleId);
                    console.log('Fetched role permission IDs:', rolePermissionIds);

                    if (rolePermissionIds && rolePermissionIds.length > 0) {
                        const rolePermissions = applyRolePermissions(rolePermissionIds, config);
                        setPermissions(rolePermissions);
                    } else {
                        console.log('No role permissions found, initializing empty permissions');
                        setPermissions(initializePermissions(config));
                    }
                } else {
                    console.log('Loading data for create mode');
                    // Create mode - initialize empty permissions
                    setPermissions(initializePermissions(config));
                }
            } catch (error) {
                console.error('Error loading data:', error);
                setError('Failed to load data: ' + error.message);
                showToast('Failed to load data: ' + error.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isEditMode, currentRoleId, user?.user_id]); // Added user.user_id as dependency

    // Function to get active checkbox count for a section
    const getActiveCheckboxCount = (sectionKey) => {
        const section = permissions[sectionKey];
        let activeCount = 0;
        let totalCount = 0;

        if (section && permissionConfig[sectionKey]) {
            Object.entries(permissionConfig[sectionKey].subsections).forEach(([subsectionKey, subsection]) => {
                subsection.permissions.forEach(permission => {
                    totalCount++;
                    if (section[subsectionKey] && section[subsectionKey][permission.key]) {
                        activeCount++;
                    }
                });
            });
        }

        return { activeCount, totalCount };
    };

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
                    subsectionPerms[p.key] = allSelected;
                });
                subsectionPerms[permission] = allSelected;
            } else {
                const isCurrentlySelected = subsectionPerms[permission];

                // 🛡️ Prevent unchecking "view" if other permissions are selected
                const viewPermission = findViewPermission(section, subsection);
                if (
                    viewPermission &&
                    permission === viewPermission.key &&
                    isCurrentlySelected
                ) {
                    // check if any other permission is still true
                    const otherSelected = permissionConfig[section].subsections[subsection].permissions.some(p =>
                        p.key !== permission && subsectionPerms[p.key]
                    );
                    if (otherSelected) {
                        showToast('Cannot deselect view while other permissions are active', 'warning');
                        return prev;
                    }
                }

                subsectionPerms[permission] = !isCurrentlySelected;

                // ✅ Auto-select view if selecting another permission
                if (!isCurrentlySelected) {
                    if (viewPermission && !subsectionPerms[viewPermission.key]) {
                        subsectionPerms[viewPermission.key] = true;
                    }
                }

                // ✅ Update selectAll status
                const allPermissions = permissionConfig[section].subsections[subsection].permissions.map(p => p.key);
                subsectionPerms.selectAll = allPermissions.every(p => subsectionPerms[p]);
            }

            return newPermissions;
        });
    };

    const handleSaveChanges = () => {
        if (submitInProgressRef.current) return;

        if (!name.trim()) {
            showToast('Please enter a role name', 'warning');
            return;
        }

        if (!user || !user.user_id) {
            showToast('Admin user ID is required. Please log in again.', 'error');
            return;
        }

        setConfirmModal({
            isOpen: true,
            type: 'save',
            data: null
        });
    };

    const confirmSave = async () => {
        setConfirmModal({ isOpen: false, type: '', data: null });
        if (submitInProgressRef.current) return;
        submitInProgressRef.current = true;

        try {
            setLoading(true);

            const permissionItemsIds = [];

            Object.entries(permissionConfig).forEach(([sectionKey, section]) => {
                Object.entries(section.subsections).forEach(([subsectionKey, subsection]) => {
                    subsection.permissions.forEach(permission => {
                        if (permissions[sectionKey][subsectionKey][permission.key]) {
                            permissionItemsIds.push(parseInt(permission.id));
                        }
                    });
                });
            });

            console.log('Saving with permission IDs:', permissionItemsIds);

            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('user_id', String(user.user_id));

            // Add permission IDs
            permissionItemsIds.forEach((id, index) => {
                formData.append(`permission_items_id[${index}]`, String(id));
            });

            // Add role ID for edit mode
            if (isEditMode && currentRoleId) {
                formData.append('user_roles_id', String(currentRoleId));
                console.log('Edit mode: Adding user_roles_id:', currentRoleId);
            }

            // Log the FormData contents
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            const response = await api.post('user_roles_create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Save response:', response.data);

            if (response.data.success) {
                showToast(
                    isEditMode ? 'Role updated successfully!' : 'Role created successfully!',
                    'success'
                );
                setTimeout(() => {
                    navigate('/role');
                }, 1500);
            } else {
                throw new Error(response.data.message || 'Failed to save role');
            }
        } catch (err) {
            console.error('Save error:', err);
            showToast(
                'Error saving role: ' + (err.response?.data?.message || err.message),
                'error'
            );
        } finally {
            setTimeout(() => {
                submitInProgressRef.current = false;
                setLoading(false);
            }, 1500);
        }
    };

    const handleCancel = () => {
        setConfirmModal({
            isOpen: true,
            type: 'cancel',
            data: null
        });
    };

    const confirmCancel = () => {
        setConfirmModal({ isOpen: false, type: '', data: null });
        navigate('/role');
    };

    const formatPermissionName = (permissionTitle) => {
        return permissionTitle;
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto bg-[var(--color-bg-secondary)] min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-blue-dark)]"></div>
                    <span className="ml-3 text-[var(--color-text-secondary)]">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto bg-[var(--color-bg-secondary)] min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-[var(--color-text-error)] text-lg font-semibold mb-2">Error</div>
                        <div className="text-[var(--color-text-secondary)] mb-4">{error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-md hover:bg-[var(--color-blue-darker)] transition-all duration-200"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)]">
                        <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                                >
                                    <ArrowLeft size={18} />
                                    Back
                                </button>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <h2 className="text-2xl font-bold text-[var(--color-text-white)]">
                                            {isEditMode ? 'Edit Role' : 'Create New Role'}
                                        </h2>
                                        <p className="text-[var(--color-blue-lighter)] text-sm mt-1">
                                            {isEditMode ? 'Update role details and permissions below' : 'Fill in the role details and permissions below'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-blue-light)] shadow-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-[var(--color-blue-light)] bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)]">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-[var(--color-text-white)]" />
                            <h3 className="text-lg font-semibold text-[var(--color-text-white)]">Role Information</h3>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Role Name */}
                        <div className="space-y-2">
                            <label htmlFor="role_name" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                <User className="w-4 h-4 text-[var(--color-blue-dark)]" />
                                Role Name <span className="text-[var(--color-error)]">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="role_name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 pl-12 border rounded-xl shadow-sm focus:outline-none focus:ring-3 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)] transition-all duration-200 border-[var(--color-border-secondary)] hover:border-[var(--color-blue-medium)]"
                                    placeholder="Enter role name"
                                />
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                            </div>
                        </div>

                        {/* Permissions Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-[var(--color-blue-dark)]" />
                                <h3 className="text-lg font-semibold text-gray-800">Permissions</h3>
                            </div>

                            {Object.entries(permissionConfig).map(([sectionKey, config]) => {
                                const isExpanded = expandedSections[sectionKey];
                                const { activeCount, totalCount } = getActiveCheckboxCount(sectionKey);

                                return (
                                    <div key={sectionKey} className="border border-[var(--color-border-primary)] rounded-xl overflow-hidden shadow-sm">
                                        <div
                                            onClick={() => toggleSection(sectionKey)}
                                            className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-[var(--color-bg-primary)] transition-colors duration-200 bg-[var(--color-bg-secondary)]"
                                        >
                                            <div>
                                                <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">{config.title}</h4>
                                                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{config.subtitle}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${activeCount > 0
                                                        ? 'bg-[var(--color-blue-lighter)] text-[var(--color-blue-darkest)]'
                                                        : 'bg-[var(--color-bg-gradient-start)] text-[var(--color-text-secondary)]'
                                                        }`}>
                                                        {activeCount}/{totalCount} Permissions
                                                    </span>
                                                    {activeCount > 0 && (
                                                        <div className="w-2 h-2 bg-[var(--color-blue-lightest)]0 rounded-full"></div>
                                                    )}
                                                </div>
                                                <div className="p-2 rounded-full hover:bg-[var(--color-bg-gradient-start)] transition-all duration-200">
                                                    {isExpanded ? (
                                                        <ChevronUp className="w-5 h-5 text-[var(--color-blue-dark)] transition-transform duration-200" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-[var(--color-blue-dark)] transition-transform duration-200" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                            <div className="p-6 space-y-6 bg-[var(--color-bg-primary)] border-t border-[var(--color-border-primary)]">
                                                {Object.entries(config.subsections).map(([subsectionKey, subsection]) => {
                                                    const subsectionPerms = permissions[sectionKey]?.[subsectionKey] || {};

                                                    return (
                                                        <div key={subsectionKey} className="border border-blue-100 rounded-lg p-4 bg-[var(--color-bg-secondary)]">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h5 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                                    <Settings className="w-4 h-4 text-[var(--color-blue-dark)]" />
                                                                    {subsection.title}
                                                                </h5>
                                                                <button
                                                                    onClick={() => handlePermissionChange(sectionKey, subsectionKey, 'selectAll')}
                                                                    className="text-xs text-[var(--color-blue-dark)] hover:text-[var(--color-blue-darkest)] font-medium transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-[var(--color-blue-lightest)] border border-[var(--color-blue-light)]"
                                                                >
                                                                    {subsectionPerms.selectAll ? 'Deselect all' : 'Select all'}
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {subsection.permissions.map(permission => (
                                                                    <label
                                                                        key={permission.key}
                                                                        className="flex items-center space-x-3 cursor-pointer group p-3 rounded-lg hover:bg-[var(--color-blue-lightest)] transition-colors duration-150 border border-transparent hover:border-[var(--color-blue-light)]"
                                                                    >
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={subsectionPerms[permission.key] || false}
                                                                            onChange={() => handlePermissionChange(sectionKey, subsectionKey, permission.key)}
                                                                            className="w-4 h-4 text-[var(--color-blue-dark)] border-2 border-[var(--color-border-secondary)] rounded focus:ring-[var(--color-blue)] focus:ring-2 transition-colors duration-150"
                                                                        />
                                                                        <span className="text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors duration-150 font-medium">
                                                                            {formatPermissionName(permission.title)}
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
                            })}
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end space-x-4 pt-8 border-t border-[var(--color-border-primary)]">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-secondary)] rounded-xl shadow-sm hover:bg-[var(--color-bg-primary)] hover:border-gray-400 focus:outline-none focus:ring-3 focus:ring-gray-500/20 transition-all duration-200"
                            >
                                <X className="w-4 h-4" />
                                Discard
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[var(--color-text-white)] bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] border border-transparent rounded-xl shadow-lg hover:from-[var(--color-blue-darker)] hover:to-[var(--color-blue-darkest)] focus:outline-none focus:ring-3 focus:ring-[var(--color-blue)] transition-all duration-200 transform hover:scale-105"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => closeToast()}
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmDialog
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, type: '', data: null })}
                type="info"
                onConfirm={confirmModal.type === 'save' ? confirmSave : confirmCancel}
                title={confirmModal.type === 'save' ? 'Save Changes' : 'Discard Changes'}
                message={
                    confirmModal.type === 'save'
                        ? `Are you sure you want to ${isEditMode ? 'update' : 'create'} this role?`
                        : 'Are you sure you want to discard all changes? This action cannot be undone.'
                }
                confirmText={confirmModal.type === 'save' ? 'Save' : 'Discard'}
                cancelText="Cancel"
            />
        </div>
    );
};

export default AddRole;