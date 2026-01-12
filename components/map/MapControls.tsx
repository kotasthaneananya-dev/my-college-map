import { ZoomIn, ZoomOut, Maximize, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onResetView: () => void;
}

export function MapControls({ onZoomIn, onZoomOut, onToggleFullscreen, onResetView }: MapControlsProps) {
  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-6 flex flex-col space-y-2 z-40" data-testid="map-controls">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={onZoomIn}
              className="bg-card border border-border shadow-lg hover:bg-accent"
              data-testid="zoom-in-button"
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Zoom In</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={onZoomOut}
              className="bg-card border border-border shadow-lg hover:bg-accent"
              data-testid="zoom-out-button"
            >
              <ZoomOut className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Zoom Out</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={onResetView}
              className="bg-card border border-border shadow-lg hover:bg-accent"
              data-testid="reset-view-button"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Reset to University</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              onClick={onToggleFullscreen}
              className="bg-card border border-border shadow-lg hover:bg-accent"
              data-testid="fullscreen-button"
            >
              <Maximize className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Toggle Fullscreen</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
