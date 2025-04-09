
import { Link } from 'react-router-dom';

const RegisterCta = () => {
  return (
    <div className="bg-secondary/30 rounded-lg p-4 mb-6 text-center">
      <p className="text-sm">
        Vous êtes un professionnel ? <Link to="/register" className="text-primary font-medium hover:underline">Créez un compte boutique</Link> pour contacter directement les producteurs.
      </p>
    </div>
  );
};

export default RegisterCta;
