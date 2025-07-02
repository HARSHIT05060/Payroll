import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, UserPlus, RefreshCw, Save, User, Phone, Mail, Lock, Shield, ChevronDown, AlertCircle, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../../Components/ui/Toast';
import { useRef } from 'react';

const AddUser = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const searchParams = new URLSearchParams(location.search);
    const editUserId = searchParams.get('edit');

    // Check if we're editing (passed via navigation state)
    const isEditing = !!editUserId;

    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        number: '',
        email: '',
        password: '',
        user_roles_id: ''
    });

    // Component state
    const [roles, setRoles] = useState([]);
    const [rolesLoading, setRolesLoading] = useState(true);
    const [userDataLoading, setUserDataLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const submitInProgressRef = useRef(false);

    const showToast = (message, type) => {
        setToast({ message, type });
    };

    const closeToast = () => {
        setToast(null);
    };

    // Fetch user roles dropdown
    const fetchRoles = async () => {
        if (!user?.user_id) {
            setRolesLoading(false);
            return;
        }

        try {
            setRolesLoading(true);
            const formData = new FormData();
            formData.append('user_id', String(user.user_id));

            const res = await api.post('/user_roles_drop_down', formData);

            if (res.data?.success) {
                const rolesData = res.data.data || [];
                setRoles(rolesData);
            } else {
                showToast(res.data?.message || 'Failed to fetch roles', 'error');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Error fetching roles', 'error');
        } finally {
            setRolesLoading(false);
        }
    };

    // Fetch user data for editing
    const fetchUserData = async (userId) => {
        if (!userId || !user?.user_id) {
            return;
        }

        try {
            setUserDataLoading(true);

            const requestFormData = new FormData();
            requestFormData.append('user_id', String(user.user_id));
            requestFormData.append('edit_user_id', String(userId));

            console.log('Fetching user data for userId:', userId);

            let res;
            try {
                res = await api.post('/user_list', requestFormData);
            } catch (err) {
                console.log(err);
                throw new Error('Unable to fetch user details from any endpoint');
            }

            console.log('User data response:', res.data);

            if (res.data?.success && Array.isArray(res.data.data)) {
                // Find the user that matches the edit_user_id
                const userData = res.data.data.find(
                    (u) => String(u.edit_user_id) === String(userId)
                );

                if (!userData) {
                    showToast('User not found in response data', 'error');
                    return;
                }

                console.log('Setting form data:', userData);

                setFormData({
                    full_name: userData.full_name || userData.name || '',
                    number: userData.number || userData.phone || userData.mobile || '',
                    email: userData.email || '',
                    password: '', // Don't populate password for security
                    // Fixed: Use user_role_id from API response instead of user_roles_id
                    user_roles_id: String(userData.user_role_id || userData.user_roles_id || '')
                });
            } else {
                showToast(res.data?.message || 'Failed to fetch user data', 'error');
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            showToast(err.response?.data?.message || err.message || 'Error fetching user data', 'error');
        } finally {
            setUserDataLoading(false);
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        if (user?.user_id) {
            fetchRoles();
        }
    }, [user?.user_id]);

    // Fetch user data when roles are loaded (to ensure role dropdown is populated)
    useEffect(() => {
        if (user?.user_id && isEditing && editUserId && !rolesLoading) {
            fetchUserData(editUserId);
        }
    }, [user?.user_id, isEditing, editUserId, rolesLoading]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form
    const validateForm = (e) => {
        e.preventDefault(); // ✅ prevents default form submission
        // ✅ PREVENT double click before validation completes
        if (submitInProgressRef.current) return;
        const newErrors = {};
        if (!user?.user_id) {
            newErrors.user_id = ('User not authenticated');
        }

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Full name is required';
        }

        if (!formData.number.trim()) {
            newErrors.number = 'Phone number is required';

        } else if (!/^\d{10}$/.test(formData.number.trim())) {
            newErrors.number = 'Phone number must be 10 digits';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }

        const trimmedPassword = formData.password.trim();
        if (!isEditing && !trimmedPassword) {
            newErrors.password = 'Password is required';
        } else if (trimmedPassword && trimmedPassword.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!formData.user_roles_id) {
            newErrors.user_roles_id = 'Please select a role';
        }
        console.log('Form is valid, submitting...');
        setErrors(newErrors);
        console.log(errors, 'Form is valid, submitting...');

        if (Object.keys(newErrors).length === 0) {
            handleSubmit(); // Let handleSubmit decide when to set the flag
        }


    };

    // Handle form submission
    const handleSubmit = async () => {
        // ✅ Prevent duplicate call here (only here!)
        if (submitInProgressRef.current) return;

        submitInProgressRef.current = true; // mark start of submit
        setLoading(true);

        try {
            setLoading(true);

            const submitFormData = new FormData();
            submitFormData.append('user_id', String(user.user_id));
            submitFormData.append('user_roles_id', String(formData.user_roles_id));
            submitFormData.append('full_name', formData.full_name.trim());
            submitFormData.append('number', formData.number.trim());
            submitFormData.append('email', formData.email.trim());

            if (formData.password.trim()) {
                submitFormData.append('password', formData.password);
            }

            if (isEditing) {
                submitFormData.append('edit_user_id', String(editUserId));
            }

            const res = await api.post('/user_create', submitFormData);

            if (res.data?.success) {
                showToast(
                    isEditing ? 'User updated successfully' : 'User created successfully',
                    'success'
                );

                // Navigate back after a short delay
                setTimeout(() => {
                    navigate('/usermanage');
                }, 1500);

            } else {
                showToast(res.data?.message || 'Failed to save user', 'error');
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Error saving user', 'error');
        } finally {
            // ✅ Mark as done
            setTimeout(() => {
                submitInProgressRef.current = false;
                setLoading(false);
            }, 1500);

        }
    };

    // Handle cancel/back
    const handleCancel = () => {
        navigate('/usermanage');
    };

    // Show authentication error
    if (!user?.user_id) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Required</h2>
                    <p className="text-red-600">Please log in to manage users.</p>
                </div>
            </div>
        );
    }

    const isFormDisabled = loading || rolesLoading || userDataLoading;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="max-w-5xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={handleCancel}
                                        disabled={isFormDisabled}
                                        className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm"
                                    >
                                        <ArrowLeft size={18} />
                                        Back
                                    </button>
                                    <div className="flex items-center gap-3">
                                        {isEditing ? <Edit size={24} className="text-white" /> : <UserPlus size={24} className="text-white" />}
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">
                                                {isEditing ? 'Edit User' : 'Create New User'}
                                            </h2>
                                            {userDataLoading && (
                                                <p className="text-blue-100 text-sm mt-1 flex items-center">
                                                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                                    Loading user data...
                                                </p>
                                            )}
                                            {!userDataLoading && (
                                                <p className="text-blue-100 text-sm mt-1">
                                                    {isEditing ? 'Update user details below' : 'Fill in the user details below'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-blue-200 shadow-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700">
                            <div className="flex items-center gap-3">
                                <UserPlus className="w-5 h-5 text-white" />
                                <h3 className="text-lg font-semibold text-white">User Information</h3>
                            </div>
                        </div>

                        <form onSubmit={validateForm} className="p-8 space-y-8">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label htmlFor="full_name" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-12 border rounded-xl shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.full_name ? 'border-red-300 bg-red-50/30' : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                        placeholder="Enter your full name"
                                        disabled={isFormDisabled}
                                    />
                                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {errors.full_name && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.full_name}
                                    </p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label htmlFor="number" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        id="number"
                                        name="number"
                                        value={formData.number}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-12 border rounded-xl shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.number ? 'border-red-300 bg-red-50/30' : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                        placeholder="Enter 10-digit phone number"
                                        disabled={isFormDisabled}
                                    />
                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {errors.number && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.number}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-12 border rounded-xl shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.email ? 'border-red-300 bg-red-50/30' : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                        placeholder="Enter your email address"
                                        disabled={isFormDisabled}
                                    />
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <Lock className="w-4 h-4 text-blue-600" />
                                    Password {!isEditing && <span className="text-red-500">*</span>}
                                    {isEditing && <span className="text-gray-500 text-xs ml-2 bg-gray-100 px-2 py-1 rounded-full">(Leave blank to keep current password)</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-12 border rounded-xl shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${errors.password ? 'border-red-300 bg-red-50/30' : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                        placeholder={isEditing ? "Enter new password (optional)" : "Enter your password"}
                                        disabled={isFormDisabled}
                                    />
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-2">
                                <label htmlFor="user_roles_id" className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    User Role <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="user_roles_id"
                                        name="user_roles_id"
                                        value={formData.user_roles_id}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 pl-12 border rounded-xl shadow-sm focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 appearance-none bg-white ${errors.user_roles_id ? 'border-red-300 bg-red-50/30' : 'border-gray-300 hover:border-blue-400'
                                            }`}
                                        disabled={isFormDisabled}
                                    >
                                        <option value="">
                                            {rolesLoading ? 'Loading roles...' : 'Select a role'}
                                        </option>
                                        {roles.map(role => (
                                            <option key={role.user_roles_id} value={role.user_roles_id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                                {errors.user_roles_id && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {errors.user_roles_id}
                                    </p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl shadow-sm hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-3 focus:ring-gray-500/20 transition-all duration-200"
                                    disabled={isFormDisabled}
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 border border-transparent rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-3 focus:ring-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                    disabled={isFormDisabled}
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            {isEditing ? 'Updating User...' : 'Creating User...'}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            {isEditing ? 'Update User' : 'Create User'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
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
        </>
    );
};

export default AddUser;