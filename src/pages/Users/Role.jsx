import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, RefreshCw, X, CheckCircle, AlertCircle, XCircle, Shield, User } from 'lucide-react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { Toast } from '../../Components/ui/Toast';
import { ConfirmationModal } from '../../Components/ui/ConfirmationModal';

const Role = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });
    const permissions = useSelector(state => state.permissions);

    const showToast = (message, type) => {

        setToast({ message, type });
    };



    // Helper function to check if role is admin
    const isAdminRole = (role) => {
        return role.status === '1' || role.status === 1;
    };

    // Helper function to check if role can be modified
    const canModifyRole = (role) => {
        return !isAdminRole(role);
    };

    // Get roles from API

    const fetchRoles = async () => {
        if (!user?.user_id) {
            setError('User not authenticated');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('user_id', String(user.user_id));

            const res = await api.post('/user_roles_list', formData);

            if (res.data?.success) {
                const rolesData = res.data.data || [];
                setRoles(rolesData);
            } else {
                const errorMsg = res.data?.message || 'Failed to fetch roles';
                setError(errorMsg);
                setToast(errorMsg, 'error');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error fetching roles';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.user_id) {
            fetchRoles();
        } else {
            setLoading(false);
            setError('User not authenticated');
        }
    }, [user?.user_id]);

    const handleCreateRole = () => {

        navigate('/add-role');

    };

    const handleEditRole = (role) => {
        if (!canModifyRole(role)) {
            showToast('Admin roles cannot be modified', 'warning');
            return;
        }

        setConfirmModal({
            isOpen: true,
            type: 'edit',
            data: role
        });
    };

    // Edit role 

    const confirmEditRole = () => {

        navigate('/add-role', {
            state: {
                roleId: roles.user_roles_id,
                roleName: roles.name
            }
        });
        setConfirmModal({ isOpen: false, type: '', data: null });

    };

    // Delete role handler
    const handleDeleteRole = (role) => {
        if (!canModifyRole(role)) {
            showToast('Admin roles cannot be deleted', 'warning');
            return;
        }

        setConfirmModal({
            isOpen: true,
            type: 'delete',
            data: role
        });
    };

    const confirmDeleteRole = async () => {
        const role = confirmModal.data;
        setDeleting(role.user_roles_id);
        setConfirmModal({ isOpen: false, type: '', data: null });

        try {
            const formData = new FormData();
            formData.append('user_id', String(user.user_id));
            formData.append('user_roles_id', String(role.user_roles_id));

            const res = await api.post('/user_roles_delete', formData);

            if (res.data?.success) {
                await fetchRoles();
                showToast('Role deleted successfully', 'success');
            } else {
                showToast(res.data?.message || 'Failed to delete role', 'error');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Error deleting role', 'error');
        } finally {
            setDeleting(null);
        }
    };



    const closeModal = () => {
        setConfirmModal({ isOpen: false, type: '', data: null });
    };

    // Show authentication error
    if (!user?.user_id && !loading) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Required</h2>
                    <p className="text-red-600">Please log in to manage roles.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="p-6 max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Role Management</h2>
                            {/* <p className="text-gray-600 mt-1">Manage user roles and assign permissions</p> */}
                        </div>
                        <div className="flex space-x-2">

                            {permissions['user_roles_create'] &&
                                <button
                                    onClick={handleCreateRole}
                                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create Role</span>
                                </button>
                            }
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-blue-600 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-blue-200 bg-blue-600">
                            <h3 className="text-lg font-medium text-white">All Roles</h3>
                        </div>

                        {loading ? (
                            <div className="px-6 py-12 text-center">
                                <div className="inline-flex items-center space-x-2 text-gray-500">
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    <span>Loading roles...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="px-6 py-12 text-center">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                    <p className="text-red-700 text-lg font-medium mb-2">Error Loading Roles</p>
                                    <p className="text-red-600 mb-4">{error}</p>
                                    <button
                                        onClick={handleRefresh}
                                        className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        <span>Try Again</span>
                                    </button>
                                </div>
                            </div>
                        ) : roles.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Plus className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <p className="text-gray-700 text-lg font-medium mb-2">No Roles Found</p>
                                    <p className="text-gray-500 text-sm mb-4">
                                        You haven't created any roles yet. Create your first role to get started with role management.
                                    </p>
                                    <button
                                        onClick={handleCreateRole}
                                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Create First Role</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-blue-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created Date
                                            </th>
                                            {permissions['user_roles_edit', 'user_roles_delete'] &&
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {roles.map(role => (
                                            <tr key={role.user_roles_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <div className="flex items-center space-x-2">
                                                        {isAdminRole(role) ? (
                                                            <Shield className="w-4 h-4 text-blue-600" />
                                                        ) : (
                                                            <User className="w-4 h-4 text-gray-500" />
                                                        )}
                                                        <span>{role.name || 'Unnamed Role'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${isAdminRole(role)
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {isAdminRole(role) ? (
                                                            <>
                                                                <Shield className="w-3 h-3 mr-1" />
                                                                Admin
                                                            </>
                                                        ) : (
                                                            <>
                                                                <User className="w-3 h-3 mr-1" />
                                                                User
                                                            </>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {role.created_date ? new Date(role.created_date).toLocaleDateString('en-GB') : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {permissions['user_roles_edit'] &&
                                                            <button
                                                                onClick={() => handleEditRole(role)}
                                                                className={`p-2 rounded-md transition-colors ${canModifyRole(role)
                                                                    ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                                                                    : 'text-gray-400 cursor-not-allowed'
                                                                    }`}
                                                                title={canModifyRole(role) ? "Edit Role" : "Admin roles cannot be edited"}
                                                                disabled={deleting === role.user_roles_id || !canModifyRole(role)}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                        }
                                                        {permissions['user_roles_delete'] &&
                                                            <button
                                                                onClick={() => handleDeleteRole(role)}
                                                                className={`p-2 rounded-md transition-colors ${canModifyRole(role)
                                                                    ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                                                    : 'text-gray-400 cursor-not-allowed'
                                                                    }`}
                                                                title={canModifyRole(role) ? "Delete Role" : "Admin roles cannot be deleted"}
                                                                disabled={deleting === role.user_roles_id || !canModifyRole(role)}
                                                            >
                                                                {deleting === role.user_roles_id ? (
                                                                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <Trash2 className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => { setToast(null) }}
                />
            )}

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen && confirmModal.type === 'delete'}
                onClose={closeModal}
                onConfirm={confirmDeleteRole}
                title="Delete Role"
                message={`Are you sure you want to delete "${confirmModal.data?.name || 'this role'}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen && confirmModal.type === 'edit'}
                onClose={closeModal}
                onConfirm={confirmEditRole}
                title="Edit Role"
                message={`Do you want to edit the role "${confirmModal.data?.name || 'this role'}"?`}
                confirmText="Edit"
                cancelText="Cancel"
                type="warning"
            />
        </>
    );
};

export default Role;