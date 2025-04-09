
import { Globe, Calendar, Phone } from 'lucide-react';
import { Store } from '@/types/store';

interface StoreInfoTabProps {
  store: Store;
}

const StoreInfoTab = ({ store }: StoreInfoTabProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">À propos</h3>
        <p className="text-muted-foreground">{store.description}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Horaires d'ouverture</h3>
        <div className="grid grid-cols-2 gap-2">
          {store.openingHours.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{item.day}</span>
              </div>
              <span className="font-medium">{item.hours}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Produits proposés</h3>
        <div className="space-y-3">
          {store.products.map((product, index) => (
            <div key={index} className="bg-secondary p-3 rounded-md">
              <div className="font-medium">{product.category}</div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Origine: {product.origin}</span>
                <span>Qualité: {product.quality}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Coordonnées</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
            <a 
              href={store.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {store.website.replace(/^https?:\/\//, '')}
            </a>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`tel:${store.phone}`} className="hover:underline">
              {store.phone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoTab;
