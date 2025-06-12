import { createContext, useContext, useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

const USER_KEY = 'auth_user';
const TIMESTAMP_KEY = 'auth_timestamp';
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours
const SECRET_KEY = import.meta.env.VITE_AES_SECRET_KEY || 'shopno-ecommerce';

// AES encryption helpers (in-file)
const encrypt = (data) => {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
};

const decrypt = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};

const setItem = (key, value) => {
    const encrypted = encrypt(value);
    sessionStorage.setItem(key, encrypted);
};

const getItem = (key) => {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;
    return decrypt(encrypted);
};

const removeItem = (key) => {
    sessionStorage.removeItem(key);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const isSessionExpired = () => {
        const timestamp = getItem(TIMESTAMP_KEY);
        return !timestamp || (Date.now() - timestamp) > SESSION_TIMEOUT;
    };

    const updateTimestamp = () => {
        setItem(TIMESTAMP_KEY, Date.now());
    };

    const clearSession = () => {
        removeItem(USER_KEY);
        removeItem(TIMESTAMP_KEY);
    };

    useEffect(() => {
        try {
            if (isSessionExpired()) {
                clearSession();
            } else {
                const savedUser = getItem(USER_KEY);
                if (savedUser) {
                    setUser(savedUser);
                    updateTimestamp();
                }
            }
        } catch (error) {
            console.error('Error loading session:', error);
            clearSession();
        }
        setIsLoading(false);
    }, []);

    const login = (userData) => {
        if (!userData) return false;

        const userWithSession = {
            ...userData,
            loginTime: Date.now(),
            sessionId: Math.random().toString(36).substring(2, 15)
        };

        setUser(userWithSession);
        setItem(USER_KEY, userWithSession);
        updateTimestamp();
        return true;
    };

    const logout = () => {
        setUser(null);
        clearSession();
        window.location.href = '/';
    };

    const updateUser = (updates) => {
        if (!user || !updates) return false;

        const updatedUser = {
            ...user,
            ...updates,
            lastUpdated: Date.now()
        };

        setUser(updatedUser);
        setItem(USER_KEY, updatedUser);
        updateTimestamp();
        return true;
    };

    const isAuthenticated = () => {
        return user !== null && !isSessionExpired();
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            updateUser,
            isLoading,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
