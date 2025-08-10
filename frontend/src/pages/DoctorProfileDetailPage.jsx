import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, redirect } from 'react-router-dom';
import AppNavbar from '../components/AppNavbar';
import { AppButton } from '../components/Shared';
import { MapPin, Phone, Star, Video, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const DoctorProfilePage = ({ openProfileModal }) => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]); // all booked appointments for this doctor
  const [loading, setLoading] = useState(true);

  // For booking UI
  const bookingDates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    bookingDates.push({
      day: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      date: date.getDate(),
      fullDate: date,
    });
  }

  const timeSlots = ['05:00 pm', '06:00 pm', '06:30 pm', '07:00 pm', '07:30 pm', '08:00 pm', '08:30 pm'];
  const [selectedDate, setSelectedDate] = useState(bookingDates[0]);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        setLoading(true);
        // Fetch doctor info
        const docRes = await api.get(`/doctor/get-doctor/${doctorId}`);
        if (!docRes.data.success) throw new Error(docRes.data.message || 'Failed to fetch doctor');
        setDoctor(docRes.data.doctor);

        // Fetch appointments for this doctor - assuming your backend has such endpoint
        // Replace with your actual endpoint!
        const apptRes = await api.get(`/appointment/by-doctor/${doctorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

       
       
        if (!apptRes.data.success) throw new Error(apptRes.data.message || 'Failed to fetch appointments');
        setAppointments(apptRes.data.appointments || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  // Format selected date string for comparison with appointments
  const formattedSelectedDate = selectedDate?.fullDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Extract booked slots for the selected date
  const bookedSlotsForDay = appointments
    .filter(appt => {
      const apptDate = new Date(appt.date);
      return (
        appt.doctorId === doctorId &&
        apptDate.toDateString() === selectedDate.fullDate.toDateString()
      );
    })
    .map(appt => appt.timeSlot);

  // Booking function
  const handleBooking = async () => {
    if (!doctor || !selectedDate || !selectedTime) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to book an appointment');
        return;
      }

      const appointmentDetails = {
        doctorId: doctor._id,
        date: selectedDate.fullDate.toLocaleDateString('en-US'),
        timeSlot: selectedTime,
        fee: doctor.fee
      };

      console.log(appointmentDetails);
      

      const response = await api.post(
        '/patient/doctor-booking',
        appointmentDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success('Appointment booked successfully');
        navigate('/app/my-appointments');
      } else {
        alert(response.data.message || 'Booking failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert(error.response?.data?.message || 'Something went wrong during booking');
    }
  };


  if (loading) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <AppNavbar openProfileModal={openProfileModal} />
        <main className="container mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold dark:text-white">Doctor not found</h1>
          <Link to="/app/doctors">
            <AppButton className="mt-4">Back to Doctors</AppButton>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <AppNavbar openProfileModal={openProfileModal} />
      <main className="container mx-auto p-6 max-w-4xl">
        <Link to="/app/doctors">
          <AppButton variant="secondary" className="mb-6 flex items-center">
            <ArrowLeft size={20} className="mr-2" />
            Back to Doctors
          </AppButton>
        </Link>

        {/* Doctor Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={doctor.profilePic || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
            alt={doctor.fullName}
            className="w-40 h-40 rounded-full object-cover shadow-md"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{doctor.fullName}</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{doctor.specialization?.join(', ')}</p>

            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star size={18} />
                <span>{doctor.rating?.toFixed(1) || '4.5'} / 5</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <MapPin size={18} />
                <span>{doctor.location || 'Dhaka, Bangladesh'}</span>
              </div>
            </div>

            <div className="mt-4 text-gray-600 dark:text-gray-300 flex items-center gap-2 justify-center md:justify-start">
              <Phone size={18} />
              <span>{doctor.phone || '+8801XXXXXXX'}</span>
            </div>

            <p className="mt-2 text-gray-800 dark:text-white font-medium">
              Appointment Fee: <span className="text-indigo-600">{doctor.fee || 1000} BDT</span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Booking slots</h2>
          <div className="flex space-x-2 overflow-x-auto pb-4">
            {bookingDates.map(d => (
              <button
                key={d.date}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedTime(null);
                }}
                className={`flex-shrink-0 w-14 h-16 rounded-lg flex flex-col items-center justify-center transition ${selectedDate.date === d.date
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                <span className="text-sm">{d.day}</span>
                <span className="font-bold text-lg">{d.date}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
            {timeSlots.map(time => {
              const isBooked = bookedSlotsForDay.includes(time);

              // Check if the time slot is in the past for today's date
              let isPast = false;
              const now = new Date();
              if (
                selectedDate.date === now.getDate() &&
                selectedDate.fullDate.getMonth() === now.getMonth() &&
                selectedDate.fullDate.getFullYear() === now.getFullYear()
              ) {
                const [hourStr, minuteStr] = time.split(':');
                const period = time.slice(-2);
                let hour = parseInt(hourStr, 10);
                if (period.toLowerCase() === 'pm' && hour !== 12) {
                  hour += 12;
                }
                if (period.toLowerCase() === 'am' && hour === 12) {
                  hour = 0; // Midnight case
                }
                if (hour < now.getHours()) {
                  isPast = true;
                }
              }

              const isDisabled = isBooked || isPast;

              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  disabled={isDisabled}
                  className={`p-2 rounded-lg text-sm font-semibold transition relative ${isDisabled
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed  opacity-44'
                    : selectedTime === time
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  {time}
                </button>

              );
            })}
          </div>
          <div className="mt-8 text-center">
            <AppButton onClick={handleBooking} disabled={!selectedDate || !selectedTime} className="w-full sm:w-auto">
              Book Appointment
            </AppButton>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfilePage;
