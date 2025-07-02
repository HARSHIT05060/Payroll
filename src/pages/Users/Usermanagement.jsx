import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, RefreshCw, X, CheckCircle, AlertCircle, XCircle, User, Shield } from 'lucide-react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { Toast } from '../../Components/ui/Toast';
import { ConfirmationModal } from '../../Components/ui/ConfirmationModal';


const UserManagement = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: '', data: null });
    const permissions = useSelector(state => state.permissions);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    // Helper function to check if user is admin
    const isAdminUser = (userData) => {
        return userData.role_status === '1' || userData.role_status === 1 || userData.user_type === 'admin';
    };

    // Helper function to check if user can be modified
    const canModifyUser = (userData) => {
        return !isAdminUser(userData);
    };

    // fetch users from the API

    const fetchUsers = async () => {
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

            const res = await api.post('/user_list', formData);

            if (res.data?.success) {
                const usersData = res.data.data || [];
                setUsers(usersData);
            } else {
                const errorMsg = res.data?.message || 'Failed to fetch users';
                setError(errorMsg);
                showToast(errorMsg, 'error');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error fetching users';
            setError(errorMessage);
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.user_id) {
            fetchUsers();
        } else {
            setLoading(false);
            setError('User not authenticated');
        }
    }, [user?.user_id]);



    const handleEditUser = (userData) => {
        if (!canModifyUser(userData)) {
            showToast('Admin users cannot be modified', 'warning');
            return;
        }

        setConfirmModal({
            isOpen: true,
            type: 'edit',
            data: userData
        });
    };

    const confirmEditUser = () => {
        try {
            const userData = confirmModal.data;
            navigate(`/add-user?edit=${userData.edit_user_id}`);
            console.log(userData.edit_user_id)
            setConfirmModal({ isOpen: false, type: '', data: null });
        } catch (error) {
            showToast('Error preparing user for editing', error);
            setConfirmModal({ isOpen: false, type: '', data: null });
        }
    };

    const handleDeleteUser = (userData) => {
        if (!canModifyUser(userData)) {
            showToast('Admin users cannot be deleted', 'warning');
            return;
        }

        setConfirmModal({
            isOpen: true,
            type: 'delete',
            data: userData
        });
    };

    const confirmDeleteUser = async () => {
        const userData = confirmModal.data;
        setDeleting(userData.edit_user_id);
        setConfirmModal({ isOpen: false, type: '', data: null });

        try {
            const formData = new FormData();
            formData.append('user_id', String(user.user_id));
            formData.append('edit_user_id', String(userData.edit_user_id));

            const res = await api.post('/user_delete', formData);

            if (res.data?.success) {
                await fetchUsers();
                showToast('User deleted successfully', 'success');
            } else {
                showToast(res.data?.message || 'Failed to delete user', 'error');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Error deleting user', 'error');
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
                    <p className="text-red-600">Please log in to manage users.</p>
                </div>
            </div>
        );
    }
 
    return (
        <>
            <div className="min-h-screen bg-gray-50 p-6 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    </div>
                    <div className="flex space-x-2">

                        {permissions['user_create'] && <button
                            onClick={() => navigate('/add-user')}
                            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create User</span>
                        </button>}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-blue-600 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-blue-200 bg-blue-600">
                        <h3 className="text-lg font-medium text-white">All Users</h3>
                    </div>

                    {loading ? (
                        <div className="px-6 py-12 text-center">
                            <div className="inline-flex items-center space-x-2 text-gray-500">
                                <RefreshCw className="w-5 h-5 animate-spin" />
                                <span>Loading users...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <p className="text-red-700 text-lg font-medium mb-2">Error Loading Users</p>
                                <p className="text-red-600 mb-4">{error}</p>
                            </div>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Plus className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-700 text-lg font-medium mb-2">No Users Found</p>
                                <p className="text-gray-500 text-sm mb-4">
                                    You haven't created any users yet. Create your first user to get started with user management.
                                </p>
                                <button
                                    onClick={() => navigate('/add-user')}
                                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Create First User</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-blue-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Full Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone Number
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        {permissions['user_edit', 'user_delete'] &&
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        }
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(userData => (
                                        <tr key={userData.edit_user_id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <div className="flex items-center space-x-2">
                                                    {isAdminUser(userData) ? (
                                                        <Shield className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <User className="w-4 h-4 text-gray-500" />
                                                    )}
                                                    <span>{userData.full_name || 'Unnamed User'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {userData.email || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {userData.number || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${isAdminUser(userData)
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {isAdminUser(userData) ? (
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {permissions['user_edit'] &&
                                                        <button
                                                            onClick={() => handleEditUser(userData)}
                                                            className={`p-2 rounded-md transition-colors ${canModifyUser(userData)
                                                                ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-50'
                                                                : 'text-gray-400 cursor-not-allowed'
                                                                }`}
                                                            title={canModifyUser(userData) ? "Edit User" : "Admin users cannot be edited"}
                                                            disabled={deleting === userData.edit_user_id || !canModifyUser(userData)}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    }
                                                    {permissions['user_delete'] &&
                                                        <button
                                                            onClick={() => handleDeleteUser(userData)}
                                                            className={`p-2 rounded-md transition-colors ${canModifyUser(userData)
                                                                ? 'text-red-600 hover:text-red-900 hover:bg-red-50'
                                                                : 'text-gray-400 cursor-not-allowed'
                                                                }`}
                                                            title={canModifyUser(userData) ? "Delete User" : "Admin users cannot be deleted"}
                                                            disabled={deleting === userData.edit_user_id || !canModifyUser(userData)}
                                                        >
                                                            {deleting === userData.edit_user_id ? (
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

            {/* Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={closeToast}
                />
            )}

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen && confirmModal.type === 'delete'}
                onClose={closeModal}
                onConfirm={confirmDeleteUser}
                title="Delete User"
                message={`Are you sure you want to delete "${confirmModal.data?.full_name || 'this user'}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={confirmModal.isOpen && confirmModal.type === 'edit'}
                onClose={closeModal}
                onConfirm={confirmEditUser}
                title="Edit User"
                message={`Do you want to edit the user "${confirmModal.data?.full_name || 'this user'}"?`}
                confirmText="Edit"
                cancelText="Cancel"
                type="warning"
            />
        </>
    );
};

export default UserManagement;