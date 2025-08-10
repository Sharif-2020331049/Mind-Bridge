import React, { createContext, useState, useEffect, useMemo, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
    const { currentUser } = useAuth();

    // Initialize appointments from localStorage
    const [appointments, setAppointments] = useState(() => {
        const saved = localStorage.getItem('appointments');
        return saved ? JSON.parse(saved) : [];
    });

    // Save appointments to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('appointments', JSON.stringify(appointments));
    }, [appointments]);

    // Function to book a new appointment
    const bookAppointment = useCallback((doctor, appointmentDetails) => {
        if (!currentUser) return;

        const newAppointment = {
            id: `appt_${Date.now()}`,
            patientId: currentUser.userId,
            status: 'Upcoming',
            ...doctor, // Spread doctor info
            ...appointmentDetails, // Spread date and time
        };
        setAppointments(prev => [newAppointment, ...prev]);
    }, [currentUser]);

    // Function to cancel an appointment
    const cancelAppointment = useCallback((appointmentId) => {
        setAppointments(prev => 
            prev.map(appt => 
                appt.id === appointmentId ? { ...appt, status: 'Cancelled' } : appt
            )
        );
    }, []);

    // Function to mark an appointment as completed
    const completeAppointment = useCallback((appointmentId) => {
        setAppointments(prev => 
            prev.map(appt => 
                appt.id === appointmentId ? { ...appt, status: 'Completed' } : appt
            )
        );
    }, []);

    // --- NEW FUNCTION TO HANDLE MISSED APPOINTMENTS ---
    const missAppointment = useCallback((appointmentId) => {
        setAppointments(prev => 
            prev.map(appt => 
                appt.id === appointmentId ? { ...appt, status: 'Missed' } : appt
            )
        );
    }, []);

    const value = useMemo(() => ({
        appointments,
        bookAppointment,
        cancelAppointment,
        completeAppointment,
        missAppointment, // Expose the new function
    }), [appointments, bookAppointment, cancelAppointment, completeAppointment, missAppointment]);

    return (
        <AppointmentContext.Provider value={value}>
            {children}
        </AppointmentContext.Provider>
    );
};

export const useAppointments = () => {
    const context = useContext(AppointmentContext);
    if (context === undefined) {
        throw new Error('useAppointments must be used within an AppointmentProvider');
    }
    return context;
};
