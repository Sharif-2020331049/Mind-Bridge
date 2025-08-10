import React, { useEffect, useState } from 'react';
// In a real application, you would use this for navigation
// import { useNavigate } from 'react-router-dom';

// This component encapsulates the animated checkmark SVG and its logic.
const AnimatedCheckmark = () => (
  <div className="mx-auto mb-4">
    <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
      <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </svg>
  </div>
);

const PaymentSuccess = () => {
  // const navigate = useNavigate(); // Hook for navigation in a React Router setup
  const [isModalVisible, setIsModalVisible] = useState(false);

  // This useEffect hook triggers the modal animation when the component mounts.
  useEffect(() => {
    // A small delay can help ensure the initial state is rendered before the animation starts.
    const timer = setTimeout(() => {
      setIsModalVisible(true);
    }, 100); // 100ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  // const handleGoToDashboard = () => {
  //   navigate('/dashboard'); // Programmatically navigate to the dashboard
  // };

  return (
    <div className="bg-gray-50 font-sans min-h-screen relative">
      {/* In a real Single Page Application (SPA), you would typically apply the blur 
        to your main app layout component when the modal is active, rather than having 
        a separate blurred background div here.
      */}
      <div className="w-full h-screen filter blur-sm">
        {/* Placeholder for background content */}
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
          <AnimatedCheckmark />

          <div className="mt-3">
            <h3 className="text-2xl leading-6 font-bold text-gray-800">
              Payment Successful!
            </h3>
            <div className="mt-2 px-7 py-3">
              <p className="text-md text-gray-500">
                Thank you for your payment. Your appointment is confirmed. You can now proceed to your dashboard.
              </p>
            </div>
            <div className="items-center px-4 py-3 mt-4">
              <a
                href="/app/dashboard" // Fallback for simple routing
                // onClick={handleGoToDashboard} // Recommended approach for SPAs
                className="w-full cursor-pointer px-4 py-3 bg-green-500 text-white text-base font-medium rounded-xl shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105 block"
              >
                Go to the Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Component-specific styles for the animations. 
        This is a straightforward way to include CSS animations in a React component
        without needing a separate CSS file or a CSS-in-JS library.
      */}
      <style>{`
        .checkmark__circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          stroke-width: 2;
          stroke-miterlimit: 10;
          stroke: #4CAF50; /* Green */
          fill: none;
          animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
        }
        .checkmark {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: block;
          stroke-width: 3;
          stroke: #fff;
          stroke-miterlimit: 10;
          margin: 10% auto;
          box-shadow: inset 0px 0px 0px #4CAF50;
          animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
        }
        .checkmark__check {
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
        @keyframes fill {
          100% {
            box-shadow: inset 0px 0px 0px 40px #4CAF50;
          }
        }
      `}</style>
    </div>
  );
};


export default PaymentSuccess