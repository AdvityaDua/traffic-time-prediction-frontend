import React from 'react';

const SummaryPanel = ({ summary }) => {
  if (!summary) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-gray-600">Route summary will appear here.</p>
      </div>
    );
  }

  const { avg_speed, dominant_congestion, max_congestion_segment, min_congestion_segment, total_travel_time } = summary;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Route Summary</h3>
      <p><strong>Total Travel Time:</strong> {total_travel_time ? (total_travel_time / 60).toFixed(2) : 'N/A'} minutes</p>
      <p><strong>Average Speed:</strong> {avg_speed ? avg_speed.toFixed(2) : 'N/A'} km/h</p>
      <p><strong>Dominant Congestion:</strong> {dominant_congestion || 'N/A'}</p>
      {/* Assuming segment IDs can be used to link to segments on map if needed */}
      {/* <p><strong>Max Congestion Segment ID:</strong> {max_congestion_segment || 'N/A'}</p> */}
      {/* <p><strong>Min Congestion Segment ID:</strong> {min_congestion_segment || 'N/A'}</p> */}
    </div>
  );
};

export default SummaryPanel;

