
interface StoreInfoWindowProps {
  place: google.maps.places.PlaceResult;
  onSelect: () => void;
}

const StoreInfoWindow = ({ place, onSelect }: StoreInfoWindowProps) => {
  return `
    <div class="store-info-window">
      <h3 class="store-name">${place.name}</h3>
      ${place.rating ? `
        <div class="store-rating">
          <span class="rating-value">${place.rating.toFixed(1)}</span>
          <span class="rating-stars">★</span>
          ${place.user_ratings_total ? `
            <span class="rating-count">(${place.user_ratings_total} avis)</span>
          ` : ''}
        </div>
      ` : ''}
      ${place.vicinity ? `<p class="store-address">${place.vicinity}</p>` : ''}
      <button class="select-store-btn" onclick="window.selectStore('${place.place_id}')">
        Sélectionner cette boutique
      </button>
    </div>
  `;
};

export default StoreInfoWindow;

