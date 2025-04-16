
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RoleDashboardWrapper from "./RoleDashboardWrapper";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Mail, Phone, MapPin, Globe, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel } from "@/utils/partnerUtils";
import { PartnerCategory } from "@/types/auth";

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [partnerData, setPartnerData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPartnerData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching partner profile data:", error);
          return;
        }

        console.log("Partner dashboard data:", data);
        setPartnerData(data);
      } catch (err) {
        console.error("Error loading partner data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPartnerData();
  }, [user]);
  
  // Extract values from partner_favorites array if it exists
  const getPartnerInfo = () => {
    if (!partnerData || !partnerData.partner_favorites) {
      return { email: '', phone: '', address: '', city: '', postalCode: '', website: '', description: '' };
    }
    
    const [email, phone, address, city, postalCode, website, description] = partnerData.partner_favorites;
    
    return { email, phone, address, city, postalCode, website, description };
  };
  
  const partnerInfo = getPartnerInfo();
  
  return (
    <RoleDashboardWrapper
      title="Espace Partenaire"
      description="Bienvenue dans votre espace partenaire. Depuis cet espace, vous pouvez gérer votre profil et accéder aux statistiques de visite."
    >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <Card className="mb-8">
            <CardHeader className="flex flex-col sm:flex-row items-center sm:justify-between pb-2">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <Avatar className="h-16 w-16">
                  {partnerData?.logo_url ? (
                    <AvatarImage src={partnerData.logo_url} alt={partnerData.name} />
                  ) : (
                    <AvatarFallback className="text-2xl">
                      {partnerData?.name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{partnerData?.name}</CardTitle>
                  {partnerData?.partner_category && (
                    <Badge variant="outline" className="mt-1">
                      {getCategoryLabel(partnerData.partner_category as PartnerCategory)}
                    </Badge>
                  )}
                </div>
              </div>
              <Button 
                onClick={() => navigate("/add-partner", {
                  state: { 
                    fromRegistration: false,
                    partnerCategory: partnerData?.partner_category || '',
                    isEditing: true
                  }
                })}
              >
                Modifier mon profil
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-3">Informations</h3>
                  <div className="space-y-3">
                    {partnerInfo.description && (
                      <div className="flex gap-2">
                        <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                        <p>{partnerInfo.description}</p>
                      </div>
                    )}
                    {partnerInfo.email && (
                      <div className="flex gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <p>{partnerInfo.email}</p>
                      </div>
                    )}
                    {partnerInfo.phone && (
                      <div className="flex gap-2">
                        <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <p>{partnerInfo.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-3">Localisation</h3>
                  <div className="space-y-3">
                    {(partnerInfo.address || partnerInfo.city || partnerInfo.postalCode) && (
                      <div className="flex gap-2">
                        <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <p>
                          {partnerInfo.address}{" "}
                          {partnerInfo.city ? `${partnerInfo.city}, ` : ""}
                          {partnerInfo.postalCode || ""}
                        </p>
                      </div>
                    )}
                    {partnerInfo.website && (
                      <div className="flex gap-2">
                        <Globe className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <a 
                          href={partnerInfo.website.startsWith('http') ? partnerInfo.website : `https://${partnerInfo.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {partnerInfo.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6 flex flex-col items-center text-center">
              <h3 className="text-xl font-medium mb-3">Statistiques</h3>
              <p className="text-muted-foreground text-center mb-4">
                Consultez les statistiques de visite de votre profil
              </p>
              <Button className="mt-auto" onClick={() => navigate("/partner/stats")}>
                Voir les statistiques
              </Button>
            </Card>
          </div>
        </>
      )}
    </RoleDashboardWrapper>
  );
};

export default PartnerDashboard;
