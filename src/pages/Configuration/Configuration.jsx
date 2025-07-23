import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Save, ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import { Toast } from '../../Components/ui/Toast'; // Adjust path as needed
import { useNavigate } from 'react-router-dom';

const TimeConfigurationComponent = () => {
  const { user, logout } = useAuth();

  const [config, setConfig] = useState({
    earlyTimeMin: 15,
    lateTimeMin: 15,
    overtimeMin: 30
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [toast, setToast] = useState(null);
  console.log("📦 Configuration component loaded");
  // Show toast function
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Close toast function
  const closeToast = () => {
    setToast(null);
  };

  // Fetch software settings
  const fetchSoftwareSettings = useCallback(async () => {
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

        // Map API response to component state
        setConfig({
          earlyTimeMin: parseInt(settingsData.early_clock_in) || 15,
          lateTimeMin: parseInt(settingsData.late_arrival) || 15,
          overtimeMin: parseInt(settingsData.overtime) || 30
        });
      } else if (response.data) {
        // Handle direct data response
        setConfig({
          earlyTimeMin: parseInt(response.data.early_clock_in) || 15,
          lateTimeMin: parseInt(response.data.late_arrival) || 15,
          overtimeMin: parseInt(response.data.overtime) || 30
        });
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

  // Update software settings
  const updateSoftwareSettings = useCallback(async () => {
    try {
      setUpdateLoading(true);

      if (!user?.user_id) {
        throw new Error('User ID is required');
      }

      const formData = new FormData();
      formData.append('user_id', user.user_id);
      formData.append('early_clock_in', config.earlyTimeMin.toString());
      formData.append('late_arrival', config.lateTimeMin.toString());
      formData.append('overtime', config.overtimeMin.toString());

      const response = await api.post('software_setting_update', formData);

      if (response.data?.success) {
        showToast('Configuration saved successfully!', 'success');
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
  }, [user, logout, config]);

  // Fetch settings on component mount
  useEffect(() => {
    fetchSoftwareSettings();
  }, [fetchSoftwareSettings]);

  const handleInputChange = (field, value) => {
    // Handle empty string or invalid input
    if (value === '' || value === null || value === undefined) {
      setConfig(prev => ({
        ...prev,
        [field]: 0
      }));
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
      return;
    }

    // Parse the value and ensure it's not negative
    let numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0;
    }

    // Validation
    const newErrors = { ...errors };
    if (numValue > 480) { // 8 hours max
      newErrors[field] = 'Value cannot exceed 480 minutes (8 hours)';
    } else {
      delete newErrors[field];
    }

    setErrors(newErrors);
    setConfig(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSave = () => {
    if (Object.keys(errors).length === 0) {
      updateSoftwareSettings();
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-blue-dark)] mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading settings...</p>
        </div>
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

      <div className="p-6 max-w-7xl mx-auto">
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
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg">
                      <Settings className="w-6 h-6 text-[var(--color-text-white)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--color-text-white)]">Time Configuration</h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Early Time Configuration */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="w-5 h-5 text-[var(--color-success-dark)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Early Clock-In</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Tolerance Period</p>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-[var(--color-blue-dark)]">{formatTime(config.earlyTimeMin)}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Current Setting</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="480"
                  value={config.earlyTimeMin === 0 ? '' : config.earlyTimeMin}
                  onChange={(e) => handleInputChange('earlyTimeMin', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)] ${errors.earlyTimeMin ? 'border-red-500' : 'border-[var(--color-border-secondary)]'
                    }`}
                />
                {errors.earlyTimeMin && (
                  <div className="text-[var(--color-text-error)] text-sm mt-1">
                    {errors.earlyTimeMin}
                  </div>
                )}
              </div>

              <p className="text-xs text-[var(--color-text-secondary)]">Maximum time employees can clock in early without penalty</p>
            </div>
          </div>

          {/* Late Time Configuration */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Late Arrival</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Grace Period</p>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-[var(--color-blue-dark)]">{formatTime(config.lateTimeMin)}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Current Setting</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="480"
                  value={config.lateTimeMin === 0 ? '' : config.lateTimeMin}
                  onChange={(e) => handleInputChange('lateTimeMin', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)] ${errors.lateTimeMin ? 'border-red-500' : 'border-[var(--color-border-secondary)]'
                    }`}
                />
                {errors.lateTimeMin && (
                  <div className="text-[var(--color-text-error)] text-sm mt-1">
                    {errors.lateTimeMin}
                  </div>
                )}
              </div>

              <p className="text-xs text-[var(--color-text-secondary)]">Grace period for late arrivals before marking as tardy</p>
            </div>
          </div>

          {/* Overtime Configuration */}
          <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--color-blue-lighter)] rounded-lg">
                  <Clock className="w-5 h-5 text-[var(--color-blue-dark)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">Overtime</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">Threshold</p>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-[var(--color-blue-dark)]">{formatTime(config.overtimeMin)}</div>
                <div className="text-xs text-[var(--color-text-secondary)]">Current Setting</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="480"
                  value={config.overtimeMin === 0 ? '' : config.overtimeMin}
                  onChange={(e) => handleInputChange('overtimeMin', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)] ${errors.overtimeMin ? 'border-red-500' : 'border-[var(--color-border-secondary)]'
                    }`}
                />
                {errors.overtimeMin && (
                  <div className="text-[var(--color-text-error)] text-sm mt-1">
                    {errors.overtimeMin}
                  </div>
                )}
              </div>

              <p className="text-xs text-[var(--color-text-secondary)]">Minimum extra time worked to qualify for overtime compensation</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end pt-6 border-t border-[var(--color-border-primary)]">
          <button
            onClick={handleSave}
            disabled={Object.keys(errors).length > 0 || updateLoading}
            className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${Object.keys(errors).length > 0 || updateLoading
              ? 'bg-gray-300 text-[var(--color-text-secondary)] cursor-not-allowed'
              : 'bg-[var(--color-blue-dark)] hover:bg-[var(--color-blue-darker)] text-[var(--color-text-white)]'
              }`}
          >
            {updateLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-border-primary)]"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Configuration
              </>
            )}
          </button>
        </div>

        {/* Summary */}
        <div className="mt-8 bg-[var(--color-blue-lightest)] border border-[var(--color-blue-light)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-blue-dark)]" />
            Configuration Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-blue-light)]">
              <div className="text-sm text-[var(--color-text-secondary)] mb-1">Early Time Tolerance</div>
              <div className="text-xl font-bold text-[var(--color-blue-dark)]">{formatTime(config.earlyTimeMin)}</div>
            </div>
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-blue-light)]">
              <div className="text-sm text-[var(--color-text-secondary)] mb-1">Late Time Grace Period</div>
              <div className="text-xl font-bold text-[var(--color-blue-dark)]">{formatTime(config.lateTimeMin)}</div>
            </div>
            <div className="bg-[var(--color-bg-secondary)] rounded-lg p-4 border border-[var(--color-blue-light)]">
              <div className="text-sm text-[var(--color-text-secondary)] mb-1">Overtime Threshold</div>
              <div className="text-xl font-bold text-[var(--color-blue-dark)]">{formatTime(config.overtimeMin)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeConfigurationComponent;