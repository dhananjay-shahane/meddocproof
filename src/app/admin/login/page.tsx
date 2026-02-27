"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  SignInPage,
  Testimonial,
  GlassInputWrapper,
} from "@/components/ui/sign-in";

type View = "login" | "forgot" | "reset";

const testimonials: Testimonial[] = [
  {
    name: "Rohit Mehta",
    handle: "Platform Admin",
    text: "The admin dashboard gives me complete visibility and control over all certificate operations.",
  },
  {
    name: "System Admin",
    handle: "Operations",
    text: "Efficient management of doctors, certificates, and payments all in one place.",
  },
];

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("reset");
    if (token) {
      setResetToken(token);
      setView("reset");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/admin/login", { email, password });
      login(undefined, { ...res.data.user, type: "admin" });
      toast.success("Login successful!");
      router.push("/admin");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/admin/forgot-password", { email });
      toast.success(res.data.message);
      if (res.data.resetToken) {
        setResetToken(res.data.resetToken);
        setView("reset");
      }
    } catch {
      toast.error("Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/admin/reset-password", {
        token: resetToken,
        password: newPassword,
      });
      toast.success(res.data.message);
      setView("login");
      setNewPassword("");
      setConfirmPassword("");
      setResetToken("");
      router.replace("/admin/login");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const getSubtitle = () => {
    switch (view) {
      case "forgot":
        return "Enter your email to receive a reset link";
      case "reset":
        return "Enter your new password";
      default:
        return "Sign in to your admin account";
    }
  };

  return (
    <div className="auth-gradient-bg min-h-screen">
      <SignInPage
        title={
          <>
            <span className="text-primary">Admin</span> Panel
          </>
        }
        description={getSubtitle()}
        heroImageSrc="/images/auth/admin-hero.jpg"
        testimonials={testimonials}
        footer={
          view === "login" ? (
            <div className="mt-8 space-y-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to User Login
              </Link>
              <p className="text-xs text-muted-foreground">
                MediProofDocs — Admin Console
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-4">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setView("login")}
              >
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Back to Sign In
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                MediProofDocs — Admin Console
              </p>
            </div>
          )
        }
      >
        <AnimatePresence mode="wait">
          {view === "login" && (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-xl bg-transparent pl-11 pr-4 text-sm focus:outline-none"
                    />
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Password</label>
                  <button
                    type="button"
                    onClick={() => setView("forgot")}
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <GlassInputWrapper>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-xl bg-transparent pl-11 pr-12 text-sm focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </motion.form>
          )}

          {view === "forgot" && (
            <motion.form
              key="forgot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleForgotPassword}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      name="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 w-full rounded-xl bg-transparent pl-11 pr-4 text-sm focus:outline-none"
                    />
                  </div>
                </GlassInputWrapper>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </motion.form>
          )}

          {view === "reset" && (
            <motion.form
              key="reset"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleResetPassword}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      name="newPassword"
                      type="password"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="h-12 w-full rounded-xl bg-transparent pl-11 pr-4 text-sm focus:outline-none"
                    />
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-12 w-full rounded-xl bg-transparent pl-11 pr-4 text-sm focus:outline-none"
                    />
                  </div>
                </GlassInputWrapper>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
      </SignInPage>
    </div>
  );
}
