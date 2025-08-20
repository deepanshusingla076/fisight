import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
}

export function PageHeader({ title, description, icon: Icon }: PageHeaderProps) {
  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-7 w-7 text-primary" aria-hidden="true" />}
        <h1 className="text-3xl lg:text-4xl font-bold font-headline text-foreground tracking-tight">
          {title}
        </h1>
      </div>
      {description && (
        <p className="mt-2 text-base text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
