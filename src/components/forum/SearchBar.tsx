import React from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Search as SearchIcon,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from '../ui/sheet';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface Category {
  id: number;
  name: string;
}

interface SearchFilters {
  categoryId?: string;
  sortBy: 'recent' | 'popular' | 'comments' | 'likes';
  timeRange: 'all' | 'today' | 'week' | 'month' | 'year';
  showPinned: boolean;
  showResolved: boolean;
}

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: Category[];
  onSearch: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  filters,
  onFiltersChange,
  categories,
  onSearch,
  className
}) => {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [tempFilters, setTempFilters] = React.useState(filters);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleFilterApply = () => {
    onFiltersChange(tempFilters);
    setSheetOpen(false);
  };

  const handleFilterReset = () => {
    const defaultFilters: SearchFilters = {
      sortBy: 'recent',
      timeRange: 'all',
      showPinned: false,
      showResolved: false,
    };
    setTempFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' && value !== 'recent') return true;
    if (key === 'timeRange' && value !== 'all') return true;
    if (key === 'categoryId' && value) return true;
    if (typeof value === 'boolean' && value === true) return true;
    return false;
  }).length;

  return (
    <form onSubmit={handleSearch} className={cn("relative", className)}>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search the forum..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-10 pr-4"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => onQueryChange('')}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" type="button">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge 
                  variant="secondary" 
                  className="ml-2 h-4 w-4 p-0 text-xs flex items-center justify-center"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
              <SheetDescription>
                Refine your search results using the filters below.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={tempFilters.categoryId}
                  onValueChange={(value) => 
                    setTempFilters({ ...tempFilters, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem 
                        key={category.id} 
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={tempFilters.sortBy}
                  onValueChange={(value: SearchFilters['sortBy']) => 
                    setTempFilters({ ...tempFilters, sortBy: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="comments">Most Comments</SelectItem>
                    <SelectItem value="likes">Most Likes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Range</Label>
                <Select
                  value={tempFilters.timeRange}
                  onValueChange={(value: SearchFilters['timeRange']) => 
                    setTempFilters({ ...tempFilters, timeRange: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-pinned">Show Pinned Only</Label>
                <Switch
                  id="show-pinned"
                  checked={tempFilters.showPinned}
                  onCheckedChange={(checked) =>
                    setTempFilters({ ...tempFilters, showPinned: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-resolved">Show Resolved Only</Label>
                <Switch
                  id="show-resolved"
                  checked={tempFilters.showResolved}
                  onCheckedChange={(checked) =>
                    setTempFilters({ ...tempFilters, showResolved: checked })
                  }
                />
              </div>
            </div>
            <SheetFooter className="mt-6 flex-row justify-between sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handleFilterReset}
              >
                Reset Filters
              </Button>
              <Button type="button" onClick={handleFilterApply}>
                Apply Filters
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </form>
  );
};

export default SearchBar;