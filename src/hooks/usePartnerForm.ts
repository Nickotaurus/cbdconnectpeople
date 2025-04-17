import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const usePartnerForm = (initialCategory: string = '', userId: string = '', isEditing: boolean = false) => {
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
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    const fetchExistingData = async () => {
      if (isEditing && userId) {
        try {
          setIsLoading(true);
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (error) {
            console.error("Error fetching partner profile for editing:", error);
            return;
          }
          
          if (data && data.partner_favorites) {
            const [email, phone, address, city, postalCode, website, description] = data.partner_favorites;
            
            setFormData({
              companyName: data.name || '',
              description: description || '',
              website: website || '',
              email: email || '',
              phone: phone || '',
              category: data.partner_category || initialCategory,
              address: address || '',
              city: city || '',
              postalCode: postalCode || '',
              logoUrl: data.logo_url || ''
            });
            
            console.log("Loaded existing partner data:", data);
          }
        } catch (err) {
          console.error("Error loading partner data:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchExistingData();
  }, [isEditing, userId, initialCategory]);

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
      console.log("Creating/updating partner profile with data:", formData);
      let partnerId = crypto.randomUUID();

      const requiredFields = {
        'nom de l\'entreprise': formData.companyName,
        'description': formData.description,
        'email': formData.email, 
        'téléphone': formData.phone,
        'catégorie': formData.category,
        'adresse': formData.address,
        'ville': formData.city,
        'code postal': formData.postalCode
      };
      
      const missingFields = Object.entries(requiredFields)
        .filter(([_key, value]) => !value || value.trim() === '')
        .map(([key]) => key);
      
      if (missingFields.length > 0) {
        throw new Error(`Veuillez remplir les champs obligatoires: ${missingFields.join(', ')}`);
      }

      const { data: currentProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (fetchError) {
        console.error("Error fetching profile:", fetchError);
        throw fetchError;
      }

      if (isEditing && currentProfile.partner_id) {
        partnerId = currentProfile.partner_id;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.companyName,
          partner_category: formData.category,
          logo_url: formData.logoUrl,
          partner_id: partnerId,
          certifications: currentProfile.certifications || [],
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

      console.log("Partner profile updated successfully with ID:", partnerId);
      toast({
        title: isEditing ? "Profil mis à jour avec succès" : "Profil créé avec succès",
        description: isEditing 
          ? "Votre profil partenaire a été mis à jour" 
          : "Votre profil partenaire est désormais visible par tous les acteurs CBD",
      });

      setTimeout(() => {
        window.location.href = '/partner/profile';
      }, 2500);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour de votre profil",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    isLoading,
    handleInputChange,
    handleSelectChange,
    handleLogoUpload,
    handleSubmit
  };
};
