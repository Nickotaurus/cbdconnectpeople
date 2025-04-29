
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

// Schéma simplifié sans validation
const defaultValues = {
  address: '',
  city: '',
  postalCode: '',
  country: 'France'
};

interface ManualAddressFormProps {
  initialData?: Partial<typeof defaultValues>;
  onSubmit: (values: typeof defaultValues) => void;
}

const ManualAddressForm = ({ initialData, onSubmit }: ManualAddressFormProps) => {
  const form = useForm({
    defaultValues: {
      ...defaultValues,
      ...initialData
    }
  });

  const handleSubmit = (values: typeof defaultValues) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-4 p-2">
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
          
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pays</FormLabel>
                <FormControl>
                  <Input value="France" disabled {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            Valider mon adresse
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ManualAddressForm;
