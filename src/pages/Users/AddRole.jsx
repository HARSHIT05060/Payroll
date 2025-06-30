import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Save, ChevronDown, ChevronUp, ArrowLeft, X, Check, AlertTriangle } from 'lucide-react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../../Components/ui/Toast';
import { ConfirmationModal } from '../../Components/ui/ConfirmationModal';
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
    console.log(roleId)

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
                setPermissions(initializePermissions(config));
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

    // Fetch role permissions using user_role_id
    const fetchRolePermissions = async (roleId) => {
        try {
            const formData = new FormData();
            formData.append('user_roles_id', roleId);
            formData.append('user_id', user.user_id);

            const response = await api.post('permission_list', formData);

            if (response.data?.success && response.data.data) {
                const rolePermissionIds = [];

                response.data.data.forEach(section => {
                    section.permission_name_items.forEach(item => {
                        if (item.has_access === 1 || item.has_access === "1" || item.has_access === true) {
                            rolePermissionIds.push(parseInt(item.main_permission_items_id));
                        }
                    });
                });

                return rolePermissionIds;
            }

            throw new Error('Could not fetch role permissions');
        } catch (error) {
            showToast('Failed to load role permissions', error);
            return [];
        }
    };

    // Fetch role data for editing (basic info only)
    const fetchRoleData = async (roleId) => {
        try {
            if (roleDataFromState && roleDataFromState.user_roles_id == roleId) {
                return roleDataFromState;
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            const response = await api.post('user_roles_list', formData);

            if (response.data?.success && response.data.data) {
                const roleData = response.data.data.find(role =>
                    role.user_roles_id == roleId || role.user_roles_id === parseInt(roleId)
                );

                if (roleData) {
                    return roleData;
                } else {
                    throw new Error('Role not found in the list');
                }
            } else {
                throw new Error(response.data?.message || 'Failed to fetch role data');
            }
        } catch (err) {
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

    // Apply role permissions using permission_items_id array
    const applyRolePermissions = (rolePermissionIds, config) => {
        const userPermissions = initializePermissions(config);

        if (rolePermissionIds && rolePermissionIds.length > 0) {
            Object.entries(config).forEach(([sectionKey, section]) => {
                Object.entries(section.subsections).forEach(([subsectionKey, subsection]) => {
                    let sectionSelectedCount = 0;

                    subsection.permissions.forEach(permission => {
                        if (rolePermissionIds.includes(permission.id)) {
                            userPermissions[sectionKey][subsectionKey][permission.key] = true;
                            sectionSelectedCount++;
                        }
                    });

                    const totalPermissions = subsection.permissions.length;
                    userPermissions[sectionKey][subsectionKey].selectAll = sectionSelectedCount === totalPermissions;
                });
            });
        }

        return userPermissions;
    };

    // Load component data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                const config = await fetchPermissions();
                if (!config) return;

                if (isEditMode && currentRoleId) {
                    let roleData = roleDataFromState;
                    if (!roleData || roleData.user_roles_id != currentRoleId) {
                        roleData = await fetchRoleData(currentRoleId);
                    }

                    if (roleData) {
                        setName(roleData.name || '');
                        const rolePermissionIds = await fetchRolePermissions(currentRoleId);

                        if (rolePermissionIds.length > 0) {
                            const rolePermissions = applyRolePermissions(rolePermissionIds, config);
                            setPermissions(rolePermissions);
                        } else {
                            setPermissions(initializePermissions(config));
                        }
                    }
                } else {
                    setPermissions(initializePermissions(config));
                }
            } catch (error) {
                setError('Failed to load data');
                showToast('Failed to load data', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isEditMode, currentRoleId, roleDataFromState]);

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
                subsectionPerms[permission] = !isCurrentlySelected;

                // Auto-select view permission if selecting edit/delete/create
                if (!isCurrentlySelected) {
                    const viewPermission = findViewPermission(section, subsection);
                    if (viewPermission && !subsectionPerms[viewPermission.key]) {
                        subsectionPerms[viewPermission.key] = true;
                    }
                }

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
        submitInProgressRef.current = true; // mark start of submit

        try {
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

            const formData = new FormData();
            formData.append('name', name);
            formData.append('user_id', user.user_id);

            permissionItemsIds.forEach((id, index) => {
                formData.append(`permission_items_id[${index}]`, id);
            });

            if (isEditMode && currentRoleId) {
                formData.append('user_roles_id', currentRoleId);
            }

            const response = await api.post('user_roles_create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

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
            showToast(
                'Error saving role: ' + (err.response?.data?.message || err.message),
                'error'
            );
        }
        finally {
            // ✅ Mark as done
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
            <div className="max-w-4xl mx-auto bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto bg-white min-h-screen">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
                        <div className="text-gray-600 mb-4">{error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white min-h-screen">
            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, type: '', data: null })}
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
            <div className="flex items-center justify-between mb-6 mt-6">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleCancel}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isEditMode ? 'Edit Role' : 'Add New Role'}

                        </h2>

                    </div>
                </div>
            </div>


            <div className="p-6 bg-blue-50 min-h-screen rounded-lg">
                <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-lg font-semibold text-gray-900 mb-2">Role Name <span className='text-red-500'>*</span></label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Enter role name"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h2>

                    {Object.entries(permissionConfig).map(([sectionKey, config]) => {
                        const isExpanded = expandedSections[sectionKey];
                        const { activeCount, totalCount } = getActiveCheckboxCount(sectionKey);

                        return (
                            <div key={sectionKey} className="mb-6 bg-gray-50 rounded-lg overflow-hidden">
                                <div
                                    onClick={() => toggleSection(sectionKey)}
                                    className="flex items-center justify-between py-4 px-6 cursor-pointer hover:bg-gray-100 transition-colors duration-200 border-b border-gray-200"
                                >
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">{config.title}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{config.subtitle}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
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
                                        <div className="p-2 rounded-full hover:bg-gray-200 transition-all duration-200">
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5 text-blue-600 transition-transform duration-200" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-blue-600 transition-transform duration-200" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                    <div className="p-6 space-y-6 bg-white">
                                        {Object.entries(config.subsections).map(([subsectionKey, subsection]) => {
                                            const subsectionPerms = permissions[sectionKey]?.[subsectionKey] || {};

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
                                                                key={permission.key}
                                                                className="flex items-center space-x-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50 transition-colors duration-150"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={subsectionPerms[permission.key] || false}
                                                                    onChange={() => handlePermissionChange(sectionKey, subsectionKey, permission.key)}
                                                                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-colors duration-150"
                                                                />
                                                                <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-150">
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

                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSaveChanges}

                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRole;