
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Filter, CalendarIcon } from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from 'date-fns/locale';

interface AdvancedFiltersPopoverProps {
  onFilterChange: (filters: {
    minPrice?: string;
    maxPrice?: string;
    dateFrom?: Date;
    isPremium?: boolean;
  }) => void;
  filters: {
    minPrice?: string;
    maxPrice?: string;
    dateFrom?: Date;
    isPremium?: boolean;
  };
}

const AdvancedFiltersPopover = ({ onFilterChange, filters }: AdvancedFiltersPopoverProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [localFilters, setLocalFilters] = React.useState(filters);

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({ ...prev, minPrice: e.target.value }));
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFilters(prev => ({ ...prev, maxPrice: e.target.value }));
  };

  const handlePremiumChange = (checked: boolean) => {
    setLocalFilters(prev => ({ ...prev, isPremium: checked }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setLocalFilters(prev => ({ ...prev, dateFrom: date }));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="default" className="gap-2">
          <Filter className="h-4 w-4" />
          Filtres avancés
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium">Filtres avancés</h4>
          
          <div className="space-y-2">
            <Label>Fourchette de prix</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min €"
                value={localFilters.minPrice || ''}
                onChange={handleMinPriceChange}
                className="max-w-24"
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max €"
                value={localFilters.maxPrice || ''}
                onChange={handleMaxPriceChange}
                className="max-w-24"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Publié après</Label>
            <div className="grid gap-2">
              <Calendar
                mode="single"
                selected={localFilters.dateFrom}
                onSelect={handleDateChange}
                locale={fr}
                className="border rounded-md"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch 
              id="premium-only" 
              checked={!!localFilters.isPremium}
              onCheckedChange={handlePremiumChange}
            />
            <Label htmlFor="premium-only" className="cursor-pointer">Annonces premium uniquement</Label>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleApplyFilters}>
              Appliquer les filtres
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdvancedFiltersPopover;
