import React, { useState } from "react";

const DesignationForm = ({ onSubmit, loading = false }) => {
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            alert("Please enter a designation name");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const result = await onSubmit(name.trim());
            
            if (result && result.success) {
                setName(""); // Clear form on success
            } else {
                alert("Failed to add designation. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to add designation. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Add New Designation
            </h3>
            
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    type="text"
                    placeholder="Designation Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isSubmitting || loading}
                />
                
                <button
                    type="submit"
                    disabled={isSubmitting || loading || !name.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isSubmitting ? "Adding..." : "Add Designation"}
                </button>
            </form>
        </div>
    );
};

export default DesignationForm;