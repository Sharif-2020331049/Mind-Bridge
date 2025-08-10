// frontend/src/components/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    // 1. Show a loading indicator while we check for a user.
    // This is the key to preventing the infinite redirect loop.
    if (loading) {
        return <div>Loading...</div>; // Or a proper spinner component
    }

    // 2. If loading is done and there's no user, redirect to a generic login/options page.
    if (!currentUser) {
        // Redirect them to the signup options page, passing the page they wanted to visit.
        return <Navigate to="/signup-options" state={{ from: location }} replace />;
    }

    // 3. Determine the required role based on the URL path.
    const isDoctorRoute = location.pathname.startsWith('/doctor');
    const isPatientRoute = location.pathname.startsWith('/app');
    const userRole = currentUser.role;

    // 4. Check for role mismatch.
    if (isDoctorRoute && userRole !== 'doctor') {
        // A non-doctor is trying to access a doctor route. Send them to their own dashboard.
        return <Navigate to="/app/dashboard" replace />;
    }

    if (isPatientRoute && userRole !== 'patient') {
        // A non-patient is trying to access a patient route. Send them to their own dashboard.
        return <Navigate to="/doctor/dashboard" replace />;
    }

    // 5. If all checks pass, render the nested routes (e.g., <PatientApp /> or <DoctorApp />).
    return <Outlet />;
};

export default ProtectedRoute;