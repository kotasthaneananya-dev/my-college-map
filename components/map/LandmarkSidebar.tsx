import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { LandmarkCard } from "./LandmarkCard";
import { useLandmarks } from "@/hooks/use-landmarks";
import { type Landmark, type LandmarkCategory, type MapBounds } from "@/types/landmark";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface LandmarkSidebarProps {
  landmarks: Landmark[];
  filteredLandmarks: Landmark[];
  isLoading: boolean;
  selectedCategory: LandmarkCategory | 'all';
  onCategoryChange: (category: LandmarkCategory | 'all') => void;
  onLandmarkSelect: (landmark: Landmark) => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  coordinates: { lat: number; lng: number };
  onCoordinatesChange: (coords: { lat: number; lng: number }) => void;
}

const categories = [
  { id: 'all', name: 'All Landmarks', color: '#64748b' },
  { id: 'educational', name: 'Educational', color: '#1976D2' },
  { id: 'historical', name: 'Historical', color: '#FF9800' },
  { id: 'religious', name: 'Religious', color: '#F57C00' },
  { id: 'natural', name: 'Natural', color: '#4CAF50' },
  { id: 'entertainment', name: 'Entertainment', color: '#9C27B0' },
] as const;

export function LandmarkSidebar({
  landmarks,
  filteredLandmarks,
  isLoading,
  selectedCategory,
  onCategoryChange,
  onLandmarkSelect,
  onSearch,
  searchQuery,
  coordinates,
  onCoordinatesChange
}: LandmarkSidebarProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [latInput, setLatInput] = useState(coordinates.lat.toString());
  const [lngInput, setLngInput] = useState(coordinates.lng.toString());

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setLatInput(coordinates.lat.toString());
    setLngInput(coordinates.lng.toString());
  }, [coordinates]);

  const handleSearch = () => {
    onSearch(localSearchQuery);
  };

  const handleCoordsSubmit = () => {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);
    if (!isNaN(lat) && !isNaN(lng)) {
      onCoordinatesChange({ lat, lng });
    }
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return landmarks.length;
    return landmarks.filter(l => l.category === categoryId).length;
  };

  return (
    <aside className="w-96 sidebar-overlay border-r border-border flex flex-col z-40" data-testid="landmark-sidebar">
      {/* College Info Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-green-500 via-yellow-400 to-blue-500 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10" />
            <MapPin className="w-7 h-7 text-white drop-shadow-md z-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">My College App</h1>
            <p className="text-sm text-muted-foreground">Campus Explorer</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Map Center Coordinates</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground">Latitude</label>
              <Input 
                type="number" 
                value={latInput} 
                onChange={(e) => setLatInput(e.target.value)}
                onBlur={handleCoordsSubmit}
                onKeyPress={(e) => e.key === 'Enter' && handleCoordsSubmit()}
                className="h-8 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-muted-foreground">Longitude</label>
              <Input 
                type="number" 
                value={lngInput} 
                onChange={(e) => setLngInput(e.target.value)}
                onBlur={handleCoordsSubmit}
                onKeyPress={(e) => e.key === 'Enter' && handleCoordsSubmit()}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Coordinate Input */}
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-background rounded-lg px-3 py-2 border border-border flex-1">
            <Search className="w-4 h-4 text-muted-foreground mr-2" />
            <Input
              type="text"
              placeholder="Search landmarks or 'lat, lng'..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="border-0 p-0 h-auto focus-visible:ring-0"
              data-testid="search-input"
            />
          </div>
          <Button onClick={handleSearch} size="sm" data-testid="search-button">
            Search
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground px-1">
          Tip: Enter "lat, lng" (e.g. 22.7, 75.8) to jump to coordinates
        </p>
      </div>
      
      {/* Category Filters */}
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold mb-3">Landmark Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "category-filter w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                selectedCategory === category.id 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "hover:bg-accent"
              )}
              onClick={() => onCategoryChange(category.id as LandmarkCategory | 'all')}
              data-testid={`category-filter-${category.id}`}
            >
              <span className="flex items-center">
                {category.id === 'educational' ? (
                  <span className={cn(
                    "mr-3 text-lg transition-transform",
                    selectedCategory === 'educational' ? "scale-110" : "opacity-80"
                  )}>📖</span>
                ) : category.id === 'historical' ? (
                  <span className={cn(
                    "mr-3 text-lg transition-transform",
                    selectedCategory === 'historical' ? "scale-110" : "opacity-80"
                  )}>🏰</span>
                ) : category.id === 'religious' ? (
                  <span className={cn(
                    "mr-3 text-lg transition-transform",
                    selectedCategory === 'religious' ? "scale-110" : "opacity-80"
                  )}>🙏</span>
                ) : category.id === 'natural' ? (
                  <span className={cn(
                    "mr-3 text-lg transition-transform",
                    selectedCategory === 'natural' ? "scale-110" : "opacity-80"
                  )}>🍃</span>
                ) : category.id === 'entertainment' ? (
                  <span className={cn(
                    "mr-3 text-lg transition-transform",
                    selectedCategory === 'entertainment' ? "scale-110" : "opacity-80"
                  )}>🎭</span>
                ) : (
                  <span 
                    className="w-3 h-3 rounded-full mr-3 border border-white/20"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                <span className="font-medium">{category.name}</span>
              </span>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                selectedCategory === category.id 
                  ? "bg-primary-foreground/20 text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {getCategoryCount(category.id)}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Landmarks List */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="w-6 h-6 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 rounded mb-2" />
                    <Skeleton className="h-3 rounded w-2/3 mb-2" />
                    <Skeleton className="h-3 rounded w-full" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredLandmarks.length > 0 ? (
            filteredLandmarks.map((landmark) => (
              <LandmarkCard
                key={landmark.id}
                landmark={landmark}
                onClick={onLandmarkSelect}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground" data-testid="no-landmarks-message">
              <p>No landmarks found</p>
              <p className="text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
