
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useQuery } from '@tanstack/react-query';
import { classifiedService } from '@/services/classified';
import { Classified } from '@/types/classified';
import ClassifiedHeader from '@/components/classifieds/ClassifiedHeader';
import ClassifiedFilters from '@/components/classifieds/ClassifiedFilters';
import ClassifiedsList from '@/components/classifieds/ClassifiedsList';
import LoginDialog from '@/components/classifieds/LoginDialog';
import ClassifiedDetailDialog from '@/components/classifieds/ClassifiedDetailDialog';

const ClassifiedsPage = () => {
  const { user } = useAuth();
  const [activeType, setActiveType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClassifieds, setFilteredClassifieds] = useState<Classified[]>([]);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [selectedClassified, setSelectedClassified] = useState<Classified | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Fetch real classified ads from the database
  const { data: classifieds, isLoading, error } = useQuery({
    queryKey: ['classifieds', 'approved'],
    queryFn: async () => {
      return await classifiedService.getApprovedClassifieds();
    }
  });
  
  useEffect(() => {
    if (classifieds) {
      filterClassifieds(activeType, searchTerm);
    }
  }, [classifieds, activeType, searchTerm]);
  
  const filterClassifieds = (type: string, term: string) => {
    if (!classifieds) return;
    
    let filtered = [...classifieds];
    
    if (type !== 'all') {
      filtered = filtered.filter(classified => classified.type === type);
    }
    
    if (term.trim()) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(
        classified => 
          classified.title.toLowerCase().includes(lowerTerm) ||
          classified.description.toLowerCase().includes(lowerTerm) ||
          classified.location.toLowerCase().includes(lowerTerm)
      );
    }
    
    setFilteredClassifieds(filtered);
  };
  
  const handleTypeChange = (value: string) => {
    setActiveType(value);
    filterClassifieds(value, searchTerm);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterClassifieds(activeType, term);
  };

  const handleViewClassified = (classified: Classified) => {
    if (user) {
      // If user is logged in, show details dialog
      setSelectedClassified(classified);
      setDetailsDialogOpen(true);
      console.log("Voir l'annonce:", classified.title);
    } else {
      // If user is not logged in, show login dialog
      setSelectedClassified(classified);
      setLoginDialogOpen(true);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <ClassifiedHeader user={user} />
        
        <ClassifiedFilters 
          searchTerm={searchTerm} 
          onSearchChange={handleSearch} 
          onTypeChange={handleTypeChange} 
        />
        
        <ClassifiedsList 
          classifieds={filteredClassifieds} 
          isLoading={isLoading} 
          error={error} 
          onViewClassified={handleViewClassified} 
        />
        
        {/* Dialogs */}
        <LoginDialog 
          open={loginDialogOpen} 
          onOpenChange={setLoginDialogOpen} 
          selectedClassified={selectedClassified} 
        />
        
        <ClassifiedDetailDialog 
          open={detailsDialogOpen} 
          onOpenChange={setDetailsDialogOpen} 
          classified={selectedClassified} 
        />
      </div>
    </div>
  );
};

export default ClassifiedsPage;
