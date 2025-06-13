import React from "react";
import BranchForm from "./BranchForm";
import BranchList from "./BranchList";
import useBranches from "../../hooks/useBranches";

const Branch = () => {
    const {
        branches,
        loading,
        error,
        addBranch,
        deleteBranch,
        refetchBranches
    } = useBranches();

    const handleAddBranch = async (name) => {
        const result = await addBranch(name);
        return result;
    };

    const handleDeleteBranch = async (id) => {
        const result = await deleteBranch(id);
        return result;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Branch Management
                </h1>
                <p className="text-gray-600">
                    Manage your organization's branches
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
                            onClick={refetchBranches}
                            className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            <BranchForm
                onSubmit={handleAddBranch}
                loading={loading}
            />

            <BranchList
                branches={branches}
                onDelete={handleDeleteBranch}
                loading={loading}
            />

            {/* Debug information (remove in production) */}
            {import.meta.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-gray-100 rounded-md">
                    <h4 className="font-semibold text-gray-700 mb-2">Debug Info:</h4>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify({
                            branchesCount: branches?.length || 0,
                            loading,
                            error,
                            branches: branches?.slice(0, 2) // Show first 2 for debugging
                        }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default Branch;