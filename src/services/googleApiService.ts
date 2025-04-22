
import { supabase } from '@/integrations/supabase/client';

export const getGoogleMapsApiKey = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .functions.invoke('get-google-maps-key');

    if (error) {
      console.error('Error fetching Google Maps API key:', error);
      throw new Error('Impossible de récupérer la clé API Google Maps.');
    }

    return data?.apiKey || '';
  } catch (error) {
    console.error('Unexpected error getting Google Maps API key:', error);
    return '';
  }
};
