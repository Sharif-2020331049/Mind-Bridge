 // File: frontend/src/pages/doctor/DoctorClientsPage.jsx
// --- REWRITTEN BY AI TO FETCH LIVE DATA ---

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import DoctorModal from '../../components/doctor/DoctorModal';
import api from '../../api/axios'; // Import our configured axios instance

const DoctorClientsPage = () => {
    // 1. State for managing real client data, loading, and errors
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedClient, setSelectedClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // 2. useEffect to fetch data when the component mounts
    useEffect(() => {
        const fetchClients = async () => {
            try {
                // Call the new backend endpoint we created for fetching clients
                const response = await api.get('/doctors/my-clients');
                if (response.data.success) {
                    setClients(response.data.data); // Set the client list from the API response
                } else {
                    setError('Failed to fetch clients.');
                }
            } catch (err) {
                console.error("API Error:", err);
                setError(err.response?.data?.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false); // Stop loading, whether successful or not
            }
        };

        fetchClients();
    }, []); // The empty array [] ensures this effect runs only once

    // 3. The search filter now works on the state fetched from the API
    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 4. Handle Loading State
    if (loading) {
        return <div className="p-6 text-center">Loading your client list...</div>;
    }

    // 5. Handle Error State
    if (error) {
        return <div className="p-6 text-center text-red-500">Error: {error}</div>;
    }

    // Your existing JSX is largely unchanged, just adapted for the new data structure
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">My Clients</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">A list of all patients you have had an appointment with.</p>

            <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by client name or email..." className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Member Since</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredClients.length > 0 ? filteredClients.map(client => (
                            <tr key={client._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{client.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(client.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => setSelectedClient(client)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View Profile</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                    No clients found. A client will appear here after their first appointment with you.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Your Modal component remains unchanged and should work with the selectedClient state */}
            <DoctorModal isOpen={!!selectedClient} onClose={() => setSelectedClient(null)}>
                {selectedClient && (
                    <div className="text-gray-900 dark:text-gray-200">
                         <h2 className="text-2xl font-bold mb-1">{selectedClient.name}</h2>
                         <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{`Email: ${selectedClient.email}`}</p>
                         {/* ... (rest of your modal content) ... */}
                         <div className="mt-6 flex justify-end">
                            <button onClick={() => setSelectedClient(null)} className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">Close</button>
                         </div>
                    </div>
                )}
            </DoctorModal>
        </div>
    );
};

export default DoctorClientsPage;