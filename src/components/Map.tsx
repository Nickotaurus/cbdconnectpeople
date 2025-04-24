
import { Store } from '@/types/store';
import BasicMap from './maps/BasicMap';

interface MapProps {
  stores?: Store[];
  onSelectStore?: (store: Store) => void;
  selectedStoreId?: string;
}

const Map = ({ stores, onSelectStore, selectedStoreId }: MapProps = {}) => {
  return <BasicMap stores={stores} onSelectStore={onSelectStore} selectedStoreId={selectedStoreId} />;
};

export default Map;
