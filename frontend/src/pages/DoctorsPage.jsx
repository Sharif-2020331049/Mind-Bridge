// src/pages/DoctorsPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Star as StarIcon } from 'lucide-react';
import { AppButton, Card } from '../components/Shared';
import AppNavbar from '../components/AppNavbar';
// 1. Import useAuth
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios.js';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useEffect } from 'react';

const DoctorsPage = ({ openProfileModal }) => {
     const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Fetch doctors from API
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await api.get(`/doctor/all-doctor`);
                setDoctors(response.data.doctors || []);
            } catch (err) {
                toast.error('Failed to fetch doctors');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <AppNavbar openProfileModal={openProfileModal} />
            <main className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Find a Consultant</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {doctors.map((doctor) => (
                        <Card key={doctor._id} className="flex flex-col">
                            <div className="p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <img src={doctor.profilePic} alt={doctor.fullName} className="w-20 h-20 rounded-full" />
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">{doctor.fullName}</h2>
                                        <div className="flex items-center mt-1">
                                            <StarIcon className="w-5 h-5 text-yellow-400" fill="currentColor" />
                                            <span className="text-gray-600 dark:text-gray-300 font-bold ml-1">4.5</span>
                                            <span className="text-gray-500 dark:text-gray-400 ml-2">(100 reviews)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {doctor.specialization.map(spec => (
                                        <span key={spec} className="text-xs font-semibold px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                                            {spec}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">{doctor.bio}</p>
                            </div>
                            <div className="mt-auto p-6 border-t dark:border-gray-700">
                                <Link to={`/app/doctor/${doctor._id}`}>
                                    <AppButton variant="primary" className="w-full">View Profile & Book</AppButton>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default DoctorsPage;
