
export const searchNearbyStores = (
  service: google.maps.places.PlacesService,
  location: google.maps.LatLngLiteral
): Promise<google.maps.places.PlaceResult[]> => {
  return new Promise((resolve, reject) => {
    const request: google.maps.places.PlaceSearchRequest = {
      location,
      radius: 5000,
      keyword: 'cbd shop',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results);
      } else {
        reject(new Error(`Places search failed with status: ${status}`));
      }
    });
  });
};

export const getStoreDetails = (
  service: google.maps.places.PlacesService,
  placeId: string
): Promise<google.maps.places.PlaceResult> => {
  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: ['name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total']
      },
      (placeDetails, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && placeDetails) {
          resolve(placeDetails);
        } else {
          reject(new Error(`Place details failed with status: ${status}`));
        }
      }
    );
  });
};

