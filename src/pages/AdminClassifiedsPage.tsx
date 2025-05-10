
import { useState } from 'react';
import { useClassifiedsAdmin } from "@/hooks/useClassifiedsAdmin";
import { Classified } from '@/types/classified';
import { ClassifiedsHeader } from '@/components/admin/classifieds/ClassifiedsHeader';
import { ClassifiedsTable } from '@/components/admin/classifieds/ClassifiedsTable';
import { LoadingState } from '@/components/admin/classifieds/LoadingState';
import { ErrorState } from '@/components/admin/classifieds/ErrorState';

const AdminClassifiedsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    classifieds,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    approveClassified,
    rejectClassified,
    deleteClassified
  } = useClassifiedsAdmin();
  
  // Filter classifieds by search term
  const filteredClassifieds = classifieds?.filter(classified => {
    const matchesSearch = 
      classified.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classified.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classified.user.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  }) || [];
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <ClassifiedsHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <ClassifiedsTable 
          classifieds={filteredClassifieds}
          approveClassified={approveClassified}
          rejectClassified={rejectClassified}
          deleteClassified={deleteClassified}
        />
      </div>
    </div>
  );
};

export default AdminClassifiedsPage;
