import { useState } from "react";
import DesignationForm from "./DesignationForm";
import DesignationList from "./DesignationList";
import useDesignations from "../../hooks/useDesignations";
import { useSelector } from 'react-redux';
import { Toast } from '../ui/Toast';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

const Designation = () => {
    const {
        designations,
        loading,
        // addDesignation,
        deleteDesignation,
    } = useDesignations();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };
    const permissions = useSelector(state => state.permissions) || {};

    // const handleAddDesignation = async (name) => {
    //     const result = await addDesignation(name);
    //     return result;
    // };

    const handleDeleteDesignation = async (id) => {
        const result = await deleteDesignation(id);
        return result;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-white">
                                        Designation Management
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {permissions['designation_view'] &&
                        <DesignationList
                            designations={designations}
                            onDelete={handleDeleteDesignation}
                            loading={loading}
                            showToast={showToast}
                        />
                    }
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