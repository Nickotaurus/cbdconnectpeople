
import { Producer } from '@/components/producers/ProducerCard';

export const mockProducers: Producer[] = [
  {
    id: "p1",
    name: "Chanvre des Alpes",
    location: "Grenoble, France",
    description: "Producteur de chanvre biologique dans les Alpes françaises. Culture en extérieur avec méthodes traditionnelles.",
    certifications: ["Bio", "Sans pesticides"],
    cultivationType: "Outdoor",
    varieties: ["CBD Kush", "Charlotte's Web", "ACDC"],
    wholesaleOnly: false,
    imageUrl: "https://images.unsplash.com/photo-1589244159943-460088ed5c83?q=80&w=1000",
    distance: 120,
  },
  {
    id: "p2",
    name: "CBD Provence",
    location: "Aix-en-Provence, France",
    description: "Exploitation familiale spécialisée dans la culture de chanvre CBD de haute qualité sous le soleil de Provence.",
    certifications: ["Bio", "Eco-responsable"],
    cultivationType: "Greenhouse",
    varieties: ["Harlequin", "Critical Mass CBD", "Swiss Dream"],
    wholesaleOnly: true,
    imageUrl: "https://images.unsplash.com/photo-1625963580916-21eb7ea8d935?q=80&w=1000",
    distance: 245,
  },
  {
    id: "p3",
    name: "Loire Hemp",
    location: "Nantes, France",
    description: "Culture indoor de variétés CBD sélectionnées pour leur taux de cannabinoïdes et leurs profils terpéniques uniques.",
    certifications: ["Qualité Premium"],
    cultivationType: "Indoor",
    varieties: ["Candida", "Royal Medic", "Dinamed CBD"],
    wholesaleOnly: false,
    imageUrl: "https://images.unsplash.com/photo-1536819114556-1c10b30f9d94?q=80&w=1000",
    distance: 78,
  },
];
