import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ArrowRight,
  CheckCircle,
  Loader2,
  Zap,
  Brain,
  TrendingUp
} from "lucide-react";
import apiClient from "@/lib/api/client";
import 'react-phone-input-2/lib/style.css'

interface AuthFormData {
  name?: string;
  email: string;
  phone: string;
  password: string;
  otp?: string;
}

export function Auth() {
  const [activeTab, setActiveTab] = useState("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    phone: "",
    password: "",
  });
  const { toast } = useToast();
  const { login } = useAuth();

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/signup`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log("Signup response:", response);

      // Backend returns JSON { status: 'otp_sent' }
      if (response.data?.status === 'otp_sent') {
        toast({
          title: "Signup Successful",
          description: "Please check your phone for OTP verification.",
        });
        setActiveTab("verify-signup");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      console.error("Error response:", error.response);
      console.log(error.response)

      if (error.response?.status === 422) {
        const errorData = error.response.data;
        toast({
          title: "Signup Failed",
          description: errorData.detail?.[0]?.msg || "Validation error occurred.",
          variant: "destructive",
        });
      } else if (error.response?.status === 409) {
        toast({
          title: "Account Already Exists",
          description: "An account with this email or phone already exists.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Error: ${error.response.status}`,
          description: `${error.response.data.detail}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignupOTP = async () => {
    if (!formData.phone || !formData.otp) {
      toast({
        title: "Validation Error",
        description: "Please enter your phone number and OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/verify-signup-otp`, {
        phone: formData.phone,
        otp: formData.otp,
      });

      // Backend returns JSON { status: 'verified', access_token, user_data }
      if (response.data?.status === "verified") {
        const { access_token, user_data } = response.data;
        
        // Store user data in localStorage for immediate use
        if (user_data && access_token) {
          localStorage.setItem('userProfile', JSON.stringify(user_data.profile));
          localStorage.setItem('userPreferences', JSON.stringify(user_data.preferences));
          localStorage.setItem('userSecurity', JSON.stringify(user_data.security));
          
          // Store token and login user
          login(access_token);
          
          toast({
            title: "Verification Successful",
            description: "Welcome to YoForex AI! Your account is now verified.",
          });
          
          // Redirect to dashboard
          window.location.href = '/dashboard';
        } else {
          toast({
            title: "Verification Successful",
            description: "Your account has been verified successfully!",
          });
          setActiveTab("login");
        }
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        toast({
          title: "Verification Failed",
          description: errorData.detail?.[0]?.msg || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Error: ${error.response.status}`,
          description: `${error.response.data.detail}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestLoginOTP = async () => {
    if (!formData.phone) {
      toast({
        title: "Validation Error",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/login/request-otp`, {
        phone: formData.phone,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Backend returns JSON { status: 'success' }
      if (response.data?.status === "success") {
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the login OTP.",
        });
        setActiveTab("verify-login");
      }
    } catch (error: any) {
      toast({
        title: "Error!",
        description: `${error}`,
        variant: "destructive",
      });
      
      if (!error.response) {
        toast({
          title: "Error!",
          description: "Network error occurred",
          variant: "destructive",
        });
        return;
      }

      if (error?.response?.status === 422) {
        const errorData = error.response.data;
        const errorMessage = errorData.detail?.[0]?.msg || "Failed to send OTP. Please try again.";
        toast({
          title: "Request Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        const errorMessage = error.response.data?.detail || "An unexpected error occurred";
        toast({
          title: `Error: ${error.response.status}`,
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLoginOTP = async () => {
    if (!formData.phone || !formData.otp) {
      toast({
        title: "Validation Error",
        description: "Please enter your phone number and OTP.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/login/verify-otp`, {
        phone: formData.phone,
        otp: formData.otp,
      });

      // Backend returns JSON { status: 'login_successful', access_token }
      if (response.data?.status === "login_successful") {
        
        toast({
          title: "Login Successful",
          description: "Welcome back to YoForex AI!",
        });
        const token = response.data.access_token;
        // Persist via auth context (stores authToken and fetches profile)
        await login(token);
        // Also keep access_token for any consumers checking that key
        localStorage.setItem('access_token', token);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        console.log(errorData)
        toast({
          title: "Login Failed",
          description: errorData.detail?.[0]?.msg || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log(error.response)
        toast({
          title: `Error: ${error.response.status}`,
          description: `${error.response.detail}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!formData.email || !formData.password) {
      toast({
        title: "Validation Error",
        description: "Please enter your email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/login/email`, {
        email: formData.email,
        password: formData.password,
      });

      // API returns 200 for successful login
      if (response.status === 200) {
        const { access_token, user_data } = response.data; // Extract access_token and user_data from response
        if (!access_token) {
          throw new Error('No access token received from server');
        }
        
        // Store user data in localStorage for immediate use
        if (user_data) {
          localStorage.setItem('userProfile', JSON.stringify(user_data.profile));
          localStorage.setItem('userPreferences', JSON.stringify(user_data.preferences));
          localStorage.setItem('userSecurity', JSON.stringify(user_data.security));
        }
        
        toast({
          title: "Login Successful",
          description: "Welcome back to YoForex AI!",
        });
        // Handle successful login (store token, redirect, etc.)
        login(access_token);
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        toast({
          title: "Login Failed",
          description: errorData.detail?.[0]?.msg || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: `Error: ${error.response.status}`,
          description: `${error.response.data.detail}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        {/* Logo and Brand */}
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            {/* <div className="p-3 bg-blue-600 rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">YoForex AI</h1>
              <p className="text-gray-400">Advanced Trading Platform</p>
            </div> */}
            {/* <img src="/logo_signin_optimized.png" alt="YoForex Logo"/> */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl mb-1 font-brand font-semibold tracking-tight leading-tight text-foreground"
              aria-label="YoForex AI"
            >
              YoForex AI
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              powered by
              <img src="/yoforexai.png" alt="YoForex Logo" className="h-5 w-auto opacity-90" />
            </p>
            
          </div>
          <div className="flex items-center justify-center space-x-2 mt-[0px]">
            <Badge variant="secondary" className="bg-gradient-profit text-white">
              <Brain className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
            <Badge variant="secondary" className="bg-gradient-primary text-white">
              <TrendingUp className="h-3 w-3 mr-1" />
              Real-time
            </Badge>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-gradient-glass border-border/20 shadow-glass p-6 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/20">
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary">
                Sign Up
              </TabsTrigger>
              <TabsTrigger value="login" className="data-[state=active]:bg-primary">
                Login
              </TabsTrigger>
            </TabsList>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium text-foreground pb-[10px]">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 bg-muted/20 border-border/30 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground pb-[10px]">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-muted/20 border-border/30 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div className="phone-input">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-foreground flex items-center gap-1 pb-[10px]"
                  >
                    <img src="/whatsapp.png" alt="Whatsapp" className="w-4 h-4 inline-block mr-[5px]" />
                    <span>Whatsapp Number</span>

                  </Label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="E.g. +910234567890"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 bg-muted/20 border-border/30 focus:border-primary/50"
                    />
                  </div>
                </div>


                <div>
                  <Label htmlFor="password" className="text-sm font-medium text-foreground pb-[10px]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-muted/20 border-border/30 focus:border-primary/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSignup}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  Create Account
                </Button>
              </div>
            </TabsContent>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-sm font-medium text-foreground pb-[10px]">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-muted/20 border-border/30 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-sm font-medium text-foreground pb-[10px]">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-muted/20 border-border/30 focus:border-primary/50"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleEmailLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ArrowRight className="h-4 w-4 mr-2" />
                  )}
                  Login with Email
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <div className="phone-input">
                  <Label 
                    htmlFor="phone"
                    className="text-sm font-medium text-foreground flex items-center gap-1 pb-[10px]"
                  >
                    <img src="/whatsapp.png" alt="Whatsapp" className="w-4 h-4 inline-block mr-[5px]" />
                    <span>Whatsapp Number</span>

                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-phone"
                      type="tel"
                      placeholder="E.g. +910123456789"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 bg-muted/20 border-border/30 focus:border-primary/50"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleRequestLoginOTP}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full border-border/30 hover:bg-muted/20"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Shield className="h-4 w-4 mr-2" />
                  )}
                  Login with OTP
                </Button>
              </div>
            </TabsContent>

            {/* Verify Signup OTP Tab */}
            <TabsContent value="verify-signup" className="space-y-4">
              <div className="text-center space-y-2">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <h3 className="text-lg font-semibold text-foreground">Verify Your Account</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a verification code to your phone number.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="signup-otp" className="text-sm font-medium text-foreground">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={formData.otp || ""}
                      onChange={(e) => handleInputChange("otp", e.target.value)}
                      className="pl-10 bg-muted/20 border-border/30 focus:border-primary/50"
                      maxLength={6}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleVerifySignupOTP}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Verify Account
                </Button>
              </div>
            </TabsContent>

            {/* Verify Login OTP Tab */}
            <TabsContent value="verify-login" className="space-y-4">
              <div className="text-center space-y-2">
                <Shield className="h-12 w-12 text-blue-500 mx-auto" />
                <h3 className="text-lg font-semibold text-foreground">Login Verification</h3>
                <p className="text-sm text-muted-foreground">
                  We've sent a login code to your phone number.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="login-otp" className="text-sm font-medium text-foreground">
                    Verification Code
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={formData.otp || ""}
                      onChange={(e) => handleInputChange("otp", e.target.value)}
                      className="pl-10 bg-muted/20 border-border/30 focus:border-primary/50"
                      maxLength={6}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleVerifyLoginOTP}
                  disabled={isLoading}
                  className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Verify & Login
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Features Preview */}
        <div className="text-center space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center space-y-2">
              <div className="p-2 bg-gradient-profit/20 rounded-lg mx-auto w-fit">
                <Brain className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground">AI-Powered</p>
            </div>
            <div className="text-center space-y-2">
              <div className="p-2 bg-gradient-primary/20 rounded-lg mx-auto w-fit">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground">Real-time</p>
            </div>
            <div className="text-center space-y-2">
              <div className="p-2 bg-gradient-secondary/20 rounded-lg mx-auto w-fit">
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-xs text-muted-foreground">Fast</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 