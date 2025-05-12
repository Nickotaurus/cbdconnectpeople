
import { ClassifiedType, ClassifiedCategory } from '@/types/classified';

export const getTypeLabel = (type: ClassifiedType) => {
  switch (type) {
    case 'buy': return 'Achat';
    case 'sell': return 'Vente';
    case 'service': return 'Service';
    default: return type;
  }
};

export const getCategoryLabel = (category: ClassifiedCategory) => {
  switch (category) {
    case 'store': return 'Boutique CBD';
    case 'ecommerce': return 'E-commerce CBD';
    case 'realestate': return 'Immobilier CBD';
    case 'employer': return 'Employeur CBD';
    case 'employee': return 'Employé CBD';
    case 'bank': return 'Banque';
    case 'accountant': return 'Comptable';
    case 'legal': return 'Juriste';
    case 'insurance': return 'Assurance';
    case 'logistics': return 'Logistique';
    case 'breeder': return 'Breeder';
    case 'label': return 'Label';
    case 'association': return 'Association';
    case 'media': return 'Média';
    case 'laboratory': return 'Laboratoire';
    case 'production': return 'Production';
    case 'realEstate': return 'Agence immobilière';
    case 'other': return 'Autre';
    default: return category;
  }
};

export const getTypeBadgeColor = (type: ClassifiedType) => {
  switch (type) {
    case 'buy': return 'bg-blue-100 text-blue-800';
    case 'sell': return 'bg-green-100 text-green-800';
    case 'service': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
