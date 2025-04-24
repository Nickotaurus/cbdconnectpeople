
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

interface ResponseBody {
  apiKey?: string;
  error?: string;
}

serve(async (req: Request) => {
  try {
    const apiKey = Deno.env.get("GOOGLE_MAPS_API_KEY");
    
    if (!apiKey) {
      console.error("Missing Google Maps API key in environment variables");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }

    const response: ResponseBody = {
      apiKey
    };

    return new Response(
      JSON.stringify(response),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in edge function:", error);
    
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
