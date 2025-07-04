import React, { useState } from "react";
import { Plus, Briefcase } from "lucide-react";

const DesignationForm = ({ onSubmit, loading = false, showToast }) => {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            showToast("Please enter a designation name", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await onSubmit(name.trim());

            if (result && Object.prototype.hasOwnProperty.call(result, 'success')) {
                if (result.success === true) {
                    // Success case
                    setName("");
                    showToast("Designation added successfully!", "success");
                } else {
                    // success: false case - show the specific error message
                    const errorMessage = result.message || "Failed to add designation. Please try again.";
                    showToast(errorMessage, "error");
                }
            } else {
                showToast("Failed to add designation. Please try again.", "error");
            }
        } catch (error) {
            console.error("Error adding designation:", error);
            showToast("An error occurred while adding the designation.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-blue-600 overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-blue-50/20 to-white">
                <div className="flex w-full flex-row items-center justify-between mb-4">
                    <div >
                        <label htmlFor="designationName" className=" text-sm font-medium text-gray-700 mb-2 ">
                            Add New Designation <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="designationName"
                            type="text"
                            placeholder="Enter designation name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-gray-400 bg-white"
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
                                Add Designation
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DesignationForm;