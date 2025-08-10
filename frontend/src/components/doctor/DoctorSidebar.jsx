// src/components/doctor/DoctorModal.jsx


// src/components/doctor/DoctorSidebar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart, MessageSquare, Users, User, X, Menu, Clapperboard, CalendarClock } from 'lucide-react';

const DoctorSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const NavItem = ({ to, icon, label }) => (
        <NavLink 
            to={to} 
            className={({ isActive }) => `flex items-center w-full text-left px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-gray-100'}`}
        >
            {icon}
            <span className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
        </NavLink>
    );

    return (
        <aside className={`bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
            <div className={`flex items-center border-b dark:border-gray-700 h-16 ${isSidebarOpen ? 'justify-between px-4' : 'justify-center'}`}>
                <h1 className={`text-2xl font-bold text-blue-700 dark:text-blue-400 transition-opacity duration-200 whitespace-nowrap ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0'}`}>PsyCare</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700">
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20}/>}
                </button>
            </div>
            <nav className="flex-1 mt-6 px-3 space-y-2">
                <NavItem to="dashboard" icon={<BarChart size={20} />} label="Dashboard" />
                <NavItem to="community" icon={<MessageSquare size={20} />} label="Community Qs" />
                <NavItem to="clips" icon={<Clapperboard size={20} />} label="Clips" />
                <NavItem to="appointments" icon={<CalendarClock size={20} />} label="Appointments" />
                <NavItem to="clients" icon={<Users size={20} />} label="My Clients" />
                <NavItem to="profile" icon={<User size={20} />} label="Profile" />
            </nav>
        </aside>
    );
};

export default DoctorSidebar;