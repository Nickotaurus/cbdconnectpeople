
export const renderInfoWindowContent = (
  place: google.maps.places.PlaceResult,
  onSelect: () => void
) => {
  // Ajout de styles en ligne pour améliorer l'apparence de l'info-window
  const styles = `
    <style>
      .store-info-window {
        padding: 12px;
        font-family: Arial, sans-serif;
        max-width: 300px;
      }
      .store-name {
        font-size: 16px;
        font-weight: bold;
        margin-top: 0;
        margin-bottom: 8px;
        color: #333;
      }
      .store-rating {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        font-size: 14px;
      }
      .rating-value {
        font-weight: bold;
        margin-right: 4px;
      }
      .rating-stars {
        color: #FFB800;
      }
      .rating-count {
        color: #666;
        font-size: 12px;
        margin-left: 4px;
      }
      .store-address {
        color: #555;
        font-size: 14px;
        margin-bottom: 12px;
        line-height: 1.3;
      }
      .select-store-btn {
        background-color: #4F46E5;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        width: 100%;
        transition: background-color 0.2s;
      }
      .select-store-btn:hover {
        background-color: #4338CA;
      }
      .store-type {
        display: inline-block;
        background-color: #E0F2FE;
        color: #0369A1;
        font-size: 12px;
        padding: 3px 8px;
        border-radius: 12px;
        margin-bottom: 8px;
      }
      /* Amélioration pour mettre en évidence les boutiques CBD */
      .cbd-store {
        border-left: 4px solid #4F46E5;
        background-color: #F8FAFC;
      }
      .cbd-badge {
        display: inline-block;
        background-color: #4F46E5;
        color: white;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 12px;
        margin-left: 6px;
        vertical-align: middle;
      }
    </style>
  `;

  const address = place.formatted_address || place.vicinity || 'Adresse non disponible';
  
  // Fix: Check if place.types exists before using it
  const isCBDStore = place.types ? 
    place.types.some(type => ['store', 'shop', 'establishment'].includes(type)) : 
    true; // Default to true if types not available
  
  // Check if name contains CBD-related terms
  const name = place.name || 'Boutique';
  const lowerName = name.toLowerCase();
  const isCbdInName = lowerName.includes('cbd') || lowerName.includes('chanvre') || lowerName.includes('cannabis');
  
  // Add CBD badge next to name if relevant
  const cbdBadge = isCbdInName ? '<span class="cbd-badge">CBD</span>' : '';
  
  // Apply special class to CBD stores
  const storeContainerClass = isCbdInName ? 'store-info-window cbd-store' : 'store-info-window';
  
  const storeType = isCBDStore ? 
    '<div class="store-type">Boutique CBD</div>' : 
    '';

  // Amélioration de l'affichage des avis Google
  const ratingSection = place.rating ? `
    <div class="store-rating">
      <span class="rating-value">${place.rating.toFixed(1)}</span>
      <span class="rating-stars">★</span>
      ${place.user_ratings_total ? `
        <span class="rating-count">(${place.user_ratings_total} avis Google)</span>
      ` : ''}
    </div>
  ` : '';

  return `
    ${styles}
    <div class="${storeContainerClass}">
      <h3 class="store-name">${name}${cbdBadge}</h3>
      ${storeType}
      ${ratingSection}
      <p class="store-address">${address}</p>
      <button class="select-store-btn" onclick="window.selectStore('${place.place_id}')">
        Sélectionner cette boutique
      </button>
    </div>
  `;
};
