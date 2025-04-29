
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Search } from 'lucide-react';

// Schéma de validation sans restrictions
const formSchema = z.object({
  address: z.string().optional(),
  city: z.string().optional(),
  postalCode: z.string().optional()
});

interface ManualAddressFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onBack: () => void;
  isSearching: boolean;
}

const ManualAddressForm = ({ onSubmit, onBack, isSearching }: ManualAddressFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      city: '',
      postalCode: ''
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    // Version simplifiée - sans validation stricte
    onSubmit(values);
  };

  return (
    <div className="space-y-4 p-2">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2" type="button">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la carte
      </Button>
      
      <Form {...form}>
        <form onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(handleSubmit)(e);
        }} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse</FormLabel>
                <FormControl>
                  <Input placeholder="123 Rue de la Boutique" {...field} />
                </FormControl>
                <FormMessage />
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
                  <FormMessage />
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
                  <FormMessage />
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
