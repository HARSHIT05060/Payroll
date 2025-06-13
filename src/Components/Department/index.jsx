import React from "react";
import DepartmentForm from "./DepartmentForm";
import DepartmentList from "./DepartmentList";
import useDepartments from "../../hooks/useDepartments";

const Department = () => {
    const {
        departments,
        loading,
        error,
        addDepartment,
        deleteDepartment,
        refetchDepartments
    } = useDepartments();

    const handleAddDepartment = async (name) => {
        const result = await addDepartment(name);
        return result;
    };

    const handleDeleteDepartment = async (id) => {
        const result = await deleteDepartment(id);
        return result;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Department Management
                </h1>
                <p className="text-gray-600">
                    Manage your organization's departments
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <div className="flex items-center">
                        <div className="text-red-400 mr-2">⚠️</div>
                        <div>
                            <h4 className="text-red-800 font-medium">Error</h4>
                            <p className="text-red-700 text-sm mt-1">{error}</p>
                        </div>
                        <button
                            onClick={refetchDepartments}
                            className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            <DepartmentForm
                onSubmit={handleAddDepartment}
                loading={loading}
            />

            <DepartmentList
                departments={departments}
                onDelete={handleDeleteDepartment}
                loading={loading}
            />

            {/* Debug information (remove in production) */}
            {import.meta.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-gray-100 rounded-md">
                    <h4 className="font-semibold text-gray-700 mb-2">Debug Info:</h4>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify({
                            departmentsCount: departments?.length || 0,
                            loading,
                            error,
                            departments: departments?.slice(0, 2) // Show first 2 for debugging
                        }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default Department;