// src/components/Login.jsx
import { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from '../api/axiosInstance';
import { useAuth } from "../context/AuthContext";
import { useDispatch } from 'react-redux';
import { setPermissions } from '../../src/redux/permissionsSlice';

const Login = () => {
    const { login } = useAuth();
    const [number, setNumber] = useState("8529637411");
    const [password, setPassword] = useState("Test@123");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const flattenPermissions = (permissionsArray) =>
        permissionsArray.reduce((acc, item) => ({ ...acc, ...item }), {});

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        if (!number || !password) {
            setError("Please enter both email/number and password");
            setIsLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("number", number);
        formData.append("password", password);
        try {
            const res = await api.post("login", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            const { success, user_data, message } = res.data;
            if (success && user_data) {
                const userData = {
                    user_id: user_data.user_id,
                    full_name: user_data.full_name,
                    username: user_data.username,
                    email: user_data.email || '',
                    number: user_data.number,
                    type: user_data.type,
                    user_roles_id: user_data.user_role_id,
                    subscriptions_status: user_data.subscriptions_status,
                    subscriptions_days: user_data.subscriptions_days,
                };
                login(userData);
                const formData = new FormData();
                formData.append("user_id", user_data.user_id);
                formData.append("user_roles_id", user_data.user_role_id);
                const permRes = await api.post("user_permissions", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
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

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-[var(--color-bg-gradient-start)] via-[var(--color-blue-lightest)] to-[var(--color-bg-gradient-end)]">
            {/* Left Side - Illustration */}
            <div className="hidden md:flex w-1/2 bg-[var(--color-bg-secondary)] items-center justify-center">
                <img src="/login.png" alt="Login Illustration" className="max-w-[400px] w-full h-auto" />
            </div>
            {/* Right Side - Blue Background */}
            <div className="hidden md:block w-1/2 bg-[var(--color-blue-darkest)] min-h-screen"></div>
            {/* Centered Login Card */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-10 px-4">
                <div className="relative bg-[var(--color-bg-secondary)] rounded-2xl shadow-2xl p-10 flex flex-col gap-6 animate-fade-in-up border border-[var(--color-border-primary)]">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Welcome Back !</h2>
                    {error && (
                        <div className="mb-2 p-2 bg-[var(--color-error-light)] border border-[var(--color-border-error)] rounded text-[var(--color-text-error)] text-sm animate-shake">{error}</div>
                    )}
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Email Address"
                                className="w-full pl-12 pr-4 py-3 border border-[var(--color-border-primary)] rounded-full focus:border-[var(--color-blue-darkest)] focus:outline-none transition-all duration-200 text-[var(--color-text-secondary)] placeholder-[var(--color-text-muted)] bg-[var(--color-bg-secondary)]"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)] w-5 h-5" />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full pl-12 pr-4 py-3 border border-[var(--color-border-primary)] rounded-full focus:border-[var(--color-blue-darkest)] focus:outline-none transition-all duration-200 text-[var(--color-text-secondary)] placeholder-[var(--color-text-muted)] bg-[var(--color-bg-secondary)]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[var(--color-blue-darkest)] text-[var(--color-text-white)] py-3 rounded-full font-semibold mt-2 hover:bg-[var(--color-blue-darker)] transition-all duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    
                </div>
            </div>
            {/* Decorative Circles */}
            <svg className="absolute bottom-0 right-0 z-0 hidden md:block" width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="350" cy="350" r="80" stroke="var(--color-text-white)" strokeWidth="2" fill="none" />
                <circle cx="350" cy="350" r="120" stroke="var(--color-text-white)" strokeWidth="1" fill="none" />
            </svg>
        </div>
    );
};

export default Login;