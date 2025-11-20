import React from 'react';

const InfoAlert = () => {
  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4" role="alert">
      <p className="font-bold">Hybrid Prediction System</p>
      <p>Some segments fallback to live traffic data to ensure real-time accuracy.</p>
    </div>
  );
};

export default InfoAlert;

