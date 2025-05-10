
interface EcommerceShippingProps {
  shippingCountries: string[];
}

const EcommerceShipping = ({ shippingCountries }: EcommerceShippingProps) => {
  return (
    <div>
      <h4 className="text-xs font-medium mb-1">Livraison:</h4>
      <p className="text-xs text-muted-foreground">
        {shippingCountries.join(', ')}
      </p>
    </div>
  );
};

export default EcommerceShipping;
