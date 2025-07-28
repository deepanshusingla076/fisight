'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfile } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const profileSchema = z.object({
  annualIncome: z.coerce.number().positive('Must be a positive number.'),
  monthlyExpenses: z.coerce.number().positive('Must be a positive number.'),
  assets: z.string().min(10, 'Please describe your assets.'),
  liabilities: z.string().min(10, 'Please describe your liabilities.'),
});

export function ProfileForm() {
  const { profile, setProfile } = useProfile();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile,
  });
  
  function onSubmit(values: z.infer<typeof profileSchema>) {
    setProfile(values);
    toast({
        title: "Profile Saved",
        description: "Your financial information has been updated.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Financial Information</CardTitle>
        <CardDescription>
          Provide your financial details below. This will be used by the AI to give you personalized advice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="annualIncome"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Annual Income ($)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="120000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="monthlyExpenses"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Monthly Expenses ($)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="4000" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="assets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assets</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Savings Account: $25,000, Investment Portfolio: $10,250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="liabilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Liabilities</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Credit Card Debt: $2,000, Student Loans: $15,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
