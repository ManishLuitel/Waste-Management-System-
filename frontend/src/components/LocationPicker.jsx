import { useEffect, useRef } from 'react';

export default function LocationPicker({ onLocationSelect, selectedLocation }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    // Load Leaflet dynamically
    const loadLeaflet = async () => {
      if (typeof window !== 'undefined' && !window.L) {
        // Add Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = initMap;
        document.head.appendChild(script);
      } else if (window.L) {
        initMap();
      }
    };

    const initMap = () => {
      if (mapInstanceRef.current) return;

      // Initialize map centered on Banepa, Nepal
      const map = window.L.map(mapRef.current).setView([27.6298, 85.5209], 13);
      
      // Add OpenStreetMap tiles
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Add click handler
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        
        // Remove existing marker
        if (markerRef.current) {
          map.removeLayer(markerRef.current);
        }
        
        // Add new marker
        markerRef.current = window.L.marker([lat, lng]).addTo(map);
        
        // Call callback with coordinates
        onLocationSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      });

      mapInstanceRef.current = map;

      // Set initial marker if location is provided
      if (selectedLocation && selectedLocation.includes(',')) {
        const [lat, lng] = selectedLocation.split(',').map(coord => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          markerRef.current = window.L.marker([lat, lng]).addTo(map);
          map.setView([lat, lng], 15);
        }
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg border border-gray-300 bg-gray-100"
        style={{ minHeight: '256px' }}
      />
      <p className="text-sm text-gray-600">
        Click on the map to select your location
      </p>
    </div>
  );
}