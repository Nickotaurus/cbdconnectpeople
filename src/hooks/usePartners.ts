
import { useState, useEffect, useRef } from 'react';
import { fetchPartners } from '@/services/partnersService';
import { filterPartners } from '@/utils/partnerUtils';
import { Partner, UsePartnersResult } from '@/types/partners';

export type { Partner };

export const usePartners = (searchTerm: string, categoryFilter: string): UsePartnersResult => {
  const [partnerProfiles, setPartnerProfiles] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useTestData, setUseTestData] = useState(false);
  
  const isMountedRef = useRef(true);

  const loadPartnerProfiles = async () => {
    if (!isMountedRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { partners, error: fetchError, useTestData: useTestPartners } = await fetchPartners();
      
      if (!isMountedRef.current) return;
      
      if (fetchError) {
        setError(fetchError);
      }
      
      setPartnerProfiles(partners);
      const filtered = filterPartners(partners, searchTerm, categoryFilter);
      setFilteredPartners(filtered);
      setUseTestData(useTestPartners);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPartnerProfiles();
    
    const intervalId = setInterval(loadPartnerProfiles, 60000);
    
    return () => {
      clearInterval(intervalId);
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (partnerProfiles.length > 0) {
      const filtered = filterPartners(partnerProfiles, searchTerm, categoryFilter);
      setFilteredPartners(filtered);
    }
  }, [searchTerm, categoryFilter, partnerProfiles]);

  return { partnerProfiles, filteredPartners, isLoading, error, useTestData };
};
