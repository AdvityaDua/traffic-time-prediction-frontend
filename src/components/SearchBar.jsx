import React, { useState, useEffect, useCallback } from 'react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const SearchBar = ({ label, onSelectLocation, currentLocation }) => {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const debounce = (func, delay) => {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const fetchSuggestions = useCallback(debounce(async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&country=IN`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSuggestions(data.features);
    } catch (err) {
      console.error('Error fetching geocoding suggestions:', err);
      setError('Failed to fetch suggestions. Please try again.');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 500), []);

  useEffect(() => {
    if (searchText) {
      fetchSuggestions(searchText);
    } else {
      setSuggestions([]);
    }
  }, [searchText, fetchSuggestions]);

  useEffect(() => {
    if (currentLocation) {
      setSearchText(`${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`);
    }
  }, [currentLocation]);

  const handleSelect = (suggestion) => {
    setSearchText(suggestion.place_name);
    onSelectLocation({
      lat: suggestion.center[1],
      lng: suggestion.center[0],
    });
    setSuggestions([]);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={`Search ${label}`}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      {loading && <div className="absolute z-10 w-full bg-white shadow-lg rounded-b-md p-2">Loading...</div>}
      {error && <div className="absolute z-10 w-full bg-red-100 text-red-700 shadow-lg rounded-b-md p-2">{error}</div>}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-b-md shadow-lg max-h-60 overflow-y-auto mt-1">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(suggestion)}
            >
              {suggestion.place_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
