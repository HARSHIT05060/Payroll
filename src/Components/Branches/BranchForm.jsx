import React, { useState } from "react";
import { Plus, Building2 } from "lucide-react";

const BranchForm = ({ onSubmit, loading = false, showToast }) => {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            showToast("Please enter a branch name", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await onSubmit(name.trim());

            // Handle the response based on the success property
            if (result && Object.prototype.hasOwnProperty.call(result, 'success')) {
                if (result.success === true) {
                    // Success case
                    setName("");
                    showToast("Branch added successfully!", "success");
                } else {
                    // success: false case - show the specific error message
                    const errorMessage = result.message || "Failed to add branch. Please try again.";
                    showToast(errorMessage, "error");
                }
            } else {
                // Handle case where result doesn't have success property or is null/undefined
                showToast("Failed to add branch. Please try again.", "error");
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error("Error adding branch:", error);
            showToast("An error occurred while adding the branch.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-blue-dark)] overflow-hidden">


            <div className="p-6 bg-gradient-to-br from-blue-50/20 to-white">
                <div className="flex w-full flex-row items-center justify-between mb-4">
                    <div >
                        <label htmlFor="branchName" className=" text-sm font-medium text-[var(--color-text-secondary)] mb-2 ">
                            Add New Branch <span className="text-[var(--color-error)]">*</span>
                        </label>
                        <input
                            id="branchName"
                            type="text"
                            placeholder="Enter branch name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-[var(--color-border-secondary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-blue)] focus:border-[var(--color-blue)] transition-all duration-200 placeholder-gray-400 bg-[var(--color-bg-secondary)]"
                            disabled={isSubmitting || loading}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || loading || !name.trim()}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[var(--color-blue-dark)] text-[var(--color-text-white)] font-medium rounded-lg hover:bg-[var(--color-blue-darker)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-blue)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-border-primary)] mr-2"></div>
                                Adding...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Branch
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BranchForm;