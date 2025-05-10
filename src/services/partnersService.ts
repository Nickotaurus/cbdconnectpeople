
import { supabase } from '@/integrations/supabase/client';
import { Partner } from '@/types/partners/partner';
import { testPartnerData } from '@/data/testPartnersData';
import { toast } from '@/components/ui/use-toast';
import { PartnerCategory } from '@/types/auth';

export async function fetchPartners(): Promise<{
  partners: Partner[];
  useTestData: boolean;
  error: string | null;
}> {
  try {
    console.log("🔍 Fetching partner profiles");
    
    const { data: allProfiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'partner');
    
    if (profileError) {
      console.error("❌ Error fetching profiles:", profileError);
      return { partners: [], error: "Impossible de charger les profils partenaires", useTestData: true };
    }
    
    console.log("📋 Total partner profiles found:", allProfiles?.length || 0);
    
    if (allProfiles && allProfiles.length > 0) {
      allProfiles.forEach(profile => {
        console.log("🕵️ Profile Details:", {
          id: profile.id,
          name: profile.name,
          role: profile.role,
          verified: profile.is_verified,
          category: profile.partner_category,
          partners_favorites: profile.partner_favorites
        });
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'partner')
      .eq('is_verified', true)
      .not('partner_category', 'is', null);
    
    if (error) {
      console.error("❌ Error filtering partners:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les partenaires.",
        variant: "destructive",
      });
      return { partners: [], error: "Impossible de charger les partenaires", useTestData: true };
    }

    console.log("✅ Filtered partner profiles:", data?.length || 0);
    
    if (data && data.length > 0) {
      data.forEach(profile => {
        console.log("✨ Partner Profile:", {
          id: profile.id,
          name: profile.name,
          category: profile.partner_category,
          location: profile.partner_favorites?.[3] || 'Non spécifiée',
          description: profile.partner_favorites?.[6] || 'Aucune description'
        });
      });
      
      const formattedProfiles = data.map(profile => ({
        id: profile.id,
        name: profile.name || 'Partenaire sans nom',
        category: (profile.partner_category || 'other') as PartnerCategory, // Cast to PartnerCategory type
        location: profile.partner_favorites?.[3] || 'France',
        description: profile.partner_favorites?.[6] || 'Aucune description',
        certifications: profile.certifications || [],
        distance: Math.floor(Math.random() * 300),
        imageUrl: profile.logo_url || 'https://via.placeholder.com/150'
      }));
      
      console.log("🏆 Formatted Profiles:", formattedProfiles);
      return { partners: formattedProfiles, error: null, useTestData: false };
    } else {
      console.warn("❗ No partner profiles found matching criteria - Using test data");
      return { partners: testPartnerData, error: null, useTestData: true };
    }
  } catch (err) {
    console.error("🚨 Unexpected error:", err);
    return { 
      partners: testPartnerData, 
      error: "Une erreur s'est produite lors du chargement des partenaires", 
      useTestData: true 
    };
  }
}
