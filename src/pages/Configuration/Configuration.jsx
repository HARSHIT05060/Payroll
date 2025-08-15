import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Save, Building, Upload, X, Settings, ArrowLeft, Eye, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { Toast } from '../../Components/ui/Toast';
import { useNavigate } from 'react-router-dom';

const SettingsComponent = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('company');
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [toast, setToast] = useState(null);

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
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
          {!preview ? (
            /* Upload Button when no file */
            <label
              htmlFor={fieldId}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all duration-300"
            >
              <div className="flex flex-col items-center justify-center pt-3 pb-3">
                <div className="w-10 h-10 mb-2 bg-blue-500 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <p className="mb-1 text-base font-medium text-gray-900">Upload {label}</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
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
            <div className="relative w-full h-32 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 overflow-hidden">
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
                  className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm"
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
                    className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
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
                    className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200"
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
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={closePreviewModal}
      >
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl max-h-[85vh] m-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              {previewTitle}
            </h3>
            <button
              onClick={closePreviewModal}
              className="p-2 hover:bg-gray-200 rounded-full transition-all duration-200 group"
              title="Close preview"
            >
              <X className="w-5 h-5 text-gray-500 group-hover:text-gray-700 group-hover:rotate-90 transition-all duration-200" />
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

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">Click outside to close or use the × button</p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg backdrop-blur-sm"
              >
                <ArrowLeft size={18} />
                Back
              </button>
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-2xl font-bold text-white">Settings</h1>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('company')}
              className={`px-6 py-4 font-medium ${activeTab === 'company'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              <Building className="w-4 h-4 inline mr-2" />
              Company Info
            </button>
            <button
              onClick={() => setActiveTab('time')}
              className={`px-6 py-4 font-medium ${activeTab === 'time'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
                }`}
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Time Configuration
            </button>
          </div>
        </div>

        {/* Company Info Tab */}
        {activeTab === 'company' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={companyData.company_name}
                  onChange={(e) => handleInputChange('company_name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Number</label>
                <input
                  type="text"
                  value={companyData.company_number}
                  onChange={(e) => handleInputChange('company_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter company number"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Address</label>
                <textarea
                  value={companyData.company_address}
                  onChange={(e) => handleInputChange('company_address', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter company address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biometric API Key</label>
                <input
                  type="text"
                  value={companyData.biomatric_api_key}
                  onChange={(e) => handleInputChange('biomatric_api_key', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter API key"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biometric API Password</label>
                <input
                  type="password"
                  value={companyData.biomatric_api_password}
                  onChange={(e) => handleInputChange('biomatric_api_password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter API password"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Slip Policy</label>
                <textarea
                  value={companyData.salary_slip_policy}
                  onChange={(e) => handleInputChange('salary_slip_policy', e.target.value)}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              { key: 'early_clock_in', title: 'Early Clock-In', desc: 'Maximum time employees can clock in early', color: 'green' },
              { key: 'late_arrival', title: 'Late Arrival', desc: 'Grace period for late arrivals', color: 'yellow' },
              { key: 'overtime', title: 'Overtime', desc: 'Minimum extra time for overtime compensation', color: 'blue' }
            ].map(({ key, title, desc, color }) => (
              <div key={key} className="bg-white rounded-lg shadow-sm p-6">
                <div className={`flex items-center gap-3 mb-4`}>
                  <div className={`p-2 bg-${color}-100 rounded-lg`}>
                    <Clock className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>

                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-blue-600">{formatTime(timeConfig[key])}</div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="480"
                    value={timeConfig[key] === 0 ? '' : timeConfig[key]}
                    onChange={(e) => handleInputChange(key, e.target.value, true)}
                    onKeyDown={(e) => {
                      if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault();
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors[key] ? 'border-red-500' : 'border-gray-300'
                      }`}
                  />
                  {errors[key] && (
                    <div className="text-red-500 text-sm mt-1">{errors[key]}</div>
                  )}
                </div>

                <p className="text-xs text-gray-500">{desc}</p>
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
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
          >
            {updateLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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