
interface EcommercePageHeaderProps {
  title: string;
  subtitle: string;
}

const EcommercePageHeader = ({ title, subtitle }: EcommercePageHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground">{subtitle}</p>
    </div>
  );
};

export default EcommercePageHeader;
