
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MinusCircle, Maximize2, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from '@/lib/utils';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

type ChatbotState = 'minimized' | 'expanded' | 'fullscreen';

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  content: 'Bonjour ! Je suis votre assistant virtuel CBD. Comment puis-je vous aider aujourd\'hui ?',
  sender: 'bot',
  timestamp: new Date(),
};

const FAQ_RESPONSES: Record<string, string> = {
  'cbd': "Le CBD (cannabidiol) est un composé naturel présent dans le cannabis qui offre des bienfaits thérapeutiques sans les effets psychoactifs du THC.",
  'legal': "En France, les produits CBD sont légaux s'ils contiennent moins de 0,3% de THC et proviennent de variétés de cannabis autorisées.",
  'effets': "Le CBD peut aider à réduire l'anxiété, l'inflammation, les douleurs chroniques et améliorer le sommeil, mais sans l'effet planant du THC.",
  'produits': "Il existe de nombreux produits CBD: huiles, fleurs, e-liquides, cosmétiques, gélules, et même des produits pour animaux de compagnie.",
  'huile': "L'huile CBD se consomme en déposant quelques gouttes sous la langue. Commencez avec une faible dose (5-10mg) et augmentez progressivement si nécessaire.",
  'dosage': "Le dosage optimal du CBD varie selon chaque personne. Il est recommandé de commencer avec une petite dose et d'augmenter progressivement.",
  'boutiques': "Vous pouvez trouver des boutiques CBD près de chez vous en utilisant notre carte interactive dans la section 'Carte'."
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState<ChatbotState>('minimized');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const generateId = () => Math.random().toString(36).substring(2, 11);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: generateId(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simuler une réponse du chatbot (dans une version réelle, cela appellerait une API)
    setTimeout(() => {
      const botResponse = generateResponse(inputValue);
      const botMessage: Message = {
        id: generateId(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 800);
  };
  
  const generateResponse = (query: string): string => {
    const lowercaseQuery = query.toLowerCase();
    
    // Recherche de mots-clés dans le message
    for (const [keyword, response] of Object.entries(FAQ_RESPONSES)) {
      if (lowercaseQuery.includes(keyword)) {
        return response;
      }
    }
    
    // Réponses par défaut si aucun mot-clé n'est trouvé
    const defaultResponses = [
      "Je n'ai pas toutes les informations sur ce sujet. Vous pourriez trouver plus de détails dans notre Guide CBD ou auprès de nos boutiques partenaires.",
      "C'est une question intéressante! Pour une réponse plus détaillée, je vous invite à consulter notre section Guide CBD ou à contacter directement une boutique spécialisée.",
      "Je ne peux pas vous donner une réponse précise à cette question. N'hésitez pas à explorer notre plateforme pour trouver plus d'informations ou à contacter un professionnel."
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  
  const toggleChatState = () => {
    setChatState(prevState => {
      if (prevState === 'minimized') return 'expanded';
      if (prevState === 'expanded') return 'minimized';
      return 'expanded';
    });
  };
  
  const toggleFullscreen = () => {
    setChatState(prevState => prevState === 'fullscreen' ? 'expanded' : 'fullscreen');
  };
  
  if (chatState === 'minimized') {
    return (
      <Button
        onClick={toggleChatState}
        className="fixed bottom-4 right-4 flex items-center gap-2 shadow-lg z-30"
        size="lg"
      >
        <Bot className="h-5 w-5" />
        <span>Assistant CBD</span>
      </Button>
    );
  }
  
  return (
    <Card className={cn(
      "fixed shadow-lg z-30 transition-all duration-300 border-primary/20",
      chatState === 'fullscreen' 
        ? "inset-4 md:inset-10" 
        : "bottom-4 right-4 w-[350px] md:w-[400px] max-h-[500px]"
    )}>
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary/10">
            <AvatarFallback className="text-primary">CBD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">Assistant CBD</h3>
            <p className="text-xs text-muted-foreground">Posez vos questions sur le CBD</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={toggleChatState} className="h-8 w-8">
            <MinusCircle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-8 w-8">
            {chatState === 'fullscreen' ? <ChevronDown className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setChatState('minimized')} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-y-auto" style={{ height: chatState === 'fullscreen' ? 'calc(100% - 130px)' : '300px' }}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col",
                message.sender === 'user' ? "items-end" : "items-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                  message.sender === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-2 border-t">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Tapez votre message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default Chatbot;
