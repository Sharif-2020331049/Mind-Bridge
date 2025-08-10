// src/components/doctor/DoctorModal.jsx

import React from 'react';
import { X } from 'lucide-react';

const DoctorModal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 relative flex-grow overflow-y-auto">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 z-10">
                        <X size={24} />
                    </button>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DoctorModal;