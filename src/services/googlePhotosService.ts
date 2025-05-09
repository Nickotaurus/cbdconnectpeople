
import { getPlacesService } from './googleMapsService';

/**
 * Récupère l'URL d'une photo Google Places à partir d'un placeId
 * @param placeId Identifiant Google Place
 * @param maxWidth Largeur maximale de l'image (défaut: 400)
 * @returns Promise avec l'URL de la photo ou null si non disponible
 */
export const getGooglePlacePhoto = async (placeId: string, maxWidth = 400): Promise<string | null> => {
  try {
    if (!window.google?.maps?.places) {
      console.error("Google Places API not available");
      return null;
    }
    
    const service = getPlacesService();
    if (!service) {
      console.error("Could not create Places service");
      return null;
    }
    
    return new Promise((resolve) => {
      service.getDetails({
        placeId,
        fields: ['photos']
      }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place && place.photos && place.photos.length > 0) {
          // Récupérer l'URL de la première photo
          const photoUrl = place.photos[0].getUrl({ maxWidth });
          resolve(photoUrl);
        } else {
          resolve(null);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching place photo:", error);
    return null;
  }
};

/**
 * Charge et met en cache les photos Google Places pour une liste de magasins
 * @param stores Liste des magasins
 */
export const preloadStorePhotos = async (stores: any[]): Promise<void> => {
  // Ne traiter que les magasins ayant un placeId et pas encore d'imageUrl
  const storesToProcess = stores.filter(store => 
    store.placeId && 
    (!store.imageUrl || store.imageUrl.includes('placeholder'))
  );
  
  if (storesToProcess.length === 0) return;
  
  console.log(`Preloading photos for ${storesToProcess.length} stores...`);
  
  for (const store of storesToProcess) {
    try {
      const photoUrl = await getGooglePlacePhoto(store.placeId);
      if (photoUrl) {
        // Mettre à jour l'imageUrl du magasin directement
        store.imageUrl = photoUrl;
        console.log(`Photo loaded for ${store.name}`);
      }
    } catch (err) {
      console.error(`Failed to load photo for ${store.name}:`, err);
    }
  }
};
