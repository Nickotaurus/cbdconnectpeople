
import React from "react";
import { Button } from "@/components/ui/button";
import { BookmarkCheck, Search, Ticket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface ProfileCardProps {
  icon: React.ReactNode;
  title: string;
  description: string | string[];
  primaryAction: () => void;
  primaryLabel: string;
  secondaryAction?: () => void;
  secondaryLabel?: string;
  banner?: string;
}

const ProfileCard = ({
  icon,
  title,
  description,
  primaryAction,
  primaryLabel,
  secondaryAction,
  secondaryLabel,
  banner,
}: ProfileCardProps) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="pb-3">
      <div className="flex justify-center mb-3">{icon}</div>
      <CardTitle className="text-xl text-center">{title}</CardTitle>
      {banner && (
        <div className="mt-2 bg-primary/10 text-primary text-sm py-1 px-2 rounded-md text-center">
          {banner}
        </div>
      )}
    </CardHeader>
    <CardContent className="flex-grow">
      <CardDescription className="text-center mb-6">
        {Array.isArray(description) ? (
          <ul className="list-none text-left space-y-4">
            {description.map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary mr-2 mt-0.5 flex-shrink-0">
                  {index === 0 ? (
                    <Search size={18} />
                  ) : index === 1 ? (
                    <BookmarkCheck size={18} />
                  ) : (
                    <Ticket size={18} />
                  )}
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          description
        )}
      </CardDescription>
      <div className="flex flex-col gap-2 mt-auto">
        <Button className="w-full" onClick={primaryAction}>
          {primaryLabel}
        </Button>
        {secondaryAction && secondaryLabel && (
          <Button
            variant="outline"
            className="w-full"
            onClick={secondaryAction}
          >
            {secondaryLabel}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default ProfileCard;
