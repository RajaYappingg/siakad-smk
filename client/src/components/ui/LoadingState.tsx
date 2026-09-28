import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  rows?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Memuat data...', rows = 4 }) => {
  return (
    <div className="w-full space-y-4 py-8">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span>{message}</span>
      </div>
      <div className="space-y-2.5 max-w-2xl mx-auto px-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-full bg-muted/60 animate-pulse rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};
