
import { supabase } from '@/integrations/supabase/client';

export const getGoogleMapsApiKey = async (): Promise<string> => {
  try {
    console.log("Invoking Supabase function to get Google Maps API key");
    const { data, error } = await supabase
      .functions.invoke('get-google-maps-key');

    if (error) {
      console.error('Error fetching Google Maps API key:', error);
      throw new Error('Impossible de récupérer la clé API Google Maps.');
    }

    console.log("API key received from Supabase function");
    return data?.apiKey || '';
  } catch (error) {
    console.error('Unexpected error getting Google Maps API key:', error);
    return '';
  }
};
