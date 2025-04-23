
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

// Form schema for manual address entry
const manualAddressSchema = z.object({
  address: z.string().min(5, "L'adresse est requise (min. 5 caractères)"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(5, "Code postal requis"),
});

type ManualAddressFormValues = z.infer<typeof manualAddressSchema>;

interface ManualAddressFormProps {
  onSubmit: (values: ManualAddressFormValues) => void;
  onBack: () => void;
  isSearching: boolean;
}

const ManualAddressForm = ({ onSubmit, onBack, isSearching }: ManualAddressFormProps) => {
  const form = useForm<ManualAddressFormValues>({
    resolver: zodResolver(manualAddressSchema),
    defaultValues: {
      address: "",
      city: "",
      postalCode: "",
    },
  });

  return (
    <div className="p-4 mb-4 bg-slate-50 rounded-md">
      <h3 className="font-medium mb-2">Ajout manuel de boutique</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Veuillez saisir l'adresse complète de votre boutique pour que nous puissions la trouver.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adresse complète</FormLabel>
                <FormControl>
                  <Input placeholder="123 rue de la Paix" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onBack}>
              Retour
            </Button>
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher l'établissement
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ManualAddressForm;
