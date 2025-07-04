import React, { useState, useMemo } from "react";
import { Trash2, Users, AlertTriangle, X, Search } from "lucide-react";
import { useSelector } from 'react-redux';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import DepartmentForm from "./DepartmentForm";
import useDepartments from "../../hooks/useDepartments";

const DepartmentList = () => {
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null,
        data: null
    });
    const permissions = useSelector(state => state.permissions) || {};

    const {
        departments,
        loading,
        addDepartment,
        deleteDepartment,
    } = useDepartments();

    // eslint-disable-next-line no-unused-vars
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleAddDepartment = async (name) => {
        const result = await addDepartment(name);
        return result;
    };

    const handleDeleteDepartment = async (id) => {
        const result = await deleteDepartment(id);
        if (result && result.success) {
            showToast("Department deleted successfully!", "success");
        } else {
            showToast("Failed to delete department. Please try again.", "error");
        }
    };

    // Real-time search filtering using useMemo for performance
    const filteredDepartments = useMemo(() => {
        if (!departments || !searchTerm.trim()) {
            return departments || [];
        }

        return departments.filter(department =>
            department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [departments, searchTerm]);

    const handleDeleteClick = (department) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            data: department
        });
    };

    const confirmDeleteDepartment = async () => {
        const department = confirmModal.data;
        if (!department) return;
        const departmentId = department.department_id || department.id;
        setDeletingId(departmentId);
        try {
            await handleDeleteDepartment(departmentId);
        } catch (error) {
            showToast("An error occurred while deleting the department.", error);
        } finally {
            setDeletingId(null);
            closeModal();
        }
    };

    const closeModal = () => {
        if (!deletingId) {
            setConfirmModal({ isOpen: false, type: null, data: null });
        }
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Departments
                            </h3>
                        </div>
                    </div>
                    <div className="h-1 bg-blue-700"></div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading departments...</span>
                </div>
            </div>
        );
    }

    const totalDepartments = departments ? departments.length : 0;
    const filteredCount = filteredDepartments.length;

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-blue-600 overflow-hidden">
                <div className="relative">
                    <div className="bg-blue-600 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">
                                        Departments ({totalDepartments})
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50/10 to-white flex flex-col gap-4">
                    {permissions['department_create'] &&
                        <DepartmentForm
                            onSubmit={handleAddDepartment}
                            loading={loading}
                            showToast={showToast}
                        />
                    }
                    {totalDepartments === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                No departments found
                            </h4>
                            <p className="text-gray-500 mb-1">
                                Get started by adding your first department
                            </p>
                            <p className="text-sm text-gray-400">
                                Use the form above to create a new department
                            </p>
                        </div>
                    ) : filteredCount === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-blue-500" />
                            </div>
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                No departments match your search
                            </h4>
                            <p className="text-gray-500 mb-4">
                                Try adjusting your search terms or
                            </p>
                            <button
                                onClick={clearSearch}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredDepartments.map((department) => {
                                const departmentId = department.department_id || department.id;
                                const isDeleting = deletingId === departmentId;

                                return (
                                    <div
                                        key={departmentId}
                                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-blue-50/20 to-indigo-50/20 hover:from-blue-50/40 hover:to-indigo-50/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="p-1.5 bg-blue-100 rounded-md">
                                                        <Users className="w-4 h-4 text-blue-600" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-gray-900 truncate">
                                                        {department.name}
                                                    </h4>
                                                </div>

                                                {department.description && (
                                                    <p className="text-gray-600 mb-2 text-sm leading-relaxed pl-7">
                                                        {department.description}
                                                    </p>
                                                )}
                                            </div>
                                            {permissions['department_delete'] &&
                                                <button
                                                    onClick={() => handleDeleteClick(department)}
                                                    disabled={isDeleting}
                                                    className="ml-4 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                                                    title="Delete department"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            }
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen && confirmModal.type === 'delete'}
                onClose={closeModal}
                onConfirm={confirmDeleteDepartment}
                title="Delete Department"
                message={`Are you sure you want to delete "${confirmModal.data?.name || 'this Department'}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
};

export default DepartmentList;