import { useState } from "react";
import DepartmentList from "./DepartmentList";
import useDepartments from "../../hooks/useDepartments";
import { useSelector } from 'react-redux';
import { Toast } from '../ui/Toast';
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';

const Department = () => {
    const {
        departments,
        loading,
        // addDepartment,
        deleteDepartment,
    } = useDepartments();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };
    const permissions = useSelector(state => state.permissions) || {};

    // const handleAddDepartment = async (name) => {
    //     const result = await addDepartment(name);
    //     return result;
    // };

    const handleDeleteDepartment = async (id) => {
        const result = await deleteDepartment(id);
        return result;
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)]">
            <div className="max-w-5xl mx-auto">
                <div className="bg-[var(--color-bg-secondary)] rounded-2xl shadow-xl mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-[var(--color-blue-dark)] to-[var(--color-blue-darker)] p-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-[var(--color-text-white)] hover:text-[var(--color-text-white)] transition-colors bg-[var(--color-bg-secondary-20)] hover:bg-[var(--color-bg-secondary-30)] px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <div className="flex items-center gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-[var(--color-text-white)]">
                                        Department Management
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {permissions['department_view'] &&
                        <DepartmentList
                            departments={departments}
                            onDelete={handleDeleteDepartment}
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

export default Department;