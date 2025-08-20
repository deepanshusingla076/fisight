'use client';

import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Mail, Calendar, Shield } from 'lucide-react';

export function UserProfile() {
  const { currentUser, signOut } = useAuth();

  if (!currentUser) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || 'User'} />
            <AvatarFallback className="text-lg">
              {getInitials(currentUser.displayName)}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="font-headline text-2xl">
          {currentUser.displayName || 'User'}
        </CardTitle>
        <CardDescription className="flex items-center justify-center gap-2">
          <Mail className="h-4 w-4" />
          {currentUser.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Account Status</span>
            <Badge variant={currentUser.emailVerified ? 'default' : 'secondary'}>
              <Shield className="h-3 w-3 mr-1" />
              {currentUser.emailVerified ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          
          {currentUser.metadata?.creationTime && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Member Since</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(currentUser.metadata.creationTime).toLocaleDateString()}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Provider</span>
            <Badge variant="outline">
              {currentUser.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}
            </Badge>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
