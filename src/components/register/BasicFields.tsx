
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicFieldsProps {
  name: string;
  email: string;
  setName: (value: string) => void;
  setEmail: (value: string) => void;
}

const BasicFields = ({ name, email, setName, setEmail }: BasicFieldsProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Nom</Label>
        <Input
          id="name"
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="exemple@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
    </>
  );
};

export default BasicFields;
