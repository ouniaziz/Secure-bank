"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OTPModal from "@/components/modals/otp-modal";
import PasswordStrengthIndicator from "@/components/ui/password-strength-indicator";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import api from "@/lib/api";
import { ref } from "process";

interface LoginPageProps {
  onLogin: (userData: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    return true;
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

      setLoading(false);
      setShowOTP(true);
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || "Login failed");
    }
  };
  const handleOTPVerify = async (otp: string) => {
    try {
      const response = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      const { user, accessToken, refreshToken } = response.data;

      // Save tokens securely
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      onLogin(user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setError("")

  //   if (!validateForm()) return

  //   setLoading(true)
  //   // Simulate API delay
  //   await new Promise((resolve) => setTimeout(resolve, 1000))
  //   setLoading(false)
  //   setShowOTP(true)
  // }

  // const handleOTPVerify = (otp: string) => {
  //   // Simulate OTP verification
  //   const mockUser = {
  //     id: "12345",
  //     name: "John Doe",
  //     email,
  //     balance: 45250.5,
  //     accountNumber: "****5678",
  //   }
  //   onLogin(mockUser)
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <Card className="border border-border shadow-2xl">
          <CardHeader className="space-y-2 pb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-2">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">SecureBank</CardTitle>
            <CardDescription className="text-center">
              Secure digital banking platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <PasswordStrengthIndicator password={password} />

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <button type="button" className="text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login to your account"}
              </Button>

              {/* <div className="text-center text-sm text-muted-foreground">
                Demo credentials: demo@bank.com / Password123!
              </div> */}
            </form>
          </CardContent>
        </Card>

        {/* <div className="mt-6 text-center text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-green-500"></div>
            <span>🔒 256-bit SSL Encrypted Connection</span>
          </div>
          <div className="text-xs">
            For testing only. Use test credentials provided.
          </div>
        </div> */}

        {showOTP && (
          <OTPModal
            email={email}
            onVerify={handleOTPVerify}
            onClose={() => setShowOTP(false)}
          />
        )}
      </div>
    </div>
  );
}
