import React, { useState } from 'react';
import MapContainer from './components/MapContainer';
import SearchBar from './components/SearchBar';
import CoverageBar from './components/CoverageBar';
import SummaryPanel from './components/SummaryPanel';
import InfoAlert from './components/InfoAlert';
import { predictRoute } from './utils/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';

function App() {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);

  // NEW: Time input
  const [timeOfDay, setTimeOfDay] = useState('');

  const [routeQueryEnabled, setRouteQueryEnabled] = useState(false);

  const queryClient = useQueryClient();

  const { data: routeData, isLoading, isError, error } = useQuery({
    queryKey: ['route', source, destination, timeOfDay],
    queryFn: () => predictRoute(source, destination, timeOfDay),

    cacheTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,

    enabled: routeQueryEnabled && !!source && !!destination && !!timeOfDay,
    onSuccess: () => setRouteQueryEnabled(false),
    onError: () => setRouteQueryEnabled(false)
  });

  const handlePredictRoute = () => {
    if (!source || !destination || !timeOfDay) {
      alert('Please set source, destination, and time.');
      return;
    }
    queryClient.removeQueries(['route']);
    setRouteQueryEnabled(true);
  };

  return (
    <div className="flex flex-col h-screen font-sans antialiased bg-gray-100">

      {/* HEADER */}
      <header className="bg-white shadow-md p-4 z-10">
        <h1 className="text-2xl font-bold text-gray-800">
          Traffic Prediction App
        </h1>
      </header>

      {/* MAIN CONTENT */}
      <div className="relative flex h-[calc(100vh-64px)]">

        {/* MAP */}
        <div className="flex justify-center items-center flex-grow bg-gray-200">
          <MapContainer
            source={source}
            destination={destination}
            setSource={setSource}
            setDestination={setDestination}
            routeData={routeData}
          />
        </div>

        {/* SIDEBAR */}
        <div className="relative z-10 flex flex-col p-4 space-y-4 w-96 bg-white shadow-xl h-full overflow-y-auto">

          <SearchBar label="Source" onSelectLocation={setSource} currentLocation={source} />
          <SearchBar label="Destination" onSelectLocation={setDestination} currentLocation={destination} />

          {/* NEW: TIME PICKER */}
          <div className="flex flex-col space-y-1">
            <label className="font-medium text-gray-600">Select Time of Day</label>
            <input
              type="time"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="p-3 rounded-md border border-gray-300"
            />
          </div>

          <button
            onClick={handlePredictRoute}
            disabled={!source || !destination || !timeOfDay || isLoading}
            className={`w-full p-3 rounded-md text-white font-semibold 
              ${(!source || !destination || !timeOfDay || isLoading)
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {isLoading ? 'Predicting...' : 'Predict Route'}
          </button>

          {isError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md">
              Error: {error.message}
            </div>
          )}

          {routeData && (
            <>
              <CoverageBar modelCoverage={routeData.summary.model_coverage} />
              <SummaryPanel summary={routeData.summary} />
              <InfoAlert />
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;