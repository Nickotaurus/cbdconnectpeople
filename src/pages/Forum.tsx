
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Users, Tag, Clock, Plus, Search, Flame, Leaf, HelpCircle, ShieldAlert, BookOpen } from 'lucide-react';

// Types pour nos données
interface ForumTopic {
  id: string;
  title: string;
  category: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: string;
  isSticky?: boolean;
  isHot?: boolean;
}

interface ForumCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  topics: number;
  posts: number;
  color?: string;
}

const Forum = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Catégories du forum
  const categories: ForumCategory[] = [
    {
      id: 'general',
      name: 'Discussions Générales',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Discussions générales autour du CBD et du monde du cannabis légal',
      topics: 124,
      posts: 1243,
      color: 'bg-blue-500'
    },
    {
      id: 'producers',
      name: 'Producteurs',
      icon: <Leaf className="h-5 w-5" />,
      description: 'Discussions sur les producteurs, leurs méthodes et leurs produits',
      topics: 87,
      posts: 652,
      color: 'bg-green-500'
    },
    {
      id: 'stores',
      name: 'Boutiques',
      icon: <ShieldAlert className="h-5 w-5" />,
      description: 'Échanges sur les boutiques CBD, promotions et actualités',
      topics: 95,
      posts: 734,
      color: 'bg-purple-500'
    },
    {
      id: 'help',
      name: 'Questions & Aide',
      icon: <HelpCircle className="h-5 w-5" />,
      description: 'Besoin d\'aide ou de conseils sur le CBD?',
      topics: 152,
      posts: 987,
      color: 'bg-yellow-500'
    },
    {
      id: 'guides',
      name: 'Guides & Ressources',
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Guides, tutoriels et ressources éducatives sur le CBD',
      topics: 63,
      posts: 489,
      color: 'bg-red-500'
    }
  ];
  
  // Sujets récents pour l'onglet "Récents"
  const recentTopics: ForumTopic[] = [
    {
      id: 't1',
      title: 'Quelle est la différence entre CBD et CBG?',
      category: 'guides',
      author: 'Jean_CBD',
      replies: 23,
      views: 345,
      lastActivity: 'Il y a 2 heures'
    },
    {
      id: 't2',
      title: 'Nouvelles réglementations en France',
      category: 'general',
      author: 'CBDLegal',
      replies: 45,
      views: 732,
      lastActivity: 'Il y a 3 heures',
      isSticky: true
    },
    {
      id: 't3',
      title: 'Comparatif des producteurs bio en France',
      category: 'producers',
      author: 'Marie_Green',
      replies: 18,
      views: 291,
      lastActivity: 'Il y a 5 heures',
      isHot: true
    },
    {
      id: 't4',
      title: 'Meilleure huile pour l\'anxiété?',
      category: 'help',
      author: 'AnxietyFree',
      replies: 34,
      views: 456,
      lastActivity: 'Il y a 8 heures'
    },
    {
      id: 't5',
      title: 'Nouvelle boutique à Paris: avis?',
      category: 'stores',
      author: 'Parisien75',
      replies: 12,
      views: 198,
      lastActivity: 'Il y a 12 heures'
    }
  ];
  
  // Sujets populaires pour l'onglet "Populaires"
  const popularTopics: ForumTopic[] = [
    {
      id: 'p1',
      title: 'Guide complet des terpènes dans le CBD',
      category: 'guides',
      author: 'ProfCBD',
      replies: 87,
      views: 1245,
      lastActivity: 'Il y a 2 jours',
      isHot: true
    },
    {
      id: 'p2',
      title: 'Meilleurs producteurs européens 2023',
      category: 'producers',
      author: 'EuroCBD',
      replies: 65,
      views: 982,
      lastActivity: 'Il y a 3 jours'
    },
    {
      id: 'p3',
      title: 'Combattre l\'insomnie avec le CBD: témoignages',
      category: 'help',
      author: 'Insomniac',
      replies: 76,
      views: 1103,
      lastActivity: 'Il y a 4 jours',
      isHot: true
    },
    {
      id: 'p4',
      title: 'Top 10 des boutiques en ligne: notre classement',
      category: 'stores',
      author: 'ShopperCBD',
      replies: 58,
      views: 874,
      lastActivity: 'Il y a 5 jours'
    },
    {
      id: 'p5',
      title: 'Débat: fleur vs huile - quelle efficacité?',
      category: 'general',
      author: 'Debator',
      replies: 92,
      views: 1342,
      lastActivity: 'Il y a 1 semaine'
    }
  ];
  
  // Fonction pour filtrer les sujets
  const filterTopics = (topics: ForumTopic[]) => {
    if (!searchQuery) return topics;
    
    return topics.filter(topic => 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };
  
  // Fonction pour obtenir le badge de catégorie
  const getCategoryBadge = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return null;
    
    return (
      <Badge variant="outline" className={`${category.color || 'bg-gray-500'} text-white`}>
        {category.name}
      </Badge>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Forum Communautaire</h1>
          <p className="text-muted-foreground">
            Rejoignez les discussions et partagez vos expériences avec la communauté CBD
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button asChild>
            <Link to="/forum/nouveau">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau sujet
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans le forum..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="recent">Récents</TabsTrigger>
          <TabsTrigger value="popular">Populaires</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-md ${category.color || 'bg-primary'}`}>
                        {category.icon}
                      </div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div><span className="font-semibold">{category.topics}</span> sujets</div>
                    <div><span className="font-semibold">{category.posts}</span> messages</div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to={`/forum/category/${category.id}`}>
                      Explorer la catégorie
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Sujets récents</CardTitle>
              <CardDescription>
                Les dernières discussions de notre communauté
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Sujet</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead className="text-center">Réponses</TableHead>
                    <TableHead className="text-center">Vues</TableHead>
                    <TableHead className="text-right">Activité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterTopics(recentTopics).map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {topic.isSticky && <Tag className="h-4 w-4 mr-2 text-yellow-500" />}
                          {topic.isHot && <Flame className="h-4 w-4 mr-2 text-red-500" />}
                          <Link to={`/forum/topic/${topic.id}`} className="font-medium hover:underline">
                            {topic.title}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(topic.category)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{topic.author}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{topic.replies}</TableCell>
                      <TableCell className="text-center">{topic.views}</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{topic.lastActivity}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="popular">
          <Card>
            <CardHeader>
              <CardTitle>Sujets populaires</CardTitle>
              <CardDescription>
                Les discussions qui ont généré le plus d'engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Sujet</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead className="text-center">Réponses</TableHead>
                    <TableHead className="text-center">Vues</TableHead>
                    <TableHead className="text-right">Activité</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterTopics(popularTopics).map((topic) => (
                    <TableRow key={topic.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {topic.isSticky && <Tag className="h-4 w-4 mr-2 text-yellow-500" />}
                          {topic.isHot && <Flame className="h-4 w-4 mr-2 text-red-500" />}
                          <Link to={`/forum/topic/${topic.id}`} className="font-medium hover:underline">
                            {topic.title}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(topic.category)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>{topic.author}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{topic.replies}</TableCell>
                      <TableCell className="text-center">{topic.views}</TableCell>
                      <TableCell className="text-right flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{topic.lastActivity}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Forum;
