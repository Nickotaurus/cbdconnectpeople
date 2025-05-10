
import { Briefcase, Building2, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface JobDetailsFormProps {
  jobType: string;
  setJobType: (value: string) => void;
  contractType: string;
  setContractType: (value: string) => void;
  salary: string;
  setSalary: (value: string) => void;
  experience: string;
  setExperience: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  isJobOffer: boolean;
}

const JobDetailsForm = ({
  jobType, setJobType,
  contractType, setContractType,
  salary, setSalary,
  experience, setExperience,
  companyName, setCompanyName,
  contactEmail, setContactEmail,
  isJobOffer
}: JobDetailsFormProps) => {
  const jobTypes = [
    { value: 'sales', label: 'Commercial / Vente' },
    { value: 'management', label: 'Direction / Management' },
    { value: 'production', label: 'Production' },
    { value: 'communication', label: 'Marketing / Communication' },
    { value: 'rd', label: 'R&D / Scientifique' },
    { value: 'delivery', label: 'Livraison / Logistique' },
    { value: 'admin', label: 'Administration' },
    { value: 'other', label: 'Autre' }
  ];
  
  const contractTypes = [
    { value: 'cdi', label: 'CDI' },
    { value: 'cdd', label: 'CDD' },
    { value: 'interim', label: 'Intérim' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'apprentice', label: 'Apprentissage' },
    { value: 'internship', label: 'Stage' },
    { value: 'other', label: 'Autre' }
  ];

  if (!isJobOffer) return null;

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-muted/20">
      <div className="flex items-center gap-2">
        <Briefcase className="text-primary h-5 w-5" />
        <h3 className="font-medium">Détails de l'offre d'emploi</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobType" className="text-sm">Type de poste*</Label>
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type de poste" />
            </SelectTrigger>
            <SelectContent>
              {jobTypes.map((job) => (
                <SelectItem key={job.value} value={job.value}>{job.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contractType" className="text-sm">Type de contrat</Label>
          <Select value={contractType} onValueChange={setContractType}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un type de contrat" />
            </SelectTrigger>
            <SelectContent>
              {contractTypes.map((contract) => (
                <SelectItem key={contract.value} value={contract.value}>{contract.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-sm">Expérience requise</Label>
            <Input
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Ex: 2 ans minimum"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm">Salaire proposé</Label>
            <Input
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Ex: 30-35K€ selon expérience"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm">Nom de l'entreprise</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Votre entreprise"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-sm">Email de contact</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@entreprise.com"
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsForm;
