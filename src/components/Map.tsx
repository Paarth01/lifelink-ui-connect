import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MapProps {
  className?: string;
}

export default function Map({ className }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Mock data for demonstration
  const mockData = {
    donors: [
      { id: 1, name: 'Sarah J.', coords: [-74.006, 40.7128], bloodType: 'O+' },
      { id: 2, name: 'Michael R.', coords: [-74.0059, 40.7129], bloodType: 'A+' },
      { id: 3, name: 'Emma L.', coords: [-74.0058, 40.7130], bloodType: 'B+' }
    ],
    hospitals: [
      { id: 1, name: 'City General Hospital', coords: [-74.0060, 40.7127] },
      { id: 2, name: 'St. Mary Medical Center', coords: [-74.0057, 40.7131] }
    ],
    activeRequests: [
      { id: 1, coords: [-74.0061, 40.7126], urgency: 'Critical', bloodType: 'O+' },
      { id: 2, coords: [-74.0056, 40.7132], urgency: 'High', bloodType: 'A+' }
    ]
  };

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.006, 40.7128], // NYC coordinates
      zoom: 13,
      pitch: 45,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      addMarkers();
    });
  };

  const addMarkers = () => {
    if (!map.current) return;

    // Add donor markers (green)
    mockData.donors.forEach((donor) => {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-accent rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-xs font-bold text-white';
      el.textContent = 'D';

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${donor.name}</h3>
            <p class="text-sm text-gray-600">Blood Type: ${donor.bloodType}</p>
            <p class="text-sm text-gray-600">Status: Available</p>
          </div>
        `);

      new mapboxgl.Marker(el)
        .setLngLat(donor.coords as [number, number])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Add hospital markers (blue)
    mockData.hospitals.forEach((hospital) => {
      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-xs font-bold text-white';
      el.textContent = 'H';

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold">${hospital.name}</h3>
            <p class="text-sm text-gray-600">Medical Facility</p>
          </div>
        `);

      new mapboxgl.Marker(el)
        .setLngLat(hospital.coords as [number, number])
        .setPopup(popup)
        .addTo(map.current!);
    });

    // Add active request markers (red, animated)
    mockData.activeRequests.forEach((request) => {
      const el = document.createElement('div');
      el.className = 'w-8 h-8 bg-emergency rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-xs font-bold text-white animate-pulse';
      el.textContent = '!';

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-red-600">Urgent Request</h3>
            <p class="text-sm text-gray-600">Blood Type: ${request.bloodType}</p>
            <p class="text-sm text-gray-600">Urgency: ${request.urgency}</p>
          </div>
        `);

      new mapboxgl.Marker(el)
        .setLngLat(request.coords as [number, number])
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  useEffect(() => {
    if (mapboxToken && showTokenInput === false) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, showTokenInput]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle>Mapbox Configuration</CardTitle>
          <CardDescription>
            Enter your Mapbox public token to view the interactive map. 
            Get your token from <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="text"
            placeholder="pk.eyJ1..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="font-mono text-sm"
          />
          <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
            Load Map
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapContainer} className="absolute inset-0 rounded-lg shadow-lg" />
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-accent rounded-full mr-2"></div>
                <span>Donors</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span>Hospitals</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emergency rounded-full mr-2 animate-pulse"></div>
                <span>Urgent Requests</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}