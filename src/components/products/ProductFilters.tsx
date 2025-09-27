import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Category, RoastLevel } from '@/types/product';
import { Search, X } from 'lucide-react';

interface ProductFiltersProps {
  searchQuery: string;
  categoryFilterSlug: string;
  roastFilterSlug: string;
  weightFilter: string;
  activeFiltersCount: number;
  categories: Category[];
  roastLevels: RoastLevel[];
  onSearch: (e: React.FormEvent) => void;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  searchQuery,
  categoryFilterSlug,
  roastFilterSlug,
  weightFilter,
  activeFiltersCount,
  categories,
  roastLevels,
  onSearch,
  onFilterChange,
  onClearFilters,
}: ProductFiltersProps) {
  return (
    <Card className="sticky top-4">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-semibold text-coffee-dark">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-coffee-dark"
            >
              <X className="h-4 w-4 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Search */}
          <form onSubmit={onSearch} className="space-y-2">
            <label className="text-sm font-medium text-coffee-dark">
              Search
            </label>
            <div className="flex gap-2">
              <Input
                name="search"
                placeholder="Search products..."
                defaultValue={searchQuery}
                className="flex-1"
              />
              <Button type="submit" size="sm" variant="coffee-outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-coffee-dark">
              Category
            </Label>
            <Select value={categoryFilterSlug} onValueChange={(value) => {
              if (value === 'all') {
                onFilterChange('category', '');
              } else {
                const category = categories.find(cat => cat.slug === value);
                onFilterChange('category', category?.id || '');
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Roast Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-coffee-dark">
              Roast Level
            </Label>
            <Select value={roastFilterSlug} onValueChange={(value) => {
              if (value === 'all') {
                onFilterChange('roast', '');
              } else {
                const roastLevel = roastLevels.find(rl => rl.slug === value);
                onFilterChange('roast', roastLevel?.id || '');
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="All roasts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roasts</SelectItem>
                {roastLevels.map((roastLevel: RoastLevel) => (
                  <SelectItem key={roastLevel.id} value={roastLevel.slug}>
                    {roastLevel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weight Range */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-coffee-dark">
              Weight Range
            </Label>
            <Select value={weightFilter} onValueChange={(value) => {
              onFilterChange('weight', value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="All weights" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All weights</SelectItem>
                <SelectItem value="100-250">100g - 250g</SelectItem>
                <SelectItem value="250-500">250g - 500g</SelectItem>
                <SelectItem value="500-1000">500g - 1kg</SelectItem>
                <SelectItem value="1000-2000">1kg - 2kg</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
