import { X, ExternalLink, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { type Landmark, CATEGORY_ICONS } from "@/types/landmark";

interface LandmarkModalProps {
  landmark: Landmark | null;
  isOpen: boolean;
  onClose: () => void;
  onCenterOnMap: (landmark: Landmark) => void;
}

export function LandmarkModal({ landmark, isOpen, onClose, onCenterOnMap }: LandmarkModalProps) {
  if (!landmark) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden" data-testid="landmark-modal">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <div className={`custom-marker marker-${landmark.category} w-10 h-10 rounded-full flex items-center justify-center text-lg`}>
              {CATEGORY_ICONS[landmark.category]}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">{landmark.name}</DialogTitle>
              <Badge variant="secondary" className="capitalize mt-1">
                {landmark.category}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="close-modal-button"
          >
            <X className="w-6 h-6" />
          </Button>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Images */}
            <div>
              {landmark.images && landmark.images.length > 0 ? (
                <>
                  <img
                    src={landmark.images[0]}
                    alt={landmark.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400';
                    }}
                  />
                  {landmark.images.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {landmark.images.slice(1, 4).map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${landmark.name} ${index + 2}`}
                          className="w-full h-20 object-cover rounded"
                          onError={(e) => {
                            // Hide broken images
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
                  alt={landmark.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
            </div>

            {/* Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {landmark.description}
                </p>
              </div>

              {/* Key Information */}
              <div>
                <h3 className="font-semibold mb-2">Key Information</h3>
                <div className="space-y-2 text-sm">
                  {landmark.established && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Established:</span>
                      <span>{landmark.established}</span>
                    </div>
                  )}
                  {landmark.type && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span>{landmark.type}</span>
                    </div>
                  )}
                  {landmark.distance !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance:</span>
                      <span>{landmark.distance.toFixed(1)} km from campus</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="capitalize">{landmark.category}</span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              {Object.keys(landmark.additionalInfo).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Additional Details</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(landmark.additionalInfo).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="text-right max-w-48 break-words">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-border">
                <div className="flex space-x-3">
                  {landmark.wikipediaUrl && (
                    <Button
                      asChild
                      className="flex-1"
                      data-testid="wikipedia-link"
                    >
                      <a
                        href={landmark.wikipediaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Wikipedia
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => onCenterOnMap(landmark)}
                    className="flex-1"
                    data-testid="center-on-map-button"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Center on Map
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
