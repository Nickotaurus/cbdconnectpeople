
import { Button } from "@/components/ui/button";

interface DebugPanelProps {
  isVisible: boolean;
  supabaseStoresCount: number;
  localStoresCount: number;
  combinedStoresCount: number;
  onRefresh: () => void;
}

const DebugPanel = ({
  isVisible,
  supabaseStoresCount,
  localStoresCount,
  combinedStoresCount,
  onRefresh
}: DebugPanelProps) => {
  if (!isVisible) return null;
  
  return (
    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
      <p className="text-xs font-semibold">Mode Debug</p>
      <p className="text-xs">Boutiques Supabase: {supabaseStoresCount}</p>
      <p className="text-xs">Boutiques locales: {localStoresCount}</p>
      <p className="text-xs">Boutiques combinées: {combinedStoresCount}</p>
      <Button 
        className="text-xs text-blue-600 mt-1"
        variant="ghost"
        size="sm"
        onClick={onRefresh}
      >
        Rafraîchir les données
      </Button>
    </div>
  );
};

export default DebugPanel;
