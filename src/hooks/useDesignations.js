import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import useUserId from "./useUserId";

const useDesignations = () => {
    const [designations, setDesignations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user_id = useUserId();

    const fetchDesignations = async () => {
        if (!user_id) return;

        setLoading(true);
        setError(null);

        try {
            // Create FormData for the request
            const formData = new FormData();
            formData.append('user_id', user_id);

            const res = await api.post("/designation_list", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Designation API Raw Response:", res.data);
            console.log("Fetched designations:", res.data.data);

            // Handle different response structures
            const designationData = res.data.data || res.data || [];
            setDesignations(Array.isArray(designationData) ? designationData : []);
        } catch (err) {
            console.error("Error fetching designations:", err);
            setError("Failed to fetch designations");
            setDesignations([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user_id) {
            fetchDesignations();
        }
    }, [user_id]);

    const addDesignation = async (name) => {
        if (!name.trim()) return;

        try {
            // Create FormData for the request
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('user_id', user_id);

            const res = await api.post("/designation_create", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Designation created:", res.data);

            // Refresh the designations list
            await fetchDesignations();
            return { success: true };
        } catch (err) {
            console.error("Error adding designation:", err);
            setError("Failed to add designation");
            return { success: false, error: err.message };
        }
    };

    const deleteDesignation = async (id) => {
        if (!id) {
            console.error("No ID provided for deletion");
            return { success: false, error: "No ID provided" };
        }

        console.log("Attempting to delete designation with ID:", id);
        console.log("User ID:", user_id);

        try {
            // Create FormData for the request
            const formData = new FormData();
            formData.append('id', id);
            formData.append('user_id', user_id);

            // Try different field names that your API might expect
            formData.append('designation_id', id);

            console.log("Designation Delete FormData contents:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const res = await api.post("/designation_delete", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Delete Designation API Response:", res.data);

            // Check if the API returned success
            if (res.data && res.data.success === false) {
                console.error("API returned failure:", res.data.message);
                setError(`Delete failed: ${res.data.message}`);
                return { success: false, error: res.data.message };
            }

            // Refresh the designations list
            await fetchDesignations();
            return { success: true };
        } catch (err) {
            console.error("Error deleting designation:", err);
            console.error("Error response:", err.response?.data);

            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(`Failed to delete designation: ${errorMessage}`);
            return { success: false, error: errorMessage };
        }
    };

    return {
        designations,
        loading,
        error,
        addDesignation,
        deleteDesignation,
        refetchDesignations: fetchDesignations
    };
};

export default useDesignations;