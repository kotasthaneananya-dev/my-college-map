import { type Landmark, type SearchLandmarksRequest } from "@/types/landmark";
import { apiRequest } from "@/lib/queryClient";

export class WikipediaService {
  static async searchLandmarks(searchRequest: SearchLandmarksRequest): Promise<Landmark[]> {
    const response = await apiRequest('POST', '/api/landmarks/search', searchRequest);
    return response.json();
  }

  static async getLandmarkById(id: string): Promise<Landmark> {
    const response = await apiRequest('GET', `/api/landmarks/${id}`);
    return response.json();
  }
}
