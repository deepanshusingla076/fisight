import { AuthForm } from '@/components/auth/auth-form';
import { ClientOnly } from '@/components/shared/client-only';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link href="/">
          <Button 
            variant="ghost" 
            size="sm"
            className="gap-2 hover:bg-accent"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center p-4">
        <ClientOnly>
          <AuthForm />
        </ClientOnly>
      </div>
    </div>
  );
}
