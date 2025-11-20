import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { convertSegmentsToGeoJSON } from "../utils/geojson";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function MapContainer({ source, destination, routeData }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);

  /** ============================
   *  INIT MAP (once)
   *  ============================ */
  useEffect(() => {
    if (mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [76.7794, 30.7333],  // Chandigarh
      zoom: 12,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-left");
  }, []);

  /** ============================
   *  MARKERS (source/destination)
   *  ============================ */
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove previous markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const addMarker = (pos, color) => {
      const marker = new mapboxgl.Marker({ color })
        .setLngLat([pos.lng, pos.lat])
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    };

    if (source) addMarker(source, "#007AFF");      // blue
    if (destination) addMarker(destination, "#FF3B30"); // red

  }, [source, destination]);


  /** ============================
   *  ROUTE POLYLINE
   *  ============================ */
  useEffect(() => {
    if (!mapRef.current || !routeData || !routeData.segments) return;

    const map = mapRef.current;

    // Remove old layer/source if exist
    if (map.getLayer("route-line")) map.removeLayer("route-line");
    if (map.getSource("route-line")) map.removeSource("route-line");

    const geojson = convertSegmentsToGeoJSON(routeData.segments);

    // Add source + layer
    map.addSource("route-line", {
      type: "geojson",
      data: geojson,
    });

    map.addLayer({
      id: "route-line",
      type: "line",
      source: "route-line",
      paint: {
        "line-color": [
          "match",
          ["get", "congestion"],
          "LOW", "#00FF00", // Green
          "MEDIUM", "#FFFF00", // Yellow
          "HIGH", "#FF0000", // Red
          "#0000FF" // Default to blue
        ],
        "line-width": 4,
      },
    });

    // Fit bounds to route
    const coordinates = routeData.polyline_points.map(([lat, lng]) => [lng, lat]);
    const bounds = new mapboxgl.LngLatBounds();
    coordinates.forEach((c) => bounds.extend(c));

    map.fitBounds(bounds, {
      padding: 40,
      duration: 800,
    });

  }, [routeData]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#ddd"
      }}
    />
  );
}