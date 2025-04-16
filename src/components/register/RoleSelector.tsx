
import { UserRole, StoreType } from '@/types/auth';
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import ClientRegistrationInfo from './ClientRegistrationInfo';
import StoreRegistrationInfo from './StoreRegistrationInfo';
import PartnerRegistrationInfo from './PartnerRegistrationInfo';

interface RoleSelectorProps {
  role: UserRole;
  storeType: StoreType;
  partnerCategory: string;
  setRole: (role: UserRole) => void;
  setStoreType: (type: StoreType) => void;
  setPartnerCategory: (category: string) => void;
}

const RoleSelector = ({
  role,
  storeType,
  partnerCategory,
  setRole,
  setStoreType,
  setPartnerCategory,
}: RoleSelectorProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label>Type de compte</Label>
        <Tabs defaultValue={role} onValueChange={(value) => setRole(value as UserRole)}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="client">Client</TabsTrigger>
            <TabsTrigger value="store">Boutique</TabsTrigger>
            <TabsTrigger value="partner">Partenaire</TabsTrigger>
          </TabsList>
          
          <ClientRegistrationInfo />
          <StoreRegistrationInfo />
          <PartnerRegistrationInfo
            partnerCategory={partnerCategory}
            setPartnerCategory={setPartnerCategory}
          />
        </Tabs>
      </div>
      
      {role === 'store' && (
        <div className="grid gap-2 border-t pt-4">
          <Label>Type de boutique</Label>
          <RadioGroup 
            defaultValue={storeType} 
            onValueChange={(value) => setStoreType(value as StoreType)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="physical" id="physical" />
              <Label htmlFor="physical" className="cursor-pointer">Boutique physique uniquement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ecommerce" id="ecommerce" />
              <Label htmlFor="ecommerce" className="cursor-pointer">E-commerce uniquement (payant)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both" className="cursor-pointer">Boutique physique et E-commerce (payant pour l'e-commerce)</Label>
            </div>
          </RadioGroup>
        </div>
      )}
    </>
  );
};

export default RoleSelector;
