
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldsProps {
  password: string;
  confirmPassword: string;
  setPassword: (value: string) => void;
  setConfirmPassword: (value: string) => void;
}

const PasswordFields = ({ 
  password, 
  confirmPassword, 
  setPassword, 
  setConfirmPassword 
}: PasswordFieldsProps) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
    </>
  );
};

export default PasswordFields;
