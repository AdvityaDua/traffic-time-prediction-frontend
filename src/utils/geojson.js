export const convertPolylineToGeoJSON = (polylinePoints) => {
  if (!polylinePoints || polylinePoints.length === 0) {
    return null;
  }

  // Mapbox GL JS expects [longitude, latitude] for coordinates
  const coordinates = polylinePoints.map(point => [point[1], point[0]]);

  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: coordinates,
    },
    properties: {},
  };
};

export const convertSegmentsToGeoJSON = (segments) => {
  if (!segments || segments.length === 0) {
    return null;
  }

  return {
    type: 'FeatureCollection',
    features: segments.map((segment) => {
      // Mapbox GL JS expects [longitude, latitude] for coordinates
      const startCoord = [segment.start[1], segment.start[0]];
      const endCoord = [segment.end[1], segment.end[0]];

      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [startCoord, endCoord],
        },
        properties: {
          ...segment,
        },
      };
    }),
  };
};

