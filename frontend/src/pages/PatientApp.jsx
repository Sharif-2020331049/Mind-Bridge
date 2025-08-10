import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

import DashboardPage from './DashboardPage';
import ShareStoryPage from './ShareStoryPage';
import ProblemDetailPage from './ProblemDetailPage';
import MyPostsPage from './MyPostsPage';
import AdviceNotesPage from './AdviceNotesPage';
import DoctorsPage from './DoctorsPage';
import SettingsPage from './SettingsPage';
import ClipsPage from './ClipsPage';
import AiChatAssistant from '../components/AiChatAssistant';
import MyAppointmentsPage from './MyAppointmentsPage';
import DoctorProfileDetailPage from './DoctorProfileDetailPage';

import { ProfileModal, DeleteConfirmationModal } from '../components/ComponentCollection';
import PaymentSuccess from './PaymentSuccess';
import PaymentFailiure from './PaymentFailiure';

const PatientAppContent = () => {
    const { currentUser } = useAuth();
    const { deletePost } = usePosts();
    const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
    const [postToDelete, setPostToDelete] = React.useState(null);

    const openDeleteModal = (postId) => { setPostToDelete(postId); setIsDeleteModalOpen(true); };
    const closeDeleteModal = () => { setPostToDelete(null); setIsDeleteModalOpen(false); };
    const openProfileModal = () => setIsProfileModalOpen(true);
    const closeProfileModal = () => setIsProfileModalOpen(false);
    
    const handleDeleteConfirm = () => {
        if (postToDelete) {
            deletePost(postToDelete);
            closeDeleteModal();
        }
    };

    return (
        <>
            <Routes>
                {/* <Route path="dashboard" element={<DashboardPage openDeleteModal={openDeleteModal} openProfileModal={openProfileModal} />} /> */}
                <Route path='dashboard' element= { <DashboardPage/>}/>
                <Route path="clips" element={<ClipsPage openProfileModal={openProfileModal}/>} />
                <Route path="share-story" element={<ShareStoryPage />} />
                <Route path="problem/:postId" element={<ProblemDetailPage openProfileModal={openProfileModal} />} />
                <Route path="my-posts" element={<MyPostsPage openDeleteModal={openDeleteModal} openProfileModal={openProfileModal} />} />
                <Route path="advice-notes" element={<AdviceNotesPage openProfileModal={openProfileModal} />} />
                <Route path="doctors" element={<DoctorsPage openProfileModal={openProfileModal} />} />
                <Route path="doctor/:doctorId" element={<DoctorProfileDetailPage openProfileModal={openProfileModal} />} />
                <Route path="my-appointments" element={<MyAppointmentsPage openProfileModal={openProfileModal} />} />

                <Route path="bkash-payment/success" element={<PaymentSuccess openProfileModal={openProfileModal} />} />
                <Route path="bkash-payment/error?" element={<PaymentFailiure openProfileModal={openProfileModal} />} />
                
                <Route path="settings" element={<SettingsPage openProfileModal={openProfileModal} />} />
                <Route index element={<DashboardPage openDeleteModal={openDeleteModal} openProfileModal={openProfileModal} />} />
            </Routes>
            <AiChatAssistant />
            <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} user={currentUser} />
            <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} onConfirm={handleDeleteConfirm} />
        </>
    );
};

const PatientApp = () => {
    const { isDarkMode } = useApp();
    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <PatientAppContent />
        </div>
    );
};

export default PatientApp;