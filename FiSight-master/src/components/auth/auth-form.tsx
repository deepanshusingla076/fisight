'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { 
  signInWithGooglePopup, 
  signInWithEmail, 
  createUserWithEmail,
  createUserDocumentFromAuth
} from '@/firebase/firebase';
import { resetPassword } from '@/firebase/password-reset';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  
  // Password strength and confirmation states - Initialize with empty strings
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form field states to prevent controlled/uncontrolled errors
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    loginEmail: "",
    loginPassword: ""
  });
  
  const router = useRouter();
  const { toast } = useToast();

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Handle password change
  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  // Get password strength text and color
  const getPasswordStrengthInfo = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Very Weak", color: "text-red-500", bgColor: "bg-red-500" };
      case 2:
        return { text: "Weak", color: "text-orange-500", bgColor: "bg-orange-500" };
      case 3:
        return { text: "Medium", color: "text-yellow-500", bgColor: "bg-yellow-500" };
      case 4:
        return { text: "Strong", color: "text-green-500", bgColor: "bg-green-500" };
      case 5:
        return { text: "Very Strong", color: "text-green-600", bgColor: "bg-green-600" };
      default:
        return { text: "", color: "", bgColor: "" };
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { user } = await signInWithGooglePopup();
      const isNewUser = await createUserDocumentFromAuth(user);
      
      // Send welcome email for new Google users
      if (isNewUser && user.email && user.displayName) {
        try {
          const response = await fetch('/api/welcome-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.displayName,
            }),
          });

          if (response.ok) {
            console.log('Welcome email sent to new Google user');
          } else {
            console.warn('Welcome email failed to send:', await response.text());
          }
        } catch (emailError) {
          console.warn('Welcome email error:', emailError);
          // Don't fail sign-in if email fails
        }
      }

      toast({
        title: "Welcome to Dashboard!",
        description: isNewUser 
          ? "Your account has been created successfully. Check your email for welcome instructions."
          : "You have successfully signed in.",
        variant: "default",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200); // 1.2 seconds delay for toast visibility
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Error signing in",
        description: "An error occurred while signing in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const email = formFields.loginEmail;
    const password = formFields.loginPassword;

    try {
      const { user } = await signInWithEmail(email, password);
      toast({
        title: "Welcome to Dashboard!",
        description: "You have successfully signed in.",
        variant: "default",
      });
      
      // Clear login form
      setFormFields(prev => ({...prev, loginEmail: "", loginPassword: ""}));
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = "Invalid email or password. Please try again.";
      let errorTitle = "Error signing in";
      
      if (error?.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorTitle = "Account not found";
            errorMessage = "No account found with this email. Please check your email or create a new account.";
            break;
          case 'auth/wrong-password':
            errorTitle = "Incorrect password";
            errorMessage = "The password is incorrect. Please try again or use 'Forgot Password'.";
            break;
          case 'auth/invalid-email':
            errorTitle = "Invalid email";
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/user-disabled':
            errorTitle = "Account disabled";
            errorMessage = "This account has been disabled. Please contact support.";
            break;
          case 'auth/too-many-requests':
            errorTitle = "Too many attempts";
            errorMessage = "Too many failed login attempts. Please try again later.";
            break;
          default:
            // Keep default message for unknown errors
            break;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      toast({
        title: "Reset link sent",
        description: "Check your email for the password reset link.",
        variant: "default",
      });
      setShowReset(false);
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = "An error occurred while sending the reset link. Please try again.";
      let errorTitle = "Error sending reset link";
      
      if (error?.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorTitle = "Email not found";
            errorMessage = "No account found with this email address.";
            break;
          case 'auth/invalid-email':
            errorTitle = "Invalid email";
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/too-many-requests':
            errorTitle = "Too many attempts";
            errorMessage = "Too many reset requests. Please wait before trying again.";
            break;
          default:
            // Keep default message for unknown errors
            break;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleEmailRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const name = formFields.name;
    const email = formFields.email;

    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (passwordStrength < 2) {
      toast({
        title: "Weak password",
        description: "Please choose a stronger password (at least Medium strength).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { user } = await createUserWithEmail(email, password);
      await createUserDocumentFromAuth(user, { displayName: name });
      
      // Send welcome email
      try {
        const response = await fetch('/api/welcome-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            name: name,
          }),
        });

        if (response.ok) {
          console.log('Welcome email sent successfully');
        } else {
          console.warn('Welcome email failed to send:', await response.text());
        }
      } catch (emailError) {
        console.warn('Welcome email error:', emailError);
        // Don't fail registration if email fails
      }

      toast({
        title: "Welcome to FiSight!",
        description: "Your account has been created successfully. Check your email for welcome instructions.",
        variant: "default",
      });
      
      // Clear form data
      setPassword("");
      setConfirmPassword("");
      setPasswordStrength(0);
      setFormFields({ name: "", email: "", loginEmail: "", loginPassword: "" });
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = "An error occurred while creating your account. Please try again.";
      let errorTitle = "Error creating account";
      
      if (error?.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorTitle = "Email already registered";
            errorMessage = "This email is already registered. Please use the Login tab or try a different email address.";
            break;
          case 'auth/weak-password':
            errorTitle = "Weak password";
            errorMessage = "Password should be at least 6 characters long and meet strength requirements.";
            break;
          case 'auth/invalid-email':
            errorTitle = "Invalid email";
            errorMessage = "Please enter a valid email address.";
            break;
          case 'auth/operation-not-allowed':
            errorTitle = "Registration disabled";
            errorMessage = "Email registration is currently disabled. Please contact support.";
            break;
          case 'auth/too-many-requests':
            errorTitle = "Too many attempts";
            errorMessage = "Too many failed attempts. Please try again later.";
            break;
          default:
            // Keep default message for unknown errors
            break;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  function ForgotPasswordLink() {
    return (
      <button
        type="button"
        className="text-xs text-primary underline hover:text-accent"
        onClick={() => setShowReset(true)}
        data-testid="forgot-password-link"
      >
        Forgot Password?
      </button>
    );
  }

  return (
    <div className="flex w-full max-w-3xl mx-auto bg-card rounded-2xl shadow-lg overflow-hidden">
      {/* Left side illustration */}
      <div className="hidden md:flex flex-col justify-center items-center bg-background px-8 py-10 w-1/2">
        <img src="/banner11.svg" alt="Sign in illustration" className="w-64 h-auto rounded-xl shadow-lg" />
      </div>
      {/* Right side form */}
      <div className="w-full md:w-1/2 flex items-center">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
                <Logo className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold font-headline">FiSight</span>
            </div>
            <CardTitle className="font-headline text-2xl">Welcome</CardTitle>
            <CardDescription>Login or create an account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Google Sign-In Button */}
            <Button 
              variant="outline" 
              className="w-full mb-4" 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isLoading ? "Signing in..." : "Continue with Google"}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
            <Tabs defaultValue="login" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                {!showReset ? (
                  <form onSubmit={handleEmailLogin}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email-login">Email</Label>
                        <Input 
                          id="email-login" 
                          name="email"
                          type="email" 
                          placeholder="user@example.com" 
                          value={formFields.loginEmail}
                          onChange={(e) => setFormFields(prev => ({...prev, loginEmail: e.target.value}))}
                          required 
                          disabled={isLoading}
                          autoComplete="email"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="password-login">Password</Label>
                        <Input 
                          id="password-login" 
                          name="password"
                          type="password" 
                          placeholder="Enter your password"
                          value={formFields.loginPassword}
                          onChange={(e) => setFormFields(prev => ({...prev, loginPassword: e.target.value}))}
                          required 
                          disabled={isLoading}
                          autoComplete="current-password"
                        />
                        <div className="text-right mt-1">
                          <ForgotPasswordLink />
                        </div>
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Login"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordReset}>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="reset-email">Email</Label>
                        <Input
                          id="reset-email"
                          type="email"
                          value={resetEmail ?? ""}
                          onChange={e => setResetEmail(e.target.value)}
                          placeholder="user@example.com"
                          required
                          disabled={resetLoading}
                          autoComplete="email"
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={resetLoading}>
                        {resetLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                      <button
                        type="button"
                        className="text-xs text-muted-foreground underline mt-2"
                        onClick={() => setShowReset(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </TabsContent>
              <TabsContent value="register">
                 <form onSubmit={handleEmailRegister}>
                  <div className="grid gap-6 py-4">
                     <div className="grid gap-3">
                      <Label htmlFor="name-register" className="text-sm font-medium">Full Name</Label>
                      <Input 
                        id="name-register" 
                        name="name"
                        placeholder="John Doe" 
                        value={formFields.name}
                        onChange={(e) => setFormFields(prev => ({...prev, name: e.target.value}))}
                        required 
                        disabled={isLoading}
                        autoComplete="name"
                        className="h-11"
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="email-register" className="text-sm font-medium">Email Address</Label>
                      <Input 
                        id="email-register" 
                        name="email"
                        type="email" 
                        placeholder="user@example.com" 
                        value={formFields.email}
                        onChange={(e) => setFormFields(prev => ({...prev, email: e.target.value}))}
                        required 
                        disabled={isLoading}
                        autoComplete="email"
                        className="h-11"
                      />
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="password-register" className="text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Input 
                          id="password-register" 
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={password}
                          onChange={(e) => handlePasswordChange(e.target.value)}
                          required 
                          disabled={isLoading}
                          autoComplete="new-password"
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          )}
                        </button>
                      </div>
                      {password && (
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Password Strength:</span>
                            <span className={`text-sm font-medium ${getPasswordStrengthInfo(passwordStrength).color}`}>
                              {getPasswordStrengthInfo(passwordStrength).text}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-300 ${getPasswordStrengthInfo(passwordStrength).bgColor}`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            ></div>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-2 font-medium">Password Requirements:</p>
                            <ul className="space-y-1.5 text-xs">
                              <li className={`flex items-center gap-2 ${password.length >= 8 ? "text-green-600" : "text-muted-foreground"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? "bg-green-600" : "bg-gray-300"}`}></span>
                                At least 8 characters
                              </li>
                              <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(password) ? "bg-green-600" : "bg-gray-300"}`}></span>
                                One uppercase letter
                              </li>
                              <li className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(password) ? "bg-green-600" : "bg-gray-300"}`}></span>
                                One lowercase letter
                              </li>
                              <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? "bg-green-600" : "bg-gray-300"}`}></span>
                                One number
                              </li>
                              <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-muted-foreground"}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(password) ? "bg-green-600" : "bg-gray-300"}`}></span>
                                One special character
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid gap-3">
                      <Label htmlFor="confirm-password-register" className="text-sm font-medium">Confirm Password</Label>
                      <div className="relative">
                        <Input 
                          id="confirm-password-register" 
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required 
                          disabled={isLoading}
                          autoComplete="new-password"
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && (
                        <div className="mt-2">
                          {password !== confirmPassword ? (
                            <p className="text-sm text-red-500 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              Passwords do not match
                            </p>
                          ) : (
                            <p className="text-sm text-green-600 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                              Passwords match perfectly
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-2">
                      <Button 
                        type="submit" 
                        className="w-full h-11 text-base font-medium" 
                        disabled={
                          isLoading || 
                          password !== confirmPassword || 
                          passwordStrength < 2 ||
                          !password ||
                          !confirmPassword ||
                          !formFields.name ||
                          !formFields.email
                        }
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                      {(password !== confirmPassword || passwordStrength < 2) && password && confirmPassword && (
                        <p className="text-xs text-muted-foreground text-center mt-3 px-2">
                          {password !== confirmPassword 
                            ? "Passwords must match to continue" 
                            : "Password must be at least Medium strength to continue"
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
