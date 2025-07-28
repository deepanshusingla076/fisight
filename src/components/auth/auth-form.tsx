'use client';

import { useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function AuthForm() {
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle authentication here.
    // For this prototype, we'll just redirect to the dashboard.
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-2 mb-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-headline">FiSight</span>
        </div>
        <CardTitle className="font-headline text-2xl">Welcome</CardTitle>
        <CardDescription>Login or create an account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleAuth}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input id="email-login" type="email" placeholder="user@example.com" defaultValue="user@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input id="password-login" type="password" defaultValue="password" required />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="register">
             <form onSubmit={handleAuth}>
              <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                  <Label htmlFor="name-register">Full Name</Label>
                  <Input id="name-register" placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input id="email-register" type="email" placeholder="user@example.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input id="password-register" type="password" required />
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
