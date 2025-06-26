import React, { useState } from 'react';
import { Clock, Save, RotateCcw } from 'lucide-react';

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
      setTimeout(() => setIsSaved(false), 2000);
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
    <div className="max-w-7xl mx-auto m-8 p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-semibold text-gray-800">Time Configuration</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Early Time Configuration */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Early Time Tolerance (Minutes)
          </label>
          <input
            type="number"
            min="0"
            max="480"
            value={config.earlyTimeMin}
            onChange={(e) => handleInputChange('earlyTimeMin', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.earlyTimeMin ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.earlyTimeMin && (
            <p className="text-red-500 text-sm mt-1">{errors.earlyTimeMin}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Maximum time an employee can clock in early without penalty
          </p>
        </div>

        {/* Late Time Configuration */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Late Time Tolerance (Minutes)
          </label>
          <input
            type="number"
            min="0"
            max="480"
            value={config.lateTimeMin}
            onChange={(e) => handleInputChange('lateTimeMin', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lateTimeMin ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lateTimeMin && (
            <p className="text-red-500 text-sm mt-1">{errors.lateTimeMin}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Grace period for late arrivals before marking as late
          </p>
        </div>

        {/* Overtime Configuration */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Overtime Threshold (Minutes)
          </label>
          <input
            type="number"
            min="0"
            max="480"
            value={config.overtimeMin}
            onChange={(e) => handleInputChange('overtimeMin', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.overtimeMin ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.overtimeMin && (
            <p className="text-red-500 text-sm mt-1">{errors.overtimeMin}</p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Minimum extra time worked to qualify for overtime pay
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>

        <button
          onClick={handleSave}
          disabled={Object.keys(errors).length > 0}
          className={`flex items-center gap-2 px-6 py-2 rounded-md transition-all duration-200 ${
            Object.keys(errors).length > 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isSaved
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          <Save className="w-4 h-4" />
          {isSaved ? 'Saved!' : 'Save Configuration'}
        </button>
      </div>

      {/* Configuration Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current Configuration Summary:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Early Time:</span>
            <span className="font-medium text-blue-700">{formatTime(config.earlyTimeMin)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Late Time:</span>
            <span className="font-medium text-blue-700">{formatTime(config.lateTimeMin)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Overtime:</span>
            <span className="font-medium text-blue-700">{formatTime(config.overtimeMin)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeConfigurationComponent;