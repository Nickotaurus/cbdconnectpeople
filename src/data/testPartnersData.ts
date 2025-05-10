
import { Partner } from '@/types/partners';

export const testPartnerData: Partner[] = [
  {
    id: '1',
    name: 'ABC Comptabilité',
    category: 'accountant',
    location: 'Paris',
    description: 'Cabinet comptable spécialisé dans le secteur du CBD',
    certifications: ['Expert-comptable', 'Certification CBD'],
    distance: 5,
    imageUrl: 'https://via.placeholder.com/150?text=ABC'
  },
  {
    id: '2',
    name: 'GreenBank',
    category: 'bank',
    location: 'Lyon',
    description: 'Banque offrant des services financiers adaptés aux entreprises CBD',
    certifications: ['Banque éthique', 'Financement vert'],
    distance: 120,
    imageUrl: 'https://via.placeholder.com/150?text=Bank'
  },
  {
    id: '3',
    name: 'JuriCBD',
    category: 'legal',
    location: 'Bordeaux',
    description: 'Experts juridiques spécialisés dans la législation CBD',
    certifications: ['Droit des affaires', 'Réglementation CBD'],
    distance: 230,
    imageUrl: 'https://via.placeholder.com/150?text=Legal'
  },
  {
    id: '4',
    name: 'Assur CBD',
    category: 'insurance',
    location: 'Marseille',
    description: 'Solutions d\'assurance sur mesure pour les boutiques CBD',
    certifications: ['Assurance professionnelle', 'Risques spécifiques CBD'],
    distance: 45,
    imageUrl: 'https://via.placeholder.com/150?text=Insurance'
  },
  {
    id: '5',
    name: 'CBD Lab',
    category: 'laboratory',
    location: 'Toulouse',
    description: 'Laboratoire d\'analyse et de certification de produits CBD',
    certifications: ['ISO 9001', 'Analyses THC/CBD'],
    distance: 190,
    imageUrl: 'https://via.placeholder.com/150?text=Lab'
  },
  {
    id: '6',
    name: 'CBD Media',
    category: 'media',
    location: 'Nantes',
    description: 'Agence médiatique spécialisée dans la promotion des produits CBD',
    certifications: ['Marketing digital', 'Relations presse'],
    distance: 75,
    imageUrl: 'https://via.placeholder.com/150?text=Media'
  }
];
