import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  type Landmark,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  DEFAULT_COLLEGE_COORDINATES,
} from "@/types/landmark";

interface InteractiveMapProps {
  landmarks: Landmark[];
  onMapInitialized: (map: L.Map) => void;
  onLandmarkClick: (landmark: Landmark) => void;
  onBoundsChanged?: (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => void;
  selectedLandmark?: Landmark | null;
}

export function InteractiveMap({
  landmarks,
  onMapInitialized,
  onLandmarkClick,
  onBoundsChanged,
  selectedLandmark,
}: InteractiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainer.current, {
      center: [
        DEFAULT_COLLEGE_COORDINATES.lat,
        DEFAULT_COLLEGE_COORDINATES.lng,
      ],
      zoom: 13,
      zoomControl: false,
    });

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
    onMapInitialized(map);

    // Handle bounds change
    if (onBoundsChanged) {
      const handleMoveEnd = () => {
        const bounds = map.getBounds();
        onBoundsChanged({
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        });
      };

      map.on("moveend", handleMoveEnd);

      // Initial bounds
      handleMoveEnd();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onMapInitialized, onBoundsChanged]);

  // Update markers when landmarks change
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const currentMarkers = markersRef.current;

    // Remove existing markers
    currentMarkers.forEach((marker) => map.removeLayer(marker));
    currentMarkers.clear();

    // Add new markers
    landmarks.forEach((landmark) => {
      const icon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div 
            class="custom-marker marker-${landmark.category}" 
            style="
              background-color: ${CATEGORY_COLORS[landmark.category]};
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: 600;
              color: white;
              transition: all 0.2s ease;
              cursor: pointer;
            "
            onmouseover="this.style.transform='scale(1.2)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.4)';"
            onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.3)';"
          >
            ${CATEGORY_ICONS[landmark.category]}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });

      const marker = L.marker(
        [landmark.coordinates.lat, landmark.coordinates.lng],
        { icon },
      ).addTo(map);

      // Add popup
      const popupContent = `
        <div class="p-3 min-w-64">
          <div class="flex items-start space-x-3 mb-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm" style="background-color: ${CATEGORY_COLORS[landmark.category]}; color: white;">
              ${CATEGORY_ICONS[landmark.category]}
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-sm text-gray-900 truncate">${landmark.name}</h3>
              <p class="text-xs text-gray-600 capitalize">${landmark.category}</p>
            </div>
          </div>
          <p class="text-xs text-gray-700 mb-3 line-clamp-3">${landmark.shortDescription}</p>
          ${
            landmark.distance !== undefined
              ? `<p class="text-xs text-gray-500 mb-2">${landmark.distance.toFixed(1)}km from campus</p>`
              : ""
          }
          <button 
            onclick="window.handleLandmarkPopupClick('${landmark.id}')"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
          >
            View Details
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: "custom-popup",
      });

      // Add click handler
      marker.on("click", () => onLandmarkClick(landmark));

      currentMarkers.set(landmark.id, marker);
    });

    // Global popup click handler
    (window as any).handleLandmarkPopupClick = (landmarkId: string) => {
      const landmark = landmarks.find((l) => l.id === landmarkId);
      if (landmark) {
        onLandmarkClick(landmark);
      }
    };
  }, [landmarks, onLandmarkClick]);

  // Highlight selected landmark
  useEffect(() => {
    if (!mapRef.current || !selectedLandmark) return;

    const marker = markersRef.current.get(selectedLandmark.id);
    if (marker) {
      // Center on selected landmark
      mapRef.current.setView(
        [selectedLandmark.coordinates.lat, selectedLandmark.coordinates.lng],
        15,
      );

      // Open popup
      marker.openPopup();
    }
  }, [selectedLandmark]);

  return (
    <div
      ref={mapContainer}
      className="h-full w-full"
      data-testid="interactive-map"
    />
  );
}
