import { useEffect, useState } from "react";
import CountryPhoneInput from "@/components/inputs/CountryPhoneInput";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { showApiError } from '@/lib/ui/errorToast';
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
  MessageCircle,
} from "lucide-react";
import apiClient from "@/lib/api/client";

interface AuthFormData {
  name?: string;
  email: string;
  phone: string;
  password: string;
  otp?: string;
}

export function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendSignupIn, setResendSignupIn] = useState(0);
  const [resendLoginIn, setResendLoginIn] = useState(0);
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    phone: "",
    password: "",
  });
  const { toast } = useToast();
  const SIGNUP_LOCKED = false;
  const { login } = useAuth();

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setResendSignupIn((s) => (s > 0 ? s - 1 : 0));
      setResendLoginIn((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simple E.164 validator for WhatsApp number
  const validateWhatsappNumber = (phone: string): string | null => {
    if (!phone) return 'No phone number entered';
    const trimmed = phone.trim();
    const e164 = /^\+[1-9]\d{7,14}$/;
    if (!e164.test(trimmed)) {
      return 'Invalid WhatsApp number. Use international format, e.g., +14155552671';
    }
    return null;
  };

  // WhatsApp Login Handler - Opens WhatsApp OTP flow
  const handleWhatsAppLogin = () => {
    // Switch to WhatsApp login tab directly
    setActiveTab("whatsapp-login");
  };

  const handleRequestPasswordReset = async () => {
    const phoneErr = validateWhatsappNumber(formData.phone);
    if (phoneErr) {
      toast({ title: phoneErr, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/request-password-reset`, {
        phone: formData.phone,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.data?.status === 'otp_sent') {
        toast({
          title: 'OTP Sent',
          description: 'We sent a verification code to your phone.',
        });
        setActiveTab('reset-password');
      }
    } catch (error: any) {
      showApiError(error, { title: 'Request Failed', defaultMessage: 'Failed to send reset code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.phone || !formData.otp || !formData.password) {
      const missing: string[] = [];
      if (!formData.phone) missing.push('phone number');
      if (!formData.otp) missing.push('OTP');
      if (!formData.password) missing.push('new password');
      const message = `Missing ${missing.join(', ')}`;
      toast({ title: message, variant: 'destructive' });
      return;
    }

    const phoneErr = validateWhatsappNumber(formData.phone);
    if (phoneErr) {
      toast({ title: phoneErr, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/reset-password`, {
        phone: formData.phone,
        otp: formData.otp,
        new_password: formData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.data?.status === 'password_reset_successful') {
        toast({
          title: 'Password Reset',
          description: 'Your password has been updated. Please login with the new password.',
        });
        setFormData(prev => ({ ...prev, password: '', otp: '' }));
        setActiveTab('login');
      }
    } catch (error: any) {
      const res = error?.response;
      if (!res) {
        toast({ title: 'Network Error', description: 'Please check your internet connection and try again.', variant: 'destructive' });
      } else {
        const detail = res?.data?.detail;
        let description = 'Failed to reset password.';
        if (Array.isArray(detail)) {
          description = detail[0]?.msg || detail[0] || description;
        } else if (typeof detail === 'string') {
          description = detail;
        } else if (detail?.error) {
          description = detail.error;
        } else if (error?.message) {
          description = error.message;
        }
        toast({ title: 'Reset Failed', description, variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      const missing: string[] = [];
      if (!formData.name || !formData.name.trim()) missing.push('name');
      if (!formData.email || !formData.email.trim()) missing.push('email');
      if (!formData.phone) missing.push('phone number');
      if (!formData.password) missing.push('password');
      const message = missing.length === 4
        ? 'No signup details entered'
        : `Missing ${missing.join(', ')}`;
      toast({ title: message, variant: 'destructive' });
      return;
    }

    const phoneErr = validateWhatsappNumber(formData.phone);
    if (phoneErr) {
      toast({ title: phoneErr, variant: 'destructive' });
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

      if (response.data?.status === 'otp_sent') {
        toast({
          title: "OTP Sent",
          description: "Please check your phone for OTP verification.",
        });
        setActiveTab("verify-signup");
      }
    } catch (error: any) {
      const res = error?.response;
      if (!res) {
        toast({
          title: "Network Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else if (res?.status === 422) {
        const detail = res?.data?.detail;
        let title = res?.data[0]?.msg;
        let description = 'Validation error occurred.';
        const pickMsg = (d: any) => Array.isArray(d) ? (d[0]?.msg || d[0]) : (typeof d === 'string' ? d : d?.error);
        const msg = pickMsg(detail);
        if (typeof msg === 'string') {
          if (/phone|invalid/i.test(msg)) {
            title = 'Invalid WhatsApp number';
          }
          description = msg || description;
        }
        toast({ title, description, variant: 'destructive' });
      } else if (res?.status === 409) {
        const detail = res?.data?.detail;
        const description = typeof detail === 'string' ? detail : (detail?.error || "An account with this email or phone already exists.");
        toast({
          title: "Account Already Exists",
          description,
          variant: "destructive",
        });
      } else {
        const detail = res?.data?.detail;
        const code = (typeof detail === 'object' && detail?.code) ? detail.code : undefined;
        let title = "Signup Failed";
        let description = "An unexpected error occurred.";
        if (code === 'user_already_verified' || res?.status === 400) {
          title = "Account already verified";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "This account is already verified. Please login.";
        } else if (res?.status === 409) {
          title = "Account Already Exists";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "An account with this email or phone already exists.";
        } else {
          description = Array.isArray(detail)
            ? (detail[0]?.msg || detail[0] || description)
            : (typeof detail === 'string' ? detail : (detail?.error || error?.message || description));
        }
        toast({
          title,
          description,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignupOTP = async () => {
    if (!formData.phone || !formData.otp) {
      const missingPhone = !formData.phone;
      const message = missingPhone && !formData.otp
        ? 'No phone number and OTP entered'
        : missingPhone
          ? 'No phone number entered'
          : 'No OTP entered';
      toast({ title: message, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/verify-signup-otp`, {
        phone: formData.phone,
        otp: formData.otp,
      });

      if (response.data?.status === "verified") {
        const { access_token, user_data } = response.data;
        if (user_data && access_token) {
          localStorage.setItem('userProfile', JSON.stringify(user_data.profile));
          localStorage.setItem('userPreferences', JSON.stringify(user_data.preferences));
          localStorage.setItem('userSecurity', JSON.stringify(user_data.security));

          login(access_token);

          toast({
            title: "Signup Successful",
            description: "Welcome to YoForex AI! Your account is now verified.",
          });
          window.location.href = '/dashboard';
        } else {
          toast({
            title: "Signup Successful",
            description: "Your account has been verified successfully!",
          });
          setActiveTab("login");
        }
      }
    } catch (error: any) {
      const res = error?.response;
      if (!res) {
        toast({
          title: "Network Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else if (res?.status === 422) {
        const detail = res?.data?.detail;
        const description = Array.isArray(detail)
          ? (detail[0]?.msg || detail[0] || "Invalid OTP. Please try again.")
          : (typeof detail === 'string' ? detail : (detail?.error || "Invalid OTP. Please try again."));
        toast({
          title: "Verification Failed",
          description,
          variant: "destructive",
        });
      } else {
        const detail = res?.data?.detail;
        const code = (typeof detail === 'object' && detail?.code) ? detail.code : undefined;
        let title = "Verification Failed";
        let description = "An unexpected error occurred.";
        if (code === 'user_not_found' || res?.status === 404) {
          title = "User not found";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "No account found for this phone number.";
        } else if (code === 'otp_expired') {
          title = "OTP expired";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "Your verification code has expired. Please request a new one.";
        } else if (code === 'invalid_otp') {
          title = "Invalid OTP";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "The verification code you entered is incorrect.";
        } else {
          description = Array.isArray(detail)
            ? (detail[0]?.msg || detail[0] || description)
            : (typeof detail === 'string' ? detail : (detail?.error || error?.message || description));
        }
        toast({
          title,
          description,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendSignupOTP = async () => {
    const phoneErr = validateWhatsappNumber(formData.phone);
    if (phoneErr) { toast({ title: phoneErr, variant: 'destructive' }); return; }
    if (resendSignupIn > 0) return;
    setIsLoading(true);
    try {
      const res = await apiClient.post(`/auth/signup/resend-otp`, { phone: formData.phone });
      const message = typeof res.data === 'string'
        ? res.data
        : (res.data?.message || 'Verification code sent again.');
      toast({ title: 'OTP Sent', description: message });
      setResendSignupIn(60);
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      const description = Array.isArray(detail)
        ? (detail[0]?.msg || detail[0])
        : (typeof detail === 'string' ? detail : (detail?.error || error?.message || 'Failed to resend OTP.'));
      toast({ title: 'Resend failed', description, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestLoginOTP = async () => {
    const phoneErr = validateWhatsappNumber(formData.phone);
    if (phoneErr) {
      toast({ title: phoneErr, variant: 'destructive' });
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

      if (response.status === 200) {
        const message = typeof response.data === 'string'
          ? response.data
          : (response.data?.message || "Please check your phone for the login OTP.");
        toast({
          title: "OTP Sent",
          description: message,
        });
        setActiveTab("verify-login");
      }
    } catch (error: any) {
      const res = error?.response;
      if (!res) {
        const code = 'backend-offline';
        const description = 'Cannot connect to the server. Please ensure the backend is running and reachable, then try again.';
        toast({
          title: `Error: ${code}`,
          description,
          variant: "destructive",
        });
      } else if (res?.status === 422) {
        const detail = res?.data?.detail;
        let title = 'Request Failed';
        let description = 'Failed to send OTP. Please try again.';
        const pickMsg = (d: any) => Array.isArray(d) ? (d[0]?.msg || d[0]) : (typeof d === 'string' ? d : d?.error);
        const msg = pickMsg(detail);
        if (typeof msg === 'string') {
          if (/phone|invalid/i.test(msg)) {
            title = 'Invalid WhatsApp number';
          }
          description = msg || description;
        }
        toast({ title, description, variant: 'destructive' });
      } else {
        const detail = res?.data?.detail;
        const code = (typeof detail === 'object' && detail?.code) ? detail.code : undefined;
        let title = "Request Failed";
        let description = "An unexpected error occurred.";
        if (code === 'phone_not_found' || code === 'user_not_found' || res?.status === 404) {
          title = "Phone not registered";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "No account found for this phone number.";
        } else if (code === 'otp_save_failed') {
          title = "Failed to send OTP";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "Could not save OTP. Please try again.";
        } else if (code === 'internal_error' || res?.status >= 500) {
          title = "Server error";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "Something went wrong on our side. Please try again later.";
        } else {
          description = Array.isArray(detail)
            ? (detail[0]?.msg || detail[0] || description)
            : (typeof detail === 'string' ? detail : (detail?.error || error?.message || description));
        }
        toast({
          title,
          description,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLoginOTP = async () => {
    if (!formData.phone || !formData.otp) {
      const missingPhone = !formData.phone;
      const message = missingPhone && !formData.otp
        ? 'No phone number and OTP entered'
        : missingPhone
          ? 'No phone number entered'
          : 'No OTP entered';
      toast({ title: message, variant: 'destructive' });
      return;
    }

    const phoneErr = validateWhatsappNumber(formData.phone);
    if (phoneErr) {
      toast({ title: phoneErr, variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/login/verify-otp`, {
        phone: formData.phone,
        otp: formData.otp,
      });

      if (response.data?.status === "login_successful") {
        toast({
          title: "Login Successful",
          description: "Welcome back to YoForex AI!",
        });
        const token = response.data.access_token;
        await login(token);
        localStorage.setItem('access_token', token);
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      const res = error?.response;
      if (!res) {
        toast({
          title: "Network Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else if (res?.status === 422) {
        const detail = res?.data?.detail;
        const description = Array.isArray(detail)
          ? (detail[0]?.msg || detail[0] || "Invalid credentials. Please try again.")
          : (typeof detail === 'string' ? detail : (detail?.error || "Invalid credentials. Please try again."));
        toast({
          title: "Login Failed",
          description,
          variant: "destructive",
        });
      } else {
        const detail = res?.data?.detail;
        const code = (typeof detail === 'object' && detail?.code) ? detail.code : undefined;
        let title = "Login Failed";
        let description = "An unexpected error occurred.";
        if (code === 'user_not_found' || res?.status === 404) {
          title = "User not found";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "No account found for this phone number.";
        } else if (code === 'otp_expired') {
          title = "OTP expired";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "Your login code has expired. Please request a new one.";
        } else if (code === 'invalid_otp') {
          title = "Invalid OTP";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "The login code you entered is incorrect.";
        } else {
          description = Array.isArray(detail)
            ? (detail[0]?.msg || detail[0] || description)
            : (typeof detail === 'string' ? detail : (detail?.error || error?.message || description));
        }
        toast({
          title,
          description,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLoginOTP = async () => {
    const phoneErr = validateWhatsappNumber(formData.phone);
    if (phoneErr) { toast({ title: phoneErr, variant: 'destructive' }); return; }
    if (resendLoginIn > 0) return;
    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/login/request-otp`, { phone: formData.phone }, {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      });
      const message = typeof response.data === 'string'
        ? response.data
        : (response.data?.message || 'Login code sent again.');
      toast({ title: 'OTP Sent', description: message });
      setResendLoginIn(60);
    } catch (error: any) {
      const res = error?.response;
      const detail = res?.data?.detail;
      let description = 'Failed to resend OTP. Please try again.';
      if (Array.isArray(detail)) description = detail[0]?.msg || detail[0] || description;
      else if (typeof detail === 'string') description = detail;
      else if (detail?.error) description = detail.error;
      else if (error?.message) description = error.message;
      toast({ title: 'Resend failed', description, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!formData.email || !formData.password) {
      const missingEmail = !formData.email || !formData.email.trim();
      const missingPassword = !formData.password;
      const message = missingEmail && missingPassword
        ? 'No email and password entered'
        : missingEmail
          ? 'No email entered'
          : 'No password entered';
      toast({
        title: message,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(`/auth/login/email`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        const { access_token, user_data } = response.data;
        if (user_data) {
          localStorage.setItem('userProfile', JSON.stringify(user_data.profile));
          localStorage.setItem('userPreferences', JSON.stringify(user_data.preferences));
          localStorage.setItem('userSecurity', JSON.stringify(user_data.security));
        }
        toast({
          title: "Login Successful",
          description: "Welcome back to YoForex AI!",
        });
        login(access_token);
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      const res = error?.response;
      if (!res) {
        toast({
          title: "Network Error",
          description: "Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else if (res?.status === 422) {
        const data = res.data;
        const detail = data?.detail;
        const description = Array.isArray(detail)
          ? (detail[0]?.msg || detail[0] || "Invalid credentials. Please try again.")
          : (typeof detail === 'string'
            ? detail
            : (detail?.error || "Invalid credentials. Please try again."));
        toast({
          title: "Login Failed",
          description,
          variant: "destructive",
        });
      } else {
        const detail = res?.data?.detail;
        const code = (typeof detail === 'object' && detail?.code) ? detail.code : undefined;
        let title = "Login Failed";
        let description = "An unexpected error occurred.";
        if (code === 'user_not_found' || res?.status === 404) {
          title = "Email not registered";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "No account found for this email. Please sign up.";
        } else if (code === 'invalid_credentials' || res?.status === 401) {
          title = "Invalid credentials";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "Incorrect email or password.";
        } else if (code === 'account_not_verified' || res?.status === 403) {
          title = "Account not verified";
          description = (typeof detail === 'object' && detail?.error) ? detail.error : "Please verify your account to continue.";
        } else {
          description = Array.isArray(detail)
            ? (detail[0]?.msg || detail[0] || description)
            : (typeof detail === 'string' ? detail : (detail?.error || error?.message || description));
        }
        toast({
          title,
          description,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>

        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            YoForex AI
          </h1>
          <p className="text-muted-foreground">
            Advanced AI Trading Platform
          </p>
        </div>

        {/* Auth Card */}
        <Card className="p-8 shadow-xl border-border/50 backdrop-blur-sm">
          <Tabs
            value={activeTab}
            onValueChange={(v) => { setActiveTab(v); }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="signup" className="text-base">Sign Up</TabsTrigger>
              <TabsTrigger value="login" className="text-base">Login</TabsTrigger>
            </TabsList>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-5">
              {SIGNUP_LOCKED && (<div className="p-3 text-sm rounded-md border border-destructive/30 bg-destructive/10 text-destructive">Signups are currently disabled. Please use Login.</div>)}
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5 text-sm font-medium">
                    <Phone className="h-3.5 w-3.5" />
                    WhatsApp Number
                  </Label>
                  <CountryPhoneInput
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(v) => handleInputChange('phone', v)}
                    defaultCountry="in"
                    preferredCountries={["in", "us", "gb", "ae", "sa"]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 h-11"
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
                  className="w-full h-11 text-base font-medium"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Login Tab */}
            <TabsContent value="login" className="space-y-5">
              <div className="space-y-5">
                {/* WhatsApp Login Button - Prominent */}
                <Button
                  onClick={handleWhatsAppLogin}
                  variant="outline"
                  className="w-full h-12 text-base font-medium border-2 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/30 transition-all"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Continue with WhatsApp</span>
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground font-medium">Or continue with email</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 h-11"
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
                  className="w-full h-11 text-base font-medium"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot-password')}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* WhatsApp Login Tab */}
            <TabsContent value="whatsapp-login" className="space-y-5">
              <div className="space-y-5">
                <div className="text-center space-y-2 mb-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">WhatsApp Login</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter your WhatsApp number to receive a login code
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp-phone" className="flex items-center gap-1.5 text-sm font-medium">
                    <Phone className="h-3.5 w-3.5" />
                    WhatsApp Number
                  </Label>
                  <CountryPhoneInput
                    id="whatsapp-phone"
                    name="whatsapp-phone"
                    value={formData.phone}
                    onChange={(v) => handleInputChange('phone', v)}
                    defaultCountry="in"
                    preferredCountries={["in", "us", "gb", "ae", "sa"]}
                  />
                </div>

                <Button
                  onClick={handleRequestLoginOTP}
                  disabled={isLoading}
                  className="w-full h-11 text-base font-medium bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Send Verification Code
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-sm text-muted-foreground hover:text-foreground font-medium"
                  >
                    Back to Login Options
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Forgot Password Tab */}
            <TabsContent value="forgot-password" className="space-y-5">
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Reset Password</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter your phone number to receive a reset code
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fp-phone" className="flex items-center gap-1.5 text-sm font-medium">
                    <Phone className="h-3.5 w-3.5" />
                    WhatsApp Number
                  </Label>
                  <CountryPhoneInput
                    id="fp-phone"
                    name="fp-phone"
                    value={formData.phone}
                    onChange={(v) => handleInputChange('phone', v)}
                    defaultCountry="in"
                    preferredCountries={["in", "us", "gb", "ae", "sa"]}
                  />
                </div>

                <Button
                  onClick={handleRequestPasswordReset}
                  disabled={isLoading}
                  className="w-full h-11"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Reset Code
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-sm text-muted-foreground hover:text-foreground font-medium"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Reset Password Tab */}
            <TabsContent value="reset-password" className="space-y-5">
              <div className="space-y-5">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Set New Password</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enter the code sent to your phone
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rp-phone" className="flex items-center gap-1.5 text-sm font-medium">
                    <Phone className="h-3.5 w-3.5" />
                    WhatsApp Number
                  </Label>
                  <CountryPhoneInput
                    id="rp-phone"
                    name="rp-phone"
                    value={formData.phone}
                    onChange={(v) => handleInputChange('phone', v)}
                    defaultCountry="in"
                    preferredCountries={["in", "us", "gb", "ae", "sa"]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rp-otp" className="text-sm font-medium">Verification Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rp-otp"
                      type="text"
                      placeholder="Enter 4-digit code"
                      value={formData.otp || ''}
                      onChange={(e) => handleInputChange('otp', e.target.value)}
                      className="pl-10 h-11"
                      maxLength={4}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rp-new" className="text-sm font-medium">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="rp-new"
                      type="password"
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 h-11"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleResetPassword}
                  disabled={isLoading}
                  className="w-full h-11"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Reset Password
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-sm text-muted-foreground hover:text-foreground font-medium"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Verify Signup OTP Tab */}
            <TabsContent value="verify-signup" className="space-y-5">
              <div className="text-center space-y-3 mb-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Verify Your Account</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We've sent a verification code to your phone
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="signup-otp" className="text-sm font-medium">Verification Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-otp"
                      type="text"
                      placeholder="Enter 4-digit code"
                      value={formData.otp || ""}
                      onChange={(e) => handleInputChange("otp", e.target.value)}
                      className="pl-10 h-11 text-center text-lg tracking-widest"
                      maxLength={4}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleVerifySignupOTP}
                  disabled={isLoading}
                  className="w-full h-11"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Account
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendSignupOTP}
                    disabled={isLoading || resendSignupIn > 0}
                    className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 font-medium"
                  >
                    {resendSignupIn > 0 ? `Resend in ${resendSignupIn}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Verify Login OTP Tab */}
            <TabsContent value="verify-login" className="space-y-5">
              <div className="text-center space-y-3 mb-6">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Login Verification</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    We've sent a login code to your phone
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-otp" className="text-sm font-medium">Verification Code</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-otp"
                      type="text"
                      placeholder="Enter 4-digit code"
                      value={formData.otp || ""}
                      onChange={(e) => handleInputChange("otp", e.target.value)}
                      className="pl-10 h-11 text-center text-lg tracking-widest"
                      maxLength={4}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleVerifyLoginOTP}
                  disabled={isLoading}
                  className="w-full h-11"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify & Login
                    </>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={handleResendLoginOTP}
                    disabled={isLoading || resendLoginIn > 0}
                    className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50 font-medium"
                  >
                    {resendLoginIn > 0 ? `Resend in ${resendLoginIn}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Secure authentication powered by YoForex AI</p>
        </div>
      </div>
    </div>
  );
}
