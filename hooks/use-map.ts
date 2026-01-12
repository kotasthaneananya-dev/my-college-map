import { useState, useCallback, useRef, useEffect } from "react";
import { type Map as LeafletMap, type LatLngBounds } from "leaflet";
import { type MapBounds, type Landmark, DEFAULT_COLLEGE_COORDINATES } from "@/types/landmark";

export function useMap() {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapRef = useRef<LeafletMap | null>(null);

  const initializeMap = useCallback((mapInstance: LeafletMap) => {
    setMap(mapInstance);
    mapRef.current = mapInstance;
  }, []);

  const centerOnCollege = useCallback(() => {
    if (map) {
      map.setView([DEFAULT_COLLEGE_COORDINATES.lat, DEFAULT_COLLEGE_COORDINATES.lng], 13);
    }
  }, [map]);

  const centerOnLandmark = useCallback((landmark: Landmark) => {
    if (map) {
      map.setView([landmark.coordinates.lat, landmark.coordinates.lng], 15);
    }
  }, [map]);

  const getMapBounds = useCallback((): MapBounds | null => {
    if (!map) return null;
    
    const bounds = map.getBounds();
    return {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest()
    };
  }, [map]);

  const openLandmarkModal = useCallback((landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setIsModalOpen(true);
  }, []);

  const closeLandmarkModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLandmark(null);
  }, []);

  const zoomIn = useCallback(() => {
    if (map) {
      map.zoomIn();
    }
  }, [map]);

  const zoomOut = useCallback(() => {
    if (map) {
      map.zoomOut();
    }
  }, [map]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  return {
    map,
    selectedLandmark,
    isModalOpen,
    initializeMap,
    centerOnCollege,
    centerOnLandmark,
    getMapBounds,
    openLandmarkModal,
    closeLandmarkModal,
    zoomIn,
    zoomOut,
    toggleFullscreen
  };
}
