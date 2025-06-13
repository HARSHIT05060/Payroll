import React, { useState } from "react";

const DepartmentList = ({ departments, onDelete, loading = false }) => {
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (dept) => {
        if (!window.confirm(`Are you sure you want to delete "${dept.name}"?`)) {
            return;
        }

        setDeletingId(dept.department_id || dept.id);
        
        try {
            const result = await onDelete(dept.department_id || dept.id);
            
            if (result && !result.success) {
                alert("Failed to delete department. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting department:", error);
            alert("Failed to delete department. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading departments...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Departments ({departments ? departments.length : 0})
            </h3>
            
            {!departments || departments.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-2">📁</div>
                    <p className="text-gray-500">No departments found.</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Add your first department using the form above.
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {departments.map((dept) => {
                        const deptId = dept.department_id || dept.id;
                        const isDeleting = deletingId === deptId;
                        
                        return (
                            <div
                                key={deptId}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">
                                        {dept.name}
                                    </h4>
                                    {dept.description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {dept.description}
                                        </p>
                                    )}
                                    {deptId && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            ID: {deptId}
                                        </p>
                                    )}
                                </div>
                                
                                <button
                                    onClick={() => handleDelete(dept)}
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

export default DepartmentList;