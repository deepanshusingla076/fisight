'use client';

import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Upload, Link2, FileText, CreditCard, PiggyBank, TrendingUp, Shield, Home } from 'lucide-react';
import { ThemeToggle } from '../shared/theme-toggle';
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { currentUser, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    if (currentUser?.email) {
      // Extract name from email (part before @)
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };

  // Show loading skeleton if user data is still loading
  if (isLoading) {
    return (
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1" />
        <ThemeToggle />
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="flex-1" />
        <Link href="/">
          <Button 
            variant="ghost" 
            size="sm"
            className="h-10 w-10 rounded-full"
            aria-label="Go to home"
          >
            <Home className="h-4 w-4" />
          </Button>
        </Link>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 w-10 rounded-full"
              aria-label="User menu"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={currentUser?.photoURL || ''} 
                  alt={currentUser?.displayName || 'User avatar'} 
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(getDisplayName())}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="flex flex-col">
              <span className="font-medium">{getDisplayName()}</span>
              <span className="text-xs font-normal text-muted-foreground flex items-center gap-1">
                {currentUser?.email}
                {currentUser?.emailVerified && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    <Shield className="h-2 w-2 mr-1" />
                    Verified
                  </Badge>
                )}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
              Financial Profile Setup
            </DropdownMenuLabel>
            
            <DropdownMenuItem asChild>
              <Link href="/profile/documents" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">Upload Documents</span>
                  <span className="text-xs text-muted-foreground">Bank statements, tax returns</span>
                </div>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/profile/accounts" className="cursor-pointer">
                <Link2 className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">Link Accounts</span>
                  <span className="text-xs text-muted-foreground">Banks, investments, loans</span>
                </div>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
              Quick Links
            </DropdownMenuLabel>
            
            <DropdownMenuItem asChild>
              <Link href="/profile/bank-accounts" className="cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Bank Accounts</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/profile/investments" className="cursor-pointer">
                <TrendingUp className="mr-2 h-4 w-4" />
                <span>Mutual Funds & Investments</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/profile/pf-loans" className="cursor-pointer">
                <PiggyBank className="mr-2 h-4 w-4" />
                <span>PF & Loans</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
  );
}
