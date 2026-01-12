import { useState, useEffect, useCallback } from "react";
import { InteractiveMap } from "@/components/map/InteractiveMap";
import { LandmarkSidebar } from "@/components/map/LandmarkSidebar";
import { LandmarkModal } from "@/components/map/LandmarkModal";
import { MapControls } from "@/components/map/MapControls";
import { MobileSidebar } from "@/components/map/MobileSidebar";
import { useLandmarks } from "@/hooks/use-landmarks";
import { useMap } from "@/hooks/use-map";
import { useIsMobile } from "@/hooks/use-mobile";
import { DEFAULT_COLLEGE_COORDINATES, type LandmarkCategory, type MapBounds } from "@/types/landmark";
import { useToast } from "@/hooks/use-toast";

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState<LandmarkCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentBounds, setCurrentBounds] = useState<MapBounds | null>(null);
  const [campusCoords, setCampusCoords] = useState(DEFAULT_COLLEGE_COORDINATES);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const { landmarks, isLoading, searchLandmarks } = useLandmarks();
  const {
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
  } = useMap();

  // Update map center when campus coords change
  const handleCoordinatesChange = useCallback((newCoords: { lat: number; lng: number }) => {
    setCampusCoords(newCoords);
    if (map) {
      map.setView([newCoords.lat, newCoords.lng], 13);
      toast({
        title: "Center Updated",
        description: `Map centered on ${newCoords.lat.toFixed(4)}, ${newCoords.lng.toFixed(4)}`,
      });
    }
  }, [map, toast]);

  // Filter landmarks based on category and search
  const filteredLandmarks = landmarks.filter(landmark => {
    const matchesCategory = selectedCategory === 'all' || landmark.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      landmark.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landmark.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Search landmarks when bounds change
  const handleBoundsChanged = useCallback((bounds: MapBounds) => {
    setCurrentBounds(bounds);
    searchLandmarks({
      bounds,
      category: 'all',
      query: searchQuery || undefined
    });
  }, [searchLandmarks, searchQuery]);

  // Handle category change
  const handleCategoryChange = useCallback((category: LandmarkCategory | 'all') => {
    setSelectedCategory(category);
  }, []);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    // Check if query is coordinates (e.g., "22.7, 75.8")
    const coordMatch = query.match(/^([-+]?\d*\.?\d+)\s*,\s*([-+]?\d*\.?\d+)$/);
    if (coordMatch && map) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      map.setView([lat, lng], 13);
      toast({
        title: "Navigated to coordinates",
        description: `Map centered on ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
      return;
    }

    setSearchQuery(query);
    if (currentBounds) {
      searchLandmarks({
        bounds: currentBounds,
        category: 'all',
        query: query || undefined
      });
    }
  }, [currentBounds, searchLandmarks, map, toast]);

  // Handle landmark selection
  const handleLandmarkSelect = useCallback((landmark: any) => {
    openLandmarkModal(landmark);
    if (!isMobile) {
      centerOnLandmark(landmark);
    }
  }, [openLandmarkModal, centerOnLandmark, isMobile]);

  // Handle center on map from modal
  const handleCenterOnMap = useCallback((landmark: any) => {
    centerOnLandmark(landmark);
    closeLandmarkModal();
    toast({
      title: "Centered on landmark",
      description: `Map centered on ${landmark.name}`,
    });
  }, [centerOnLandmark, closeLandmarkModal, toast]);

  // Error handling
  useEffect(() => {
    if (landmarks.length === 0 && !isLoading && currentBounds) {
      toast({
        title: "No landmarks found",
        description: "Try adjusting your search criteria or zoom out to see more landmarks.",
        variant: "destructive",
      });
    }
  }, [landmarks.length, isLoading, currentBounds, toast]);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <LandmarkSidebar
          landmarks={landmarks}
          filteredLandmarks={filteredLandmarks}
          isLoading={isLoading}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onLandmarkSelect={handleLandmarkSelect}
          onSearch={handleSearch}
          searchQuery={searchQuery}
          coordinates={campusCoords}
          onCoordinatesChange={handleCoordinatesChange}
        />
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <InteractiveMap
          landmarks={filteredLandmarks}
          onMapInitialized={initializeMap}
          onLandmarkClick={handleLandmarkSelect}
          onBoundsChanged={handleBoundsChanged}
          selectedLandmark={selectedLandmark}
        />

        {/* Map Controls */}
        <MapControls
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onToggleFullscreen={toggleFullscreen}
          onResetView={() => handleCoordinatesChange(DEFAULT_COLLEGE_COORDINATES)}
        />

        {/* Mobile Sidebar */}
        {isMobile && (
          <MobileSidebar
            landmarks={landmarks}
            filteredLandmarks={filteredLandmarks}
            isLoading={isLoading}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            onLandmarkSelect={handleLandmarkSelect}
          />
        )}
      </div>

      {/* Landmark Detail Modal */}
      <LandmarkModal
        landmark={selectedLandmark}
        isOpen={isModalOpen}
        onClose={closeLandmarkModal}
        onCenterOnMap={handleCenterOnMap}
      />
    </div>
  );
}
