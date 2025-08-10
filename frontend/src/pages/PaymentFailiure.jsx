import React, { useEffect, useState } from 'react';
// In a real application, you would use this for navigation
// import { useNavigate } from 'react-router-dom';

// This component encapsulates the animated X mark SVG and its logic.
const AnimatedXMark = () => (
  <div className="mx-auto mb-4">
    <svg className="x-mark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className="x-mark__circle" cx="26" cy="26" r="25" fill="none" />
      <path className="x-mark__line1" fill="none" d="M16 16 36 36" />
      <path className="x-mark__line2" fill="none" d="M36 16 16 36" />
    </svg>
  </div>
);

const PaymentFailiure = () => {
  // const navigate = useNavigate(); // Hook for navigation in a React Router setup
  const [isModalVisible, setIsModalVisible] = useState(false);

  // This useEffect hook triggers the modal animation when the component mounts.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalVisible(true);
    }, 100); // 100ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // const handlePayAgain = () => {
  //   // This should navigate to your appointments or payment page
  //   navigate('/my-appointments');
  // };

  return (
    <div className="bg-gray-50 font-sans min-h-screen relative">
      {/* Placeholder for blurred background content */}
      <div className="w-full h-screen filter blur-sm">
        {/* Background content goes here */}
      </div>

      {/* Modal Overlay */}
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full flex items-center justify-center transition-opacity duration-300 ${
          isModalVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Modal Content */}
        <div
          className={`relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-2xl bg-white text-center transform transition-all duration-300 ease-out ${
            isModalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <AnimatedXMark />

          <div className="mt-3">
            <h3 className="text-2xl leading-6 font-bold text-gray-800">
              Payment Failed
            </h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-md text-gray-500">
                Unfortunately, we were unable to process your payment. Please try again .
              </p>
            </div>
            <div className="items-center px-4 py-3 mt-4">
              <a
                href="/app/my-appointments" // Fallback for simple routing
                // onClick={handlePayAgain} // Recommended approach for SPAs
                className="w-full cursor-pointer px-4 py-3 bg-red-600 text-white text-base font-medium rounded-xl shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105 block"
              >
                Pay Again
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Component-specific styles for the animations */}
      <style>{`
        .x-mark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 3;
          stroke: #fff;
          stroke-miterlimit: 10;
          margin: 10% auto;
          box-shadow: inset 0px 0px 0px #DC2626; /* Red */
          animation: fill-red .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }
        .x-mark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #DC2626;
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .x-mark_line1, .x-mark_line2 {
          transform-origin: 50% 50%;
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
        }
        @keyframes stroke {
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes scale {
          0%, 100% {
            transform: none;
          }
          50% {
            transform: scale3d(1.1, 1.1, 1);
          }
        }
        @keyframes fill-red {
          100% {
            box-shadow: inset 0px 0px 0px 40px #DC2626;
          }
        }
      `}</style>
    </div>
  );
};


export default PaymentFailiure