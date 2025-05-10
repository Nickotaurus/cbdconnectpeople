
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { ClientUser } from '@/types/auth';
import { EcommerceStore } from '@/types/ecommerce';
import { useEcommerceStores } from '@/hooks/useEcommerceStores';

// Components
import EcommercePageHeader from '@/components/ecommerce/EcommercePageHeader';
import EcommerceFilters from '@/components/ecommerce/EcommerceFilters';
import EcommerceCard from '@/components/ecommerce/EcommerceCard';
import EcommerceLoading from '@/components/ecommerce/EcommerceLoading';
import EmptyState from '@/components/ecommerce/EmptyState';
import EcommerceRegisterCTA from '@/components/ecommerce/EcommerceRegisterCTA';

const EcommercePage = () => {
  const navigate = useNavigate();
  const { user, updateUserPreferences } = useAuth();
  const { toast } = useToast();
  const clientUser = user as ClientUser;
  
  const {
    filteredStores,
    isLoading,
    searchTerm,
    filterSpecialty,
    favoriteEcommerces,
    setFavoriteEcommerces,
    handleSearch,
    handleSpecialtyFilter,
    allSpecialties
  } = useEcommerceStores();
  
  const toggleFavoriteEcommerce = async (ecommerce: EcommerceStore) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris.",
      });
      return;
    }
    
    if (user.role !== 'client') {
      toast({
        title: "Action non disponible",
        description: "Seuls les clients peuvent ajouter des favoris.",
      });
      return;
    }
    
    try {
      const isCurrentlyFavorite = favoriteEcommerces.includes(ecommerce.id);
      let updatedFavorites = [...(clientUser.favorites || [])];
      
      if (isCurrentlyFavorite) {
        updatedFavorites = updatedFavorites.filter(id => id !== ecommerce.id);
      } else {
        updatedFavorites.push(ecommerce.id);
      }
      
      await updateUserPreferences({ favorites: updatedFavorites });
      
      setFavoriteEcommerces(isCurrentlyFavorite 
        ? favoriteEcommerces.filter(id => id !== ecommerce.id)
        : [...favoriteEcommerces, ecommerce.id]
      );
      
      toast({
        title: isCurrentlyFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
        description: isCurrentlyFavorite 
          ? `${ecommerce.name} a été retiré de vos favoris.` 
          : `${ecommerce.name} a été ajouté à vos favoris.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour vos favoris.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <EcommercePageHeader 
          title="Boutiques E-commerce CBD" 
          subtitle="Trouvez les meilleurs sites de vente en ligne de produits CBD"
        />
        
        <EcommerceFilters 
          searchTerm={searchTerm}
          filterSpecialty={filterSpecialty}
          allSpecialties={allSpecialties}
          onSearch={handleSearch}
          onSpecialtyFilter={handleSpecialtyFilter}
        />
      
        {isLoading ? (
          <EcommerceLoading />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredStores.map(store => (
              <EcommerceCard
                key={store.id}
                store={store}
                isFavorite={favoriteEcommerces.includes(store.id)}
                onToggleFavorite={toggleFavoriteEcommerce}
              />
            ))}
          </div>
        )}
        
        {!isLoading && filteredStores.length === 0 && <EmptyState />}
        
        <EcommerceRegisterCTA />
      </div>
    </div>
  );
};

export default EcommercePage;
