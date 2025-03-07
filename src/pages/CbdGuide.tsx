
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CbdGuide = () => {
  const [activeTab, setActiveTab] = useState("what-is-cbd");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Guide du CBD</h1>
        <p className="text-muted-foreground">
          Tout ce que vous devez savoir sur le CBD, ses bienfaits et son utilisation
        </p>
      </div>

      <Tabs defaultValue="what-is-cbd" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="what-is-cbd">Qu'est-ce que le CBD</TabsTrigger>
          <TabsTrigger value="benefits">Bienfaits</TabsTrigger>
          <TabsTrigger value="usage">Utilisation</TabsTrigger>
          <TabsTrigger value="legal">Législation</TabsTrigger>
        </TabsList>

        <TabsContent value="what-is-cbd" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Qu'est-ce que le CBD ?</CardTitle>
              <CardDescription>
                Comprendre le cannabidiol et son origine
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le CBD, ou cannabidiol, est l'un des nombreux composés actifs présents dans la plante de cannabis (Cannabis sativa). Contrairement au THC (tétrahydrocannabinol), le CBD n'a pas d'effets psychoactifs et ne provoque pas d'état d'euphorie.
              </p>
              
              <div className="my-4">
                <h3 className="text-lg font-medium mb-2">Extraction et production</h3>
                <p>
                  Le CBD est généralement extrait des fleurs de chanvre industriel, une variété de cannabis cultivée spécifiquement pour ses fibres et sa haute teneur en CBD. Plusieurs méthodes d'extraction sont utilisées, dont l'extraction au CO2 supercritique, considérée comme l'une des plus propres et des plus efficaces.
                </p>
              </div>

              <div className="my-4">
                <h3 className="text-lg font-medium mb-2">Différence entre CBD et THC</h3>
                <p>
                  Bien que le CBD et le THC partagent la même formule chimique, leur structure moléculaire diffère, ce qui explique leurs effets distincts sur le corps. Le CBD interagit avec le système endocannabinoïde sans se lier directement aux récepteurs CB1 et CB2, contrairement au THC.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bienfaits potentiels du CBD</CardTitle>
              <CardDescription>
                Les effets thérapeutiques rapportés par la recherche et les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Réduction de l'anxiété et du stress</AccordionTrigger>
                  <AccordionContent>
                    Plusieurs études suggèrent que le CBD peut aider à réduire l'anxiété. Il pourrait interagir avec les récepteurs de la sérotonine dans le cerveau, ce qui joue un rôle important dans la régulation de l'humeur et du comportement social.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>Soulagement de la douleur</AccordionTrigger>
                  <AccordionContent>
                    Le CBD peut aider à soulager la douleur en influençant l'activité des récepteurs endocannabinoïdes, réduisant l'inflammation et interagissant avec les neurotransmetteurs. Particulièrement prometteur pour les douleurs chroniques et neuropathiques.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>Amélioration du sommeil</AccordionTrigger>
                  <AccordionContent>
                    En réduisant l'anxiété et la douleur, le CBD peut indirectement améliorer la qualité du sommeil. Certaines recherches suggèrent également un effet direct sur le cycle veille-sommeil.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Effets neuroprotecteurs</AccordionTrigger>
                  <AccordionContent>
                    Des études préliminaires indiquent que le CBD pourrait avoir des propriétés neuroprotectrices, potentiellement bénéfiques pour les personnes atteintes de maladies neurologiques comme l'épilepsie, la sclérose en plaques ou la maladie de Parkinson.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Modes d'utilisation du CBD</CardTitle>
              <CardDescription>
                Les différentes façons de consommer du CBD et leurs particularités
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Huiles et teintures</h3>
                <p className="text-sm">
                  Administrées sous la langue pour une absorption rapide par la muqueuse sublinguale. Effet en 15-30 minutes, durée de 4-6 heures.
                </p>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Fleurs et résines</h3>
                <p className="text-sm">
                  Peuvent être vaporisées (jamais fumées) pour un effet rapide via les poumons. Effet en 5-10 minutes, durée de 2-4 heures.
                </p>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Produits comestibles</h3>
                <p className="text-sm">
                  Gélules, bonbons, infusions, etc. Absorption par le système digestif. Effet en 30-90 minutes, durée de 6-8 heures.
                </p>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Produits topiques</h3>
                <p className="text-sm">
                  Crèmes, baumes appliqués localement sur la peau. Idéal pour les douleurs musculaires et articulaires localisées.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Législation du CBD en France</CardTitle>
              <CardDescription>
                La situation légale actuelle du CBD et ses évolutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg mb-4">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Note importante :</strong> La législation concernant le CBD évolue régulièrement. Les informations fournies ici sont à titre indicatif et peuvent ne pas refléter les changements récents. Consultez toujours les sources officielles pour les informations les plus à jour.
                </p>
              </div>
              
              <h3 className="text-lg font-medium">Statut actuel</h3>
              <p>
                En France, le CBD est légal à condition qu'il provienne de variétés de cannabis autorisées (contenant moins de 0,3% de THC) et que le produit fini ne contienne pas de THC détectable. La vente de fleurs et feuilles brutes de CBD a connu des évolutions juridiques complexes.
              </p>
              
              <h3 className="text-lg font-medium mt-4">Restrictions</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Interdiction de faire des allégations thérapeutiques</li>
                <li>Obligation d'étiquetage conforme pour les produits alimentaires</li>
                <li>Restrictions sur la publicité</li>
                <li>Interdiction de vente aux mineurs (moins de 18 ans)</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CbdGuide;
