import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronDown,
    X,
    CheckCircle,
    AlertCircle,
    Clock,
    Activity,
    Coffee,
    Calendar
} from 'lucide-react';

// Searchable Dropdown Component
const SearchableDropdown = ({
    options,
    value,
    onChange,
    placeholder,
    disabled,
    displayKey = 'name',
    valueKey = 'id',
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option[displayKey].toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedOption = options.find(option => option[valueKey] === value);
    const displayText = selectedOption ? selectedOption[displayKey] : '';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm('');
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option[valueKey]);
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
    };

    const handleClear = () => {
        onChange('');
        setSearchTerm('');
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div
                className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent text-gray-900 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !disabled && setIsOpen(true)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        {isOpen ? (
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent outline-none"
                                placeholder={placeholder}
                                autoFocus
                            />
                        ) : (
                            <span className={displayText ? 'text-gray-900' : 'text-gray-500'}>
                                {displayText || placeholder}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {value && !disabled && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClear();
                                }}
                                className="p-1 hover:bg-gray-100 rounded"
                            >
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        )}
                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.length === 0 ? (
                        <div className="px-3 py-2 text-gray-500 text-sm">
                            No options found
                        </div>
                    ) : (
                        filteredOptions.map((option, index) => (
                            <div
                                key={option[valueKey]}
                                className={`px-3 py-2 cursor-pointer text-sm transition-colors ${index === highlightedIndex
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                                onClick={() => handleSelect(option)}
                            >
                                {option[displayKey]}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Enhanced StatusBadge component with weekoff support
const StatusBadge = ({ status }) => {
    const statusLower = status?.toLowerCase() || '';

    const getStatusStyle = () => {
        switch (statusLower) {
            case 'present':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'absent':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'weekoff':
            case 'week-off':
            case 'week off':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'holiday':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'leave':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'half day':
            case 'half-day':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = () => {
        switch (statusLower) {
            case 'present':
                return <CheckCircle className="h-3 w-3" />;
            case 'absent':
                return <AlertCircle className="h-3 w-3" />;
            case 'weekoff':
            case 'week-off':
            case 'week off':
                return <Coffee className="h-3 w-3" />;
            case 'holiday':
                return <Calendar className="h-3 w-3" />;
            case 'leave':
                return <Clock className="h-3 w-3" />;
            case 'half day':
            case 'half-day':
                return <Activity className="h-3 w-3" />;
            default:
                return null;
        }
    };

    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyle()}`}>
            {getStatusIcon()}
            {status || 'N/A'}
        </span>
    );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon: Icon, color, percentage }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                {percentage && (
                    <p className="text-xs text-gray-500 mt-1">
                        {percentage}% of total days
                    </p>
                )}
            </div>
            {Icon && (
                <div className={`p-3 rounded-full ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                </div>
            )}
        </div>
    </div>
);

export { SearchableDropdown, StatusBadge, SummaryCard };