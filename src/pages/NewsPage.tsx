
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, User, Tag, ArrowRight } from 'lucide-react';

// Types
type ArticleCategory = 'news' | 'business' | 'legal' | 'science' | 'interview' | 'sponsored';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  image?: string;
  tags: string[];
  isSponsored?: boolean;
}

// Mock articles data
const articles: Article[] = [
  {
    id: '1',
    title: "La France clarifie enfin sa position sur le CBD",
    excerpt: "Le gouvernement publie un nouveau décret encadrant la vente et la consommation de CBD en France.",
    content: "Lorem ipsum dolor sit amet...",
    category: 'legal',
    author: {
      name: "Marie Dupont",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000",
    },
    date: "2023-10-15",
    image: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=1000",
    tags: ["législation", "CBD", "France"]
  },
  {
    id: '2',
    title: "Étude clinique: le CBD efficace contre l'anxiété",
    excerpt: "Une nouvelle étude confirme les effets anxiolytiques du cannabidiol dans un essai clinique à grande échelle.",
    content: "Lorem ipsum dolor sit amet...",
    category: 'science',
    author: {
      name: "Dr. Jean Martin",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000",
    },
    date: "2023-10-17",
    image: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?q=80&w=1000",
    tags: ["recherche", "santé", "anxiété"]
  },
  {
    id: '3',
    title: "Cannabis thérapeutique : l'expérimentation française prolongée",
    excerpt: "Le ministère de la Santé annonce la prolongation de l'expérimentation du cannabis thérapeutique jusqu'en 2025.",
    content: "Lorem ipsum dolor sit amet...",
    category: 'news',
    author: {
      name: "Sophie Béranger",
    },
    date: "2023-10-20",
    image: "https://images.unsplash.com/photo-1503262028195-93c528f03218?q=80&w=1000",
    tags: ["cannabis médical", "santé", "politique"]
  },
  {
    id: '4',
    title: "Green Leaf CBD lève 5 millions d'euros",
    excerpt: "La startup française spécialisée dans les produits CBD premium annonce une levée de fonds importante.",
    content: "Lorem ipsum dolor sit amet...",
    category: 'business',
    author: {
      name: "Thomas Laurent",
    },
    date: "2023-10-22",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=1000",
    tags: ["business", "investissement", "startup"],
    isSponsored: true
  },
  {
    id: '5',
    title: "Interview: Julien Martin, pionnier du CBD en France",
    excerpt: "Rencontre avec le fondateur de l'une des premières boutiques de CBD en France qui nous raconte son parcours.",
    content: "Lorem ipsum dolor sit amet...",
    category: 'interview',
    author: {
      name: "Léa Dubois",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000",
    },
    date: "2023-10-25",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1000",
    tags: ["interview", "entrepreneur", "témoignage"]
  },
  {
    id: '6',
    title: "Découvrez les bienfaits de l'huile CBD pour le sommeil",
    excerpt: "Comment l'huile de CBD peut vous aider à retrouver un sommeil de qualité et combattre l'insomnie naturellement.",
    content: "Lorem ipsum dolor sit amet...",
    category: 'sponsored',
    author: {
      name: "CBD Health",
    },
    date: "2023-10-27",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=1000",
    tags: ["sommeil", "bien-être", "huile CBD"],
    isSponsored: true
  }
];

const NewsPage = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(articles);
  
  // Filter articles based on category and search term
  const filterArticles = (category: string, term: string) => {
    let filtered = [...articles];
    
    // Apply category filter
    if (category !== 'all') {
      filtered = filtered.filter(article => article.category === category);
    }
    
    // Apply search filter
    if (term.trim()) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(
        article => 
          article.title.toLowerCase().includes(lowerTerm) || 
          article.excerpt.toLowerCase().includes(lowerTerm) ||
          article.tags.some(tag => tag.toLowerCase().includes(lowerTerm))
      );
    }
    
    setFilteredArticles(filtered);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    filterArticles(value, searchTerm);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterArticles(activeTab, term);
  };
  
  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  // Get category label
  const getCategoryLabel = (category: ArticleCategory) => {
    switch (category) {
      case 'news': return 'Actualités';
      case 'business': return 'Business';
      case 'legal': return 'Législation';
      case 'science': return 'Recherche';
      case 'interview': return 'Interviews';
      case 'sponsored': return 'Contenu sponsorisé';
      default: return category;
    }
  };
  
  // Featured article (most recent non-sponsored)
  const featuredArticle = articles
    .filter(article => !article.isSponsored)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Actualité CBD</h1>
          <p className="text-muted-foreground mb-6">
            Les dernières actualités et tendances du monde du CBD
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10"
              />
            </div>
          </div>
        </div>
        
        {/* Featured Article */}
        {featuredArticle && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">À la une</h2>
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2 h-64 md:h-auto">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 flex flex-col p-6">
                  <Badge variant="outline" className="self-start mb-2">
                    {getCategoryLabel(featuredArticle.category)}
                  </Badge>
                  <CardTitle className="text-2xl mb-4">{featuredArticle.title}</CardTitle>
                  <CardDescription className="text-base mb-4">
                    {featuredArticle.excerpt}
                  </CardDescription>
                  <div className="flex items-center gap-2 mt-auto">
                    {featuredArticle.author.avatar ? (
                      <img 
                        src={featuredArticle.author.avatar} 
                        alt={featuredArticle.author.name} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{featuredArticle.author.name}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(featuredArticle.date)}</p>
                    </div>
                  </div>
                  <Button className="mt-6 gap-2">
                    Lire l'article <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Category Tabs */}
        <Tabs defaultValue="all" onValueChange={handleTabChange} className="mb-8">
          <TabsList className="mb-8">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="news">Actualités</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="legal">Législation</TabsTrigger>
            <TabsTrigger value="science">Recherche</TabsTrigger>
            <TabsTrigger value="interview">Interviews</TabsTrigger>
          </TabsList>
          
          {/* Articles List */}
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <Card key={article.id} className="overflow-hidden flex flex-col h-full">
                  {article.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline">
                        {getCategoryLabel(article.category)}
                      </Badge>
                      {article.isSponsored && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                          Sponsorisé
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{article.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {article.author.avatar ? (
                        <img 
                          src={article.author.avatar} 
                          alt={article.author.name} 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                      <CardDescription className="flex items-center gap-2">
                        <span>{article.author.name}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(article.date)}
                        </span>
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2 flex-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button variant="default" className="w-full gap-2">
                      Lire l'article <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun article ne correspond à votre recherche.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Newsletter Signup */}
        <div className="mt-12 bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Restez informé des dernières actualités CBD
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter hebdomadaire pour recevoir une sélection des meilleures actualités et articles du monde du CBD.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input placeholder="Votre adresse email" className="flex-1" />
            <Button>S'inscrire</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
