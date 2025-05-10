
import React from 'react';

const StoreLoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center">
      <div className="animate-spin h-10 w-10 border-4 border-primary border-r-transparent rounded-full"></div>
      <span className="ml-4 text-lg">Chargement de votre boutique...</span>
    </div>
  );
};

export default StoreLoadingState;
