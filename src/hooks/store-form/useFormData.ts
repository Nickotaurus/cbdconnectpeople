
import { useState, useCallback, useEffect } from 'react';
import { FormData } from '@/types/store/form-types';
import { initialFormData } from '@/utils/storeFormUtils';
import { StoreData } from '@/types/store/store-data';

interface UseFormDataProps {
  initialStoreData?: StoreData;
}

export const useFormData = ({ initialStoreData }: UseFormDataProps) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isAddressValid, setIsAddressValid] = useState(!!initialStoreData);
  const [hasSearched, setHasSearched] = useState(!!initialStoreData);
  
  // Apply initial data if available
  useEffect(() => {
    if (initialStoreData && !formData.id) {
      const hasGoogleInfo = Boolean(
        initialStoreData.photos && initialStoreData.photos.length > 0 || 
        initialStoreData.rating || 
        initialStoreData.totalReviews || 
        initialStoreData.openingHours
      );

      setFormData({
        ...formData,
        name: initialStoreData.name || '',
        address: initialStoreData.address || '',
        city: initialStoreData.city || '',
        postalCode: initialStoreData.postalCode || '',
        latitude: initialStoreData.latitude || null,
        longitude: initialStoreData.longitude || null,
        description: initialStoreData.description || formData.description,
        phone: initialStoreData.phone || formData.phone,
        website: initialStoreData.website || formData.website,
        logoUrl: initialStoreData.logo_url || formData.logoUrl,
        photoUrl: initialStoreData.photos && initialStoreData.photos.length > 0 ? 
          initialStoreData.photos[0] : initialStoreData.photo_url || formData.photoUrl,
        placeId: initialStoreData.placeId || '',
        hasGoogleBusinessProfile: hasGoogleInfo,
        ecommerceUrl: initialStoreData.website || '',
        openingHours: initialStoreData.openingHours
      });

      setIsAddressValid(true);
      setHasSearched(true);
    }
  }, [initialStoreData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle checkbox for isEcommerce
    if (name === 'isEcommerce') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleStoreSelect = (store: StoreData) => {
    // Check if this is coming from Google Business
    const hasGoogleInfo = Boolean(
      store.photos && store.photos.length > 0 || 
      store.rating || 
      store.totalReviews || 
      store.openingHours
    );
    
    setFormData({
      ...formData,
      name: store.name || '',
      address: store.address || '',
      city: store.city || '',
      postalCode: store.postalCode || '',
      latitude: store.latitude || null,
      longitude: store.longitude || null,
      description: store.description || formData.description,
      phone: store.phone || formData.phone,
      website: store.website || formData.website,
      logoUrl: store.logo_url || formData.logoUrl,
      photoUrl: store.photos && store.photos.length > 0 ? store.photos[0] : store.photo_url || formData.photoUrl,
      placeId: store.placeId || '',
      hasGoogleBusinessProfile: hasGoogleInfo,
      ecommerceUrl: store.website || formData.ecommerceUrl,
      openingHours: store.openingHours
    });
    
    setIsAddressValid(true);
    setHasSearched(true);
  };

  return {
    formData,
    setFormData,
    isAddressValid,
    setIsAddressValid,
    hasSearched,
    setHasSearched,
    handleInputChange,
    handleStoreSelect
  };
};
