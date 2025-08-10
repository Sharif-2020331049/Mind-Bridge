// --- REPLACE THE ENTIRE FILE with this code ---
import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import api from '../../api/axios'; // Import our configured axios instance

const DoctorAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                // Call the new backend endpoint: GET /api/v1/appointments/doctor
                const response = await api.get('/appointments/doctor');

                if (response.data.success) {
                    setAppointments(response.data.data);
                } else {
                    setError('Failed to fetch appointments.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, []); // Empty array ensures this runs only once on mount

    if (loading) {
        return <div className="p-6 text-center">Loading appointments...</div>;
    }

    if (error) {
        return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    }

    const handleComplete = (id) => alert(`TODO: API call to complete appointment ${id}`);
    const handleCancel = (id) => alert(`TODO: API call to cancel appointment ${id}`);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Appointments</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Patient</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {appointments.length > 0 ? appointments.map(appt => (
                            <tr key={appt._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="w-10 h-10 rounded-full" src={'https://ui-avatars.com/api/?name=' + (appt.patientId?.fullName || 'P')} alt="avatar" />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{appt.patientId?.name || 'nN/A'}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{appt.patientId?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    <p>{appt.appointmentDate ? new Date(appt.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                        appt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                        appt.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {appt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    {appt.status === 'confirmed' ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <button onClick={() => handleComplete(appt._id)} className="p-2 rounded-full text-green-600 hover:bg-green-100" title="Mark as Completed"><Check size={18} /></button>
                                            <button onClick={() => handleCancel(appt._id)} className="p-2 rounded-full text-red-600 hover:bg-red-100" title="Cancel Appointment"><X size={18} /></button>
                                        </div>
                                    ) : <span>-</span>}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No appointments found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorAppointmentsPage;