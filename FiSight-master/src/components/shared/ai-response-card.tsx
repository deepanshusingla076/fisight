import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, List, AlertTriangle, Sparkles } from 'lucide-react';

interface AIResponseCardProps {
  title: string;
  data: Record<string, any> | null;
  isLoading: boolean;
  error: Error | null;
  dataMap: {
    key: string;
    label: string;
    type: 'string' | 'list';
    icon: 'summary' | 'list' | 'rationale';
  }[];
}

const iconMap = {
  summary: <Sparkles className="h-5 w-5 text-primary" />,
  list: <List className="h-5 w-5 text-primary" />,
  rationale: <CheckCircle2 className="h-5 w-5 text-primary" />,
};

export function AIResponseCard({ title, data, isLoading, error, dataMap }: AIResponseCardProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          {dataMap.map(item => (
            <div key={item.key}>
              <Skeleton className="h-6 w-1/3 mb-2" />
              {item.type === 'list' ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : (
                <Skeleton className="h-10 w-full" />
              )}
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>
            {error.message || "An unexpected error occurred. Please try again."}
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!data) {
      return null;
    }

    return (
      <div className="space-y-6">
        {dataMap.map(item => {
          const content = data[item.key];
          if (!content) return null;
          
          return (
            <div key={item.key}>
              <h3 className="text-lg font-semibold font-headline mb-2 flex items-center gap-2">
                {iconMap[item.icon]}
                {item.label}
              </h3>
              {item.type === 'list' && Array.isArray(content) ? (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {content.map((listItem, index) => <li key={index}>{listItem}</li>)}
                </ul>
              ) : (
                <p className="text-muted-foreground">{String(content)}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>AI-generated insights based on your data.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
