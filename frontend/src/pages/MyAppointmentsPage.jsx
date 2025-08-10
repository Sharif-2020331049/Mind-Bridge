import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AppButton, Card } from '../components/Shared';
import AppNavbar from '../components/AppNavbar';
import api from '../api/axios';
import axios from 'axios';

const MyAppointmentsPage = ({ openProfileModal }) => {
  const token = localStorage.getItem('token');
  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/appointment/patient`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // console.log(res)

        if (res.data.success) {
          setMyAppointments(res.data.appointments);
        } else {
          setError("Failed to fetch appointments.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching appointments.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    } else {
      setError("No token found. Please log in.");
      setLoading(false);
    }
  }, [token]);

  const cancelAppointment = (id) => {
    // Implement cancel logic here
    alert(`Cancel appointment: ${id}`);
  };

  // const formatDate = (isoDate) => {
  //   const dateObj = new Date(isoDate);
  //   return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // };

  // const payWithBkash = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       'http://localhost:8000/api/v1/payment/bkash/create',
  //       { amount: 50 },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     )

  //     console.log(data)
  //     window.location.href = data?.bkashURL
  //   } catch (error) {
  //     // console.log(error.response.data)
  //     console.log(error);

  //   }
  // }
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <AppNavbar openProfileModal={openProfileModal} />
      <main className="container mx-auto p-6">
        <div className="mb-6">
          <Link to="/app/dashboard">
            <AppButton variant="secondary">
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </AppButton>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-4 dark:border-gray-700">
          My Appointments
        </h1>

        {loading ? (
          <Card className="text-center p-10">
            <p className="text-gray-500 dark:text-gray-400">Loading appointments...</p>
          </Card>
        ) : error ? (
          <Card className="text-center p-10">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </Card>
        ) : myAppointments.length > 0 ? (
          <div className="space-y-6">
            {myAppointments.map((appt) => (
              <Card key={appt._id} className="p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-[150px_1fr_auto] gap-6 p-6 items-center">
                  {/* Placeholder Image */}
                  <img
                    src={appt.doctorId?.profilePic}
                    alt="Doctor"
                    className="w-32 h-32 rounded-lg object-cover hidden md:block"
                  />

                  {/* Appointment Details */}
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {appt.doctorId?.fullName}
                    </h2>
                    <p className="font-semibold mt-3">Date & Time:</p>
                    <p>{appt.date} at {appt.timeSlot} </p>

                    <p className="font-semibold mt-3">Fee:</p>
                    <p>₹{appt.fee}</p>

                    <p className="font-semibold mt-3">Status:</p>
                    <p>{appt.status}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2 justify-center items-center border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6 border-gray-200 dark:border-gray-700">
                    {appt.status === 'pending' && (
                      <>
                        <AppButton
                          variant="primary"
                          className="w-full"
                          onClick={async () => {
                            try {
                              const { data } = await axios.post(
                                'http://localhost:8000/api/v1/payment/bkash/create',
                                { amount: appt.fee, doctorId: appt.doctorId, patientId: appt.patientId, timeSlot:appt.timeSlot, date: appt.date },
                                {
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              )

                              console.log(data)
                              window.location.href = data?.bkashURL
                            } catch (error) {
                              // console.log(error.response.data)
                              console.log(error);

                            }
                          }}
                        >
                          Pay Online
                        </AppButton>
                        <AppButton
                          variant="danger"
                          className="w-full"
                          onClick={() => cancelAppointment(appt._id)}
                        >
                          Cancel Appointment
                        </AppButton>
                      </>
                    )}
                    {appt.status === 'cancelled' && (
                      <AppButton variant="secondary" disabled className="w-full bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 cursor-not-allowed">
                        Cancelled
                      </AppButton>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-10">
            <p className="text-gray-500 dark:text-gray-400">You have no appointments scheduled.</p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default MyAppointmentsPage;
