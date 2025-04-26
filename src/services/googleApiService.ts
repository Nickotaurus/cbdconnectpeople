
import { supabase } from '@/integrations/supabase/client';

export const getGoogleMapsApiKey = async (): Promise<string> => {
  try {
    console.log("Appel de la fonction Supabase pour récupérer la clé API Google Maps");
    const { data, error } = await supabase
      .functions.invoke('get-google-maps-key');

    if (error) {
      console.error('Erreur lors de la récupération de la clé API Google Maps:', error);
      throw new Error('Impossible de récupérer la clé API Google Maps.');
    }

    if (!data?.apiKey) {
      console.error('Aucune clé API retournée par la fonction');
      throw new Error('Clé API Google Maps non disponible.');
    }

    console.log("Clé API Google Maps récupérée avec succès");
    return data.apiKey;
  } catch (error) {
    console.error('Erreur inattendue lors de la récupération de la clé API Google Maps:', error);
    throw error;
  }
};
