import React, { useState, useMemo } from "react";
import { Trash2, MapPin, Building2, AlertTriangle, X, Search } from "lucide-react";
import { useSelector } from 'react-redux';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import BranchForm from "./BranchForm";
import useBranches from "../../hooks/useBranches";

const BranchList = () => {
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null,
        data: null
    });
    const permissions = useSelector(state => state.permissions) || {};

    const {
        branches,
        loading,
        addBranch,
        deleteBranch,
    } = useBranches();

    // eslint-disable-next-line no-unused-vars
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleAddBranch = async (name) => {
        const result = await addBranch(name);
        return result;
    };

    const handleDeleteBranch = async (id) => {
        const result = await deleteBranch(id);
        if (result && result.success) {
            showToast("Branch deleted successfully!", "success");
        } else {
            showToast("Failed to delete branch. Please try again.", "error");
        }
    };



    // Real-time search filtering using useMemo for performance
    const filteredBranches = useMemo(() => {
        if (!branches || !searchTerm.trim()) {
            return branches || [];
        }

        return branches.filter(branch =>
            branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (branch.description && branch.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (branch.location && branch.location.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [branches, searchTerm]);

    const handleDeleteClick = (branch) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            data: branch
        });
    };

    const confirmDeleteBranch = async () => {
        const branch = confirmModal.data;
        if (!branch) return;
        const branchId = branch.branch_id || branch.id;
        setDeletingId(branchId);
        try {
            await handleDeleteBranch(branchId);
        } catch (error) {
            showToast("An error occurred while deleting the branch.", error);
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
            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-border-primary)] overflow-hidden">
                <div className="relative">
                    <div className="bg-gradient-to-r from-[var(--color-blue)] to-[var(--color-blue-dark)] px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-[var(--color-bg-secondary-20)] rounded-lg">
                                <Building2 className="w-5 h-5 text-[var(--color-text-white)]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--color-text-white)]">
                                Branches
                            </h3>
                        </div>
                    </div>
                    <div className="h-1 bg-[var(--color-blue-darker)]"></div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-blue-dark)]"></div>
                    <span className="ml-3 text-[var(--color-text-secondary)]">Loading branches...</span>
                </div>
            </div>
        );
    }

    const totalBranches = branches ? branches.length : 0;
    const filteredCount = filteredBranches.length;

    return (
        <>
            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-blue-dark)] overflow-hidden ">
                <div className="relative">
                    <div className="bg-[var(--color-blue-dark)] px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-[var(--color-bg-secondary-20)] rounded-lg">
                                    <Building2 className="w-5 h-5 text-[var(--color-text-white)]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--color-text-white)]">
                                        Branches ({totalBranches})
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-blue-50/10 to-white flex flex-col gap-4">
                    {permissions['branch_create'] &&
                        <BranchForm
                            onSubmit={handleAddBranch}
                            loading={loading}
                            showToast={showToast}
                        />
                    }
                    {totalBranches === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-[var(--color-blue-lighter)] rounded-full flex items-center justify-center mb-4">
                                <Building2 className="w-8 h-8 text-[var(--color-blue)]" />
                            </div>
                            <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                                No branches found
                            </h4>
                            <p className="text-[var(--color-text-secondary)] mb-1">
                                Get started by adding your first branch
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Use the form above to create a new branch
                            </p>
                        </div>
                    ) : filteredCount === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-[var(--color-blue-lighter)] rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-[var(--color-blue)]" />
                            </div>
                            <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                                No branches match your search
                            </h4>
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                Try adjusting your search terms or
                            </p>
                            <button
                                onClick={clearSearch}
                                className="inline-flex items-center px-4 py-2 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] font-medium rounded-lg hover:bg-[var(--color-blue-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-blue)] transition-colors"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Clear Search
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredBranches.map((branch) => {
                                const branchId = branch.branch_id || branch.id;
                                const isDeleting = deletingId === branchId;

                                return (
                                    <div
                                        key={branchId}
                                        className="border border-[var(--color-border-primary)] rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-blue-50/20 to-indigo-50/20 hover:from-blue-50/40 hover:to-indigo-50/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="p-1.5 bg-[var(--color-blue-lighter)] rounded-md">
                                                        <Building2 className="w-4 h-4 text-[var(--color-blue-dark)]" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-[var(--color-text-primary)] truncate">
                                                        {branch.name}
                                                    </h4>
                                                </div>

                                                {branch.description && (
                                                    <p className="text-[var(--color-text-secondary)] mb-2 text-sm leading-relaxed pl-7">
                                                        {branch.description}
                                                    </p>
                                                )}

                                                {branch.location && (
                                                    <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-2 pl-7">
                                                        <MapPin className="w-4 h-4 mr-1 text-[var(--color-blue)]" />
                                                        {branch.location}
                                                    </div>
                                                )}
                                            </div>
                                            {permissions['branch_delete'] &&
                                                <button
                                                    onClick={() => handleDeleteClick(branch)}
                                                    disabled={isDeleting}
                                                    className="ml-4 p-2 text-[var(--color-text-error)] hover:text-[var(--color-error-dark)] hover:bg-[var(--color-error-light)] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                                                    title="Delete branch"
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
                onConfirm={confirmDeleteBranch}
                title="Delete User"
                message={`Are you sure you want to delete "${confirmModal.data?.full_name || 'this Branch'}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </>
    );
};

export default BranchList;