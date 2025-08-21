// src/components/Login.jsx
import { useState } from "react";
import { Smartphone, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { setPermissions } from "../redux/permissionsSlice";
import Logo from "../assets/logo.png";

const Login = () => {
    const { login } = useAuth();
    const [number, setNumber] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const flattenPermissions = (permissionsArray) =>
        permissionsArray.reduce((acc, item) => ({ ...acc, ...item }), {});

    const validateInputs = () => {
        if (!number) return "Please enter your mobile number.";
        if (!/^\d{10}$/.test(number)) return "Mobile number must be 10 digits.";
        if (!password) return "Please enter your password.";
        return null;
    };

    const handleNumberChange = (e) => {
        const value = e.target.value;
        if (/^\d{0,10}$/.test(value)) setNumber(value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append("number", number);
        formData.append("password", password);

        try {
            const res = await api.post("login", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const { success, user_data, message } = res.data;
            if (success && user_data) {
                const userData = {
                    user_id: user_data.user_id,
                    full_name: user_data.full_name,
                    username: user_data.username,
                    email: user_data.email || "",
                    number: user_data.number,
                    type: user_data.type,
                    user_roles_id: user_data.user_role_id,
                    subscriptions_status: user_data.subscriptions_status,
                    subscriptions_days: user_data.subscriptions_days,
                };
                login(userData);

                const permFormData = new FormData();
                permFormData.append("user_id", user_data.user_id);
                permFormData.append("user_roles_id", user_data.user_role_id);
                const permRes = await api.post("user_permissions", permFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                if (permRes.data?.data) {
                    const flatPermissions = flattenPermissions(permRes.data.data);
                    dispatch(setPermissions(flatPermissions));
                }

                navigate("/home");
            } else {
                setError(message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Invalid credentials. Please try again.");
            } else if (error.response?.status >= 500) {
                setError("Server error. Please try again later.");
            } else {
                setError("Login failed. Please check your internet connection.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackClick = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen w-full flex bg-[var(--color-bg-primary)]">

            {/* Left Side - Blue Section with Image */}
            <div className="hidden lg:flex w-1/2 bg-[var(--color-blue)] items-center justify-center p-12 relative overflow-hidden">

                {/* Back Button */}
                <button
                    onClick={handleBackClick}
                    className="absolute top-8 left-8 flex items-center gap-2 text-[var(--color-text-white-90)] hover:text-[var(--color-text-white)] transition-colors duration-200 z-20"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back</span>
                </button>

                <div className="text-center text-[var(--color-text-white)] z-10 max-w-lg">
                    <h2 className="text-4xl font-bold mb-4">
                        Effortlessly manage your team and operations.
                    </h2>
                    <p className="text-xl mb-8 text-[var(--color-blue-lightest)]">
                        Log in to access your CRM dashboard and manage your team.
                    </p>

                    {/* Dashboard Preview Image */}
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Dashboard Preview"
                            className="w-full max-w-md mx-auto rounded-xl shadow-2xl border-4 border-white/20"
                        />
                        <div className="absolute -top-4 -right-4 bg-[var(--color-bg-secondary)] rounded-lg p-3 shadow-lg">
                            <div className="text-sm font-semibold text-[var(--color-text-primary)]">6,248 Units</div>
                            <div className="text-xs text-[var(--color-text-muted)]">Sales Categories</div>
                        </div>
                        <div className="absolute -bottom-4 -left-4 bg-[var(--color-bg-secondary)] rounded-lg p-3 shadow-lg">
                            <div className="text-sm font-semibold text-[var(--color-text-primary)]">$189,374</div>
                            <div className="text-xs text-[var(--color-text-muted)]">Total Sales</div>
                        </div>
                    </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-[var(--color-text-white)] rounded-full"></div>
                    <div className="absolute bottom-32 right-16 w-24 h-24 bg-[var(--color-text-white)] rounded-full"></div>
                    <div className="absolute top-1/2 left-8 w-16 h-16 bg-[var(--color-text-white)] rounded-full"></div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="w-full max-w-md">

                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-12">
                        <img
                            src={Logo}
                            alt="SyncWage Logo"
                            className="w-40 h-20 object-contain"
                        />
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                            Welcome Back
                        </h1>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 p-3 bg-[var(--color-error-light)] border border-[var(--color-error)] rounded-lg text-[var(--color-text-error)] text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Mobile Number */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                Mobile Number
                            </label>
                            <div className="relative">
                                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Enter your mobile number"
                                    className="w-full pl-11 pr-4 py-3 border border-[var(--color-border-primary)] rounded-lg 
                             focus:border-[var(--color-blue)] focus:ring-2 focus:ring-[var(--color-blue-lightest)] 
                             text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] 
                             bg-[var(--color-bg-secondary)] transition-all duration-200"
                                    value={number}
                                    onChange={handleNumberChange}
                                    disabled={isLoading}
                                    maxLength={10}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full pl-11 pr-4 py-3 border border-[var(--color-border-primary)] rounded-lg 
                             focus:border-[var(--color-blue)] focus:ring-2 focus:ring-[var(--color-blue-lightest)] 
                             text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] 
                             bg-[var(--color-bg-secondary)] transition-all duration-200"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-[var(--color-blue)] bg-[var(--color-bg-secondary)] border-[var(--color-border-primary)] rounded focus:ring-[var(--color-blue)] focus:ring-2"
                                />
                                <span className="ml-2 text-sm text-[var(--color-text-secondary)]">Remember Me</span>
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--color-blue)] text-[var(--color-text-white)] py-3 rounded-lg font-semibold 
                         hover:bg-[var(--color-blue-dark)] transition-all duration-200 shadow-md 
                         disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                        >
                            {isLoading ? "Logging in..." : "Log In"}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-xs text-center text-[var(--color-text-muted)] mt-8">
                        Copyright © {new Date().getFullYear()} SyncWage Enterprises LTD.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
