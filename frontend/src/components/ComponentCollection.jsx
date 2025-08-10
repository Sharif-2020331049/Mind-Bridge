// src/components/ComponentCollection.jsx
import React, { useState } from 'react';
import { Card, AppButton } from './Shared';
import { X, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../api/axios.js';

export const PasswordModal = ({ isOpen, onClose, onPasswordChange }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Confirm password doesn't match");
            return;
        }

        try {
            const response = await api.put(
                'patient/update-profile',
                {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                toast.success('Password changed successfully!');
                onClose(); // Close modal
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Reset
            } else {
                toast.error(response.data.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error('Password update failed:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating password.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <Card className="p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Change Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <AppButton type="button" variant="secondary" onClick={onClose}>Cancel</AppButton>
                        <AppButton type="submit" variant="primary">Change Password</AppButton>
                    </div>
                </form>
            </Card>
        </div>
    );
};


export const ProfileModal = ({ isOpen, onClose, user }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
            <Card className="p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Profile</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><X size={24} /></button>
                </div>
                <div className="flex flex-col items-center text-center">
                    <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
            </Card>
        </div>
    );
};

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <Card className="p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Confirm Deletion</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                    <AppButton variant="secondary" onClick={onClose}>Cancel</AppButton>
                    <AppButton variant="danger" onClick={onConfirm}>Delete</AppButton>
                </div>
            </Card>
        </div>
    );
};

export const Toast = ({ message, isVisible }) => {
    if (!isVisible) return null;
    return (
        <div className="fixed bottom-10 right-10 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg flex items-center space-x-3 z-50 animate-bounce">
            <CheckCircle size={24} />
            <span>{message}</span>
        </div>
    );
};

// The 'export default ComponentCollection;' line that was here is now removed.