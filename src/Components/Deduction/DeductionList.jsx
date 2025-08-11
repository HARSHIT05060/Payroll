import React, { useState, useMemo } from "react";
import { Trash2, Calculator, AlertTriangle, X, Search } from "lucide-react";
import { useSelector } from 'react-redux';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import DeductionForm from "./DeductionForm";
import useDeductions from "../../hooks/useDeductions";

const DeductionList = () => {
    const [deletingId, setDeletingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null,
        data: null
    });
    const permissions = useSelector(state => state.permissions) || {};

    const {
        deductions,
        loading,
        addDeduction,
        deleteDeduction,
    } = useDeductions();

    // eslint-disable-next-line no-unused-vars
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleAddDeduction = async (name) => {
        const result = await addDeduction(name);
        return result;
    };

    const handleDeleteDeduction = async (id) => {
        const result = await deleteDeduction(id);
        if (result && result.success) {
            showToast("Deduction deleted successfully!", "success");
        } else {
            showToast("Failed to delete deduction. Please try again.", "error");
        }
    };

    // Real-time search filtering using useMemo for performance
    const filteredDeductions = useMemo(() => {
        if (!deductions || !searchTerm.trim()) {
            return deductions || [];
        }

        return deductions.filter(deduction =>
            deduction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (deduction.description && deduction.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [deductions, searchTerm]);

    const handleDeleteClick = (deduction) => {
        setConfirmModal({
            isOpen: true,
            type: 'delete',
            data: deduction
        });
    };

    const confirmDeleteDeduction = async () => {
        const deduction = confirmModal.data;
        if (!deduction) return;
        const deductionId = deduction.deduction_id || deduction.id;
        setDeletingId(deductionId);
        try {
            await handleDeleteDeduction(deductionId);
        } catch (error) {
            showToast("An error occurred while deleting the deduction.", error);
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
                                <Calculator className="w-5 h-5 text-[var(--color-text-white)]" />
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--color-text-white)]">
                                Deductions
                            </h3>
                        </div>
                    </div>
                    <div className="h-1 bg-[var(--color-blue-darker)]"></div>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-blue-dark)]"></div>
                    <span className="ml-3 text-[var(--color-text-secondary)]">Loading deductions...</span>
                </div>
            </div>
        );
    }

    const totalDeductions = deductions ? deductions.length : 0;
    const filteredCount = filteredDeductions.length;

    return (
        <>
            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-blue-dark)] overflow-hidden ">
                <div className="relative">
                    <div className="bg-[var(--color-blue-dark)] px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-[var(--color-bg-secondary-20)] rounded-lg">
                                    <Calculator className="w-5 h-5 text-[var(--color-text-white)]" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--color-text-white)]">
                                        Deductions
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-[var(--color-bg-secondary)] flex flex-col gap-4">
                    {permissions['deduction_create'] &&
                        <DeductionForm
                            onSubmit={handleAddDeduction}
                            loading={loading}
                            showToast={showToast}
                        />
                    }

                    {/* Search Bar */}
                    {totalDeductions > 0 && (
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-[var(--color-text-secondary)]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search deductions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)] transition-all duration-200 placeholder-gray-400 bg-[var(--color-bg-secondary)]"
                            />
                            {searchTerm && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}

                    {totalDeductions === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-[var(--color-blue-lighter)] rounded-full flex items-center justify-center mb-4">
                                <Calculator className="w-8 h-8 text-[var(--color-blue)]" />
                            </div>
                            <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                                No deductions found
                            </h4>
                            <p className="text-[var(--color-text-secondary)] mb-1">
                                Get started by adding your first deduction
                            </p>
                            <p className="text-sm text-[var(--color-text-muted)]">
                                Use the form above to create a new deduction
                            </p>
                        </div>
                    ) : filteredCount === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-[var(--color-blue-lighter)] rounded-full flex items-center justify-center mb-4">
                                <Search className="w-8 h-8 text-[var(--color-blue)]" />
                            </div>
                            <h4 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">
                                No deductions match your search
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
                            {filteredDeductions.map((deduction) => {
                                const deductionId = deduction.deduction_id || deduction.id;
                                const isDeleting = deletingId === deductionId;

                                return (
                                    <div
                                        key={deductionId}
                                        className="border border-[var(--color-border-primary)] rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-red-50/20 to-orange-50/20 hover:from-red-50/40 hover:to-orange-50/40"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className="p-1.5 bg-red-100 rounded-md">
                                                        <Calculator className="w-4 h-4 text-red-600" />
                                                    </div>
                                                    <h4 className="text-lg font-semibold text-[var(--color-text-primary)] truncate">
                                                        {deduction.name}
                                                    </h4>
                                                </div>

                                                {deduction.description && (
                                                    <p className="text-[var(--color-text-secondary)] mb-2 text-sm leading-relaxed pl-7">
                                                        {deduction.description}
                                                    </p>
                                                )}

                                                {deduction.amount && (
                                                    <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-2 pl-7">
                                                        <span className="font-medium text-red-600">
                                                            Amount: ₹{deduction.amount}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {permissions['deduction_delete'] &&
                                                <button
                                                    onClick={() => handleDeleteClick(deduction)}
                                                    disabled={isDeleting}
                                                    className="ml-4 p-2 text-[var(--color-text-error)] hover:text-[var(--color-error-dark)] hover:bg-[var(--color-error-light)] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                                                    title="Delete deduction"
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

            <ConfirmDialog
                isOpen={confirmModal.isOpen && confirmModal.type === 'delete'}
                onClose={closeModal}
                onConfirm={confirmDeleteDeduction}
                title="Delete Deduction"
                message={`Are you sure you want to delete "${confirmModal.data?.name || 'this Deduction'}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
            </div>
        </>
    );
};

export default DeductionList;