import type { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorPanel({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="panel p-6 flex flex-col items-center justify-center text-center min-h-[200px] animate-fade-in">
      <AlertCircle className="w-8 h-8 text-danger mb-3" />
      <h3 className="text-sm font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-4 max-w-md">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-ghost border border-border">
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}

export function LoadingPanel({ message = 'Processing…' }: { message?: string }) {
  return (
    <div className="panel p-6 flex flex-col items-center justify-center text-center min-h-[200px] animate-fade-in">
      <div className="w-6 h-6 border-2 border-border border-t-accent rounded-full animate-spin mb-3" />
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}

export function SectionCard({
  title,
  icon: Icon,
  children,
  accent,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: ReactNode;
  accent?: string;
}) {
  return (
    <div className="panel p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`w-4 h-4 ${accent || 'text-text-tertiary'}`} />
        <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}
