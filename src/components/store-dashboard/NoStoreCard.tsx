
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const NoStoreCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aucune boutique associée</CardTitle>
        <CardDescription>
          Vous n'avez pas encore de boutique associée à votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Pour ajouter une boutique, cliquez sur le bouton ci-dessous.</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => navigate('/add-store')}>
          Ajouter une boutique
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoStoreCard;
