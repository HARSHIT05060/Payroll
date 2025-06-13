import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import useUserId from "./useUserId";

const useDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user_id = useUserId();

    const fetchDepartments = async () => {
        if (!user_id) return;

        setLoading(true);
        setError(null);

        try {
            // Create FormData for the request
            const formData = new FormData();
            formData.append('user_id', user_id);

            const res = await api.post("/department_list", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            const departmentData = res.data.data || res.data || [];
            setDepartments(Array.isArray(departmentData) ? departmentData : []);
        } catch (err) {
            console.error("Error fetching departments:", err);
            setError("Failed to fetch departments");
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user_id) {
            fetchDepartments();
        }
    }, [user_id]);

    const addDepartment = async (name) => {
        if (!name.trim()) return;

        try {
            // Create FormData for the request
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('user_id', user_id);

            const res = await api.post("/department_create", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Department created:", res.data);

            // Refresh the departments list
            await fetchDepartments();
            return { success: true };
        } catch (err) {
            console.error("Error adding department:", err);
            setError("Failed to add department");
            return { success: false, error: err.message };
        }
    };

    const deleteDepartment = async (id) => {
        if (!id) {
            console.error("No ID provided for deletion");
            return { success: false, error: "No ID provided" };
        }

        console.log("Attempting to delete department with ID:", id);
        console.log("User ID:", user_id);

        try {
            // Create FormData for the request
            const formData = new FormData();
            formData.append('id', id);
            formData.append('user_id', user_id);

            // Try different field names that your API might expect
            formData.append('department_id', id); // Some APIs expect 'department_id'

            console.log("FormData contents:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const res = await api.post("/department_delete", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Delete API Response:", res.data);

            // Check if the API returned success
            if (res.data && res.data.success === false) {
                console.error("API returned failure:", res.data.message);
                setError(`Delete failed: ${res.data.message}`);
                return { success: false, error: res.data.message };
            }

            // Refresh the departments list
            await fetchDepartments();
            return { success: true };
        } catch (err) {
            console.error("Error deleting department:", err);
            console.error("Error response:", err.response?.data);

            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(`Failed to delete department: ${errorMessage}`);
            return { success: false, error: errorMessage };
        }
    };

    return {
        departments,
        loading,
        error,
        addDepartment,
        deleteDepartment,
        refetchDepartments: fetchDepartments
    };
};

export default useDepartments;