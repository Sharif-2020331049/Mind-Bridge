// src/pages/doctor/DoctorClipsPage.jsx

import React, { useState } from 'react';
import { Video, Send } from 'lucide-react';
import { AppButton, Card } from '../../components/Shared';
import { useClips } from '../../contexts/ClipsContext';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth to get the current doctor

const DoctorClipsPage = () => {
    const { clips, addClip } = useClips();
    const { currentUser } = useAuth(); // Get the logged-in doctor

    const [videoFile, setVideoFile] = useState(null);
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState({ loading: false, success: '' });

    // Filter to get only the current doctor's clips
    const myClips = clips.filter(clip => clip.doctorId === currentUser.userId);

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!videoFile || !description) return;
        
        setStatus({ loading: true, success: '' });
        
        // Simulate upload delay
        setTimeout(() => {
            addClip({ videoFile, description });
            setStatus({ loading: false, success: 'Clip posted successfully!' });
            setVideoFile(null);
            document.getElementById('file-upload').value = ''; // Clear file input
            setDescription('');
            setTimeout(() => setStatus({ success: '' }), 3000); // Clear message after 3s
        }, 2000);
    };

    return (
        <div>
            {/* --- UPLOAD FORM SECTION --- */}
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Upload & Manage Clips</h1>
            <Card className="p-8 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Video File</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <Video className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="video/*" onChange={handleFileChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">{videoFile ? videoFile.name : 'MP4, WebM up to 50MB'}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="mt-1 block w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2" placeholder="Write a short description or advice..."></textarea>
                    </div>
                    {status.success && <p className="text-green-600 dark:text-green-400 text-center">{status.success}</p>}
                    <div className="text-right">
                        <AppButton type="submit" disabled={!videoFile || !description || status.loading}>
                            {status.loading ? 'Posting...' : <><Send size={18} className="mr-2"/>Post Clip</>}
                        </AppButton>
                    </div>
                </form>
            </Card>

            {/* --- MY CLIPS SECTION (NEW) --- */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">My Uploaded Clips ({myClips.length})</h2>
                {myClips.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myClips.map(clip => (
                            <Card key={clip.id} className="p-0 overflow-hidden">
                                <video src={clip.videoUrl} className="w-full h-40 object-cover bg-gray-900" controls />
                                <div className="p-4">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{clip.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">You haven't uploaded any clips yet.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default DoctorClipsPage;