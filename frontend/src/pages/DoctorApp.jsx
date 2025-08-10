// src/pages/DoctorApp.jsx

import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

// Import Doctor Pages
import DoctorDashboardPage from './doctor/DoctorDashboardPage';
import DoctorCommunityPage from './doctor/DoctorCommunityPage';
import DoctorClientsPage from './doctor/DoctorClientsPage';
import DoctorProfilePage from './doctor/DoctorProfilePage';
import DoctorClipsPage from './doctor/DoctorClipsPage';
import DoctorAppointmentsPage from './doctor/DoctorAppointmentsPage'; // 1. Import new page

// Import Doctor Components
import DoctorSidebar from '../components/doctor/DoctorSidebar';
import DoctorHeader from '../components/doctor/DoctorHeader';

const DoctorApp = () => {
    const { isDarkMode } = useApp();
    const [profilePic, setProfilePic] = useState("https://placehold.co/40x40/d1fae5/166534?text=DD");

    return (
        <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans ${isDarkMode ? 'dark' : ''}`}>
            <DoctorSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <DoctorHeader profilePic={profilePic} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-8">
                    <Routes>
                        <Route index element={<DoctorDashboardPage />} />
                        <Route path="dashboard" element={<DoctorDashboardPage />} />
                        <Route path="community" element={<DoctorCommunityPage />} />
                        <Route path="clips" element={<DoctorClipsPage />} />
                        <Route path="clients" element={<DoctorClientsPage />} />
                        <Route path="appointments" element={<DoctorAppointmentsPage />} /> {/* 2. Add route here */}
                        <Route path="profile" element={<DoctorProfilePage profilePic={profilePic} setProfilePic={setProfilePic} />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default DoctorApp;