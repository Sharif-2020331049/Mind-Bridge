// frontend/src/pages/doctor/DoctorDashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; 
import api from '../../api/axios';

const DoctorDashboardPage = () => {
    const { currentUser } = useAuth();
    const [schedule, setSchedule] = useState([]);
    const [isScheduleLoading, setIsScheduleLoading] = useState(true);
    const [scheduleError, setScheduleError] = useState('');

    useEffect(() => {
        const fetchTodaysSchedule = async () => {
            try {
                const response = await api.get('/doctor/schedule/today');
                if (response.data.success) {
                    setSchedule(response.data.schedule);
                }
            } catch (err) {
                console.error("Failed to fetch schedule:", err);
                setScheduleError('Could not load schedule. Please try again.');
            } finally {
                setIsScheduleLoading(false);
            }
        };
        fetchTodaysSchedule();
    }, []);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-slate-800">
                Welcome back, {currentUser.fullName}!
            </h1>
            <p className="mt-2 text-slate-600">
                You have <span className="font-bold text-blue-600">{schedule.length} upcoming appointments</span> scheduled for today.
            </p>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-slate-700 mb-4">Today's Schedule</h2>
                    
                    {isScheduleLoading ? (
                        <p className="text-slate-500">Loading schedule...</p>
                    ) : scheduleError ? (
                        <p className="text-red-500">{scheduleError}</p>
                    ) : schedule.length === 0 ? (
                        <p className="text-slate-500">No appointments scheduled for today.</p>
                    ) : (
                        <ul className="space-y-4">
                            {schedule.map(item => (
                                <li key={item._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                                    <div className="flex items-center">
                                        <div className="font-semibold text-blue-600 mr-4">
                                            {item.timeSlot}
                                        </div>
                                        <div>
                                            {/* --- THE FIX IS ON THIS LINE --- */}
                                            {/* Changed item.patient to item.patientId to match the backend data */}
                                            <p className="font-medium text-slate-800">{item.patientId?.name || 'Patient Name Not Found'}</p>
                                            
                                            <p className="text-sm text-slate-500">Appointment</p>
                                        </div>
                                    </div>
                                    <a href="#" className="text-sm font-medium text-blue-500 hover:underline">View Details</a>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-bold text-slate-700 mb-4">Community Questions (0)</h2>
                     <p className="text-slate-500">No unanswered questions right now.</p>
                     <a href="#" className="text-sm font-medium text-blue-500 hover:underline mt-4 inline-block">View All</a>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboardPage;