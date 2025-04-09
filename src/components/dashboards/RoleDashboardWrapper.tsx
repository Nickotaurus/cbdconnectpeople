
import React, { ReactNode } from "react";

interface DashboardWrapperProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const RoleDashboardWrapper = ({ title, description, children }: DashboardWrapperProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {description && (
        <p className="text-muted-foreground mb-6">{description}</p>
      )}
      {children}
    </div>
  );
};

export default RoleDashboardWrapper;
