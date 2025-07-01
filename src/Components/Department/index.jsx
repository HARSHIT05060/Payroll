import React, { useState } from "react";
import DepartmentForm from "./DepartmentForm";
import DepartmentList from "./DepartmentList";
import useDepartments from "../../hooks/useDepartments";
import { useSelector } from 'react-redux';
import { Toast } from '../ui/Toast';


const Department = () => {
    const {
        departments,
        loading,
        addDepartment,
        deleteDepartment,
    } = useDepartments();
    const permissions = useSelector(state => state.permissions) || {};

    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleAddDepartment = async (name) => {
        const result = await addDepartment(name);
        return result;
    };

    const handleDeleteDepartment = async (id) => {
        const result = await deleteDepartment(id);
        return result;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <div className="text-grey-100 text-center rounded-lg px-6 py-4 -mx-2 -mt-2 mb-4">
                        <h1 className="text-3xl font-bold text-gray-700">
                            Department Management
                        </h1>
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-8">
                    {permissions['department_create'] &&
                        <DepartmentForm
                            onSubmit={handleAddDepartment}
                            loading={loading}
                            showToast={showToast}
                        />
                    }
                    <DepartmentList
                        departments={departments}
                        onDelete={handleDeleteDepartment}
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

export default Department;