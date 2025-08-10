// src/components/doctor/DoctorHeader.jsx

// --- IMPORTS ---
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// KEPT: Your existing imports for dark mode and icons
import { Sun, Moon, LogOut } from 'lucide-react'; 
import { useApp } from '../../contexts/AppContext';

// ADDED: Import to get user data and the logout function
import { useAuth } from '../../contexts/AuthContext';


const DoctorHeader = () => {
    // --- HOOKS & STATE ---
    // KEPT: Your existing AppContext for dark mode
    const { isDarkMode, toggleDarkMode } = useApp();

    // ADDED: Getting user data and logout function from AuthContext
    const { currentUser, handleLogout } = useAuth();
    const navigate = useNavigate();

    // ADDED: State to manage the dropdown's visibility
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // ADDED: Ref to detect clicks outside the dropdown menu
    const dropdownRef = useRef(null);


    // --- LOGIC ---
    // ADDED: This effect closes the dropdown when you click outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    // ADDED: This function handles the sign-out process
    const handleSignOut = () => {
        handleLogout();
        navigate('/patient-login');
    };
    

    // --- RENDER ---
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center h-16 border-b dark:border-gray-700">
            <div className="text-gray-800 dark:text-gray-100 font-semibold">Consultant Portal</div>

            <div className="flex items-center space-x-4">
                {/* KEPT: Your dark mode toggle button */}
                <button onClick={toggleDarkMode} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
                </button>

                {/* MODIFIED: The profile section is now a dropdown */}
                <div className="relative" ref={dropdownRef}>
                    {/* This button toggles the dropdown */}
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <img 
                            src={currentUser?.profilePic || 'https://placehold.co/40x40'} 
                            alt="Doctor" 
                            className="w-10 h-10 rounded-full object-cover border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition" 
                        />
                        <div className="hidden sm:block text-left">
                            {/* User name is now dynamic */}
                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">{currentUser?.fullName || 'Dr. Name'}</p>
                            {/* Specialty is now dynamic */}
                            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.specializations?.split(',')[0] || 'Consultant'}</p>
                        </div>
                    </button>

                    {/* ADDED: The dropdown menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 py-1 border dark:border-gray-700">
                            <div className="px-4 py-3 border-b dark:border-gray-700">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                                    {currentUser?.name || 'Doctor Name'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                    {currentUser?.email || 'doctor@email.com'}
                                </p>
                            </div>
                            <div className="py-1">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default DoctorHeader;