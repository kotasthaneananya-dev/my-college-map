import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LandmarkCard } from "./LandmarkCard";
import { type Landmark, type LandmarkCategory } from "@/types/landmark";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSidebarProps {
  landmarks: Landmark[];
  filteredLandmarks: Landmark[];
  isLoading: boolean;
  selectedCategory: LandmarkCategory | "all";
  onCategoryChange: (category: LandmarkCategory | "all") => void;
  onLandmarkSelect: (landmark: Landmark) => void;
}

const categories = [
  { id: "all", name: "All", color: "#64748b" },
  { id: "educational", name: "Educational", color: "#1976D2" },
  { id: "historical", name: "Historical", color: "#FF9800" },
  { id: "religious", name: "Religious", color: "#F57C00" },
  { id: "natural", name: "Natural", color: "#4CAF50" },
  { id: "entertainment", name: "Entertainment", color: "#9C27B0" },
] as const;

export function MobileSidebar({
  landmarks,
  filteredLandmarks,
  isLoading,
  selectedCategory,
  onCategoryChange,
  onLandmarkSelect
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return landmarks.length;
    return landmarks.filter(l => l.category === categoryId).length;
  };

  return (
    <div className="md:hidden">
      {/* Floating trigger button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="fixed top-4 left-4 z-50 bg-card border border-border shadow-lg"
            data-testid="mobile-sidebar-trigger"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-80 p-0" data-testid="mobile-sidebar">
          <SheetHeader className="p-6 border-b">
            <SheetTitle>Nearby Landmarks</SheetTitle>
          </SheetHeader>

          {/* Category filters */}
          <div className="p-4 border-b border-border">
            <ScrollArea orientation="horizontal">
              <div className="flex space-x-2 pb-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "secondary"}
                    size="sm"
                    onClick={() => onCategoryChange(category.id as LandmarkCategory | 'all')}
                    className="flex items-center whitespace-nowrap"
                    data-testid={`mobile-category-${category.id}`}
                  >
                {category.id === "educational" ? (
                  <span className={cn(
                    "mr-2 text-lg transition-transform",
                    selectedCategory === "educational" ? "scale-110" : "opacity-80"
                  )}>📖</span>
                ) : category.id === "historical" ? (
                  <span className={cn(
                    "mr-2 text-lg transition-transform",
                    selectedCategory === "historical" ? "scale-110" : "opacity-80"
                  )}>🏰</span>
                ) : category.id === "religious" ? (
                  <span className={cn(
                    "mr-2 text-lg transition-transform",
                    selectedCategory === "religious" ? "scale-110" : "opacity-80"
                  )}>🙏</span>
                ) : category.id === "natural" ? (
                  <span className={cn(
                    "mr-2 text-lg transition-transform",
                    selectedCategory === "natural" ? "scale-110" : "opacity-80"
                  )}>🍃</span>
                ) : category.id === "entertainment" ? (
                  <span className={cn(
                    "mr-2 text-lg transition-transform",
                    selectedCategory === "entertainment" ? "scale-110" : "opacity-80"
                  )}>🎭</span>
                ) : (
                  <span 
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  />
                )}
                    {category.name}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {getCategoryCount(category.id)}
                    </Badge>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Landmarks list */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading landmarks...
                </div>
              ) : filteredLandmarks.length > 0 ? (
                filteredLandmarks.map((landmark) => (
                  <LandmarkCard
                    key={landmark.id}
                    landmark={landmark}
                    onClick={(landmark) => {
                      onLandmarkSelect(landmark);
                      setIsOpen(false);
                    }}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No landmarks found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
