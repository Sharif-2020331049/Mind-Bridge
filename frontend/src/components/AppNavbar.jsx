// src/components/AppNavbar.jsx

// --- IMPORTS ---
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppButton } from './Shared';
import { BrainCircuit, Menu, X, Sun, Moon, User as UserIcon, LogOut, CalendarDays } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

const AppNavbar = ({ openProfileModal }) => {
    // --- HOOKS & STATE ---
    const { isDarkMode, toggleDarkMode } = useApp();
    const { currentUser, handleLogout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    
    const profileMenuRef = useRef(null);

    // --- LOGIC ---
    const getActivePage = (pathname) => {
        const page = pathname.split('/app/')[1]?.split('/')[0] || 'dashboard';
        return page;
    }
    const activePage = getActivePage(location.pathname);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileMenuRef]);

    const handleProfileClick = () => {
        setIsProfileMenuOpen(false); // Close dropdown before opening modal
        openProfileModal();
    }

    const handleSignOut = () => {
        handleLogout(); // Clears user session from context
        navigate('/patient-login'); // Redirects to the patient login page
    };

    const navLinks = [
        { path: 'dashboard', label: 'Dashboard' },
        { path: 'clips', label: 'Clips' },
        { path: 'my-posts', label: 'My Posts' },
        { path: 'doctors', label: 'Doctors' },
        { path: 'settings', label: 'Settings' },
    ];

    // --- RENDER ---
    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
            <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                <Link to="/app/dashboard" className="flex items-center space-x-3 cursor-pointer">
                    <BrainCircuit className="text-indigo-600" size={32} />
                    <span className="text-xl font-bold text-gray-800 dark:text-white">PsyCare</span>
                </Link>

                <div className="hidden md:flex items-center space-x-1">
                    {navLinks.map(link => (
                        <Link to={`/app/${link.path}`} key={link.path}>
                            <AppButton variant={activePage === link.path ? 'secondary' : 'ghost'}>{link.label}</AppButton>
                        </Link>
                    ))}
                </div>
                
                <div className="flex items-center space-x-4">
                    <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    
                    <div className="relative" ref={profileMenuRef}>
                        <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
                            <img src='https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?semt=ais_hybrid&w=740' alt={currentUser.name} className="w-10 h-10 rounded-full cursor-pointer border-2 border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 transition" />
                        </button>
                        {isProfileMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-40 ring-1 ring-black ring-opacity-5">
                                <button onClick={handleProfileClick} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <UserIcon size={16} className="mr-2"/>Profile
                                </button>
                                
                                <Link to="/app/my-appointments" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                    <CalendarDays size={16} className="mr-2"/>My Appointments
                                </Link>
                                
                                <button onClick={handleSignOut} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-gray-700 cursor-pointer">
                                    <LogOut size={16} className="mr-2"/>Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    {navLinks.map(link => (
                        <Link
                            key={link.path}
                            to={`/app/${link.path}`}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block px-6 py-3 text-gray-700 dark:text-gray-200 ${activePage === link.path ? 'bg-gray-100 dark:bg-gray-700' : ''} hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
};
export default AppNavbar;