import React, { useState, useRef, useEffect } from 'react';
import { Shield, Camera, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DoctorProfilePage = () => {
    const { currentUser, updateCurrentUser } = useAuth();

    // Local state for form data, initialized with the current user's info
    const [formData, setFormData] = useState(currentUser);
    const [tempProfilePic, setTempProfilePic] = useState(currentUser.avatar);
    const [showSuccess, setShowSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // This effect ensures the form updates if the currentUser object changes from elsewhere
    useEffect(() => {
        setFormData(currentUser);
        setTempProfilePic(currentUser.profilePic);
    }, [currentUser]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleEducationChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            education: { ...prev.education, [name]: value }
        }));
    };

    const handleProfilePicChange = (event) => {
        if (event.target.files[0]) {
            const newPicUrl = URL.createObjectURL(event.target.files[0]);
            setTempProfilePic(newPicUrl);
        }
    };

    const handleEditClick = () => fileInputRef.current.click();

    const handleSaveChanges = () => {
        // Create the final data object to save
        const updatedData = {
            ...formData,
            fullName: formData.fullName, // Ensure fullName is updated from the 'name' field
            avatar: tempProfilePic, // Save the new avatar
        };
        
        updateCurrentUser(updatedData); // Call the context function to save data
        
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            <img src={tempProfilePic} alt={formData.fullName} className="w-32 h-32 rounded-full mx-auto object-cover" />
                            <input type="file" ref={fileInputRef} onChange={handleProfilePicChange} className="hidden" accept="image/*" />
                            <button onClick={handleEditClick} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"><Camera size={16} /></button>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formData.fullName}</h2>
                        <p className="text-gray-500 dark:text-gray-400">Psychiatrist</p>
                        <div className="mt-4 flex items-center justify-center space-x-2 text-green-500"><Shield size={18} /><span className="font-semibold">Verified Professional</span></div>
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-6">Profile Information</h3>
                        <div className="space-y-6">
                            <fieldset><legend className="text-lg font-semibold text-slate-600 dark:text-slate-300 pb-2 mb-4 w-full">Account Details</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="name" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label><input id="name" type="text" value={formData.fullName || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" /></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label><input id="email" type="email" value={formData.email || ''} readOnly className="mt-1 block w-full bg-gray-200 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 cursor-not-allowed" /></div><div><label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label><input id="phoneNumber" type="tel" value={formData.phone || ''} readOnly className="mt-1 block w-full bg-gray-200 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 cursor-not-allowed" /></div><div><label htmlFor="address" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Address</label><input id="address" type="text" value={formData.address || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" /></div></div></fieldset>
                            <fieldset><legend className="text-lg font-semibold text-slate-600 dark:text-slate-300 pb-2 mb-4 w-full">Professional Details</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-500 dark:text-gray-400">License Number</label><input id="licenseNumber" type="text" value={formData.license || ''} readOnly className="mt-1 block w-full bg-gray-200 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2 cursor-not-allowed" /></div><div><label htmlFor="specializations" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Specializations</label><input id="specializations" type="text" value={formData.specialization || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" /></div>
                                {/* --- APPOINTMENT FEE ADDED HERE --- */}
                                <div className="md:col-span-2"><label htmlFor="appointmentFee" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Appointment Fee ($)</label><input id="appointmentFee" type="number" value={formData.fees || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" /></div>
                                <div className="md:col-span-2"><label htmlFor="workExperience" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Work Experience</label><textarea id="workExperience" rows="4" value={formData.workExperience || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2"></textarea></div><div className="md:col-span-2"><label htmlFor="bio" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Biography</label><textarea id="bio" rows="4" value={formData.bio || ''} onChange={handleChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2"></textarea></div></div></fieldset>
                            <fieldset><legend className="text-lg font-semibold text-slate-600 dark:text-slate-300 pb-2 mb-4 w-full">Education</legend><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label htmlFor="degree" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Degree</label><input id="degree" name="degree" type="text" value={formData.degree || ''} onChange={handleEducationChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" /></div>
                                <div><label htmlFor="university" className="block text-sm font-medium text-gray-500 dark:text-gray-400">University</label><input id="university" name="university" type="text" value={formData.medicalCollege || ''} onChange={handleEducationChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" /></div>
                                <div className="md:col-span-2"><label htmlFor="year" className="block text-sm font-medium text-gray-500 dark:text-gray-400">Year of Completion</label><input id="year" name="year" type="text" value={formData. yearOfCompletion || ''} onChange={handleEducationChange} className="mt-1 block w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md shadow-sm p-2" /></div>
                            </div></fieldset>
                            <div className="flex justify-end pt-4 items-center border-t border-gray-200 dark:border-gray-700">
                                {showSuccess && (<div className="flex items-center text-green-500 mr-4"><CheckCircle size={20} className="mr-2" /><span>Changes saved successfully!</span></div>)}
                                <button onClick={handleSaveChanges} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
