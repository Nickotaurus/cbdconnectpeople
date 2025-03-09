
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, BrainCircuit, ThumbsUp, CornerDownLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRecommendations } from '@/hooks/useRecommendations';

interface AiRecommendation {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

const AiRecommendations = () => {
  const { user } = useAuth();
  const [userQuery, setUserQuery] = useState('');
  const { recommendations, isLoading, generateRecommendations } = useRecommendations();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userQuery.trim()) {
      generateRecommendations(userQuery);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary h-5 w-5" />
            Recommandations personnalisées
          </CardTitle>
          <CardDescription>
            Notre IA vous propose des conseils adaptés à vos besoins spécifiques en matière de CBD
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="query">Décrivez votre situation ou posez une question</Label>
              <Textarea
                id="query"
                placeholder="Ex: Je souffre d'anxiété et d'insomnie, quel type de CBD me recommandez-vous ?"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="min-h-[100px]"
                disabled={isLoading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !userQuery.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <CornerDownLeft className="mr-2 h-4 w-4" />
                  Obtenir des recommandations
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vos recommandations personnalisées</h3>
          
          {recommendations.map((recommendation) => (
            <Card key={recommendation.id} className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div dangerouslySetInnerHTML={{ __html: recommendation.content }} />
                <div className="flex flex-wrap gap-2 mt-3">
                  {recommendation.tags.map((tag, index) => (
                    <div key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      {tag}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t">
                <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                  <span>Recommandation générée par IA</span>
                  <Button variant="ghost" size="sm" className="h-8">
                    <ThumbsUp className="h-4 w-4 mr-1" /> Utile
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AiRecommendations;
