// frontend/src/contexts/AuthContext.jsx

// THE FIX IS ON THIS LINE: We added 'useMemo' to the import list.
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            try {
                setCurrentUser(JSON.parse(user));
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    const handleLogin = async (email, password, userType) => {
        const loginUrl = userType === 'doctor' ? '/doctor/login' : '/patient/login';
        try {
            const response = await api.post(loginUrl, { email, password });
            if (response.data.success) {
                const { user, token } = response.data;
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('token', token);
                setCurrentUser(user);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return { success: true };
            }
        } catch (error) {
            console.error(`${userType} login failed:`, error);
            const message = error.response?.data?.message || "An error occurred during login.";
            return { success: false, message };
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    };

    // This useMemo hook will now work because it was imported above.
    const value = useMemo(() => ({
        currentUser,
        loading, // <-- ADD THIS LINE
        handleLogin,
        handleLogout,
    }), [currentUser, loading]); // <-- ADD 'loading' to the dependency array

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};