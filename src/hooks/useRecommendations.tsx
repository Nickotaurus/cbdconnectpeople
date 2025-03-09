
import { useState } from 'react';

interface AiRecommendation {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

// Mock data for simulating API responses
const mockRecommendations: Record<string, AiRecommendation[]> = {
  "anxiété": [
    {
      id: "rec-1",
      title: "CBD à spectre complet pour l'anxiété",
      content: `
        <p>D'après votre description, une <strong>huile CBD à spectre complet</strong> pourrait être bénéfique. Ces formulations contiennent tous les cannabinoïdes de la plante, créant un "effet d'entourage" plus efficace pour l'anxiété.</p>
        <ul>
          <li>Commencez avec une concentration modérée (5-10%)</li>
          <li>Prenez la dose 30-60 minutes avant le coucher pour l'insomnie</li>
          <li>Pour l'anxiété quotidienne, divisez votre dosage en 2-3 prises sur la journée</li>
        </ul>
        <p>Les terpènes comme le myrcène et le linalol présents dans ces huiles ont aussi des propriétés relaxantes.</p>
      `,
      tags: ["Anxiété", "Insomnie", "Huile CBD", "Spectre complet"]
    },
    {
      id: "rec-2",
      title: "Alternatives aux huiles pour un effet rapide",
      content: `
        <p>Pour les moments d'anxiété aiguë, les <strong>fleurs CBD vaporisées</strong> ou les <strong>cristaux CBD</strong> offrent un soulagement plus rapide, car ils entrent dans la circulation sanguine par les poumons.</p>
        <p>Pour l'insomnie spécifiquement, recherchez des variétés à dominante indica comme:</p>
        <ul>
          <li>Bubba Kush CBD</li>
          <li>Charlotte's Angel</li>
          <li>Sweet Pure CBD</li>
        </ul>
        <p>Ces variétés contiennent des profils terpéniques favorisant la détente et le sommeil.</p>
      `,
      tags: ["Anxiété aiguë", "Vaporisation", "Fleurs CBD", "Action rapide"]
    }
  ],
  "douleur": [
    {
      id: "rec-3",
      title: "Formulations topiques pour douleurs localisées",
      content: `
        <p>Pour les douleurs chroniques localisées, les <strong>crèmes et baumes CBD</strong> appliqués directement sur la zone douloureuse peuvent offrir un soulagement ciblé sans effets systémiques.</p>
        <ul>
          <li>Recherchez des produits avec au moins 200-300mg de CBD</li>
          <li>Les formulations incluant de l'arnica ou du menthol peuvent amplifier l'effet</li>
          <li>Appliquez 2-3 fois par jour pour des résultats optimaux</li>
        </ul>
        <p>Pour les douleurs articulaires, les préparations à base de CBD + CBG semblent particulièrement efficaces selon les retours d'utilisateurs.</p>
      `,
      tags: ["Douleur chronique", "Topique", "Anti-inflammatoire", "Application locale"]
    }
  ],
  "sommeil": [
    {
      id: "rec-4",
      title: "Combinaison CBD et CBN pour sommeil profond",
      content: `
        <p>Pour l'insomnie, les produits combinant <strong>CBD et CBN</strong> (cannabinol) sont particulièrement prometteurs. Le CBN est connu pour ses propriétés sédatives amplifiées quand associé au CBD.</p>
        <ul>
          <li>Choisissez des huiles avec ratio 3:1 (CBD:CBN)</li>
          <li>Prenez 30-45 minutes avant le coucher</li>
          <li>Complétez avec des routines de sommeil saines (pas d'écrans, température fraîche)</li>
        </ul>
        <p>Les gummies ou capsules CBD+CBN+Mélatonine représentent une option intéressante pour ceux qui préfèrent une méthode d'administration simple.</p>
      `,
      tags: ["Insomnie", "CBN", "Sommeil profond", "Gummies"]
    }
  ],
  "default": [
    {
      id: "rec-5",
      title: "Guide de démarrage pour nouveaux utilisateurs",
      content: `
        <p>Si vous débutez avec le CBD, voici quelques recommandations générales:</p>
        <ul>
          <li><strong>Commencez doucement</strong>: Huile 5% ou gummies à faible dose (10-15mg)</li>
          <li><strong>Méthode "start low, go slow"</strong>: Augmentez progressivement jusqu'à trouver votre dose idéale</li>
          <li><strong>Tenez un journal</strong>: Notez doses, effets, et ajustez en fonction</li>
        </ul>
        <p>Pour maximiser les bénéfices, prenez le CBD avec un repas contenant des graisses saines qui améliorent l'absorption.</p>
        <p>N'hésitez pas à demander des conseils plus spécifiques selon vos besoins particuliers.</p>
      `,
      tags: ["Débutants", "Dosage", "Guide général", "Conseils pratiques"]
    }
  ]
};

// Helper function to determine which recommendations to return based on keywords
const analyzeQuery = (query: string): AiRecommendation[] => {
  query = query.toLowerCase();
  
  if (query.includes('anxiété') || query.includes('stress') || query.includes('angoisse')) {
    return mockRecommendations.anxiété;
  } 
  else if (query.includes('douleur') || query.includes('mal') || query.includes('inflammation')) {
    return mockRecommendations.douleur;
  }
  else if (query.includes('sommeil') || query.includes('insomnie') || query.includes('dormir')) {
    return mockRecommendations.sommeil;
  }
  
  return mockRecommendations.default;
};

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateRecommendations = async (query: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would make an API call to an AI service
      // For demo, we're using mock data based on keywords
      const results = analyzeQuery(query);
      setRecommendations(results);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // In a real app, you would handle errors appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return {
    recommendations,
    isLoading,
    generateRecommendations
  };
};
