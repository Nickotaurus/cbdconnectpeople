
export const renderInfoWindowContent = (
  place: google.maps.places.PlaceResult,
  onSelect: () => void
) => {
  return `
    <div class="store-info-window">
      <h3 class="store-name">${place.name || 'Boutique CBD'}</h3>
      ${place.rating ? `
        <div class="store-rating">
          <span class="rating-value">${place.rating.toFixed(1)}</span>
          <span class="rating-stars">★</span>
          ${place.user_ratings_total ? `
            <span class="rating-count">(${place.user_ratings_total} avis)</span>
          ` : ''}
        </div>
      ` : ''}
      ${place.formatted_address ? `<p class="store-address">${place.formatted_address}</p>` : ''}
      <button class="select-store-btn" onclick="window.selectStore('${place.place_id}')">
        Sélectionner cette boutique
      </button>
    </div>
  `;
};
