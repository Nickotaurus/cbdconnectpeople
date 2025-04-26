
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Définir les en-têtes CORS pour permettre les requêtes depuis n'importe quel domaine
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

interface ResponseBody {
  apiKey?: string;
  error?: string;
}

serve(async (req: Request) => {
  // Gérer les requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Récupération de la clé API Google Maps");
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    
    if (!apiKey) {
      console.error("Clé API Google Maps non trouvée dans les variables d'environnement");
      return new Response(
        JSON.stringify({ error: "Clé API non configurée" }),
        { headers: corsHeaders, status: 500 }
      );
    }

    console.log("Clé API Google Maps récupérée avec succès");
    const response: ResponseBody = {
      apiKey
    };

    return new Response(
      JSON.stringify(response),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Erreur dans la fonction edge:", error);
    
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
