import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Save, Building, Upload, X, Settings, ArrowLeft, Eye, Trash2, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { Toast } from '../../Components/ui/Toast';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "../../Components/Loader/LoadingSpinner"

const SettingsComponent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Preview Modal State
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // Company Info State with file handling
  const [companyData, setCompanyData] = useState({
    company_name: '',
    company_address: '',
    company_number: '',
    salary_slip_policy: '',
    biomatric_api_key: '',
    biomatric_api_password: '',
    company_logo: null,
    authorized_signatory: null
  });

  // File Previews State
  const [filePreviews, setFilePreviews] = useState({
    company_logo: null,
    authorized_signatory: null
  });

  // Time Configuration State
  const [timeConfig, setTimeConfig] = useState({
    early_clock_in: 15,
    late_arrival: 15,
    overtime: 30
  });

  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Enhanced file handling
  const handleFileChange = (field, file) => {
    if (file) {
      // File size validation (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size should not exceed 5MB', 'error');
        return;
      }

      // File type validation
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyData(prev => ({ ...prev, [field]: file }));
        setFilePreviews(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileDelete = (field) => {
    setCompanyData(prev => ({ ...prev, [field]: null }));
    setFilePreviews(prev => ({ ...prev, [field]: null }));
  };

  const handleImagePreview = (imageSrc, title = "Document Preview") => {
    if (imageSrc) {
      setPreviewImage(imageSrc);
      setPreviewTitle(title);
      setShowPreviewModal(true);
    }
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setPreviewImage('');
    setPreviewTitle('');
  };

  // Fetch software settings
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);

      if (!user?.user_id) {
        throw new Error('User ID is required');
      }

      const formData = new FormData();
      formData.append('user_id', user.user_id);

      const response = await api.post('software_setting_list', formData);

      if (response.data?.success) {
        const settingsData = response.data.data || response.data.settings || {};

        // Get base URL for images (similar to employee form)
        const baseUrl = response.data.base_url || settingsData.base_url || '';

        // Map API response to component state
        setTimeConfig({
          early_clock_in: parseInt(settingsData.early_clock_in) || 15,
          late_arrival: parseInt(settingsData.late_arrival) || 15,
          overtime: parseInt(settingsData.overtime) || 30
        });

        setCompanyData({
          company_name: settingsData.company_name || '',
          company_address: settingsData.company_address || '',
          company_number: settingsData.company_number || '',
          salary_slip_policy: settingsData.salary_slip_policy || '',
          biomatric_api_key: settingsData.biomatric_api_key || '',
          biomatric_api_password: settingsData.biomatric_api_password || '',
          company_logo: null, // Keep as null for file object
          authorized_signatory: null // Keep as null for file object
        });

        // Handle image previews from API response
        const imagePreviewsFromAPI = {
          company_logo: settingsData.company_logo
            ? (settingsData.company_logo.startsWith('http')
              ? settingsData.company_logo
              : baseUrl + settingsData.company_logo)
            : null,
          authorized_signatory: settingsData.authorized_signatory
            ? (settingsData.authorized_signatory.startsWith('http')
              ? settingsData.authorized_signatory
              : baseUrl + settingsData.authorized_signatory)
            : null
        };

        setFilePreviews(imagePreviewsFromAPI);

      } else if (response.data) {
        // Handle direct data response
        const baseUrl = response.data.base_url || '';

        setTimeConfig({
          early_clock_in: parseInt(response.data.early_clock_in) || 15,
          late_arrival: parseInt(response.data.late_arrival) || 15,
          overtime: parseInt(response.data.overtime) || 30
        });

        setCompanyData({
          company_name: response.data.company_name || '',
          company_address: response.data.company_address || '',
          company_number: response.data.company_number || '',
          salary_slip_policy: response.data.salary_slip_policy || '',
          biomatric_api_key: response.data.biomatric_api_key || '',
          biomatric_api_password: response.data.biomatric_api_password || '',
          company_logo: null,
          authorized_signatory: null
        });

        // Handle image previews from direct response
        const imagePreviewsFromAPI = {
          company_logo: response.data.company_logo
            ? (response.data.company_logo.startsWith('http')
              ? response.data.company_logo
              : baseUrl + response.data.company_logo)
            : null,
          authorized_signatory: response.data.authorized_signatory
            ? (response.data.authorized_signatory.startsWith('http')
              ? response.data.authorized_signatory
              : baseUrl + response.data.authorized_signatory)
            : null
        };

        setFilePreviews(imagePreviewsFromAPI);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch software settings');
      }

    } catch (error) {
      console.error("Fetch software settings error:", error);
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

      if (error.response?.status === 401) {
        showToast("Your session has expired. Please login again.", 'error');
        setTimeout(() => logout?.(), 2000);
      } else if (error.response?.status === 403) {
        showToast("You don't have permission to view settings.", 'error');
      } else if (error.response?.status >= 500) {
        showToast("Server error. Please try again later.", 'error');
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [user, logout]);


  // Update settings
  const updateSettings = useCallback(async () => {
    try {
      setUpdateLoading(true);

      if (!user?.user_id) {
        throw new Error('User ID is required');
      }

      const formData = new FormData();
      formData.append('user_id', user.user_id);

      // Time configuration
      formData.append('early_clock_in', timeConfig.early_clock_in.toString());
      formData.append('late_arrival', timeConfig.late_arrival.toString());
      formData.append('overtime', timeConfig.overtime.toString());

      // Company information
      formData.append('company_name', companyData.company_name);
      formData.append('company_address', companyData.company_address);
      formData.append('company_number', companyData.company_number);
      formData.append('salary_slip_policy', companyData.salary_slip_policy);
      formData.append('biomatric_api_key', companyData.biomatric_api_key);
      formData.append('biomatric_api_password', companyData.biomatric_api_password);

      // Images - only append if new files are selected
      if (companyData.company_logo instanceof File) {
        formData.append('company_logo', companyData.company_logo);
      }
      if (companyData.authorized_signatory instanceof File) {
        formData.append('authorized_signatory', companyData.authorized_signatory);
      }

      // If you need to send deletion flags for removed images
      if (!filePreviews.company_logo) {
        formData.append('remove_company_logo', '1');
      }
      if (!filePreviews.authorized_signatory) {
        formData.append('remove_authorized_signatory', '1');
      }

      const response = await api.post('software_setting_update', formData);

      if (response.data?.success) {
        showToast('Settings saved successfully!', 'success');
        // Refresh the data after successful update
        await fetchSettings();
      } else {
        throw new Error(response.data?.message || 'Failed to update software settings');
      }

    } catch (error) {
      console.error("Update software settings error:", error);
      const errorMessage = error.response?.data?.message || error.message || "An unexpected error occurred";

      if (error.response?.status === 401) {
        showToast("Your session has expired. Please login again.", 'error');
        setTimeout(() => logout?.(), 2000);
      } else if (error.response?.status === 403) {
        showToast("You don't have permission to update settings.", 'error');
      } else if (error.response?.status >= 500) {
        showToast("Server error. Please try again later.", 'error');
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setUpdateLoading(false);
    }
  }, [user, logout, timeConfig, companyData, filePreviews, fetchSettings]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleInputChange = (field, value, isTimeConfig = false) => {
    if (isTimeConfig) {
      if (value === '' || value === null || value === undefined) {
        setTimeConfig(prev => ({ ...prev, [field]: 0 }));
        const newErrors = { ...errors };
        delete newErrors[field];
        setErrors(newErrors);
        return;
      }

      let numValue = parseInt(value);
      if (isNaN(numValue) || numValue < 0) {
        numValue = 0;
      }

      const newErrors = { ...errors };
      if (numValue > 480) {
        newErrors[field] = 'Value cannot exceed 480 minutes (8 hours)';
      } else {
        delete newErrors[field];
      }

      setErrors(newErrors);
      setTimeConfig(prev => ({ ...prev, [field]: numValue }));
    } else {
      setCompanyData(prev => ({ ...prev, [field]: value }));
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Enhanced Image Upload Component
  const ImageUploadField = ({ field, label, preview }) => {
    const fieldId = `upload_${field}`;

    return (
      <div>
        <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">{label}</label>
        <div className="relative">
          {!preview ? (
            /* Upload Button when no file */
            <label
              htmlFor={fieldId}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--color-border-secondary)] rounded-xl cursor-pointer bg-[var(--color-bg-gray-light)] hover:bg-[var(--color-bg-hover)] transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center pt-3 pb-3">
                <div className="w-10 h-10 mb-2 bg-[var(--color-blue)] rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[var(--color-text-white)]" />
                </div>
                <p className="mb-1 text-base font-medium text-[var(--color-text-primary)]">Upload {label}</p>
                <p className="text-xs text-[var(--color-text-muted)]">PNG, JPG up to 5MB</p>
              </div>
              <input
                id={fieldId}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(field, e.target.files[0])}
                className="hidden"
              />
            </label>
          ) : (
            /* Preview when file is uploaded */
            <div className="relative w-full h-32 border-2 border-dashed border-[var(--color-border-secondary)] rounded-xl bg-[var(--color-bg-gray-light)] overflow-hidden">
              <div className="relative w-full h-full group">
                <img
                  src={preview}
                  alt={`${label} Preview`}
                  className="w-full h-full object-contain group-hover:opacity-75 transition-opacity duration-200"
                  onError={(e) => {
                    console.error('Image failed to load:', preview);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback for broken images */}
                <div
                  className="w-full h-full bg-[var(--color-bg-hover)] flex items-center justify-center text-[var(--color-text-muted)] text-sm"
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
                      handleImagePreview(preview, label);
                    }}
                    className="bg-[var(--color-bg-secondary)] bg-opacity-90 hover:bg-opacity-100 text-[var(--color-text-primary)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                    title="Preview image"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileDelete(field);
                    }}
                    className="bg-[var(--color-error)] hover:bg-[var(--color-error-dark)] text-[var(--color-text-white)] rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
                    title="Remove image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Preview Modal Component
  const PreviewModal = () => {
    if (!showPreviewModal || !previewImage) return null;

    return (
      <div
        className="fixed inset-0 bg-[var(--color-modal-overlay)] backdrop-blur-sm flex items-center justify-center z-50"
        onClick={closePreviewModal}
      >
        <div className="relative bg-[var(--color-modal-bg)] rounded-2xl shadow-2xl max-w-2xl max-h-[85vh] m-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[var(--color-border-divider)] bg-[var(--color-blue-lightest)]">
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center">
              <Eye className="w-5 h-5 mr-2 text-[var(--color-blue)]" />
              {previewTitle}
            </h3>
            <button
              onClick={closePreviewModal}
              className="p-2 hover:bg-[var(--color-bg-hover)] rounded-full transition-all duration-200 group"
              title="Close preview"
            >
              <X className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] group-hover:rotate-90 transition-all duration-200" />
            </button>
          </div>

          {/* Image Content */}
          <div className="p-6 flex items-center justify-center bg-[var(--color-bg-gray-light)] min-h-[300px]">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-lg border border-[var(--color-border-secondary)]"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-[var(--color-bg-gray-light)] border-t border-[var(--color-border-divider)]">
            <p className="text-xs text-[var(--color-text-muted)] text-center">Click outside to close or use the × button</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* Toast Component */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {/* Preview Modal */}
      <PreviewModal />

      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white-90)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-[var(--color-text-white)]" />
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-text-white)]">Settings</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-[var(--color-border-divider)]">
            <button
              onClick={() => setActiveTab('company')}
              className={`px-6 py-4 font-medium ${activeTab === 'company'
                ? 'border-b-2 border-[var(--color-blue)] text-[var(--color-blue)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-blue)]'
                }`}
            >
              <Building className="w-4 h-4 inline mr-2" />
              Company Info
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`px-6 py-4 font-medium ${activeTab === 'time'
                ? 'border-b-2 border-[var(--color-blue)] text-[var(--color-blue)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-blue)]'
                }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Time Configuration
            </button>
          </div>
        </div>

        {/* Company Info Tab */}
        {activeTab === 'company' && (
          <div className="bg-[var(--color-bg-secondary)] rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-border-focus)]"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Company Number</label>
                <input
                  type="text"
                  value={companyData.company_number}
                  onChange={(e) => handleInputChange('company_number', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-border-focus)]"
                  placeholder="Enter company number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Company Address</label>
                <textarea
                  value={companyData.company_address}
                  onChange={(e) => handleInputChange('company_address', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-border-focus)]"
                  placeholder="Enter company address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Biometric API Key</label>
                <input
                  type="text"
                  value={companyData.biomatric_api_key}
                  onChange={(e) => handleInputChange('biomatric_api_key', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-border-focus)]"
                  placeholder="Enter API key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Biometric API Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={companyData.biomatric_api_password}
                    onChange={(e) => handleInputChange('biomatric_api_password', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-[var(--color-border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-border-focus)]"
                    placeholder="Enter API password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Salary Slip Policy</label>
                <textarea
                  value={companyData.salary_slip_policy}
                  onChange={(e) => handleInputChange('salary_slip_policy', e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-[var(--color-border-secondary)] rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-border-focus)]"
                  placeholder="Enter salary slip policy"
                />
              </div>

              {/* Enhanced File Uploads */}
              <ImageUploadField
                field="company_logo"
                label="Company Logo"
                currentFile={companyData.company_logo}
                preview={filePreviews.company_logo}
              />

              <ImageUploadField
                field="authorized_signatory"
                label="Authorized Signatory"
                currentFile={companyData.authorized_signatory}
                preview={filePreviews.authorized_signatory}
              />
            </div>
          </div>
        )}

        {/* Time Configuration Tab */}
        {activeTab === 'time' && (
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { key: 'early_clock_in', title: 'Early Clock-In', desc: 'Maximum time employees can clock in early', color: 'success' },
              { key: 'late_arrival', title: 'Late Arrival', desc: 'Grace period for late arrivals', color: 'warning' },
              { key: 'overtime', title: 'Overtime', desc: 'Minimum extra time for overtime compensation', color: 'blue' }
            ].map(({ key, title, desc, color }) => (
              <div key={key} className="bg-[var(--color-bg-secondary)] rounded-lg shadow-sm p-6">
                <div className={`flex items-center gap-3 mb-4`}>
                  <div className={`p-2 ${color === 'success' ? 'bg-[var(--color-success-light)]' :
                      color === 'warning' ? 'bg-[var(--color-warning-light)]' :
                        'bg-[var(--color-blue-lightest)]'
                    } rounded-lg`}>
                    <Clock className={`w-5 h-5 ${color === 'success' ? 'text-[var(--color-success)]' :
                        color === 'warning' ? 'text-[var(--color-warning-dark)]' :
                          'text-[var(--color-blue)]'
                      }`} />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
                </div>

                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-[var(--color-blue)]">{formatTime(timeConfig[key])}</div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="480"
                    value={timeConfig[key] === 0 ? '' : timeConfig[key]}
                    onChange={(e) => handleInputChange(key, e.target.value, true)}
                    onKeyDown={(e) => {
                      if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault();
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-border-focus)] ${errors[key] ? 'border-[var(--color-border-error)]' : 'border-[var(--color-border-secondary)]'
                      }`}
                  />
                  {errors[key] && (
                    <div className="text-[var(--color-text-error)] text-sm mt-1">{errors[key]}</div>
                  )}
                </div>

                <p className="text-xs text-[var(--color-text-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={updateSettings}
            disabled={Object.keys(errors).length > 0 || updateLoading}
            className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${Object.keys(errors).length > 0 || updateLoading
              ? 'bg-[var(--color-bg-gray-light)] text-[var(--color-text-muted)] cursor-not-allowed'
              : 'bg-[var(--color-blue)] hover:bg-[var(--color-blue-dark)] text-[var(--color-text-white)]'
              }`}
          >
            {updateLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-text-white)]"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsComponent;