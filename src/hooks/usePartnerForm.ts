
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePartnerForm = (initialCategory: string = '') => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    category: initialCategory,
    address: '',
    city: '',
    postalCode: '',
    logoUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (url: string) => {
    console.log("Logo uploaded, setting URL:", url);
    setFormData(prev => ({ ...prev, logoUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent, userId: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log("Creating partner profile with data:", formData);
      const partnerId = crypto.randomUUID();

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.companyName,
          partner_category: formData.category,
          logo_url: formData.logoUrl,
          partner_id: partnerId,
          certifications: [],
          partner_favorites: [
            formData.email,
            formData.phone,
            formData.address,
            formData.city,
            formData.postalCode,
            formData.website,
            formData.description
          ]
        })
        .eq('id', userId);

      if (profileError) {
        console.error("Profile update error:", profileError);
        throw profileError;
      }

      console.log("Partner profile created successfully");
      toast({
        title: "Profil créé avec succès",
        description: "Votre profil partenaire a été enregistré",
      });

      setTimeout(() => {
        navigate('/partner/profile');
      }, 1500);
    } catch (error) {
      console.error('Erreur lors de la création du profil:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre profil",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleLogoUpload,
    handleSubmit
  };
};
