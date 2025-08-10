import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// ADDED: Import useAuth to access the context
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

// Main Component for the Doctor Signup Form
const DoctorSignupForm = () => {
    // --- STATE MANAGEMENT ---
    // ADDED: Get the new registerDoctor function from the context
    const { registerDoctor } = useAuth();
    const navigate = useNavigate();

    // State for basic account info
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        password: '',
        address: '',
        specializations: '',
        licenseNumber: '',
        workExperience: '',
        bio: '',
        terms: false,
        appointmentFee: '', // Merged Line
    });

    // State for a single education entry
    const [education, setEducation] = useState({
        degree: '',
        university: '',
        year: ''
    });

    // State for file uploads and previews
    const [pfp, setPfp] = useState(null);
    const [pfpPreview, setPfpPreview] = useState('https://placehold.co/128x128/e2e8f0/64748b?text=Upload');
    const [certificationFile, setCertificationFile] = useState(null);

    // State for form validation messages
    const [message, setMessage] = useState({ text: '', type: '' });

    // --- EVENT HANDLERS ---
const [isLoading, setIsLoading] = useState(false);
    // Handles changes for simple text inputs, textareas, and checkboxes
    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value
        }));
    };

    // Handler for the single education block
    const handleEducationChange = (e) => {
        const { name, value } = e.target;
        setEducation(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handler for Profile Picture Upload
    const handlePfpChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPfp(file);
            setPfpPreview(URL.createObjectURL(file));
        }
    };

    // Handler for Certification File Upload
    const handleCertificationChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCertificationFile(file);
        }
    };

    // --- FORM SUBMISSION ---
    // MODIFIED: The handleSubmit function now saves the data
   // src/pages/DoctorSignupForm.jsx

// --- FORM SUBMISSION (This is the updated function) ---
const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Your validation logic is good, no changes needed there.
    for (const key in formData) {
        if (formData[key] === '' || (key === 'terms' && !formData[key])) {
            setMessage({ text: 'Please fill out all required fields and agree to the terms.', type: 'error' });
            return;
        }
    }
    if (!education.degree || !education.university || !education.year || !certificationFile) {
        setMessage({ text: 'Please complete the education section and upload your certification.', type: 'error' });
        return;
    }
    // END of validation logic

    setIsLoading(true);
    const submissionData = new FormData();

    // Append all text fields from formData state
    // These keys ('fullName', 'email', 'phoneNumber', etc.) are what the controller will now expect
    for (const key in formData) {
        submissionData.append(key, formData[key]);
    }
    
    // Append education data as a single JSON string.
    // The backend controller will be responsible for parsing this.
    submissionData.append('education', JSON.stringify(education));

    // **CHANGED**: Append files using the EXACT names your backend 'upload.js' expects.
    if (pfp) {
        submissionData.append('profilePic', pfp); // CHANGED from 'pfp' to 'profilePic'
    }
    if (certificationFile) {
        submissionData.append('certificate', certificationFile); // CHANGED from 'certification' to 'certificate'
    }

    try {
        // **CHANGED**: The URL is now '/doctor/register'.
        // Your axios baseURL is '/api/v1', and your app.js uses '/doctor' for the doctorRouter.
        // This combines to the correct full path: /api/v1/doctor/register
        const response = await api.post('/doctor/register', submissionData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // SUCCESS! The backend accepted the data.
        setMessage({ text: response.data.message || 'Registration successful! Redirecting to login...', type: 'success' });
        
        setTimeout(() => {
            navigate('/doctor-login');
        }, 2000);

    } catch (err) {
        // ERROR! Use the specific error message from the backend.
        const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
        setMessage({ text: errorMessage, type: 'error' });
    } finally {
        setIsLoading(false);
    }
};

    // --- JSX RENDER ---
    return (
        <div className="bg-slate-50 font-sans">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-lg">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <Link to="/" className="inline-block mb-4">
                            <span className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">PsyCare</span>
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">Join PsyCare as a Consultant</h1>
                        <p className="text-slate-500 mt-3">Complete the form below to create your professional profile and start helping others.</p>
                    </div>

                    {/* Custom Message Box */}
                    {message.text && (
                        <div id="message-box" className={`p-4 mb-6 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {message.text}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Section 1: Personal & Account Information */}
                        <fieldset className="mb-8">
                            <legend className="text-xl font-semibold text-slate-700 border-b-2 border-blue-500 pb-2 mb-6 w-full">Account Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-slate-600">Full Name</label>
                                    <input type="text" id="fullName" value={formData.fullName} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Dr. Jane Doe" required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-slate-600">Email Address</label>
                                    <input type="email" id="email" value={formData.email} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="you@example.com" required />
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-slate-600">Phone Number</label>
                                    <input type="tel" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="(123) 456-7890" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-slate-600">Create Password</label>
                                    <input type="password" id="password" value={formData.password} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required />
                                </div>
                            </div>
                        </fieldset>

                        {/* Section 2: Professional Information */}
                        <fieldset className="mb-8">
                            <legend className="text-xl font-semibold text-slate-700 border-b-2 border-blue-500 pb-2 mb-6 w-full">Professional Information</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-slate-600">Primary Clinic/Office Address</label>
                                    <input type="text" id="address" value={formData.address} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="123 Wellness Ave, Suite 100, City, Country" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="specializations" className="block mb-2 text-sm font-medium text-slate-600">Areas of Specialization (comma-separated)</label>
                                    <input type="text" id="specializations" value={formData.specializations} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g., Cognitive Behavioral Therapy, Anxiety, PTSD" required />
                                </div>
                                <div>
                                    <label htmlFor="licenseNumber" className="block mb-2 text-sm font-medium text-slate-600">License Number</label>
                                    <input type="text" id="licenseNumber" value={formData.licenseNumber} onChange={handleChange} className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="e.g., PSY123456" required />
                                </div>
                                <div>
                                    <label htmlFor="appointmentFee" className="block mb-2 text-sm font-medium text-slate-600">Appointment Fee ($)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            id="appointmentFee" 
                                            value={formData.appointmentFee} 
                                            onChange={handleChange} 
                                            className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-7" 
                                            placeholder="150" 
                                            required 
                                            min="0"
                                        />
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">$</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-slate-600">Upload Certification</label>
                                    <div className="flex items-center gap-4">
                                        <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 text-slate-800 text-sm font-medium py-2.5 px-4 rounded-lg">
                                            Choose File
                                            <input type="file" onChange={handleCertificationChange} className="hidden" accept="image/*,.pdf" required />
                                        </label>
                                        <span className="text-sm text-slate-500">{certificationFile ? certificationFile.name : 'No file chosen'}</span>
                                    </div>
                                </div>
                            </div>
                        </fieldset>

                        {/* Section 3: Education History */}
                        <fieldset className="mb-8">
                               <legend className="text-xl font-semibold text-slate-700 border-b-2 border-blue-500 pb-2 mb-6 w-full">Education</legend>
                               <div className="p-4 border border-slate-200 rounded-lg">
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div>
                                           <label htmlFor="degree" className="block mb-1 text-xs font-medium text-slate-500">Degree/Certificate</label>
                                           <input type="text" id="degree" name="degree" value={education.degree} onChange={handleEducationChange} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2" placeholder="e.g., PhD in Clinical Psychology" required />
                                       </div>
                                       <div>
                                           <label htmlFor="university" className="block mb-1 text-xs font-medium text-slate-500">Institution</label>
                                           <input type="text" id="university" name="university" value={education.university} onChange={handleEducationChange} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2" placeholder="University of Example" required />
                                       </div>
                                       <div className="md:col-span-2">
                                           <label htmlFor="year" className="block mb-1 text-xs font-medium text-slate-500">Year of Completion</label>
                                           <input type="text" id="year" name="year" value={education.year} onChange={handleEducationChange} className="bg-white border border-slate-300 text-slate-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2" placeholder="2020" required />
                                       </div>
                                   </div>
                               </div>
                        </fieldset>
                        
                        {/* Section 4: Work Experience */}
                        <fieldset className="mb-8">
                               <legend className="text-xl font-semibold text-slate-700 border-b-2 border-blue-500 pb-2 mb-6 w-full">Work Experience</legend>
                               <div>
                                   <label htmlFor="workExperience" className="block mb-2 text-sm font-medium text-slate-600">Experience Summary</label>
                                   <textarea id="workExperience" value={formData.workExperience} onChange={handleChange} rows="5" className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Briefly describe your professional background, roles, and key areas of practice." required></textarea>
                               </div>
                        </fieldset>

                        {/* Section 5: Public Profile */}
                        <fieldset>
                            <legend className="text-xl font-semibold text-slate-700 border-b-2 border-blue-500 pb-2 mb-6 w-full">Public Profile</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 flex flex-col items-center">
                                    <label className="block mb-2 text-sm font-medium text-slate-600">Profile Picture</label>
                                    <img src={pfpPreview} className="w-32 h-32 rounded-full object-cover bg-slate-200 mb-4" alt="Profile preview" />
                                    <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg">
                                        Upload Photo
                                        <input type="file" onChange={handlePfpChange} className="hidden" accept="image/*" />
                                    </label>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="bio" className="block mb-2 text-sm font-medium text-slate-600">Biography & Approach</label>
                                    <textarea id="bio" value={formData.bio} onChange={handleChange} rows="8" className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Tell potential clients about yourself, your therapeutic philosophy, and what they can expect..." required></textarea>
                                </div>
                            </div>
                        </fieldset>
                        
                         {/* Form Submission */}
                        <div className="mt-10 pt-6 border-t border-slate-200">
                            <div className="flex items-center">
                                <input id="terms" type="checkbox" checked={formData.terms} onChange={handleChange} className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500" required />
                                <label htmlFor="terms" className="ml-2 text-sm font-medium text-slate-600">I agree to the <a href="#" className="text-blue-600 hover:underline">terms and conditions</a> and <a href="#" className="text-blue-600 hover:underline">privacy policy</a> of PsyCare.</label>
                            </div>

                            <button type="submit" className="w-full mt-6 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-3 text-center transition-colors duration-200">
                                Create My Account
                            </button>
                        </div>
                    </form>

                    {/* Link to Sign In */}
                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?
                        <Link to="/login" className="font-medium text-blue-600 hover:underline ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DoctorSignupForm;