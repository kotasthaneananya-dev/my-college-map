import { type Landmark, CATEGORY_ICONS } from "@/types/landmark";
import { cn } from "@/lib/utils";

interface LandmarkCardProps {
  landmark: Landmark;
  onClick?: (landmark: Landmark) => void;
  className?: string;
}

export function LandmarkCard({ landmark, onClick, className }: LandmarkCardProps) {
  return (
    <div
      className={cn(
        "landmark-card bg-card border border-border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1",
        className
      )}
      onClick={() => onClick?.(landmark)}
      data-testid={`landmark-card-${landmark.id}`}
    >
      <div className="flex items-start space-x-3">
        <div className={`custom-marker marker-${landmark.category} flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs`}>
          {CATEGORY_ICONS[landmark.category]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground truncate">
            {landmark.name}
          </h4>
          <p className="text-xs text-muted-foreground mb-2 capitalize">
            {landmark.category}
            {landmark.distance !== undefined && (
              <span> • {landmark.distance.toFixed(1)}km from campus</span>
            )}
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {landmark.shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
