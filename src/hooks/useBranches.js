import { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import useUserId from "./useUserId";

const useBranches = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const user_id = useUserId();

    const fetchBranches = async () => {
        if (!user_id) return;

        setLoading(true);
        setError(null);

        try {
            // Create FormData for the request
            const formData = new FormData();
            formData.append('user_id', user_id);

            const res = await api.post("/branch_list", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Branch API Raw Response:", res.data);
            console.log("Fetched branches:", res.data.data);

            // Handle different response structures
            const branchData = res.data.data || res.data || [];
            setBranches(Array.isArray(branchData) ? branchData : []);
        } catch (err) {
            console.error("Error fetching branches:", err);
            setError("Failed to fetch branches");
            setBranches([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user_id) {
            fetchBranches();
        }
    }, [user_id]);

    const addBranch = async (name) => {
        if (!name.trim()) return;

        try {
            // Create FormData for the request
            const formData = new FormData();
            formData.append('name', name.trim());
            formData.append('user_id', user_id);

            const res = await api.post("/branch_create", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Branch created:", res.data);

            // Refresh the branches list
            await fetchBranches();
            return { success: true };
        } catch (err) {
            console.error("Error adding branch:", err);
            setError("Failed to add branch");
            return { success: false, error: err.message };
        }
    };

    const deleteBranch = async (id) => {
        if (!id) {
            console.error("No ID provided for deletion");
            return { success: false, error: "No ID provided" };
        }

        console.log("Attempting to delete branch with ID:", id);
        console.log("User ID:", user_id);

        try {
            // Create FormData for the request
            const formData = new FormData();
            formData.append('id', id);
            formData.append('user_id', user_id);

            // Try different field names that your API might expect
            formData.append('branch_id', id);

            console.log("Branch Delete FormData contents:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const res = await api.post("/branch_delete", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            console.log("Delete Branch API Response:", res.data);

            // Check if the API returned success
            if (res.data && res.data.success === false) {
                console.error("API returned failure:", res.data.message);
                setError(`Delete failed: ${res.data.message}`);
                return { success: false, error: res.data.message };
            }

            // Refresh the branches list
            await fetchBranches();
            return { success: true };
        } catch (err) {
            console.error("Error deleting branch:", err);
            console.error("Error response:", err.response?.data);

            const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            setError(`Failed to delete branch: ${errorMessage}`);
            return { success: false, error: errorMessage };
        }
    };

    return {
        branches,
        loading,
        error,
        addBranch,
        deleteBranch,
        refetchBranches: fetchBranches
    };
};

export default useBranches;