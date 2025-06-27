import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Save, X, CheckCircle, AlertCircle, Info, RotateCcw, Settings, Eye, EyeOff, Users, Timer, Edit } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { Toast } from '../../Components/ui/Toast';

// Professional Loading Component
const LoadingSpinner = ({ message = "Loading shift configuration..." }) => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
            <div className="w-12 h-12 border-3 border-gray-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">{message}</p>
        </div>
    </div>
);

const CreateShift = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    // Get edit mode and shift ID from URL params
    const editShiftId = searchParams.get('edit');
    const isEditMode = !!editShiftId;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [previewMode, setPreviewMode] = useState(false);

    // Form data
    const [shiftName, setShiftName] = useState('');
    const [remark, setRemark] = useState('');
    const [dayList, setDayList] = useState([]);
    const [shiftTypes, setShiftTypes] = useState([]);
    const [occasionalDayList, setOccasionalDayList] = useState([]);

    // Show toast notification
    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    // Close toast
    const closeToast = () => {
        setToast(null);
    };

    // Apply default values to day list
    const applyDefaultValues = (days) => {
        return days.map(day => ({
            ...day,
            from_time: day.from_time || '09:00 PM',
            to_time: day.to_time || '06:00 AM',
            shift_type: day.shift_type || '1',
            occasional_days: day.occasional_days || ''
        }));
    };

    // Fetch shift day data (for creating new shifts)
    // Fetch shift day data (for creating new shifts or editing existing ones)
    const fetchShiftDayData = async (shiftId = null) => {
        try {
            const formData = new FormData();

            // If shiftId is provided, add it to fetch existing shift data
            if (shiftId) {
                formData.append('shift_id', shiftId);
            }

            const response = await api.post('shift_day_fetch', formData);

            if (response.data.success) {
                const data = response.data.data;
                return {
                    dayList: data.day_list || [],
                    shiftTypes: data.shift_type || [],
                    occasionalDayList: data.day_occasional_list || []
                };
            } else {
                showToast(response.data.message || 'Failed to fetch shift data', 'error');
                return null;
            }
        } catch (err) {
            console.error('Error fetching shift data:', err);
            showToast('Failed to load shift data. Please try again.', 'error');
            return null;
        }
    };

    // Fetch existing shift details from shift_list API (for basic info like shift_name)
    const fetchShiftDetailsFromList = async (shiftId) => {
        try {
            if (!user?.user_id) {
                showToast('Admin user ID is required.', 'error');
                return null;
            }

            const formData = new FormData();
            formData.append('user_id', user.user_id);

            const response = await api.post('shift_list', formData);

            if (response.data.success && Array.isArray(response.data.data)) {
                // Find the specific shift by ID
                const shiftDetails = response.data.data.find(shift =>
                    shift.shift_id === shiftId || shift.shift_id === parseInt(shiftId)
                );

                if (shiftDetails) {
                    return shiftDetails;
                } else {
                    showToast('Shift not found in the list', 'error');
                    return null;
                }
            } else {
                showToast(response.data.message || 'Failed to fetch shift list', 'error');
                return null;
            }
        } catch (err) {
            console.error('Error fetching shift list:', err);
            showToast('Failed to load shift details. Please try again.', 'error');
            return null;
        }
    };

    // Fetch existing shift data for editing
    const fetchExistingShiftData = async (shiftId) => {
        try {
            if (!user?.user_id) {
                showToast('Admin user ID is required.', 'error');
                return;
            }

            // Fetch shift day data with the specific shift_id
            const shiftDayData = await fetchShiftDayData(shiftId);
            if (!shiftDayData) return;

            // Set the fetched data
            setShiftTypes(shiftDayData.shiftTypes);
            setOccasionalDayList(shiftDayData.occasionalDayList);

            // Process the day list - map occasional_day to occasional_days for consistency
            const processedDayList = shiftDayData.dayList.map(day => ({
                ...day,
                occasional_days: day.occasional_day || '' // Map occasional_day to occasional_days
            }));

            setDayList(processedDayList);

            // Fetch basic shift info (shift_name, remark) from shift_list API
            const shiftDetails = await fetchShiftDetailsFromList(shiftId);
            if (shiftDetails) {
                setShiftName(shiftDetails.shift_name || '');
                setRemark(shiftDetails.remark || ''); // This might still be empty if API doesn't provide it
            }
        } catch (err) {
            console.error('Error:', err);
            showToast('Failed to load shift details.', 'error');

            // Try to load at least the base data on error
            const shiftDayData = await fetchShiftDayData();
            if (shiftDayData) {
                setShiftTypes(shiftDayData.shiftTypes);
                setOccasionalDayList(shiftDayData.occasionalDayList);
                setDayList(applyDefaultValues(shiftDayData.dayList));
            }
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        const initializeData = async () => {
            if (!user?.user_id) return; // prevent API call if user ID is not ready

            setLoading(true);
            try {
                if (isEditMode && editShiftId) {
                    await fetchExistingShiftData(editShiftId);
                } else {
                    // For new shift creation
                    const shiftDayData = await fetchShiftDayData();
                    if (shiftDayData) {
                        setShiftTypes(shiftDayData.shiftTypes);
                        setOccasionalDayList(shiftDayData.occasionalDayList);
                        setDayList(applyDefaultValues(shiftDayData.dayList));
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, [isEditMode, editShiftId, user?.user_id]);

    // Handle day data change
    const handleDayChange = (dayId, field, value) => {
        setDayList(prevDays =>
            prevDays.map(day =>
                day.day_id === dayId
                    ? { ...day, [field]: value }
                    : day
            )
        );
    };

    // Handle occasional day selection
    const handleOccasionalDayChange = (dayId, occasionalId, checked) => {
        setDayList(prevDays =>
            prevDays.map(day => {
                if (day.day_id === dayId) {
                    let occasionalDays = day.occasional_days ? day.occasional_days.split(',').filter(id => id) : [];

                    if (checked) {
                        if (!occasionalDays.includes(occasionalId)) {
                            occasionalDays.push(occasionalId);
                        }
                    } else {
                        occasionalDays = occasionalDays.filter(id => id !== occasionalId);
                    }

                    return { ...day, occasional_days: occasionalDays.join(',') };
                }
                return day;
            })
        );
    };

    // Validate form data
    const validateForm = () => {
        if (!shiftName.trim()) {
            showToast('Shift name is required to proceed', 'error');
            return false;
        }

        const hasValidDay = dayList.some(day => {
            return day.from_time && day.to_time && day.shift_type;
        });

        if (!hasValidDay) {
            showToast('Please configure at least one day with valid schedule', 'error');
            return false;
        }

        const invalidOccasionalDays = dayList.some(day => {
            if (day.shift_type === "3") {
                return !day.occasional_days || day.occasional_days.trim() === '';
            }
            return false;
        });

        if (invalidOccasionalDays) {
            showToast('Please select occasional days for "Occasional Working Day" shifts', 'error');
            return false;
        }

        return true;
    };

    // Enhanced Time Selector Component with separate Hour and Minute dropdowns
    const TimeSelector = ({ value, onChange, label, required = false, disabled = false }) => {
        // Parse the current time value (e.g., "09:30 AM" or "")
        const parseTimeValue = (timeStr) => {
            if (!timeStr) return { hour: '', minute: '', period: '' };

            const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
            if (match) {
                return {
                    hour: match[1].padStart(2, '0'),
                    minute: match[2],
                    period: match[3].toUpperCase()
                };
            }
            return { hour: '', minute: '', period: '' };
        };

        const { hour, minute, period } = parseTimeValue(value);

        // Generate hour options (1-12 for 12-hour format)
        const generateHourOptions = () => {
            const hours = [];
            for (let i = 1; i <= 12; i++) {
                hours.push({
                    value: i.toString().padStart(2, '0'),
                    label: i.toString()
                });
            }
            return hours;
        };

        // Generate minute options (0-59)
        const generateMinuteOptions = () => {
            const minutes = [];
            for (let i = 0; i < 60; i++) {
                minutes.push({
                    value: i.toString().padStart(2, '0'),
                    label: i.toString().padStart(2, '0')
                });
            }
            return minutes;
        };

        const hourOptions = generateHourOptions();
        const minuteOptions = generateMinuteOptions();
        const periodOptions = [
            { value: 'AM', label: 'AM' },
            { value: 'PM', label: 'PM' }
        ];

        // Handle individual field changes
        const handleFieldChange = (field, fieldValue) => {
            const currentParsed = parseTimeValue(value);

            const newTime = {
                hour: field === 'hour' ? fieldValue : currentParsed.hour,
                minute: field === 'minute' ? fieldValue : currentParsed.minute,
                period: field === 'period' ? fieldValue : currentParsed.period
            };

            // Only call onChange if all fields have values
            if (newTime.hour && newTime.minute && newTime.period) {
                const formattedTime = `${parseInt(newTime.hour).toString().padStart(2, '0')}:${newTime.minute} ${newTime.period}`;
                onChange(formattedTime);
            } else if (!newTime.hour && !newTime.minute && !newTime.period) {
                // If all fields are empty, pass empty string
                onChange('');
            }
        };

        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                <div className="flex gap-1">
                    {/* Hour Dropdown */}
                    <select
                        value={hour}
                        onChange={(e) => handleFieldChange('hour', e.target.value)}
                        className="flex-1 px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
                        required={required}
                        disabled={disabled}
                    >
                        <option value="">Hr</option>
                        {hourOptions.map(h => (
                            <option key={h.value} value={h.value}>
                                {h.label}
                            </option>
                        ))}
                    </select>

                    <span className="flex items-center px-1 text-gray-500">:</span>

                    {/* Minute Dropdown */}
                    <select
                        value={minute}
                        onChange={(e) => handleFieldChange('minute', e.target.value)}
                        className="flex-1 px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
                        required={required}
                        disabled={disabled}
                    >
                        <option value="">Min</option>
                        {minuteOptions.map(m => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>

                    {/* AM/PM Dropdown */}
                    <select
                        value={period}
                        onChange={(e) => handleFieldChange('period', e.target.value)}
                        className="px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
                        required={required}
                        disabled={disabled}
                    >
                        <option value="">--</option>
                        {periodOptions.map(p => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!user?.user_id) {
            showToast('Authentication required. Please log in again.', 'error');
            return;
        }

        try {
            setSubmitting(true);

            const formData = new FormData();
            formData.append('user_id', user.user_id);
            formData.append('shift_name', shiftName.trim());
            formData.append('remark', remark.trim());

            // Add shift_id for edit mode
            if (isEditMode && editShiftId) {
                formData.append('shift_id', editShiftId);
                formData.append('action', 'update');
            }

            const validDays = dayList.filter(day =>
                day.from_time && day.to_time && day.shift_type
            );

            validDays.forEach(day => {
                formData.append('day_id[]', day.day_id);
                formData.append('from_time[]', day.from_time);
                formData.append('to_time[]', day.to_time);
                formData.append('shift_type[]', day.shift_type);

                const occasionalKey = `occasional_day_${day.day_id}`;
                formData.append(occasionalKey, day.occasional_days || '');
            });

            const response = await api.post('shift_create', formData);

            if (response.data.success) {
                const successMessage = isEditMode
                    ? 'Shift updated successfully! Redirecting...'
                    : 'Shift created successfully! Redirecting...';
                showToast(successMessage, 'success');
                setTimeout(() => {
                    navigate('/shift-management');
                }, 2000);
            } else {
                const errorMessage = isEditMode
                    ? 'Failed to update shift. Please try again.'
                    : 'Failed to create shift. Please try again.';
                showToast(response.data.message || errorMessage, 'error');
            }
        } catch (err) {
            console.error('Error submitting shift:', err);
            showToast('Network error. Please check your connection and try again.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // Reset day to defaults
    const resetDayToDefaults = (dayId) => {
        handleDayChange(dayId, 'from_time', '09:00 PM');
        handleDayChange(dayId, 'to_time', '06:00 AM');
        handleDayChange(dayId, 'shift_type', '1');
        handleDayChange(dayId, 'occasional_days', '');
        showToast('Day reset to default values', 'info');
    };

    // Reset all days to defaults
    const resetAllToDefaults = () => {
        dayList.forEach(day => {
            resetDayToDefaults(day.day_id);
        });
        showToast('All days reset to default configuration', 'info');
    };

    if (loading) {
        const loadingMessage = isEditMode
            ? "Loading shift details for editing..."
            : "Loading shift configuration...";
        return <LoadingSpinner message={loadingMessage} />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/shift-management')}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isEditMode ? 'bg-orange-600' : 'bg-blue-600'}`}>
                                    {isEditMode ? <Edit className="w-5 h-5 text-white" /> : <Calendar className="w-5 h-5 text-white" />}
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900">
                                        {isEditMode ? 'Edit Shift' : 'Create New Shift'}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {isEditMode
                                            ? 'Modify existing work schedule and shift parameters'
                                            : 'Configure work schedule and shift parameters'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setPreviewMode(!previewMode)}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                {previewMode ? 'Edit' : 'Preview'}
                            </button>
                            <button
                                type="button"
                                onClick={resetAllToDefaults}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset All
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Basic Information */}
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <Settings className="w-5 h-5 text-gray-500" />
                                <h2 className="text-lg font-medium text-gray-900">Basic Information</h2>
                                {isEditMode && (
                                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                                        Editing
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Shift Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={shiftName}
                                        onChange={(e) => setShiftName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter shift name"
                                        required
                                        disabled={previewMode}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Remark
                                    </label>
                                    <input
                                        type="text"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Optional notes"
                                        disabled={previewMode}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Schedule */}
                    <div className="bg-white rounded-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-gray-500" />
                                    <h2 className="text-lg font-medium text-gray-900">Weekly Schedule</h2>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-500">
                                        Default: 9:00 PM - 6:00 AM
                                    </div>
                                    {!previewMode && (
                                        <button
                                            type="button"
                                            onClick={resetAllToDefaults}
                                            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors flex items-center gap-1"
                                        >
                                            <RotateCcw className="w-3 h-3" />
                                            Reset All
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="space-y-6">
                                {dayList.map((day) => {
                                    const isConfigured = day.from_time && day.to_time && day.shift_type;
                                    const isOccasionalDay = day.shift_type === "3";
                                    const hasOccasionalDaysSelected = isOccasionalDay && day.occasional_days && day.occasional_days.trim() !== '';

                                    return (
                                        <div key={day.day_id} className="border border-gray-200 rounded-lg overflow-hidden">
                                            {/* Day Header */}
                                            <div className={`px-4 py-3 border-b border-gray-200 ${isConfigured ? 'bg-green-50' : 'bg-gray-50'}`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white ${isConfigured ? 'bg-green-500' : 'bg-gray-400'}`}>
                                                            {day.day_name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{day.day_name}</h3>
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <span>{isConfigured ? 'Configured' : 'Not configured'}</span>
                                                                {isOccasionalDay && hasOccasionalDaysSelected && (
                                                                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                                                        Occasional
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {/* Quick Time Display */}
                                                        {isConfigured && (
                                                            <div className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                                                                {day.from_time} - {day.to_time}
                                                            </div>
                                                        )}
                                                        {!previewMode && (
                                                            <button
                                                                type="button"
                                                                onClick={() => resetDayToDefaults(day.day_id)}
                                                                className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white rounded transition-colors"
                                                                title="Reset to defaults"
                                                            >
                                                                <RotateCcw className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Day Configuration */}
                                            <div className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                    {/* Start Time */}
                                                    <TimeSelector
                                                        value={day.from_time}
                                                        onChange={(value) => handleDayChange(day.day_id, 'from_time', value)}
                                                        label="Start Time"
                                                        required={true}
                                                        disabled={previewMode}
                                                    />

                                                    {/* End Time */}
                                                    <TimeSelector
                                                        value={day.to_time}
                                                        onChange={(value) => handleDayChange(day.day_id, 'to_time', value)}
                                                        label="End Time"
                                                        required={true}
                                                        disabled={previewMode}
                                                    />

                                                    {/* Shift Type */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Shift Type <span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            value={day.shift_type || ''}
                                                            onChange={(e) => handleDayChange(day.day_id, 'shift_type', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white"
                                                            required
                                                            disabled={previewMode}
                                                        >
                                                            <option value="" disabled>Select shift type</option>
                                                            {shiftTypes.map(type => (
                                                                <option key={type.id} value={type.id}>
                                                                    {type.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* Occasional Days */}
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Occasional Days {isOccasionalDay && <span className="text-red-500">*</span>}
                                                        </label>
                                                        {isOccasionalDay ? (
                                                            <div className="border border-gray-300 rounded-md bg-white">
                                                                <div className="p-3 max-h-24 overflow-y-auto">
                                                                    <div className="space-y-2">
                                                                        {occasionalDayList.map(occasional => {
                                                                            const isChecked = (day.occasional_days || '').split(',').filter(id => id).includes(occasional.id);
                                                                            return (
                                                                                <label key={occasional.id} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-50 p-1 rounded">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={isChecked}
                                                                                        onChange={(e) => handleOccasionalDayChange(day.day_id, occasional.id, e.target.checked)}
                                                                                        className="w-3 h-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                                        disabled={previewMode}
                                                                                    />
                                                                                    <span className="text-gray-700">{occasional.name}</span>
                                                                                </label>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                                {/* Selected count indicator */}
                                                                {hasOccasionalDaysSelected && (
                                                                    <div className="px-3 py-1 bg-blue-50 border-t text-xs text-blue-600">
                                                                        {day.occasional_days.split(',').filter(id => id).length} day(s) selected
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 text-center">
                                                                <p className="text-xs text-gray-500">
                                                                    Select "Occasional Working Day" to configure
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {!previewMode && (
                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/shift-management')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`px-6 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:ring-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${isEditMode
                                    ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                    }`}
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        {isEditMode ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        {isEditMode ? 'Update Shift' : 'Create Shift'}
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>

                {/* Toast Notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={closeToast}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateShift;