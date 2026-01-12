export interface LandmarkCoordinates {
  lat: number;
  lng: number;
}

export type LandmarkCategory = 'educational' | 'historical' | 'religious' | 'natural' | 'entertainment';

export interface Landmark {
  id: string;
  name: string;
  category: LandmarkCategory;
  coordinates: LandmarkCoordinates;
  description: string;
  shortDescription: string;
  wikipediaUrl?: string;
  images: string[];
  established?: string;
  type?: string;
  distance?: number;
  additionalInfo: Record<string, string>;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface SearchLandmarksRequest {
  bounds: MapBounds;
  category?: LandmarkCategory | 'all';
  query?: string;
}

export const CATEGORY_ICONS: Record<LandmarkCategory, string> = {
  educational: '📖',
  historical: '🏰',
  religious: '🙏',
  natural: '🍃',
  entertainment: '🎭'
};

export const CATEGORY_COLORS: Record<LandmarkCategory, string> = {
  educational: '#1976D2',
  historical: '#FF9800',
  religious: '#F57C00',
  natural: '#4CAF50',
  entertainment: '#9C27B0'
};

export const DEFAULT_COLLEGE_COORDINATES: LandmarkCoordinates = {
  lat: 22.7196,
  lng: 75.8577
};

export const MEDICAPS_COORDINATES = DEFAULT_COLLEGE_COORDINATES;
