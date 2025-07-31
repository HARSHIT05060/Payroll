// src/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { clearPermissions } from '../redux/permissionsSlice';
import { ThemeToggle } from '../context/Themetoggle';
import { ConfirmDialog } from './ui/ConfirmDialog';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const dropdownRef = useRef(null);
    const dispatch = useDispatch();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle logout initiation
    const handleLogoutClick = () => {
        setIsDropdownOpen(false);
        setShowLogoutDialog(true);
    };

    // Handle logout confirmation
    const handleLogoutConfirm = () => {
        logout();
        dispatch(clearPermissions());
        setShowLogoutDialog(false);
    };

    // Handle logout cancellation
    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };

    // Get user initials for avatar
    const getUserInitials = (name) => {
        if (!name || name === 'Unknown User') return 'U';
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <>
            <div className="fixed top-0 left-0 right-0 flex items-center justify-between w-full h-16 px-6 bg-[var(--color-bg-secondary)] border-b border-[var(--color-border-primary)] z-50 shadow-sm">
                {/* Left side - Logo/Brand */}
                <div className="flex items-center">
                    <h1 className="text-xl font-bold text-[var(--color-text-primary)]">Attendance System</h1>
                </div>

                {/* Right side - User menu */}
                <div className="flex items-center space-x-4">
                    <ThemeToggle />
                    {/* Notifications */}
                    <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-gradient-start)] rounded-full transition-colors">
                        <Bell size={20} />
                        {/* Notification badge */}
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-error-light)]0 rounded-full"></span>
                    </button>

                    {/* User Profile Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-[var(--color-bg-gradient-start)] transition-colors"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {/* User Avatar */}
                            <div className="w-8 h-8 bg-[var(--color-blue)] rounded-full flex items-center justify-center text-[var(--color-text-white)] text-sm font-semibold">
                                {getUserInitials(user?.full_name)}
                            </div>

                            {/* User Name */}
                            <span className="text-[var(--color-text-secondary)] font-medium hidden sm:inline-block max-w-32 truncate">
                                {user?.full_name || user?.name || user?.username || 'User'}
                            </span>

                            {/* Dropdown Arrow */}
                            <ChevronDown
                                size={16}
                                className={`text-[var(--color-text-secondary)] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 top-12 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-lg shadow-lg w-80 overflow-hidden">
                                {/* User Info Header */}
                                <div className="px-4 py-3 bg-[var(--color-bg-primary)] border-b">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-[var(--color-blue)] rounded-full flex items-center justify-center text-[var(--color-text-white)] font-semibold">
                                            {getUserInitials(user?.full_name)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-800">
                                                {user?.full_name || user?.name || user?.username || 'User'}
                                            </h3>
                                            <p className="text-sm text-[var(--color-text-secondary)]">
                                                {user?.email || user?.username || user?.number || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* User Details */}
                                <div className="px-4 py-3 border-b">
                                    <h4 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2">Account Details</h4>
                                    <div className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                                        <div className="flex justify-between">
                                            <span>User ID:</span>
                                            <span className="font-mono">{user?.user_id || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Username:</span>
                                            <span className="font-mono">{user?.username || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Phone:</span>
                                            <span className="font-mono">{user?.number || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Sub Status:</span>
                                            <span className="font-mono">{user?.subscriptions_status || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Expire In:</span>
                                            <span className="font-mono">{user?.subscriptions_days || 'N/A'}</span>
                                        </div>
                                        {user?.email && (
                                            <div className="flex justify-between">
                                                <span>Email:</span>
                                                <span className="font-mono truncate ml-2">{user.email}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Menu Actions */}
                                <div className="py-2">
                                    <button className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-gradient-start)] flex items-center space-x-2">
                                        <Settings size={16} />
                                        <span>Settings</span>
                                    </button>

                                    <button
                                        onClick={handleLogoutClick}
                                        className="w-full px-4 py-2 text-left text-sm text-[var(--color-text-error)] hover:bg-[var(--color-error-light)] flex items-center space-x-2"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showLogoutDialog}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to logout? You will need to sign in again to access your account."
                confirmText="Yes, Logout"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
};

export default Navbar;