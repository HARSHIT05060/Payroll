import { useState } from "react";
import DesignationForm from "./DesignationForm";
import DesignationList from "./DesignationList";
import useDesignations from "../../hooks/useDesignations";
import { useSelector } from 'react-redux';
import { Toast } from '../ui/Toast';

const Designation = () => {
    const {
        designations,
        loading,
        addDesignation,
        deleteDesignation,
    } = useDesignations();
    const permissions = useSelector(state => state.permissions) || {};

    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleAddDesignation = async (name) => {
        const result = await addDesignation(name);
        return result;
    };

    const handleDeleteDesignation = async (id) => {
        const result = await deleteDesignation(id);
        return result;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
            <div className="max-w-6xl mx-auto ">
                <div className="mb-8">
                    <div className="text-grey-100 text-center rounded-lg px-6 py-4 -mx-2 -mt-2 mb-4">
                        <h1 className="text-3xl font-bold text-gray-700">
                            Designation Management
                        </h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {permissions['designation_create'] &&
                        <DesignationForm
                            onSubmit={handleAddDesignation}
                            loading={loading}
                            showToast={showToast}
                        />
                    }
                    <DesignationList
                        designations={designations}
                        onDelete={handleDeleteDesignation}
                        loading={loading}
                        showToast={showToast}
                    />
                </div>

                {/* Toast Notification */}
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </div>
        </div>
    );
};

export default Designation;