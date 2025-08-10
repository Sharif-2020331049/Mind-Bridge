// src/pages/BookAppointmentPage.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppButton, Card } from '../components/Shared';
import AppNavbar from '../components/AppNavbar';
import { MOCK_DOCTORS_LIST } from '../data/mockData';

const BookAppointmentPage = ({ openProfileModal }) => {
    const { doctorId } = useParams();
    const doctor = MOCK_DOCTORS_LIST.find(d => d.id === parseInt(doctorId, 10));

    if (!doctor) { 
        return ( 
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                <AppNavbar openProfileModal={openProfileModal}/>
                <main className="container mx-auto p-6 text-center">
                    <h1 className="text-2xl font-bold dark:text-white">Doctor not found</h1>
                    <Link to="/app/doctors"><AppButton className="mt-4">Back to Doctors</AppButton></Link>
                </main>
            </div> 
        );
    }
    return ( 
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            <AppNavbar openProfileModal={openProfileModal}/>
            <main className="container mx-auto p-6">
                <Link to="/app/doctors">
                    <AppButton variant="secondary" className="mb-6"><ArrowLeft size={20} className="mr-2" />Back to Doctors</AppButton>
                </Link>
                <Card className="p-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Book Appointment</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">You are booking with <span className="font-bold text-indigo-600 dark:text-indigo-400">{doctor.fullName}</span>.</p>
                    <div className="text-center text-gray-700 dark:text-gray-300">
                        <h2 className="text-xl font-bold mb-4">Coming Soon!</h2>
                        <p>Date & time selection will be implemented soon.</p>
                    </div>
                </Card>
            </main>
        </div> 
    );
};

export default BookAppointmentPage;