import React, { useState } from 'react';
import { Clock, Save, RotateCcw, Settings, CheckCircle2, AlertCircle } from 'lucide-react';

const TimeConfigurationComponent = () => {
  const [config, setConfig] = useState({
    earlyTimeMin: 15,
    lateTimeMin: 15,
    overtimeMin: 30
  });

  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    
    // Validation
    const newErrors = { ...errors };
    if (numValue < 0) {
      newErrors[field] = 'Value cannot be negative';
    } else if (numValue > 480) { // 8 hours max
      newErrors[field] = 'Value cannot exceed 480 minutes (8 hours)';
    } else {
      delete newErrors[field];
    }
    
    setErrors(newErrors);
    setConfig(prev => ({
      ...prev,
      [field]: numValue
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    if (Object.keys(errors).length === 0) {
      // Here you would typically save to your backend/database
      console.log('Saving configuration:', config);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleReset = () => {
    setConfig({
      earlyTimeMin: 15,
      lateTimeMin: 15,
      overtimeMin: 30
    });
    setErrors({});
    setIsSaved(false);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Time Configuration</h2>
        </div>
        <p className="text-gray-600">Manage attendance policies and overtime settings for your organization</p>
      </div>

      {/* Success Message */}
      {isSaved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Configuration saved successfully!</span>
          </div>
        </div>
      )}

      {/* Configuration Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Early Time Configuration */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Early Clock-In</h3>
                <p className="text-sm text-gray-600">Tolerance Period</p>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600">{formatTime(config.earlyTimeMin)}</div>
              <div className="text-xs text-gray-500">Current Setting</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
              <input
                type="number"
                min="0"
                max="480"
                value={config.earlyTimeMin}
                onChange={(e) => handleInputChange('earlyTimeMin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.earlyTimeMin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.earlyTimeMin && (
                <div className="flex items-center gap-1 mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.earlyTimeMin}</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-600">Maximum time employees can clock in early without penalty</p>
          </div>
        </div>

        {/* Late Time Configuration */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Late Arrival</h3>
                <p className="text-sm text-gray-600">Grace Period</p>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600">{formatTime(config.lateTimeMin)}</div>
              <div className="text-xs text-gray-500">Current Setting</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
              <input
                type="number"
                min="0"
                max="480"
                value={config.lateTimeMin}
                onChange={(e) => handleInputChange('lateTimeMin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.lateTimeMin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lateTimeMin && (
                <div className="flex items-center gap-1 mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.lateTimeMin}</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-600">Grace period for late arrivals before marking as tardy</p>
          </div>
        </div>

        {/* Overtime Configuration */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Overtime</h3>
                <p className="text-sm text-gray-600">Threshold</p>
              </div>
            </div>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600">{formatTime(config.overtimeMin)}</div>
              <div className="text-xs text-gray-500">Current Setting</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
              <input
                type="number"
                min="0"
                max="480"
                value={config.overtimeMin}
                onChange={(e) => handleInputChange('overtimeMin', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.overtimeMin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.overtimeMin && (
                <div className="flex items-center gap-1 mt-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errors.overtimeMin}</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-600">Minimum extra time worked to qualify for overtime compensation</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>

        <button
          onClick={handleSave}
          disabled={Object.keys(errors).length > 0}
          className={`flex items-center gap-2 px-6 py-2 rounded-md font-medium transition-colors ${
            Object.keys(errors).length > 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isSaved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Save className="w-4 h-4" />
          {isSaved ? 'Saved!' : 'Save Configuration'}
        </button>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Configuration Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Early Time Tolerance</div>
            <div className="text-xl font-bold text-blue-600">{formatTime(config.earlyTimeMin)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Late Time Grace Period</div>
            <div className="text-xl font-bold text-blue-600">{formatTime(config.lateTimeMin)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Overtime Threshold</div>
            <div className="text-xl font-bold text-blue-600">{formatTime(config.overtimeMin)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeConfigurationComponent;