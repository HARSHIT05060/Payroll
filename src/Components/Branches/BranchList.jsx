import React, { useState } from "react";

const BranchList = ({ branches, onDelete, loading = false }) => {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (branch) => {
        if (!window.confirm(`Are you sure you want to delete "${branch.name}"?`)) {
            return;
        }

        setDeletingId(branch.branch_id || branch.id);

        try {
            const result = await onDelete(branch.branch_id || branch.id);

            if (result && !result.success) {
                alert("Failed to delete branch. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting branch:", error);
            alert("Failed to delete branch. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600">Loading branches...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Branches ({branches ? branches.length : 0})
            </h3>

            {!branches || branches.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">🏢</div>
                    <p className="text-gray-500">No branches found.</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Add your first branch using the form above.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {branches.map((branch) => {
                        const branchId = branch.branch_id || branch.id;
                        const isDeleting = deletingId === branchId;

                        return (
                            <div
                                key={branchId}
                                className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-100 hover:bg-green-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">
                                        {branch.name}
                                    </h4>
                                    {branch.description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {branch.description}
                                        </p>
                                    )}
                                    {branch.location && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            📍 {branch.location}
                                        </p>
                                    )}
                                    {branchId && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            ID: {branchId}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleDelete(branch)}
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

export default BranchList;