import React from "react";
import DesignationForm from "./DesignationForm";
import DesignationList from "./DesignationList";
import useDesignations from "../../hooks/useDesignations";

const Designation = () => {
    const { 
        designations, 
        loading, 
        error,
        addDesignation, 
        deleteDesignation,
        refetchDesignations
    } = useDesignations();

    const handleAddDesignation = async (name) => {
        const result = await addDesignation(name);
        return result;
    };

    const handleDeleteDesignation = async (id) => {
        const result = await deleteDesignation(id);
        return result;
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Designation Management
                </h1>
                <p className="text-gray-600">
                    Manage your organization's designations
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
                            onClick={refetchDesignations}
                            className="ml-auto text-red-600 hover:text-red-800 text-sm underline"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            <DesignationForm 
                onSubmit={handleAddDesignation}
                loading={loading}
            />
            
            <DesignationList
                designations={designations}
                onDelete={handleDeleteDesignation}
                loading={loading}
            />

            {/* Debug information (remove in production) */}
            {import.meta.env.NODE_ENV === 'development' && (
                <div className="mt-8 p-4 bg-gray-100 rounded-md">
                    <h4 className="font-semibold text-gray-700 mb-2">Debug Info:</h4>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                        {JSON.stringify({
                            DesignationsCount: designations?.length || 0,
                            loading,
                            error,
                            Designations: designations?.slice(0, 2) // Show first 2 for debugging
                        }, null, 2)}
                    </pre>
                </div>
            )}
            </div>
    );
};

export default Designation;