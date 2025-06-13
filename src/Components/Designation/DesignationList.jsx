import React, { useState } from "react";

const DesignationList = ({ designations, onDelete, loading = false }) => {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (designation) => {
        if (!window.confirm(`Are you sure you want to delete "${designation.name}"?`)) {
            return;
        }

        setDeletingId(designation.designation_id || designation.id);

        try {
            const result = await onDelete(designation.designation_id || designation.id);

            if (result && !result.success) {
                alert("Failed to delete designation. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting designation:", error);
            alert("Failed to delete designation. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-3 text-gray-600">Loading designations...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Designations ({designations ? designations.length : 0})
            </h3>

            {!designations || designations.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">💼</div>
                    <p className="text-gray-500">No designations found.</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Add your first designation using the form above.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {designations.map((designation) => {
                        const designationId = designation.designation_id || designation.id;
                        const isDeleting = deletingId === designationId;

                        return (
                            <div
                                key={designationId}
                                className="flex items-center justify-between p-3 bg-purple-50 rounded-md border border-purple-100 hover:bg-purple-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">
                                        {designation.name}
                                    </h4>
                                    {designation.description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {designation.description}
                                        </p>
                                    )}
                                    {designation.level && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Level: {designation.level}
                                        </p>
                                    )}
                                    {designation.department && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Department: {designation.department}
                                        </p>
                                    )}
                                    {designationId && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            ID: {designationId}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleDelete(designation)}
                                    disabled={isDeleting}
                                    className="ml-4 px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DesignationList;