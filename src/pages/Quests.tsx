import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Award, CheckCircle2, Circle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Quest {
  id: string;
  title: string;
  description: string;
  reward: string;
  completed: boolean;
  progress?: number;
  category: 'daily' | 'weekly' | 'achievements';
}

const Quests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [quests, setQuests] = useState<Quest[]>([
    // Daily Quests
    { 
      id: "d1", 
      title: "Visiter une boutique CBD", 
      description: "Consultez la page d'une boutique CBD sur notre plateforme", 
      reward: "1 ticket", 
      completed: false,
      category: 'daily'
    },
    { 
      id: "d2", 
      title: "Consulter le guide CBD", 
      description: "Apprenez-en plus sur le CBD en consultant notre guide", 
      reward: "1 ticket", 
      completed: true,
      category: 'daily'
    },
    { 
      id: "d3", 
      title: "Laisser un avis Google", 
      description: "Noter une boutique ou un site CBD sur Google", 
      reward: "2 tickets", 
      completed: false,
      category: 'daily'
    },
    
    // Weekly Quests
    { 
      id: "w1", 
      title: "Noter 3 boutiques", 
      description: "Donnez votre avis sur au moins 3 boutiques différentes", 
      reward: "5 tickets", 
      completed: false,
      progress: 1,
      category: 'weekly'
    },
    { 
      id: "w2", 
      title: "Utiliser un coupon", 
      description: "Utilisez un code de réduction dans une boutique partenaire", 
      reward: "3 tickets", 
      completed: false,
      category: 'weekly'
    },
    
    // Achievements
    { 
      id: "a1", 
      title: "Expert CBD", 
      description: "Répondre correctement à 10 questions du quiz CBD", 
      reward: "Badge Expert + 10 tickets", 
      completed: false,
      progress: 4,
      category: 'achievements'
    },
    { 
      id: "a2", 
      title: "Explorateur", 
      description: "Visiter 20 boutiques différentes sur la carte", 
      reward: "Badge Explorateur + 15 tickets", 
      completed: false,
      progress: 8,
      category: 'achievements'
    }
  ]);
  
  const completeQuest = (questId: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId ? { ...quest, completed: true } : quest
    ));
    
    toast({
      title: "Quête complétée !",
      description: "Vous avez gagné une récompense",
    });
  };
  
  const getQuestsByCategory = (category: 'daily' | 'weekly' | 'achievements') => {
    return quests.filter(quest => quest.category === category);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">CBD Quest</h1>
          <Button onClick={() => navigate('/')}>
            Retour au tableau de bord
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Progressez et gagnez des récompenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Niveau 2</span>
                <span>Niveau 3</span>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Complétez des quêtes pour gagner des points d'expérience et monter de niveau
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="daily" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="daily">Quotidiennes</TabsTrigger>
            <TabsTrigger value="weekly">Hebdomadaires</TabsTrigger>
            <TabsTrigger value="achievements">Succès</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <div className="grid gap-3">
              {getQuestsByCategory('daily').map(quest => (
                <Card key={quest.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          {quest.completed ? (
                            <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 mr-2 text-muted-foreground" />
                          )}
                          <h3 className="font-medium">{quest.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{quest.reward}</div>
                        {!quest.completed && (
                          <Button size="sm" variant="outline" className="mt-2" onClick={() => completeQuest(quest.id)}>
                            Compléter
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <div className="grid gap-3">
              {getQuestsByCategory('weekly').map(quest => (
                <Card key={quest.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          {quest.completed ? (
                            <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 mr-2 text-muted-foreground" />
                          )}
                          <h3 className="font-medium">{quest.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                        {quest.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progression</span>
                              <span>{quest.progress}/3</span>
                            </div>
                            <Progress value={(quest.progress / 3) * 100} className="h-1" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{quest.reward}</div>
                        {!quest.completed && quest.progress === undefined && (
                          <Button size="sm" variant="outline" className="mt-2" onClick={() => completeQuest(quest.id)}>
                            Compléter
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="achievements">
            <div className="grid gap-3">
              {getQuestsByCategory('achievements').map(quest => (
                <Card key={quest.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          {quest.completed ? (
                            <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                          ) : (
                            <Circle className="h-5 w-5 mr-2 text-muted-foreground" />
                          )}
                          <h3 className="font-medium">{quest.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                        {quest.progress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Progression</span>
                              <span>{quest.progress}/{quest.id === "a1" ? 10 : 20}</span>
                            </div>
                            <Progress value={(quest.progress / (quest.id === "a1" ? 10 : 20)) * 100} className="h-1" />
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <div className="text-sm font-medium text-primary">{quest.reward}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Quests;
