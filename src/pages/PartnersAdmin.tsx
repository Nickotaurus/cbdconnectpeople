
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader, UserCheck, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePendingPartners } from '@/hooks/usePendingPartners';
import { PartnerUser } from '@/types/auth';

const PartnersAdmin = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { pendingPartners, isLoading, error, approvePartner } = usePendingPartners();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Administration des Partenaires</h1>
        
        {pendingPartners.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Aucun partenaire en attente</CardTitle>
              <CardDescription>
                Tous les partenaires ont été approuvés
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendingPartners.map((partner: PartnerUser) => (
              <Card key={partner.id}>
                <CardHeader>
                  <CardTitle>{partner.name}</CardTitle>
                  <CardDescription>
                    Catégorie : {partner.partnerCategory}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Email : {partner.email}
                      </p>
                      {partner.certifications && partner.certifications.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Certifications : {partner.certifications.join(', ')}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => approvePartner(partner.id)}
                      className="gap-2"
                    >
                      <UserCheck className="h-4 w-4" />
                      Approuver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnersAdmin;
