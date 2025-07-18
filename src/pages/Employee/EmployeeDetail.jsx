
import { useState, useEffect } from 'react';
import {
    User,
    Pencil,
    Trash2,
    Briefcase,
    Mail,
    Phone,
    CreditCard,
    Tag,
    Clock,
    Activity,
    FileText,
    Shield,
    Fingerprint,
    ArrowLeft,
    Loader2,
    AlertCircle,
    MapPin,
    Calendar,
    Building,
    Eye,
    X,
    CheckCircle,
    XCircle,
    Info,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useSelector } from 'react-redux';


const EmployeeDetail = () => {
    const [employee, setEmployee] = useState(null);
    const [baseUrl, setBaseUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);
    const [toast, setToast] = useState(null);
    const navigate = useNavigate();
    const { employee_id } = useParams();
    const { user } = useAuth();
    const permissions = useSelector(state => state.permissions) || {};

    const [expandedSections, setExpandedSections] = useState({
        basic: true,
        employment: false,
        salary: false,
        bank: false,
        legal: false,
        emergency: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };


    // Show toast notification
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    // Get user ID from localStorage or session
    const getUserId = () => {
        return user?.user_id || user?.id;
    };
    // Fetch employee data
    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!employee_id) {
                setError('Employee ID is required');
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const formData = new FormData();
                formData.append('employee_id', employee_id);

                const response = await api.post('/employee_edit_data_fetch', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                });

                if (response.data.error) {
                    throw new Error(response.data.error);
                }

                const { data } = response.data;

                if (data?.employee) {
                    setBaseUrl(data.base_url);
                    setEmployee(data.employee);
                } else {
                    setError('Employee not found');
                }

            } catch (err) {
                console.error("Error fetching employee data:", err);
                let errorMessage = 'Failed to load employee data';

                if (err.response?.status === 404) {
                    errorMessage = 'Employee not found';
                } else if (err.response?.status === 401) {
                    errorMessage = 'Unauthorized access';
                } else if (err.response?.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.message) {
                    errorMessage = err.message;
                }

                setError(errorMessage);
                showToast(errorMessage, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [employee_id]);

    // Handle edit
    const handleEditClick = () => {
        navigate(`/add-employee?edit=${employee_id}`);
    };

    // Handle delete
    const handleDeleteClick = async () => {
        const userId = getUserId();

        if (!userId) {
            showToast('User not authenticated. Please login again.', 'error');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('employee_id', employee_id);
            formData.append('user_id', userId);

            const response = await api.post('/employee_delete', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.error || !response.data.success) {
                throw new Error(response.data.message || response.data.error || 'Failed to delete employee');
            }

            showToast('Employee deleted successfully', 'success');
            setShowDeleteModal(false);
            setTimeout(() => navigate('/employee'), 1500);

        } catch (err) {
            console.error("Error deleting employee:", err);
            let errorMessage = 'Failed to delete employee';

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle image preview
    const handleImagePreview = (imageSrc, title) => {
        setCurrentImage({ src: imageSrc, title });
        setShowImageModal(true);
    };



    // Get field value safely
    const getField = (fieldName, fallback = 'N/A') => {
        return employee?.[fieldName] || fallback;
    };

    // Get department name
    const getDepartmentName = () => {
        return getField('department_name') || getField('department') || `Department ID: ${getField('department_id')}`;
    };

    // Get designation name
    const getDesignationName = () => {
        return getField('designation_name') || getField('designation') || `Designation ID: ${getField('designation_id')}`;
    };

    // Get branch name
    const getBranchName = () => {
        return getField('branch_name') || getField('branch') || `Branch ID: ${getField('branch_id')}`;
    };

    // Get employee type name
    const getEmployeeTypeName = () => {
        return getField('employee_type_name') || getField('employee_type') || `Type ID: ${getField('employee_type_id')}`;
    };

    // Get salary type name
    const getSalaryTypeName = () => {
        const salaryTypeId = getField('salary_type_id');
        if (salaryTypeId === '1') return 'Monthly';
        if (salaryTypeId === '2') return 'Daily';
        if (salaryTypeId === '3') return 'Hourly';
        return getField('salary_type_name') || getField('salary_type') || `Type ID: ${salaryTypeId}`;
    };

    // Get gender name
    const getGenderName = () => {
        const genderId = getField('gender_id');
        if (genderId === '1') return 'Male';
        if (genderId === '2') return 'Female';
        if (genderId === '3') return 'Other';
        return getField('gender_name') || getField('gender') || 'Not specified';
    };

    // Get emergency relation name
    const getEmergencyRelationName = () => {
        const relationId = getField('emergency_relation_id');
        const relationMap = {
            '1': 'Father',
            '2': 'Mother',
            '3': 'Spouse',
            '4': 'Sibling',
            '5': 'Friend',
            '6': 'Other'
        };
        return relationMap[relationId] || getField('emergency_relation_name') || getField('emergency_relation') || 'Not specified';
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-primary)] flex justify-center items-center">
                <div className="text-center">
                    <Loader2 size={40} className="animate-spin text-[var(--color-blue-dark)] mx-auto mb-4" />
                    <p className="text-[var(--color-text-secondary)]">Loading employee details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-primary)] flex justify-center items-center">
                <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
                    <AlertCircle size={48} className="text-[var(--color-text-error)] mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">Error</h2>
                    <p className="text-center text-[var(--color-text-secondary)] mb-6">{error}</p>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 px-4 py-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-blue-darker)] transition-colors"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => navigate('/employee')}
                            className="flex-1 px-4 py-2 bg-gray-600 text-[var(--color-text-white)] rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-primary)] flex justify-center items-center">
                <div className="text-center">
                    <Info size={48} className="text-[var(--color-text-muted)] mx-auto mb-4" />
                    <p className="text-[var(--color-text-secondary)]">No employee data found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${toast.type === 'success' ? 'bg-[var(--color-success-medium)] text-[var(--color-text-white)]' :
                    toast.type === 'error' ? 'bg-[var(--color-error)] text-[var(--color-text-white)]' :
                        'bg-[var(--color-blue-dark)] text-[var(--color-text-white)]'
                    }`}>
                    <div className="flex items-center">
                        {toast.type === 'success' && <CheckCircle size={20} className="mr-2" />}
                        {toast.type === 'error' && <XCircle size={20} className="mr-2" />}
                        {toast.type === 'info' && <Info size={20} className="mr-2" />}
                        <span className="text-sm">{toast.message}</span>
                        <button
                            onClick={() => setToast(null)}
                            className="ml-2 hover:opacity-80"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto p-6 px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-[var(--color-text-white)]">
                                        Employee Information
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Column - Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm overflow-hidden">
                            {/* Profile Header */}
                            <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6 relative">
                                <div className="text-center">
                                    <div
                                        className={`relative h-40 w-40 mx-auto mb-4 rounded-full border-4 flex items-center justify-center ${employee?.status == "1" ? "border-[var(--color-success)]" : "border-[var(--color-error)]"}`}
                                    >
                                        {employee?.passport_img ? (
                                            <img
                                                src={baseUrl + employee?.passport_img}
                                                alt={getField('full_name') + " photo"}
                                                className="h-full w-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <span className="h-full w-full flex items-center justify-center text-[var(--color-blue-dark)] text-5xl font-bold select-none">
                                                {getField('full_name').split(' ').map(name => name[0]).join('').toUpperCase() || 'N/A'}
                                            </span>
                                        )}
                                        {/* Status Dot */}
                                        <span className={`absolute bottom-1 right-5 h-4 w-4 rounded-full border-2 ${employee?.status == "1" ? "bg-[var(--color-success)] border-[var(--color-bg-secondary)]" : "bg-[var(--color-error)] border-[var(--color-bg-secondary)]"}`}></span>
                                    </div>

                                    <h2 className="text-xl font-bold text-[var(--color-text-white)] mb-1">
                                        {getField('full_name')}
                                    </h2>
                                    <p className="text-[var(--color-text-white)] text-sm">
                                        Employee ID: {getField('employee_code')}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="p-6 space-y-4">
                                <div className="flex items-center">
                                    <Mail size={16} className="text-[var(--color-text-muted)] mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                                            {getField('email')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Phone size={16} className="text-[var(--color-text-muted)] mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                            {getField('mobile_number')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Calendar size={16} className="text-[var(--color-text-muted)] mr-3" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                                            {formatDate(getField('dob'))}
                                        </p>
                                    </div>
                                </div>
                                {/* Action Buttons */}
                                <div className="flex flex-row  justify-around gap-4 my-10">
                                    {permissions['employee_edit'] &&
                                        <button
                                            onClick={handleEditClick}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-blue-darker)] transition-colors font-medium"
                                        >
                                            <Pencil size={18} className="mr-2" />
                                            Edit
                                        </button>
                                    }
                                    {permissions['employee_delete'] &&
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            className="w-full flex items-center justify-center px-4 py-2 bg-[var(--color-error)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-error-dark)] transition-colors font-medium"
                                        >
                                            <Trash2 size={18} className="mr-2" />
                                            Delete
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details Sections */}
                    <div className="lg:col-span-3 space-y-8">

                        {/* Employment Information */}
                        <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] overflow-hidden">
                            <button
                                type="button"
                                onClick={() => toggleSection('employment')}
                                className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-bg-primary)] transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <User size={20} className="text-blue-600" />
                                    </div>
                                    <span className="font-semibold text-[var(--color-text-primary)] text-lg">Employment Information</span>
                                </div>
                                <div className={`p-1 rounded-full ${expandedSections.employment ? 'bg-[var(--color-blue-lighter)]' : 'bg-[var(--color-bg-gradient-start)]'}`}>
                                    {expandedSections.employment ?
                                        <ChevronUp size={20} className="text-[var(--color-blue-dark)]" /> :
                                        <ChevronDown size={20} className="text-[var(--color-text-secondary)]" />
                                    }
                                </div>
                            </button>
                            {expandedSections.employment && (
                                <div className="border-t border-[var(--color-border-primary)] p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Gender</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getGenderName()}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Department</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getDepartmentName()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Designation</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getDesignationName()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Branch</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getBranchName()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Date of Joining</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{formatDate(getField('date_of_joining'))}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Employee Type</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getEmployeeTypeName()}</p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Address</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getField('address')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Salary Information */}
                        <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] overflow-hidden">
                            <button
                                type="button"
                                onClick={() => toggleSection('salary')}
                                className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-bg-primary)] transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <CreditCard size={20} className="text-blue-600" />
                                    </div>
                                    <span className="font-semibold text-[var(--color-text-primary)] text-lg">Salary Information</span>
                                </div>
                                <div className={`p-1 rounded-full ${expandedSections.salary ? 'bg-[var(--color-blue-lighter)]' : 'bg-[var(--color-bg-gradient-start)]'}`}>
                                    {expandedSections.salary ?
                                        <ChevronUp size={20} className="text-[var(--color-blue-dark)]" /> :
                                        <ChevronDown size={20} className="text-[var(--color-text-secondary)]" />
                                    }
                                </div>
                            </button>
                            {expandedSections.salary && (
                                <div className="border-t border-[var(--color-border-primary)] p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Salary</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">₹{parseInt(getField('salary', '0')).toLocaleString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Salary Type</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getSalaryTypeName()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Bank Name</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getField('bank_name')}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Branch</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getField('bank_branch')}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Account Number</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getField('bank_account_number')}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">IFSC Code</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getField('bank_ifsc_code')}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Legal Documents */}
                        <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] overflow-hidden">
                            <button
                                type="button"
                                onClick={() => toggleSection('legal')}
                                className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-bg-primary)] transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <FileText size={20} className="text-blue-600" />
                                    </div>
                                    <span className="font-semibold text-[var(--color-text-primary)] text-lg">Documents</span>
                                </div>
                                <div className={`p-1 rounded-full ${expandedSections.legal ? 'bg-[var(--color-blue-lighter)]' : 'bg-[var(--color-bg-gradient-start)]'}`}>
                                    {expandedSections.legal ?
                                        <ChevronUp size={20} className="text-[var(--color-blue-dark)]" /> :
                                        <ChevronDown size={20} className="text-[var(--color-text-secondary)]" />
                                    }
                                </div>
                            </button>
                            {expandedSections.legal && (
                                <div className="border-t border-[var(--color-border-primary)] p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[{ key: 'aadharcard_img', label: 'Aadhar Card' }, { key: 'pan_img', label: 'PAN Card' }, { key: 'dl_img', label: 'Driving License' }, { key: 'passport_img', label: 'Passport' }].map((doc) => (
                                            <div key={doc.key} className="border border-[var(--color-border-primary)] rounded-lg p-4">
                                                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">{doc.label}</label>
                                                {getField(doc.key) ? (
                                                    <button
                                                        onClick={() => handleImagePreview(getField(doc.key), doc.label)}
                                                        className="flex items-center px-3 py-2 bg-[var(--color-blue-lightest)] text-[var(--color-blue-dark)] rounded-lg hover:bg-[var(--color-blue-lighter)] transition-colors text-sm font-medium"
                                                    >
                                                        <Eye size={16} className="mr-2" />
                                                        View Document
                                                    </button>
                                                ) : (
                                                    <p className="text-[var(--color-text-secondary)] text-sm">Not uploaded</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Emergency Contact */}
                        <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] overflow-hidden">
                            <button
                                type="button"
                                onClick={() => toggleSection('emergency')}
                                className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-bg-primary)] transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <Phone size={20} className="text-blue-600" />
                                    </div>
                                    <span className="font-semibold text-[var(--color-text-primary)] text-lg">Contact</span>
                                </div>
                                <div className={`p-1 rounded-full ${expandedSections.emergency ? 'bg-[var(--color-blue-lighter)]' : 'bg-[var(--color-bg-gradient-start)]'}`}>
                                    {expandedSections.emergency ?
                                        <ChevronUp size={20} className="text-[var(--color-blue-dark)]" /> :
                                        <ChevronDown size={20} className="text-[var(--color-text-secondary)]" />
                                    }
                                </div>
                            </button>
                            {expandedSections.emergency && (
                                <div className="border-t border-[var(--color-border-primary)] p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Contact Name</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getField('emergency_contact_name') || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Contact Number</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getField('emergency_contact_number') || 'Not provided'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Relationship</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getEmergencyRelationName()}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Emergency Address</label>
                                            <p className="text-[var(--color-text-primary)] font-medium">{getField('emergency_address') || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-2xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="bg-[var(--color-error-light)] rounded-full p-3 mr-4">
                                    <Trash2 size={24} className="text-[var(--color-text-error)]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Delete Employee</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">This action cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-[var(--color-text-secondary)] mb-6">
                                Are you sure you want to delete <span className="font-semibold">{getField('full_name')}</span>?
                                All associated data will be permanently removed.
                            </p>
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 px-4 py-2 bg-[var(--color-bg-gray-light)] text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteClick}
                                    className="flex-1 px-4 py-2 bg-[var(--color-error)] text-[var(--color-text-white)] rounded-lg hover:bg-[var(--color-error-dark)] transition-colors font-medium flex items-center justify-center"
                                    disabled={loading}
                                >
                                    {loading && <Loader2 size={16} className="animate-spin mr-2" />}
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {showImageModal && currentImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
                    <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-primary)]">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{currentImage.title}</h3>
                            <button
                                onClick={() => setShowImageModal(false)}
                                className="p-2 hover:bg-[var(--color-bg-gradient-start)] rounded-lg transition-colors"
                            >
                                <X size={20} className="text-[var(--color-text-secondary)]" />
                            </button>
                        </div>
                        <div className="p-4 flex justify-center">
                            <img
                                src={currentImage.src}
                                alt={currentImage.title}
                                className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden flex-col items-center justify-center text-[var(--color-text-secondary)] p-8">
                                <AlertCircle size={48} className="mb-4" />
                                <p>Unable to load image</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeDetail;