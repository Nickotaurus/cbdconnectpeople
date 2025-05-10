
import { useState, useEffect } from 'react';
import { loadGoogleMapsAPI } from '@/services/googleMapsService';
import { fetchReviewsData } from '@/services/googleBusinessService';
import { EcommerceStore } from '@/types/ecommerce';

export const useReviewData = (store: EcommerceStore) => {
  const [reviewData, setReviewData] = useState<{ rating?: number, totalReviews?: number } | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  useEffect(() => {
    const initGoogleMaps = async () => {
      if (store.isPhysicalStore && store.googlePlaceId) {
        try {
          await loadGoogleMapsAPI();
          loadReviewData();
        } catch (error) {
          console.error("Failed to load Google Maps API:", error);
        }
      }
    };
    
    initGoogleMaps();
  }, [store.googlePlaceId, store.isPhysicalStore]);
  
  const loadReviewData = async () => {
    if (!store.googlePlaceId) return;
    
    setIsLoadingReviews(true);
    try {
      const data = await fetchReviewsData(store.googlePlaceId);
      console.log("Review data for", store.name, ":", data);
      if (data) {
        setReviewData(data);
      }
    } catch (error) {
      console.error("Error loading review data:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const displayRating = reviewData?.rating !== undefined ? reviewData.rating : store.rating;
  const displayReviewCount = reviewData?.totalReviews !== undefined ? reviewData.totalReviews : store.reviewCount;
  const isGoogleReview = store.isPhysicalStore && store.googlePlaceId && reviewData !== null;

  return {
    displayRating,
    displayReviewCount,
    isLoadingReviews,
    isGoogleReview
  };
};
