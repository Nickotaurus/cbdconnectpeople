
import React from 'react';

const StoreLoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-secondary rounded w-1/3"></div>
        <div className="h-4 bg-secondary rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-secondary rounded"></div>
          <div className="h-64 bg-secondary rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default StoreLoadingState;
