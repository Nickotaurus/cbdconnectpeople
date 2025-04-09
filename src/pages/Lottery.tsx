
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket, Gift } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { ClientUser } from '@/types/auth';

const mockRewards = [
  { id: "1", name: "10% de réduction chez CBD Paris", date: "2024-04-01", claimed: true },
  { id: "2", name: "Échantillon gratuit d'huile CBD 5%", date: "2024-04-05", claimed: false }
];

const Lottery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const clientUser = user as ClientUser;
  const ticketsAvailable = clientUser?.tickets || 0;
  
  const handleUseLotteryTicket = () => {
    if (ticketsAvailable <= 0) {
      toast({
        title: "Aucun ticket disponible",
        description: "Complétez des quêtes pour gagner des tickets de loterie",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would call an API to use a lottery ticket
    toast({
      title: "Tirage en cours...",
      description: "Vérification de votre gain..."
    });
    
    // Simulate a delay for the lottery draw
    setTimeout(() => {
      // Random chance to win (30%)
      const hasWon = Math.random() < 0.3;
      
      if (hasWon) {
        toast({
          title: "Félicitations !",
          description: "Vous avez gagné un échantillon gratuit d'huile CBD !",
        });
      } else {
        toast({
          title: "Pas de chance",
          description: "Vous n'avez rien gagné cette fois. Retentez votre chance !",
        });
      }
    }, 2000);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Loterie CBD Connect</h1>
          <Button onClick={() => navigate('/')}>
            Retour au tableau de bord
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Ticket className="h-5 w-5 mr-2 text-primary" />
                Mes tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <span className="text-4xl font-bold">{ticketsAvailable}</span>
                <p className="text-muted-foreground mt-1">tickets disponibles</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleUseLotteryTicket}
                disabled={ticketsAvailable <= 0}
              >
                Utiliser un ticket
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Gift className="h-5 w-5 mr-2 text-primary" />
                Comment gagner des tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">1</div>
                  <span>Compléter votre profil (+1 ticket)</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">2</div>
                  <span>Ajouter un avis sur une boutique (+1 ticket)</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 mt-0.5">3</div>
                  <span>Visiter une boutique partenaire (+2 tickets)</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/quests')}
              >
                Voir toutes les quêtes
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Mes gains</CardTitle>
            <CardDescription>Historique de vos récompenses obtenues</CardDescription>
          </CardHeader>
          <CardContent>
            {mockRewards.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Récompense</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRewards.map(reward => (
                    <TableRow key={reward.id}>
                      <TableCell>{reward.name}</TableCell>
                      <TableCell>{new Date(reward.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        {reward.claimed ? (
                          <span className="text-muted-foreground">Réclamé</span>
                        ) : (
                          <Button variant="link" className="p-0 h-auto">
                            Réclamer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Vous n'avez pas encore gagné de récompenses</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Lottery;
