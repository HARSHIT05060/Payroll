import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    // Load users from localStorage on component mount
    useEffect(() => {
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
        }
    }, []);

    // Listen for storage changes to update users list
    useEffect(() => {
        const handleStorageChange = () => {
            const savedUsers = localStorage.getItem('users');
            if (savedUsers) {
                setUsers(JSON.parse(savedUsers));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        // Also listen for custom event for same-tab updates
        window.addEventListener('usersUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('usersUpdated', handleStorageChange);
        };
    }, []);

    const handleCreateUser = () => {
        navigate('/add-user');
    };

    const handleEditUser = (user) => {
        localStorage.setItem('editingUser', JSON.stringify(user));
        navigate('/add-user');
    };

    const handleDeleteUser = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            const updatedUsers = users.filter(user => user.id !== userId);
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('usersUpdated'));
        }
    };

    const getPermissionSummary = (permissions) => {
        if (!permissions || Object.keys(permissions).length === 0) {
            return 'No permissions assigned';
        }

        const sections = Object.keys(permissions);
        const totalPermissions = sections.reduce((total, section) => {
            return total + Object.values(permissions[section]).reduce((sectionTotal, perms) => {
                return sectionTotal + (Array.isArray(perms) ? perms.length : 0);
            }, 0);
        }, 0);

        return `${sections.length} section(s), ${totalPermissions} permission(s)`;
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                    <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
                </div>
                <button
                    onClick={handleCreateUser}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create User</span>
                </button>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">All Users</h3>
                </div>

                {users.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <p className="text-gray-500 text-lg">No users found</p>
                        <p className="text-gray-400 text-sm mt-2">Create your first user to get started</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Permissions
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.roleName}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{getPermissionSummary(user.permissions)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString('en-GB')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
    );
};

export default UserManagement;