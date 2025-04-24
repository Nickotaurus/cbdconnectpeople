
export default function StoreInfoWindow({ 
  place,
  onSelect 
}: { 
  place: google.maps.places.PlaceResult;
  onSelect: () => void;
}) {
  const name = place.name || 'Boutique sans nom';
  const address = place.formatted_address || place.vicinity || '';
  const rating = place.rating || 0;
  const reviews = place.user_ratings_total || 0;
  const placeId = place.place_id || '';
  
  // Convert this React component to plain HTML string for Google Maps InfoWindow
  return `
    <div class="store-info-window">
      <div>
        <div class="store-info-title">${name}</div>
        <div class="store-info-address">${address}</div>
        ${rating > 0 ? `
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="color: #f59e0b; margin-right: 4px;">★</span>
            <span style="font-weight: 500;">${rating.toFixed(1)}</span>
            <span style="color: #666; font-size: 12px; margin-left: 4px;">(${reviews} avis)</span>
          </div>
        ` : ''}
      </div>
      <div class="store-info-actions">
        <button class="store-info-button" onclick="selectStore('${placeId}')">
          Sélectionner cette boutique
        </button>
      </div>
    </div>
  `;
}
