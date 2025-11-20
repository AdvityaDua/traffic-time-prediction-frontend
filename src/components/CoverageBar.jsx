import React from 'react';

const CoverageBar = ({ modelCoverage }) => {
  const displayedCoverage = Math.max(20, Math.sqrt(modelCoverage || 0) * 100);

  const barColor = displayedCoverage < 50 ? 'bg-red-500' : displayedCoverage < 80 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
      <div
        className={`${barColor} h-4 rounded-full text-xs flex items-center justify-center text-white`}
        style={{ width: `${displayedCoverage}%` }}
      >
        {`${displayedCoverage.toFixed(0)}%`}
      </div>
    </div>
  );
};

export default CoverageBar;

