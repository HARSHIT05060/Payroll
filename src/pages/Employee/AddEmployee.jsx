import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, ArrowLeft, User, Building, CreditCard, FileText, Phone, Calendar, Users, Edit, Lock, Eye } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { Toast } from '../../Components/ui/Toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSelector } from 'react-redux';

const AddEmployee = () => {
    const { employeeId } = useParams(); // Get employee ID from URL params
    const location = useLocation();
    const navigate = useNavigate();

    // Check for edit mode from both URL params and query params
    const queryParams = new URLSearchParams(location.search);
    const editEmployeeId = employeeId || queryParams.get('edit');
    const isEditMode = Boolean(editEmployeeId);
    const [toast, setToast] = useState(null);
    const permissions = useSelector(state => state.permissions) || {};

    // Updated state to include preview title
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [formData, setFormData] = useState({
        // Basic Details
        employeeCode: '',
        name: '',
        mobile: '',
        email: '',
        gender: '',
        branch: '',
        department: '',
        designation: '',
        employmentType: '',
        salaryType: '',
        salary: '',
        allowances: [
            {
                allowance_id: '',
                allowance_value: '',
                allowance_type: 2 // Add this field
            }
        ],
        deductions: [
            {
                deduction_id: '',
                deduction_value: '',
                deduction_type: 2 // Add this field
            }
        ],
        address: '',

        // Bank Details
        bankName: '',
        branchName: '',
        accountNo: '',
        ifscCode: '',

        // Legal Documents
        aadharCard: null,
        drivingLicence: null,
        panCard: null,
        photo: null,

        // Contact Information
        emergencyContactNo: '',
        contactPersonName: '',
        relation: '',
        emergencyAddress: '',

        // Personal Information
        dateOfBirth: null,
        dateOfJoining: null,

        // References
        references: [{ name: '', contactNumber: '' }],

        // credentials
        loginMobileNo: '',
        password: '',

    });
    const { user, isAuthenticated } = useAuth();

    const [expandedSections, setExpandedSections] = useState({
        basicDetails: true,
        salaryStructure: false,
        bankDetails: false,
        legalDocuments: false,
        contactInformation: false,
        personalInformation: false,
        reference: false
    });

    const [filePreviews, setFilePreviews] = useState({
        aadharCard: null,
        drivingLicence: null,
        panCard: null,
        photo: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);
    const [isLoadingEmployeeData, setIsLoadingEmployeeData] = useState(false);

    // Dropdown options from API
    const [dropdownOptions, setDropdownOptions] = useState({
        genderOptions: [],
        branchOptions: [],
        departmentOptions: [],
        designationOptions: [],
        employmentTypeOptions: [],
        salaryTypeOptions: [],
        relationOptions: [],
        allowanceOptions: [],
        deductionOptions: []
    });

    // Fetch dropdown data
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                // Check if user is authenticated and has user_id
                if (!isAuthenticated() || !user?.user_id) {
                    setMessage({
                        type: 'error',
                        text: 'User authentication required. Please login again.'
                    });
                    setIsLoadingDropdowns(false);
                    return;
                }

                setIsLoadingDropdowns(true);

                const formData = new FormData();
                formData.append('user_id', user.user_id);

                const response = await api.post('/employee_drop_down_list', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.data.success) {
                    const data = response.data.data;

                    const dropdownData = {
                        genderOptions: data.gender_list?.map(item => ({
                            value: item.gender_id,
                            label: item.name
                        })) || [],
                        branchOptions: data.branch_list?.map(item => ({
                            value: item.branch_id,
                            label: item.name
                        })) || [],
                        departmentOptions: data.department_list?.map(item => ({
                            value: item.department_id,
                            label: item.name
                        })) || [],
                        designationOptions: data.designation_list?.map(item => ({
                            value: item.designation_id,
                            label: item.name
                        })) || [],
                        employmentTypeOptions: data.employee_type_list?.map(item => ({
                            value: item.employee_type_id, // Fixed: was using salary_type_id
                            label: item.name
                        })) || [],
                        salaryTypeOptions: data.salary_type_list?.map(item => ({
                            value: item.salary_type_id,
                            label: item.name
                        })) || [],
                        relationOptions: data.relation_list?.map(item => ({
                            value: item.relation_id,
                            label: item.name
                        })) || [],
                        allowanceOptions: data.allowance_list?.map(item => ({
                            value: item.allowance_id,
                            label: item.name,
                            base_amount: item.base_amount || 0
                        })) || [],
                        deductionOptions: data.deduction_list?.map(item => ({
                            value: item.deduction_id,
                            label: item.name,
                            base_amount: item.base_amount || 0
                        })) || []
                    };

                    setDropdownOptions(dropdownData);
                } else {
                    setMessage({
                        type: 'error',
                        text: response.data.message || 'Failed to load dropdown options.'
                    });
                }
            } catch (error) {
                console.error('Error fetching dropdown data:', error);
                setMessage({
                    type: 'error',
                    text: 'Failed to load dropdown options. Please refresh the page.'
                });
            } finally {
                setIsLoadingDropdowns(false);
            }
        };

        fetchDropdownData();
    }, [user, isAuthenticated]);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!isEditMode || !editEmployeeId || !isAuthenticated() || !user?.user_id) return;

            setIsLoadingEmployeeData(true);

            try {
                const formDataToSend = new FormData();
                formDataToSend.append('user_id', user.user_id);
                formDataToSend.append('employee_id', editEmployeeId);

                const response = await api.post('/employee_edit_data_fetch', formDataToSend, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                const { data, success } = response.data;

                if (!success || !data || typeof data !== 'object' || !data.employee) {
                    setMessage({
                        type: 'error',
                        text: 'Failed to load employee data properly.'
                    });
                    return;
                }

                const employee = data.employee;
                const baseUrl = data.base_url || '';

                // Map allowances correctly from the API response
                const allowances = data.employee_allowance?.map(allowance => ({
                    allowance_id: allowance.allowance_id || '',
                    allowance_value: allowance.allowance_value || '',
                    allowance_type: parseInt(allowance.allowance_type) || 2
                })) || [];

                // Map deductions correctly from the API response
                const deductions = data.employee_deduction?.map(deduction => ({
                    deduction_id: deduction.deduction_id || '',
                    deduction_value: deduction.deduction_value || '',
                    deduction_type: parseInt(deduction.deduction_type) || 2
                })) || [];

                // Map references correctly from the API response
                const references = data.employee_reference?.map(ref => ({
                    name: ref.name || '',
                    contactNumber: ref.number || ''
                })) || [];

                const mappedFormData = {
                    employeeCode: employee.employee_code || '',
                    name: employee.full_name || '',
                    mobile: employee.mobile_number || '',
                    email: employee.email || '',
                    gender: employee.gender_id || '',
                    branch: employee.branch_id || '',
                    department: employee.department_id || '',
                    designation: employee.designation_id || '',
                    employmentType: employee.employee_type_id || '',
                    salaryType: employee.salary_type_id || '',
                    salary: employee.salary || '',

                    // Use mapped allowances or default empty array with one item
                    allowances: allowances.length > 0
                        ? allowances
                        : [{ allowance_id: '', allowance_value: '', allowance_type: 2 }],

                    // Use mapped deductions or default empty array with one item
                    deductions: deductions.length > 0
                        ? deductions
                        : [{ deduction_id: '', deduction_value: '', deduction_type: 2 }],

                    address: employee.address || '',

                    bankName: employee.bank_name || '',
                    branchName: employee.bank_branch || '',
                    accountNo: employee.bank_account_number || '',
                    ifscCode: employee.bank_ifsc_code || '',

                    emergencyContactNo: employee.emergency_contact_number || '',
                    contactPersonName: employee.emergency_contact_name || '',
                    relation: employee.emergency_relation || '',
                    emergencyAddress: employee.emergency_address || '',

                    dateOfBirth: employee.dob || '',
                    dateOfJoining: employee.date_of_joining || '',

                    // Use mapped references or default empty array with one item
                    references: references.length > 0
                        ? references
                        : [{ name: '', contactNumber: '' }],

                    aadharCard: null,
                    drivingLicence: null,
                    panCard: null,
                    photo: null,
                    loginMobileNo: employee.login_mobile_number || '',
                    password: employee.password || '',
                };

                setFormData(mappedFormData);

                const filePreviews = {
                    aadharCard: employee.aadharcard_img ? baseUrl + employee.aadharcard_img : null,
                    drivingLicence: employee.dl_img ? baseUrl + employee.dl_img : null,
                    panCard: employee.pan_img ? baseUrl + employee.pan_img : null,
                    photo: employee.passport_img ? baseUrl + employee.passport_img : null
                };

                setFilePreviews(filePreviews);

                setTimeout(() => {
                    setMessage({ type: '', text: '' });
                }, 3000);
            } catch (error) {
                setMessage({
                    type:   error,
                    text: 'Failed to fetch employee data. Please try again.'
                });
            } finally {
                setIsLoadingEmployeeData(false);
            }
        };

        if (!isLoadingDropdowns) {
            fetchEmployeeData();
        }
    }, [isEditMode, editEmployeeId, user, isAuthenticated, isLoadingDropdowns]);

    const validateName = (name) => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!name.trim()) return 'Name is required';
        if (!nameRegex.test(name)) return 'Name should only contain letters and spaces';
        if (name.length < 2) return 'Name should be at least 2 characters long';
        return '';
    };

    const validateMobile = (mobile) => {
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobile.trim()) return 'Mobile number is required';
        if (!mobileRegex.test(mobile)) return 'Mobile number should be 10 digits starting with 6-9';
        return '';
    };
    const validateLoginMobile = (mobile) => {
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobile.trim()) return 'Login Mobile number is required';
        if (!mobileRegex.test(mobile)) return 'Login Mobile number should be 10 digits starting with 6-9';
        return '';
    };

    const validateEmail = (email) => {
        if (!email.trim()) return ''; // Email is optional
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        return '';
    };

    const validateBankAccount = (accountNo) => {
        if (!accountNo.trim()) return 'Account number is required';
        if (accountNo.length < 9 || accountNo.length > 18) return 'Account number should be 9-18 digits';
        if (!/^\d+$/.test(accountNo)) return 'Account number should only contain numbers';
        return '';
    };

    const validateIFSC = (ifsc) => {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifsc.trim()) return 'IFSC code is required';
        if (!ifscRegex.test(ifsc.toUpperCase())) return 'Please enter a valid IFSC code (e.g., SBIN0123456)';
        return '';
    };

    const validateBankName = (bankName) => {
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!bankName.trim()) return 'Bank name is required';
        if (!nameRegex.test(bankName)) return 'Bank name should only contain letters and spaces';
        return '';
    };

    const validateBranchName = (branchName) => {
        const branchRegex = /^[a-zA-Z\s]+$/;
        if (!branchName.trim()) return 'Branch name is required';
        if (!branchRegex.test(branchName)) return 'Branch name should only contain letters and spaces';
        return '';
    };

    const validateEmployeeCode = (code) => {
        if (!code.trim()) return 'Employee code is required';
        if (code.length < 3) return 'Employee code should be at least 3 characters long';
        return '';
    };

    const validateSalary = (salary) => {
        if (!salary) return ''; // Salary is optional
        if (isNaN(salary) || parseFloat(salary) < 0) return 'Salary should be a valid positive number';
        return '';
    };
    const handleAllowanceChange = (index, field, value) => {
        const updatedAllowances = [...formData.allowances];
        updatedAllowances[index][field] = value;
        setFormData(prev => ({ ...prev, allowances: updatedAllowances }));
    };

    const handleDeductionChange = (index, field, value) => {
        const updatedDeductions = [...formData.deductions];
        updatedDeductions[index][field] = value;
        setFormData(prev => ({ ...prev, deductions: updatedDeductions }));
    };

    const addAllowance = () => {
        setFormData(prev => ({
            ...prev,
            allowances: [...prev.allowances, { allowance_id: '', allowance_value: '', allowance_type: 2 }] // Changed from 'amount' to 2
        }));
    };

    const addDeduction = () => {
        setFormData(prev => ({
            ...prev,
            deductions: [...prev.deductions, { deduction_id: '', deduction_value: '', deduction_type: 2 }] // Changed from 'amount' to 2
        }));
    };

    const removeAllowance = (index) => {
        if (formData.allowances.length > 1) {
            const updatedAllowances = formData.allowances.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, allowances: updatedAllowances }));
        }
    };

    const removeDeduction = (index) => {
        if (formData.deductions.length > 1) {
            const updatedDeductions = formData.deductions.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, deductions: updatedDeductions }));
        }
    };



    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            const file = files[0];
            if (file) {
                // File size validation (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    setToast({ message: 'File size should not exceed 5MB', type: 'error' });
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({ ...prev, [name]: file }));
                    setFilePreviews(prev => ({ ...prev, [name]: reader.result }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            let processedValue = value;

            if (value instanceof Date && !isNaN(value)) {
                processedValue = value.toISOString().split('T')[0];
            }
            // Real-time validation and formatting
            switch (name) {
                case 'name':
                case 'contactPersonName':
                    processedValue = processedValue.replace(/[^a-zA-Z\s]/g, '');
                    break;

                case 'mobile':
                case 'emergencyContactNo':
                case 'loginMobileNo':
                    processedValue = processedValue.replace(/\D/g, '').slice(0, 10);
                    break;

                case 'accountNo':
                    processedValue = processedValue.replace(/\D/g, '').slice(0, 18);
                    break;

                case 'ifscCode':
                    processedValue = processedValue.toUpperCase().slice(0, 11);
                    break;

                case 'bankName':
                case 'branchName':
                    processedValue = processedValue.replace(/[^a-zA-Z\s]/g, '');
                    break;

                case 'employeeCode':
                    processedValue = processedValue.replace(/[^a-zA-Z0-9-_]/g, '');
                    break;
            }

            setFormData(prev => ({ ...prev, [name]: processedValue }));
        }
    };

    const getValidDate = (value) => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    };


    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'name':
            case 'contactPersonName':
                return validateName(value);
            case 'mobile':
            case 'emergencyContactNo':
                return validateMobile(value);
            case 'loginMobileNo':
                return validateLoginMobile(value);
            case 'email':
                return validateEmail(value);
            case 'employeeCode':
                return validateEmployeeCode(value);
            case 'bankName':
                return validateBankName(value);
            case 'branchName':
                return validateBranchName(value);
            case 'accountNo':
                return validateBankAccount(value);
            case 'ifscCode':
                return validateIFSC(value);
            case 'salary':
                return validateSalary(value);
            default:
                return '';
        }
    };

    const handleFieldBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);

        if (error) {
            setToast({ message: error, type: 'error' });
        }
    };

    const handleReferenceChange = (index, field, value) => {
        const updatedReferences = [...formData.references];
        updatedReferences[index][field] = value;
        setFormData(prev => ({ ...prev, references: updatedReferences }));
    };


    const addReference = () => {
        setFormData(prev => ({
            ...prev,
            references: [...prev.references, { name: '', contactNumber: '' }]
        }));
    };

    const removeReference = (index) => {
        if (formData.references.length > 1) {
            const updatedReferences = formData.references.filter((_, i) => i !== index);
            setFormData(prev => ({ ...prev, references: updatedReferences }));
        }
    };

    const handleImagePreview = (imageSrc, title = "Document Preview") => {
        if (imageSrc) {
            setPreviewImage(imageSrc);
            setPreviewTitle(title);
            setShowPreviewModal(true);
        }
    };

    const handleDocumentPreview = (docSrc, title = "Document Preview") => {
        if (docSrc) {
            // Check if it's a PDF or document
            if (docSrc.includes('.pdf') || docSrc.toLowerCase().includes('pdf')) {
                window.open(docSrc, '_blank');
            } else {
                // Treat as image and show in modal
                setPreviewImage(docSrc);
                setPreviewTitle(title);
                setShowPreviewModal(true);
            }
        }
    };

    const closePreviewModal = () => {
        setShowPreviewModal(false);
        setPreviewImage('');
        setPreviewTitle('');
    };

    const PreviewModal = () => {
        if (!showPreviewModal || !previewImage) return null;

        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={closePreviewModal}
            >
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl max-h-[85vh] m-4 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {previewTitle}
                        </h3>
                        <button
                            onClick={closePreviewModal}
                            className="p-2 hover:bg-gray-200 rounded-full transition-all duration-200 group"
                            title="Close preview"
                        >
                            <svg
                                className="w-5 h-5 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Image Content */}
                    <div className="p-6 flex items-center justify-center bg-gray-50 min-h-[300px]">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg border border-gray-200"
                            onClick={(e) => e.stopPropagation()}
                            onError={(e) => {
                                console.error('Image failed to load:', previewImage);
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2IiBzdHJva2U9IiNkMWQ1ZGIiIHN0cm9rZS13aWR0aD0iMiIgcng9IjgiLz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNTAsIDEwMCkiPjxzdmcgY2xhc3M9InctOCBoLTgiIGZpbGw9IiM5Y2EzYWYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4Ij48cGF0aCBkPSJNMTIgOXYybTAgNGguMDFtLTYuOTM4IDRoMTMuODU2YzEuNTQgMCAyLjUwMi0xLjY2NyAxLjczMi0yLjVMMTMuNzMyIDRjLS43Ny0uODMzLTEuOTY0LS44MzMtMi43MzIgMEw0LjczMiAxNS41Yy0uNzcuODMzLjE5MiAyLjUgMS43MzIgMi41eiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+PC9nPjx0ZXh0IHg9IjUwJSIgeT0iNzAlIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBTZWdvZSBVSSwgUm9ib3RvLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+SW1hZ2Ugbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg==';
                            }}
                        />
                    </div>

                    {/* Footer with file info */}
                    <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">Click outside to close or use the × button</p>
                    </div>
                </div>
            </div>
        );
    };

    const handleFileDelete = (fieldName) => {
        // Clear the file preview
        setFilePreviews(prev => ({
            ...prev,
            [fieldName]: null
        }));

        // Clear the form data
        setFormData(prev => ({
            ...prev,
            [fieldName]: null
        }));

        // Clear the actual file input element
        const fileInput = document.querySelector(`input[name="${fieldName}"]`);
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const validateForm = () => {
        const errors = [];

        // Validate all fields
        const fieldsToValidate = [
            { name: 'employeeCode', value: formData.employeeCode },
            { name: 'name', value: formData.name },
            { name: 'mobile', value: formData.mobile },
            { name: 'email', value: formData.email },
            { name: 'bankName', value: formData.bankName },
            { name: 'branchName', value: formData.branchName },
            { name: 'accountNo', value: formData.accountNo },
            { name: 'ifscCode', value: formData.ifscCode },
            { name: 'salary', value: formData.salary }
        ];

        if (!isEditMode) {
            fieldsToValidate.push(
                { name: 'loginMobileNo', value: formData.loginMobileNo },
                { name: 'password', value: formData.password }
            );
        }

        fieldsToValidate.forEach(field => {
            const error = validateField(field.name, field.value);
            if (error) {
                errors.push(error);
            }
        });

        // Check required dropdowns
        if (!formData.gender) errors.push('Gender is required');
        if (!formData.branch) errors.push('Branch is required');
        if (!formData.department) errors.push('Department is required');
        if (!formData.designation) errors.push('Designation is required');

        // File validation for new employees
        if (!isEditMode) {
            if (!formData.aadharCard) errors.push('Aadhar Card is required');
            if (!formData.panCard) errors.push('PAN Card is required');
        }

        if (!isEditMode) {
            if (!formData.aadharCard) errors.push('Aadhar Card is required');
            if (!formData.panCard) errors.push('PAN Card is required');
            if (!formData.photo) errors.push('Profile Photo is required');
        }

        // Password validation for new employees
        if (!isEditMode && formData.password) {
            if (formData.password.length < 6) {
                errors.push('Password should be at least 6 characters long');
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        // Validate form
        const validationErrors = validateForm();

        if (validationErrors.length > 0) {
            setToast({
                message: validationErrors[0],
                type: 'error'
            });
            setIsSubmitting(false);
            return;
        }

        try {
            // Check if user is authenticated and has user_id
            if (!isAuthenticated() || !user?.user_id) {
                setMessage({
                    type: 'error',
                    text: 'User authentication required. Please login again.'
                });
                setIsSubmitting(false);
                return;
            }

            // Create FormData for API submission
            const formDataToSend = new FormData();

            // Add user_id
            formDataToSend.append('user_id', user.user_id);

            // Add employee_id for edit mode
            if (isEditMode && editEmployeeId) {
                formDataToSend.append('employee_id', editEmployeeId);
            }

            // Map form fields to API field names
            formDataToSend.append('employee_code', formData.employeeCode);
            formDataToSend.append('full_name', formData.name);
            formDataToSend.append('mobile_number', formData.mobile);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('gender_id', formData.gender);
            formDataToSend.append('branch_id', formData.branch);
            formDataToSend.append('department_id', formData.department);
            formDataToSend.append('designation_id', formData.designation);
            formDataToSend.append('employee_type_id', formData.employmentType);
            formDataToSend.append('address', formData.address);

            // Bank details
            formDataToSend.append('bank_name', formData.bankName);
            formDataToSend.append('bank_branch', formData.branchName);
            formDataToSend.append('bank_account_number', formData.accountNo);
            formDataToSend.append('bank_ifsc_code', formData.ifscCode);

            // Emergency contact details
            formDataToSend.append('emergency_contact_name', formData.contactPersonName);
            formDataToSend.append('emergency_contact_number', formData.emergencyContactNo);
            formDataToSend.append('emergency_relation_id', formData.relation);
            formDataToSend.append('emergency_address', formData.emergencyAddress);

            // Personal information
            formDataToSend.append('dob', formData.dateOfBirth);
            formDataToSend.append('date_of_joining', formData.dateOfJoining);

            formDataToSend.append('salary_type_id', formData.salaryType);
            formDataToSend.append('salary', formData.salary);
            formData.allowances.forEach((allowance) => {
                if (allowance.allowance_id && allowance.allowance_value) {
                    formDataToSend.append('allowance_id[]', allowance.allowance_id);
                    formDataToSend.append('allowance_value[]', allowance.allowance_value);
                    formDataToSend.append('allowance_type[]', allowance.allowance_type);
                }
            });
            formData.deductions.forEach((deduction) => {
                if (deduction.deduction_id && deduction.deduction_value) {
                    formDataToSend.append('deduction_id[]', deduction.deduction_id);
                    formDataToSend.append('deduction_value[]', deduction.deduction_value);
                    formDataToSend.append('deduction_type[]', deduction.deduction_type);
                }
            });

            // References - append as arrays
            formData.references.forEach((reference) => {
                if (reference.name && reference.contactNumber) {
                    formDataToSend.append('reference_name[]', reference.name);
                    formDataToSend.append('reference_number[]', reference.contactNumber);
                }
            });

            // Credentials 
            formDataToSend.append('login_mobile_number', formData.loginMobileNo || '');
            formDataToSend.append('password', formData.password || '');

            // Handle file uploads
            const fileFields = ['aadharCard', 'drivingLicence', 'panCard', 'photo'];
            const apiFileFields = ['aadharcard_img', 'dl_img', 'pan_img', 'passport_img'];

            fileFields.forEach((formField, index) => {
                const apiField = apiFileFields[index];
                const file = formData[formField];
                if (file && file instanceof File) {
                    formDataToSend.append(apiField, file);
                }
            });
            // Choose the appropriate API endpoint
            const apiEndpoint = '/employee_create';

            const response = await api.post(apiEndpoint, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.data.success) {
                setMessage({
                    type: 'success',
                    text: isEditMode ? 'Employee updated successfully!' : 'Employee added successfully!'
                });

                // Reset form only for add mode
                if (!isEditMode) {
                    setFormData({
                        employeeCode: '',
                        name: '',
                        mobile: '',
                        email: '',
                        gender: '',
                        branch: '',
                        department: '',
                        designation: '',
                        employmentType: '',
                        salaryType: '',
                        salary: '',
                        allowances: [{ allowance_id: '', allowance_value: '', allowance_type: 2 }],
                        deductions: [{ deduction_id: '', deduction_value: '', deduction_type: 2 }],
                        address: '',
                        bankName: '',
                        branchName: '',
                        accountNo: '',
                        ifscCode: '',
                        aadharCard: null,
                        drivingLicence: null,
                        panCard: null,
                        photo: null,
                        emergencyContactNo: '',
                        contactPersonName: '',
                        relation: '',
                        emergencyAddress: '',
                        dateOfBirth: null,
                        dateOfJoining: null,
                        references: [{ name: '', contactNumber: '' }],
                        loginMobileNo: '',
                        password: ''
                    });
                    setFilePreviews({
                        aadharCard: null,
                        drivingLicence: null,
                        panCard: null,
                        photo: null
                    });
                } else {
                    setTimeout(() => {
                        navigate('/employee'); // Adjust the route as needed
                    }, 2000);
                }
            } else {
                setMessage({
                    type: 'error',
                    text: response.data.message || `Failed to ${isEditMode ? 'update' : 'add'} employee.`
                });
            }

            // Scroll to top to show the success/error message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error saving employee:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} employee. Please try again.`
            });
            // Scroll to top to show the error message
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        navigate(-1); // Better than window.history.back() in React Router
    };

    const sections = [
        {
            key: 'basicDetails',
            title: 'Employement Information',
            icon: User,
            color: 'blue'
        },
        {
            key: 'salaryStructure',
            title: 'Salary Structure',
            icon: CreditCard,
            color: 'blue'
        },
        {
            key: 'bankDetails',
            title: 'Bank Details',
            icon: CreditCard,
            color: 'blue'
        },
        {
            key: 'legalDocuments',
            title: 'Documents',
            icon: FileText,
            color: 'blue'
        },
        {
            key: 'contactInformation',
            title: 'Contact',
            icon: Phone,
            color: 'blue'
        },
        {
            key: 'personalInformation',
            title: 'Personal Information',
            icon: Calendar,
            color: 'blue'
        },
        {
            key: 'reference',
            title: 'References',
            icon: Users,
            color: 'blue'
        },
        {
            key: 'credentials',
            title: 'Credentials',
            icon: Lock,
            color: 'blue'
        }
    ];

    if (isLoadingDropdowns || isLoadingEmployeeData) {
        return (
            <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-8 h-8 border-4 border-[var(--color-blue-dark)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[var(--color-text-secondary)]">
                        {isLoadingDropdowns ? 'Loading form data...' : 'Loading employee data...'}
                    </p>
                </div>
            </div>
        );
    }

    if (!permissions['employee_edit'] && isEditMode) {
        return;
    }
    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={goBack}
                                className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                {isEditMode ? <Edit size={24} className="text-[var(--color-text-white)]" /> : ""}
                                <div>
                                    <h1 className="text-2xl font-bold text-[var(--color-text-white)]">
                                        {isEditMode ? 'Edit Employee' : 'Add New Employee'}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div className={`mx-6 mt-6 p-4 rounded-xl border-l-4 ${message.type === 'success'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                            : 'bg-[var(--color-error-light)] text-red-800 border-red-400'
                            }`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                                {message.text}
                            </div>
                        </div>
                    )}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {sections.map((section) => (
                        <div key={section.key} className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] overflow-hidden">
                            <button
                                type="button"
                                onClick={() => toggleSection(section.key)}
                                className="w-full flex items-center justify-between p-6 hover:bg-[var(--color-bg-primary)] transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-${section.color}-100`}>
                                        <section.icon size={20} className={`text-${section.color}-600`} />
                                    </div>
                                    <span className="font-semibold text-[var(--color-text-primary)] text-lg">{section.title}</span>
                                </div>
                                <div className={`p-1 rounded-full ${expandedSections[section.key] ? 'bg-[var(--color-blue-lighter)]' : 'bg-[var(--color-bg-gradient-start)]'}`}>
                                    {expandedSections[section.key] ?
                                        <ChevronUp size={20} className="text-[var(--color-blue-dark)]" /> :
                                        <ChevronDown size={20} className="text-[var(--color-text-secondary)]" />
                                    }
                                </div>
                            </button>

                            {expandedSections[section.key] && (
                                <div className="border-t border-[var(--color-border-primary)]">
                                    {section.key === 'basicDetails' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Employee Code <span className="text-[var(--color-error)]">*</span></label>
                                                <input
                                                    type="text"
                                                    name="employeeCode"
                                                    value={formData.employeeCode}
                                                    onChange={handleInputChange}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter employee code"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Full Name <span className="text-[var(--color-error)]">*</span></label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter full name"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Mobile Number <span className="text-[var(--color-error)]">*</span></label>
                                                <input
                                                    type="tel"
                                                    name="mobile"
                                                    value={formData.mobile}
                                                    onChange={handleInputChange}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter mobile number"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter email address"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Gender <span className="text-[var(--color-error)]">*</span></label>
                                                <select
                                                    name="gender"
                                                    value={formData.gender}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    required
                                                >
                                                    <option value="">Select Gender</option>
                                                    {dropdownOptions.genderOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Branch <span className="text-[var(--color-error)]">*</span></label>
                                                <select
                                                    name="branch"
                                                    value={formData.branch}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    required
                                                >
                                                    <option value="">Select Branch</option>
                                                    {dropdownOptions.branchOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Department <span className="text-[var(--color-error)]">*</span></label>
                                                <select
                                                    name="department"
                                                    value={formData.department}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    required
                                                >
                                                    <option value="">Select Department</option>
                                                    {dropdownOptions.departmentOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Designation <span className="text-[var(--color-error)]">*</span></label>
                                                <select
                                                    name="designation"
                                                    value={formData.designation}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    required
                                                >
                                                    <option value="">Select Designation</option>
                                                    {dropdownOptions.designationOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Employment Type</label>
                                                <select
                                                    name="employmentType"
                                                    value={formData.employmentType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                >
                                                    <option value="">Select Employment Type</option>
                                                    {dropdownOptions.employmentTypeOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Address</label>
                                                <textarea
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all resize-none"
                                                    placeholder="Enter address"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {section.key === 'salaryStructure' && (
                                        <div className="p-6 space-y-6">
                                            {/* Salary Type and Base Salary */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Salary Type</label>
                                                    <select
                                                        name="salaryType"
                                                        value={formData.salaryType}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    >
                                                        <option value="">Select Salary Type</option>
                                                        {dropdownOptions.salaryTypeOptions.map(option => (
                                                            <option key={option.value} value={option.value}>{option.label}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Base Salary <span className="text-[var(--color-error)]">*</span></label>
                                                    <input
                                                        type="number"
                                                        name="salary"
                                                        value={formData.salary}
                                                        onChange={handleInputChange}
                                                        onBlur={handleFieldBlur}
                                                        className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                        placeholder="Enter base salary amount"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Allowances Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                        Allowances
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={addAllowance}
                                                        className="flex items-center gap-2 text-[var(--color-blue-dark)] hover:text-[var(--color-blue-darkest)] font-medium transition-colors px-3 py-2 rounded-lg hover:bg-[var(--color-blue-lighter)]"
                                                    >
                                                        <Plus size={16} />
                                                        Add Allowance
                                                    </button>
                                                </div>

                                                {formData.allowances && formData.allowances.map((allowance, index) => (
                                                    <div key={index} className="border border-[var(--color-border-primary)] rounded-lg p-4 bg-[var(--color-bg-card)]">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                                                                Allowance {index + 1}
                                                            </h4>
                                                            {formData.allowances.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeAllowance(index)}
                                                                    className="text-[var(--color-error)] hover:text-[var(--color-error-dark)] p-2 rounded-full hover:bg-[var(--color-error-light)] transition-colors"
                                                                    title="Remove this allowance"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Allowance Type <span className="text-[var(--color-error)]">*</span></label>
                                                                <select
                                                                    value={allowance.allowance_id}
                                                                    onChange={(e) => handleAllowanceChange(index, 'allowance_id', e.target.value)}
                                                                    className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                                >
                                                                    <option value="">Select Allowance</option>
                                                                    {dropdownOptions.allowanceOptions && dropdownOptions.allowanceOptions.map(option => (
                                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Type <span className="text-[var(--color-error)]">*</span></label>
                                                                <select
                                                                    value={allowance.allowance_type}
                                                                    onChange={(e) => handleAllowanceChange(index, 'allowance_type', parseInt(e.target.value))} // Parse to integer
                                                                    className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                                >
                                                                    <option value={2}>Amount</option>
                                                                    <option value={1}>Percentage</option>
                                                                </select>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                                                                    {allowance.allowance_type === 1 ? 'Percentage (%)' : 'Amount (₹)'} <span className="text-[var(--color-error)]">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={allowance.allowance_value}
                                                                    onChange={(e) => handleAllowanceChange(index, 'allowance_value', e.target.value)}
                                                                    className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                                    placeholder={allowance.allowance_type === 1 ? 'Enter percentage' : 'Enter amount'}
                                                                    min="0"
                                                                    max={allowance.allowance_type === 1 ? "100" : undefined}
                                                                    step={allowance.allowance_type === 1 ? "0.01" : "0.01"}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Deductions Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
                                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                        Deductions
                                                    </h4>
                                                    <button
                                                        type="button"
                                                        onClick={addDeduction}
                                                        className="flex items-center gap-2 text-[var(--color-blue-dark)] hover:text-[var(--color-blue-darkest)] font-medium transition-colors px-3 py-2 rounded-lg hover:bg-[var(--color-blue-lighter)]"
                                                    >
                                                        <Plus size={16} />
                                                        Add Deduction
                                                    </button>
                                                </div>

                                                {formData.deductions && formData.deductions.map((deduction, index) => (
                                                    <div key={index} className="border border-[var(--color-border-primary)] rounded-lg p-4 bg-[var(--color-bg-card)]">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)]">
                                                                Deduction {index + 1}
                                                            </h4>
                                                            {formData.deductions.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeDeduction(index)}
                                                                    className="text-[var(--color-error)] hover:text-[var(--color-error-dark)] p-2 rounded-full hover:bg-[var(--color-error-light)] transition-colors"
                                                                    title="Remove this deduction"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Deduction Type <span className="text-[var(--color-error)]">*</span></label>
                                                                <select
                                                                    value={deduction.deduction_id}
                                                                    onChange={(e) => handleDeductionChange(index, 'deduction_id', e.target.value)}
                                                                    className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                                >
                                                                    <option value="">Select Deduction</option>
                                                                    {dropdownOptions.deductionOptions && dropdownOptions.deductionOptions.map(option => (
                                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                                    ))}
                                                                </select>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Type <span className="text-[var(--color-error)]">*</span></label>
                                                                <select
                                                                    value={deduction.deduction_type}
                                                                    onChange={(e) => handleDeductionChange(index, 'deduction_type', parseInt(e.target.value))} // Parse to integer
                                                                    className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                                >
                                                                    <option value={2}>Amount</option>
                                                                    <option value={1}>Percentage</option>
                                                                </select>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">
                                                                    {deduction.deduction_type === 1 ? 'Percentage (%)' : 'Amount (₹)'} <span className="text-[var(--color-error)]">*</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    value={deduction.deduction_value}
                                                                    onChange={(e) => handleDeductionChange(index, 'deduction_value', e.target.value)}
                                                                    className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                                    placeholder={deduction.deduction_type === 1 ? 'Enter percentage' : 'Enter amount'}
                                                                    min="0"
                                                                    max={deduction.deduction_type === 1 ? "100" : undefined}
                                                                    step={deduction.deduction_type === 1 ? "0.01" : "0.01"}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>


                                            {/* Summary */}
                                            {formData.salary && (formData.allowances.some(item => item.allowance_id && item.allowance_value) ||
                                                formData.deductions.some(item => item.deduction_id && item.deduction_value)) && (
                                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mt-6">
                                                        <h4 className="text-lg font-semibold text-blue-800 mb-3">Salary Summary</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                            <div className="text-center p-3 bg-white rounded-lg border border-blue-100">
                                                                <div className="font-medium text-gray-600">Base Salary</div>
                                                                <div className="text-xl font-bold text-blue-600">₹{parseFloat(formData.salary || 0).toFixed(2)}</div>
                                                            </div>
                                                            <div className="text-center p-3 bg-white rounded-lg border border-green-100">
                                                                <div className="font-medium text-gray-600">Total Allowances</div>
                                                                <div className="text-xl font-bold text-green-600">
                                                                    ₹{formData.allowances
                                                                        .filter(item => item.allowance_id && item.allowance_value)
                                                                        .reduce((sum, item) => {
                                                                            const value = parseFloat(item.allowance_value || 0);
                                                                            const baseSalary = parseFloat(formData.salary || 0);
                                                                            return sum + (item.allowance_type === 1
                                                                                ? (baseSalary * value / 100)
                                                                                : value);
                                                                        }, 0)
                                                                        .toFixed(2)
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="text-center p-3 bg-white rounded-lg border border-red-100">
                                                                <div className="font-medium text-gray-600">Total Deductions</div>
                                                                <div className="text-xl font-bold text-red-600">
                                                                    ₹{formData.deductions
                                                                        .filter(item => item.deduction_id && item.deduction_value)
                                                                        .reduce((sum, item) => {
                                                                            const value = parseFloat(item.deduction_value || 0);
                                                                            const baseSalary = parseFloat(formData.salary || 0);
                                                                            return sum + (item.deduction_type === 1
                                                                                ? (baseSalary * value / 100)
                                                                                : value);
                                                                        }, 0)
                                                                        .toFixed(2)
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 pt-3 border-t border-blue-200">
                                                            <div className="text-center">
                                                                <div className="font-medium text-gray-600">Net Salary</div>
                                                                <div className="text-2xl font-bold text-indigo-600">
                                                                    ₹{(() => {
                                                                        const baseSalary = parseFloat(formData.salary || 0);
                                                                        const totalAllowances = formData.allowances
                                                                            .filter(item => item.allowance_id && item.allowance_value)
                                                                            .reduce((sum, item) => {
                                                                                const value = parseFloat(item.allowance_value || 0);
                                                                                return sum + (item.allowance_type === 'percentage'
                                                                                    ? (baseSalary * value / 100)
                                                                                    : value);
                                                                            }, 0);
                                                                        const totalDeductions = formData.deductions
                                                                            .filter(item => item.deduction_id && item.deduction_value)
                                                                            .reduce((sum, item) => {
                                                                                const value = parseFloat(item.deduction_value || 0);
                                                                                return sum + (item.deduction_type === 'percentage'
                                                                                    ? (baseSalary * value / 100)
                                                                                    : value);
                                                                            }, 0);
                                                                        return (baseSalary + totalAllowances - totalDeductions).toFixed(2);
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                    )}


                                    {section.key === 'bankDetails' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Bank Name <span className="text-[var(--color-error)]">*</span></label>
                                                <input
                                                    type="text"
                                                    name="bankName"
                                                    value={formData.bankName}
                                                    onChange={handleInputChange}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter bank name"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Branch Name <span className="text-[var(--color-error)]">*</span></label>
                                                <input
                                                    type="text"
                                                    name="branchName"
                                                    value={formData.branchName}
                                                    onChange={handleInputChange}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter branch name"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Account Number <span className="text-[var(--color-error)]">*</span></label>
                                                <input
                                                    type="text"
                                                    name="accountNo"
                                                    value={formData.accountNo}
                                                    onChange={handleInputChange}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter account number"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">IFSC Code <span className="text-[var(--color-error)]">*</span></label>
                                                <input
                                                    type="text"
                                                    name="ifscCode"
                                                    value={formData.ifscCode}
                                                    onChange={handleInputChange}
                                                    onBlur={handleFieldBlur}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter IFSC code"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {section.key === 'legalDocuments' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">
                                                    Aadhar Card {!isEditMode && <span className="text-[var(--color-error)]">*</span>}
                                                </label>

                                                {/* Upload Area */}
                                                <div className="relative">
                                                    {!filePreviews.aadharCard ? (
                                                        /* Upload Button when no file */
                                                        <label className="flex flex-col items-center justify-center w-full h-25 border-2 border-dashed border-[var(--color-border-primary)] rounded-xl cursor-pointer bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)] transition-all duration-300">
                                                            <div className="flex flex-col items-center justify-center pt-3 pb-3">
                                                                {/* Upload Icon */}
                                                                <div className="w-10 h-10 mb-2 bg-[var(--color-blue)] rounded-full flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-[var(--color-text-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                </div>
                                                                <p className="mb-1 text-base font-medium text-[var(--color-text-primary)]">Upload photo</p>
                                                                <p className="text-xs text-[var(--color-text-muted)]">PNG, JPG up to 5MB</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                name="aadharCard"
                                                                onChange={handleInputChange}
                                                                accept="image/*,.pdf"
                                                                className="hidden"
                                                                {...(!isEditMode && { required: true })}
                                                            />
                                                        </label>
                                                    ) : (
                                                        /* Preview when file is uploaded */
                                                        <div className="relative w-full h-32 border-2 border-dashed border-[var(--color-border-primary)] rounded-xl bg-[var(--color-bg-card)] overflow-hidden">
                                                            {/* Check if it's an image */}
                                                            {(filePreviews.aadharCard.startsWith('data:image') ||
                                                                filePreviews.aadharCard.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) ? (
                                                                <div className="relative w-full h-full group">
                                                                    <img
                                                                        src={filePreviews.aadharCard}
                                                                        alt="Aadhar Card Preview"
                                                                        className="w-full h-full object-contain group-hover:opacity-75 transition-opacity duration-200"
                                                                        onError={(e) => {
                                                                            console.error('Image failed to load:', filePreviews.aadharCard);
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                    {/* Fallback for broken images */}
                                                                    <div
                                                                        className="w-full h-full bg-[var(--color-bg-gray-light)] flex items-center justify-center text-[var(--color-text-muted)] text-sm"
                                                                        style={{ display: 'none' }}
                                                                    >
                                                                        Image Error
                                                                    </div>

                                                                    {/* Overlay with buttons */}
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                                                                        {/* Preview button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleImagePreview(filePreviews.aadharCard);
                                                                            }}
                                                                            className="bg-[var(--color-bg-secondary)] bg-opacity-90 hover:bg-opacity-100 text-[var(--color-text-primary)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Preview image"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </button>

                                                                        {/* Delete button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFileDelete('aadharCard');
                                                                            }}
                                                                            className="bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text-white)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Remove image"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* Document/PDF preview */
                                                                <div className="relative w-full h-full group flex items-center justify-center">
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="w-12 h-12 bg-[var(--color-blue)] rounded-xl flex items-center justify-center mb-2">
                                                                            <svg className="w-6 h-6 text-[var(--color-text-white)]" fill="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                                                            </svg>
                                                                        </div>
                                                                        <p className="text-xs font-medium text-[var(--color-text-primary)]">PDF Document</p>
                                                                    </div>

                                                                    {/* Overlay with buttons */}
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                                                                        {/* Preview button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDocumentPreview(filePreviews.aadharCard);
                                                                            }}
                                                                            className="bg-[var(--color-bg-secondary)] bg-opacity-90 hover:bg-opacity-100 text-[var(--color-text-primary)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Preview document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </button>

                                                                        {/* Delete button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFileDelete('aadharCard');
                                                                            }}
                                                                            className="bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text-white)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Remove document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">
                                                    PAN Card {!isEditMode && <span className="text-[var(--color-error)]">*</span>}
                                                </label>

                                                {/* Upload Area */}
                                                <div className="relative">
                                                    {!filePreviews.panCard ? (
                                                        /* Upload Button when no file */
                                                        <label className="flex flex-col items-center justify-center w-full h-25 border-2 border-dashed border-[var(--color-border-primary)] rounded-xl cursor-pointer bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)] transition-all duration-300">
                                                            <div className="flex flex-col items-center justify-center pt-3 pb-3">
                                                                {/* Upload Icon */}
                                                                <div className="w-10 h-10 mb-2 bg-[var(--color-blue)] rounded-full flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-[var(--color-text-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                </div>
                                                                <p className="mb-1 text-base font-medium text-[var(--color-text-primary)]">Upload photo</p>
                                                                <p className="text-xs text-[var(--color-text-muted)]">PNG, JPG up to 5MB</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                name="panCard"
                                                                onChange={handleInputChange}
                                                                accept="image/*,.pdf"
                                                                className="hidden"
                                                                {...(!isEditMode && { required: true })}
                                                            />
                                                        </label>
                                                    ) : (
                                                        /* Preview when file is uploaded */
                                                        <div className="relative w-full h-32 border-2 border-dashed border-[var(--color-border-primary)] rounded-xl bg-[var(--color-bg-card)] overflow-hidden">
                                                            {/* Check if it's an image */}
                                                            {(filePreviews.panCard.startsWith('data:image') ||
                                                                filePreviews.panCard.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i)) ? (
                                                                <div className="relative w-full h-full group">
                                                                    <img
                                                                        src={filePreviews.panCard}
                                                                        alt="PAN Card Preview"
                                                                        className="w-full h-full object-contain group-hover:opacity-75 transition-opacity duration-200"
                                                                        onError={(e) => {
                                                                            console.error('Image failed to load:', filePreviews.panCard);
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                    {/* Fallback for broken images */}
                                                                    <div
                                                                        className="w-full h-full bg-[var(--color-bg-gray-light)] flex items-center justify-center text-[var(--color-text-muted)] text-sm"
                                                                        style={{ display: 'none' }}
                                                                    >
                                                                        Image Error
                                                                    </div>

                                                                    {/* Overlay with buttons */}
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                                                                        {/* Preview button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleImagePreview(filePreviews.panCard);
                                                                            }}
                                                                            className="bg-[var(--color-bg-secondary)] bg-opacity-90 hover:bg-opacity-100 text-[var(--color-text-primary)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Preview image"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </button>

                                                                        {/* Delete button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFileDelete('panCard');
                                                                            }}
                                                                            className="bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text-white)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Remove image"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* Document/PDF preview */
                                                                <div className="relative w-full h-full group flex items-center justify-center">
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="w-12 h-12 bg-[var(--color-blue)] rounded-xl flex items-center justify-center mb-2">
                                                                            <svg className="w-6 h-6 text-[var(--color-text-white)]" fill="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                                                            </svg>
                                                                        </div>
                                                                        <p className="text-xs font-medium text-[var(--color-text-primary)]">PDF Document</p>
                                                                    </div>

                                                                    {/* Overlay with buttons */}
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                                                                        {/* Preview button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDocumentPreview(filePreviews.panCard);
                                                                            }}
                                                                            className="bg-[var(--color-bg-secondary)] bg-opacity-90 hover:bg-opacity-100 text-[var(--color-text-primary)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Preview document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </button>

                                                                        {/* Delete button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFileDelete('panCard');
                                                                            }}
                                                                            className="bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text-white)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Remove document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">
                                                    Profile Photo {!isEditMode && <span className="text-[var(--color-error)]">*</span>}
                                                </label>

                                                {/* Upload Area */}
                                                <div className="relative">
                                                    {!filePreviews.photo ? (
                                                        /* Upload Button when no file */
                                                        <label className="flex flex-col items-center justify-center w-full h-25 border-2 border-dashed border-[var(--color-border-primary)] rounded-xl cursor-pointer bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)] transition-all duration-300">
                                                            <div className="flex flex-col items-center justify-center pt-3 pb-3">
                                                                {/* Upload Icon */}
                                                                <div className="w-10 h-10 mb-2 bg-[var(--color-blue)] rounded-full flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-[var(--color-text-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                </div>
                                                                <p className="mb-1 text-base font-medium text-[var(--color-text-primary)]">Upload photo</p>
                                                                <p className="text-xs text-[var(--color-text-muted)]">PNG, JPG up to 5MB</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                name="photo"
                                                                onChange={handleInputChange}
                                                                accept="image/*"
                                                                className="hidden"
                                                                {...(!isEditMode && { required: true })}
                                                            />
                                                        </label>
                                                    ) : (
                                                        /* Preview when file is uploaded */
                                                        <div className="relative w-full h-32 border-2 border-dashed border-[var(--color-border-primary)] rounded-xl bg-[var(--color-bg-card)] overflow-hidden">
                                                            {/* Check if it's an image */}
                                                            {filePreviews.photo.startsWith('data:image') ||
                                                                filePreviews.photo.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                                                                <div className="relative w-full h-full group">
                                                                    <img
                                                                        src={filePreviews.photo}
                                                                        alt="Profile Photo Preview"
                                                                        className="w-full h-full object-contain group-hover:opacity-75 transition-opacity duration-200"
                                                                        onError={(e) => {
                                                                            console.error('Image failed to load:', filePreviews.photo);
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                    {/* Fallback for broken images */}
                                                                    <div
                                                                        className="w-full h-full bg-[var(--color-bg-gray-light)] flex items-center justify-center text-[var(--color-text-muted)] text-sm"
                                                                        style={{ display: 'none' }}
                                                                    >
                                                                        Image Error
                                                                    </div>

                                                                    {/* Overlay with buttons */}
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                                                                        {/* Preview button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleImagePreview(filePreviews.photo);
                                                                            }}
                                                                            className="bg-[var(--color-bg-secondary)] bg-opacity-90 hover:bg-opacity-100 text-[var(--color-text-primary)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Preview image"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </button>

                                                                        {/* Delete button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFileDelete('photo');
                                                                            }}
                                                                            className="bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text-white)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Remove image"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* Document/PDF preview */
                                                                <div className="relative w-full h-full group flex items-center justify-center">
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="w-12 h-12 bg-[var(--color-blue)] rounded-xl flex items-center justify-center mb-2">
                                                                            <svg className="w-6 h-6 text-[var(--color-text-white)]" fill="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                                                            </svg>
                                                                        </div>
                                                                        <p className="text-xs font-medium text-[var(--color-text-primary)]">PDF Document</p>
                                                                    </div>

                                                                    {/* Overlay with buttons */}
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                                                                        {/* Preview button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDocumentPreview(filePreviews.photo);
                                                                            }}
                                                                            className="bg-[var(--color-bg-secondary)] bg-opacity-90 hover:bg-opacity-100 text-[var(--color-text-primary)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Preview document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </button>

                                                                        {/* Delete button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFileDelete('photo');
                                                                            }}
                                                                            className="bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text-white)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Remove document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">
                                                    Driving Licence
                                                </label>

                                                {/* Upload Area */}
                                                <div className="relative">
                                                    {!filePreviews.drivingLicence ? (
                                                        /* Upload Button when no file */
                                                        <label className="flex flex-col items-center justify-center w-full h-25 border-2 border-dashed border-[var(--color-border-primary)] rounded-xl cursor-pointer bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)] transition-all duration-300">
                                                            <div className="flex flex-col items-center justify-center pt-3 pb-3">
                                                                {/* Upload Icon */}
                                                                <div className="w-10 h-10 mb-2 bg-[var(--color-blue)] rounded-full flex items-center justify-center">
                                                                    <svg className="w-5 h-5 text-[var(--color-text-white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                    </svg>
                                                                </div>
                                                                <p className="mb-1 text-base font-medium text-[var(--color-text-primary)]">Upload photo</p>
                                                                <p className="text-xs text-[var(--color-text-muted)]">PNG, JPG up to 5MB</p>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                name="drivingLicence"
                                                                onChange={handleInputChange}
                                                                accept="image/*,.pdf"
                                                                className="hidden"
                                                            />
                                                        </label>
                                                    ) : (
                                                        /* Preview when file is uploaded */
                                                        <div className="relative w-full h-32 border-2 border-dashed border-[var(--color-border-primary)] rounded-xl bg-[var(--color-bg-card)] overflow-hidden">
                                                            {/* Check if it's an image */}
                                                            {filePreviews.drivingLicence.startsWith('data:image') ||
                                                                filePreviews.drivingLicence.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                                                                <div className="relative w-full h-full group">
                                                                    <img
                                                                        src={filePreviews.drivingLicence}
                                                                        alt="Driving Licence Preview"
                                                                        className="w-full h-full object-contain group-hover:opacity-75 transition-opacity duration-200"
                                                                        onError={(e) => {
                                                                            console.error('Image failed to load:', filePreviews.drivingLicence);
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                    {/* Fallback for broken images */}
                                                                    <div
                                                                        className="w-full h-full bg-[var(--color-bg-gray-light)] flex items-center justify-center text-[var(--color-text-muted)] text-sm"
                                                                        style={{ display: 'none' }}
                                                                    >
                                                                        Image Error
                                                                    </div>

                                                                    {/* Overlay with buttons */}
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                                                                        {/* Preview button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleImagePreview(filePreviews.drivingLicence);
                                                                            }}
                                                                            className="bg-[var(--color-bg-secondary)] bg-opacity-90 hover:bg-opacity-100 text-[var(--color-text-primary)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Preview image"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </button>

                                                                        {/* Delete button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFileDelete('drivingLicence');
                                                                            }}
                                                                            className="bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text-white)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Remove image"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                /* Document/PDF preview */
                                                                <div className="relative w-full h-full group flex items-center justify-center">
                                                                    <div className="flex flex-col items-center">
                                                                        <div className="w-12 h-12 bg-[var(--color-blue)] rounded-xl flex items-center justify-center mb-2">
                                                                            <svg className="w-6 h-6 text-[var(--color-text-white)]" fill="currentColor" viewBox="0 0 24 24">
                                                                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                                                            </svg>
                                                                        </div>
                                                                        <p className="text-xs font-medium text-[var(--color-text-primary)]">PDF Document</p>
                                                                    </div>

                                                                    {/* Overlay with buttons */}
                                                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100">
                                                                        {/* Preview button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDocumentPreview(filePreviews.drivingLicence);
                                                                            }}
                                                                            className="bg-[var(--color-bg-secondary)] bg-opacity-90 hover:bg-opacity-100 text-[var(--color-text-primary)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Preview document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                        </button>

                                                                        {/* Delete button */}
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleFileDelete('drivingLicence');
                                                                            }}
                                                                            className="bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text-white)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                                                                            title="Remove document"
                                                                        >
                                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                            </svg>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {section.key === 'contactInformation' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Emergency Contact Number</label>
                                                <input
                                                    type="tel"
                                                    name="emergencyContactNo"
                                                    value={formData.emergencyContactNo}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter emergency contact number"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Contact Person Name</label>
                                                <input
                                                    type="text"
                                                    name="contactPersonName"
                                                    value={formData.contactPersonName}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    placeholder="Enter contact person name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Relation</label>
                                                <select
                                                    name="relation"
                                                    value={formData.relation}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                >
                                                    <option value="">Select Relation</option>
                                                    {dropdownOptions.relationOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Emergency Address</label>
                                                <textarea
                                                    name="emergencyAddress"
                                                    value={formData.emergencyAddress}
                                                    onChange={handleInputChange}
                                                    rows="3"
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all resize-none"
                                                    placeholder="Enter emergency address"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {section.key === 'personalInformation' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Date of Birth</label>
                                                <DatePicker
                                                    selected={getValidDate(formData.dateOfBirth)}
                                                    onChange={(date) =>
                                                        handleInputChange({
                                                            target: {
                                                                name: 'dateOfBirth',
                                                                value: date,
                                                            },
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    dateFormat="dd-MM-yyyy"
                                                    placeholderText="DD-MM-YYYY"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    scrollableYearDropdown
                                                    scrollableMonthDropdown
                                                    yearDropdownItemNumber={100}
                                                    maxDate={new Date()}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Date of Joining</label>
                                                <DatePicker
                                                    selected={getValidDate(formData.dateOfJoining)}
                                                    onChange={(date) =>
                                                        handleInputChange({
                                                            target: {
                                                                name: 'dateOfJoining',
                                                                value: date,
                                                            },
                                                        })
                                                    }
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                    dateFormat="dd-MM-yyyy"
                                                    placeholderText="DD-MM-YYYY"
                                                    showYearDropdown
                                                    showMonthDropdown
                                                    scrollableYearDropdown
                                                    scrollableMonthDropdown
                                                    maxDate={new Date()}
                                                />
                                            </div>
                                        </div>
                                    )}


                                    {section.key === 'reference' && (
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                {formData.references.map((reference, index) => (
                                                    <div key={index} className="border border-[var(--color-border-primary)] rounded-lg p-4">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <h4 className="text-sm font-semibold text-[var(--color-text-secondary)]">Reference {index + 1}</h4>
                                                            {formData.references.length > 1 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeReference(index)}
                                                                    className="text-[var(--color-error)] hover:text-[var(--color-error-dark)] p-1 rounded-full hover:bg-[var(--color-error-light)] transition-colors"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Name</label>
                                                                <input
                                                                    type="text"
                                                                    value={reference.name}
                                                                    onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                                                                    className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                                    placeholder="Enter reference name"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="block text-sm font-medium text-[var(--color-text-secondary)]">Contact Number</label>
                                                                <input
                                                                    type="tel"
                                                                    value={reference.contactNumber}
                                                                    onChange={(e) => handleReferenceChange(index, 'contactNumber', e.target.value)}
                                                                    className="w-full px-3 py-2 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                                    placeholder="Enter contact number"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={addReference}
                                                    className="flex items-center gap-2 text-[var(--color-blue-dark)] hover:text-[var(--color-blue-darkest)] font-medium transition-colors"
                                                >
                                                    <Plus size={16} />
                                                    Add Another Reference
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    {section.key === 'credentials' && (
                                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Login Mobile No <span className="text-[var(--color-error)]">*</span></label>
                                                <input
                                                    type="tel"
                                                    name="loginMobileNo"
                                                    value={formData.loginMobileNo}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-semibold text-[var(--color-text-secondary)]">Password <span className="text-[var(--color-error)]">*</span></label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-[var(--color-border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-transparent transition-all"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Submit Button */}
                    <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-lg border border-[var(--color-border-primary)] p-6">
                        <div className="flex gap-4 justify-end">
                            <button
                                type="button"
                                onClick={goBack}
                                className="px-6 py-3 border border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-bg-primary)] transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] text-[var(--color-text-white)] rounded-lg hover:from-[var(--color-blue-darker)] hover:to-[var(--color-blue-darkest)] transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting && (
                                    <div className="w-4 h-4 border-2 border-[var(--color-border-primary)] border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...')
                                    : (isEditMode ? 'Update Employee' : 'Add Employee')
                                }
                            </button>
                        </div>
                    </div>
                </form>
                <PreviewModal />
            </div>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );

};

export default AddEmployee;