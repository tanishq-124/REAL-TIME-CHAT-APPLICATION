import React from 'react';

const SelectionScreen = ({
  userId,
  setChatMode,
  duoPartnerId,
  setDuoPartnerId,
  tempDuoPartnerInput,
  setTempDuoPartnerInput,
  setError,
  generateDisplayId
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 font-sans antialiased p-4 animate-gradient-shift">
      <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-md w-full transform transition-all duration-300 ease-in-out hover:scale-105">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Choose Your Chat Room</h2>
        <p className="text-sm text-gray-600 mb-6">
          Your User ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded-md text-xs">{generateDisplayId(userId)}</span>
        </p>
        <button
          onClick={() => setChatMode('public')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-200 active:scale-95 mb-4 hover:shadow-xl"
        >
          Join Public Chat
        </button>
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Start Duo Chat</h3>
          <input
            type="text"
            value={tempDuoPartnerInput}
            onChange={(e) => setTempDuoPartnerInput(e.target.value)}
            placeholder="Enter partner's FULL User ID (e.g., 123e4567-e89b-12d3-a456-426614174000)"
            className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 mb-4"
          />
          <button
            onClick={() => {
              // Basic validation for UUID format (length check)
              if (tempDuoPartnerInput.trim() && tempDuoPartnerInput.trim() !== userId && tempDuoPartnerInput.trim().length === 36) {
                setDuoPartnerId(tempDuoPartnerInput.trim());
                setChatMode('duo');
              } else {
                setError("Please enter a valid, full partner User ID that is not your own.");
              }
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transform transition-all duration-200 active:scale-95 hover:shadow-xl"
          >
            Start Duo Chat
          </button>
        </div>
        {/* Developer Details on First Page */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-gray-600 text-sm">
          <p>Developed by <a href="https://www.linkedin.com/in/tanishq-agrawal-91a505335?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Tanishq Agrawal</a></p>
        </div>
      </div>
    </div>
  );
};

export default SelectionScreen;
