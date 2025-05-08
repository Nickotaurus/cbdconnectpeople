
import { Store } from '@/types/store';
import BasicMap from './maps/BasicMap';

interface MapProps {
  stores?: Store[];
  onSelectStore?: (store: Store) => void;
  selectedStoreId?: string;
  zoom?: number; // Added zoom property
}

const Map = ({ stores, onSelectStore, selectedStoreId, zoom }: MapProps = {}) => {
  return <BasicMap 
    stores={stores} 
    onSelectStore={onSelectStore} 
    selectedStoreId={selectedStoreId} 
    zoom={zoom} 
  />;
};

export default Map;
