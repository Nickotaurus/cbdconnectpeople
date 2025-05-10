
import { Store } from '@/types/store';
import BasicMap from './maps/BasicMap';

interface MapProps {
  stores?: Store[];
  onSelectStore?: (store: Store) => void;
  selectedStoreId?: string;
  zoom?: number;
  center?: { lat: number; lng: number };
}

const MapComponent = ({ stores, onSelectStore, selectedStoreId, zoom, center }: MapProps = {}) => {
  return <BasicMap 
    stores={stores} 
    onSelectStore={onSelectStore} 
    selectedStoreId={selectedStoreId} 
    zoom={zoom}
    center={center}
  />;
};

export default MapComponent;
