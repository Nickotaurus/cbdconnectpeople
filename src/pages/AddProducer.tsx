
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower, Leaf, MapPin, Building, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const AddProducer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    description: '',
    website: '',
    phone: '',
    cultivationType: 'outdoor', // outdoor, indoor, greenhouse
    sellsToPublic: false,
    certifications: [] as string[],
    specialties: [] as string[],
  });
  
  const [currentTab, setCurrentTab] = useState('basic');
  const [newCertification, setNewCertification] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleAddCertification = () => {
    if (newCertification && !formData.certifications.includes(newCertification)) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification]
      }));
      setNewCertification('');
    }
  };
  
  const handleRemoveCertification = (cert: string) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };
  
  const handleAddSpecialty = () => {
    if (newSpecialty && !formData.specialties.includes(newSpecialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty]
      }));
      setNewSpecialty('');
    }
  };
  
  const handleRemoveSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally send the data to your backend
    // For now, we'll just show a success message
    
    toast({
      title: "Profil créé avec succès",
      description: "Votre profil producteur a été enregistré",
    });
    
    // In a real app, you would update the user with the new producer ID
    // and redirect to the producer profile page
    setTimeout(() => {
      navigate('/producers');
    }, 1500);
  };
  
  if (user?.role !== 'producer') {
    return (
      <div className="container max-w-md mx-auto py-16">
        <Card>
          <CardHeader>
            <CardTitle>Accès non autorisé</CardTitle>
            <CardDescription>
              Cette page est réservée aux producteurs de CBD
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              Vous devez être enregistré en tant que producteur pour accéder à cette page.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/register">S'inscrire en tant que producteur</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Créer votre profil producteur</h1>
      <p className="text-muted-foreground mb-8">
        Complétez votre profil pour être visible auprès des boutiques CBD
      </p>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="basic">Informations de base</TabsTrigger>
          <TabsTrigger value="cultivation">Méthodes de culture</TabsTrigger>
          <TabsTrigger value="certifications">Certifications & Spécialités</TabsTrigger>
        </TabsList>
        
        <form onSubmit={handleSubmit}>
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identité de votre exploitation</CardTitle>
                <CardDescription>
                  Informations qui apparaîtront sur votre profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom de l'exploitation</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="ex: Chanvre des Cévennes"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Décrivez votre activité, votre philosophie..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    required
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Rue, numéro..."
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="ex: Montpellier"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder="ex: 34000"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="ex: 06 12 34 56 78"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    name="website"
                    placeholder="ex: https://monsite.fr"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate('/producers')}>
                  Annuler
                </Button>
                <Button type="button" onClick={() => setCurrentTab('cultivation')}>
                  Continuer
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="cultivation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de culture</CardTitle>
                <CardDescription>
                  Informations sur votre mode de production
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-2">
                  <Label htmlFor="cultivationType">Type de culture</Label>
                  <Select 
                    value={formData.cultivationType} 
                    onValueChange={(value) => handleSelectChange('cultivationType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un type de culture" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">
                        <div className="flex items-center">
                          <Leaf className="mr-2 h-4 w-4" />
                          Outdoor (extérieur)
                        </div>
                      </SelectItem>
                      <SelectItem value="indoor">
                        <div className="flex items-center">
                          <Building className="mr-2 h-4 w-4" />
                          Indoor (intérieur)
                        </div>
                      </SelectItem>
                      <SelectItem value="greenhouse">
                        <div className="flex items-center">
                          <Flower className="mr-2 h-4 w-4" />
                          Greenhouse (serre)
                        </div>
                      </SelectItem>
                      <SelectItem value="mixed">
                        <div className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          Mixte (plusieurs types)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="sellsToPublic"
                    checked={formData.sellsToPublic}
                    onCheckedChange={(checked) => handleSwitchChange('sellsToPublic', checked)}
                  />
                  <Label htmlFor="sellsToPublic">Je vends également aux particuliers (B2C)</Label>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">À savoir</h3>
                  <p className="text-sm text-muted-foreground">
                    Les boutiques recherchent généralement des producteurs qui peuvent garantir :
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
                    <li>Une traçabilité complète des produits</li>
                    <li>Des analyses de conformité régulières</li>
                    <li>Une stabilité dans l'approvisionnement</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentTab('basic')}>
                  Retour
                </Button>
                <Button type="button" onClick={() => setCurrentTab('certifications')}>
                  Continuer
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="certifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Certifications & Spécialités</CardTitle>
                <CardDescription>
                  Mettez en avant vos certifications et variétés spécifiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Certifications</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.certifications.map(cert => (
                      <Badge key={cert} variant="secondary" className="pl-2">
                        {cert}
                        <Button 
                          variant="ghost" 
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => handleRemoveCertification(cert)}
                        >
                          ✕
                        </Button>
                      </Badge>
                    ))}
                    {formData.certifications.length === 0 && (
                      <span className="text-sm text-muted-foreground">Aucune certification ajoutée</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="ex: Agriculture Biologique"
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddCertification}>
                      Ajouter
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Spécialités / Variétés</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.specialties.map(specialty => (
                      <Badge key={specialty} variant="outline" className="pl-2">
                        {specialty}
                        <Button 
                          variant="ghost" 
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => handleRemoveSpecialty(specialty)}
                        >
                          ✕
                        </Button>
                      </Badge>
                    ))}
                    {formData.specialties.length === 0 && (
                      <span className="text-sm text-muted-foreground">Aucune spécialité ajoutée</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="ex: Amnesia, Cheese, etc."
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddSpecialty}>
                      Ajouter
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentTab('cultivation')}>
                  Retour
                </Button>
                <Button type="submit">
                  <Send className="mr-2 h-4 w-4" />
                  Créer mon profil
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
};

export default AddProducer;
