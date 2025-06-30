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
        <div className="bg-white rounded-xl shadow-sm border border-blue-600 overflow-hidden">
            <div className="relative">
                <div className="bg-blue-600 px-6 py-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-white">
                                Add New Department
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-blue-50/20 to-white">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="departmentName" className="block text-sm font-medium text-gray-700 mb-2">
                            Department Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="departmentName"
                            type="text"
                            placeholder="Enter department name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 bg-white"
                            disabled={isSubmitting || loading}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || loading || !name.trim()}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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