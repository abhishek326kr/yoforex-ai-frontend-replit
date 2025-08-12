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

      // API returns 201 for successful signup
      if (response.status === 201) {
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

      // API returns 200 for successful verification
      if (response.status === 200) {
        toast({
          title: "Verification Successful",
          description: "Your account has been verified successfully!",
        });
        setActiveTab("login");
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

      // API returns 200 for successful OTP request
      if (response.status === 200) {
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the login OTP.",
        });
        setActiveTab("verify-login");
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errorData = error.response.data;
        toast({
          title: "Request Failed",
          description: errorData.detail?.[0]?.msg || "Failed to send OTP. Please try again.",
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
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // Check if response contains access_token or token
      const token = response.data?.access_token || response.data?.token;
      
      if (!token) {
        throw new Error('No authentication token received from server');
      }

      // Store the token and update auth state
      login(token);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to YoForex AI!",
      });
      
      // Redirect to dashboard after a short delay to allow the toast to be seen
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
      
    } catch (error: any) {
      console.error('OTP Verification Error:', error);
      
      if (!error.response) {
        // Network error or no response from server
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your internet connection.",
          variant: "destructive",
        });
      } else if (error.response.status === 422) {
        // Validation error
        const errorData = error.response.data;
        toast({
          title: "Verification Failed",
          description: errorData.detail?.[0]?.msg || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      } else {
        // Other server errors
        const errorMessage = error.response?.data?.detail || 
                            error.response?.data?.message || 
                            "An unexpected error occurred";
        toast({
          title: `Error ${error.response?.status || ''}`.trim(),
          description: errorMessage,
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
        const { token } = response.data; // Extract token from response data object
        if (!token) {
          throw new Error('No token received from server');
        }
        toast({
          title: "Login Successful",
          description: "Welcome back to YoForex AI!",
        });
        // Handle successful login (store token, redirect, etc.)
        login(token);
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
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Brand */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">YoForex AI</h1>
              <p className="text-muted-foreground">Advanced Trading Platform</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2">
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