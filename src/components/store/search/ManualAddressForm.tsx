
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ArrowLeft, Search } from 'lucide-react';

// Schéma simplifié sans aucune validation
const defaultValues = {
  address: '',
  city: '',
  postalCode: ''
};

interface ManualAddressFormProps {
  onSubmit: (values: typeof defaultValues) => void;
  onBack: () => void;
  isSearching: boolean;
}

const ManualAddressForm = ({ onSubmit, onBack, isSearching }: ManualAddressFormProps) => {
  const form = useForm({
    defaultValues
  });

  const handleSubmit = (values: typeof defaultValues) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-4 p-2">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2" type="button">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la carte
      </Button>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="123 Rue de la Boutique" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code postal</FormLabel>
                  <FormControl>
                    <Input placeholder="75001" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isSearching}>
            {isSearching ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                Recherche en cours...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Rechercher cette adresse
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ManualAddressForm;
