import React, { useState } from "react";
import { Plus, Users } from "lucide-react";

const DepartmentForm = ({ onSubmit, loading = false, showToast }) => {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            showToast("Please enter a department name", "error");
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
                    showToast("Department added successfully!", "success");
                } else {
                    // success: false case - show the specific error message
                    const errorMessage = result.message || "Failed to add department. Please try again.";
                    showToast(errorMessage, "error");
                }
            } else {
                // Handle case where result doesn't have success property or is null/undefined
                showToast("Failed to add department. Please try again.", "error");
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error("Error adding department:", error);
            showToast("An error occurred while adding the department.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm border border-[var(--color-blue-dark)] overflow-hidden">
            <div className="p-6 bg-[var(--color-bg-secondary)]">
                <div className="flex w-full flex-row items-center justify-between mb-4">
                    <div className="space-y-2">
                        <label htmlFor="departmentName" className="text-sm font-medium text-[var(--color-text-secondary)] my-2">
                            Add New Department <span className="text-[var(--color-error)] ">*</span>
                        </label>
                        <input
                            id="departmentName"
                            type="text"
                            placeholder="Enter department name"
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
                                Add Department
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DepartmentForm;