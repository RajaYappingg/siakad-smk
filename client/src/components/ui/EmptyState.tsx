import React from 'react';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <FileQuestion className="w-10 h-10 text-muted-foreground/60" />,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-xl border border-dashed border-border bg-card/50">
      <div className="mb-3.5 p-3 bg-muted/60 rounded-full">{icon}</div>
      <h4 className="text-base font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-4 leading-relaxed">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
