// src/pages/SettingsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Lock, Bell, HelpCircle } from 'lucide-react';
import { AppButton, Card } from '../components/Shared';
import AppNavbar from '../components/AppNavbar';
import { PasswordModal } from '../components/ComponentCollection';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';

const SettingsPage = ({ openProfileModal }) => {
    const { currentUser, setCurrentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '' });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                firstName: currentUser.name?.split(' ')[0] || '',
                lastName: currentUser.name?.split(' ').slice(1).join(' ') || '',
                email: currentUser.email || ''
            });
        }
    }, [currentUser]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async () => {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();

        try {
            const response = await api.put('/patient/update-profile', { name: fullName });

            if (response.data.success) {
                const updatedUser = {
                    ...currentUser,
                    name: fullName,
                };
                setCurrentUser(updatedUser);
                toast.success('Changes saved successfully!');
            } else {
                toast.error("Failed to update profile.");
            }
        } catch (error) {
            console.error("Profile update failed:", error);
            toast.error("An error occurred while updating profile.");
        }
    };

    const handlePasswordChange = () => {
        setIsPasswordModalOpen(false);
        toast.success("Password changed successfully!");
    };

    if (!currentUser) {
        return <div className="dark:bg-gray-900 min-h-screen text-white text-center p-10">Loading settings...</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return (
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Profile Information</h3>
                            <div className="flex items-center space-x-6">
                                <img
                                    src={currentUser.profilePic || "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-173524.jpg?semt=ais_hybrid&w=740"}
                                    alt="Profile Avatar"
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                                    <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                                    <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="border-t pt-8 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Email Address</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Primary Email</p>
                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                                {formData.email}
                            </div>
                        </div>
                        <div className="border-t pt-8 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Password</h3>
                            <AppButton variant="secondary" onClick={() => setIsPasswordModalOpen(true)}>Change Password</AppButton>
                        </div>
                        <div className="flex justify-end items-center space-x-4 mt-8">
                            <AppButton variant="dark" onClick={handleSaveChanges}>Save Changes</AppButton>
                        </div>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="text-center p-10">
                        <h2 className="text-2xl font-bold dark:text-white">Privacy Controls</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Coming Soon...</p>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="text-center p-10">
                        <h2 className="text-2xl font-bold dark:text-white">Notifications</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Coming Soon...</p>
                    </div>
                );
            case 'support':
                return (
                    <div className="text-center p-10">
                        <h2 className="text-2xl font-bold dark:text-white">Help & Support</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Coming Soon...</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <AppNavbar openProfileModal={openProfileModal} />
            <main className="container mx-auto p-6">
                <Link to="/app/dashboard" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 mb-8 cursor-pointer"><ArrowLeft size={20} /> <span className="font-semibold">Settings & Privacy</span></Link>
                <div className="flex flex-col md:flex-row gap-10">
                    <aside className="w-full md:w-1/4">
                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                            <li><a onClick={() => setActiveTab('account')} className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'account' ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Settings size={20} /><span>Account Settings</span></a></li>
                            <li><a onClick={() => setActiveTab('privacy')} className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'privacy' ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Lock size={20} /><span>Privacy Controls</span></a></li>
                            <li><a onClick={() => setActiveTab('notifications')} className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'notifications' ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}><Bell size={20} /><span>Notifications</span></a></li>
                            <li><a onClick={() => setActiveTab('support')} className={`flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer ${activeTab === 'support' ? 'bg-indigo-100 text-indigo-700 dark:bg-gray-700 dark:text-white font-semibold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}><HelpCircle size={20} /><span>Help & Support</span></a></li>
                        </ul>
                    </aside>
                    <div className="w-full md:w-3/4">
                        <Card className="p-8">{renderContent()}</Card>
                    </div>
                </div>
                <div className="border-t dark:border-gray-700 mt-12 pt-4 text-center text-sm text-gray-500 dark:text-gray-400"><a href="#" className="hover:text-gray-700 dark:hover:text-white">Terms</a> &middot; <a href="#" className="ml-2 hover:text-gray-700 dark:hover:text-white">Privacy</a> &middot; <a href="#" className="ml-2 hover:text-gray-700 dark:hover:text-white">Help Center</a></div>
            </main>
            <PasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} onPasswordChange={handlePasswordChange} />
        </div>
    );
};

export default SettingsPage;