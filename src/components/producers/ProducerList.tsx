
import ProducerCard, { Producer } from './ProducerCard';

interface ProducerListProps {
  producers: Producer[];
  isStore: boolean;
}

const ProducerList = ({ producers, isStore }: ProducerListProps) => {
  if (producers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun partenaire trouvé</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {producers.map(producer => (
        <ProducerCard 
          key={producer.id} 
          producer={producer} 
          isStore={isStore}
        />
      ))}
    </div>
  );
};

export default ProducerList;
