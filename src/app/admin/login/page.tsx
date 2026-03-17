"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import api from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { SmokeyBackground } from "@/components/ui/login-form";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-950">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}

function AdminLoginContent() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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



  return (
    <main className="relative w-screen h-screen bg-gray-950 overflow-hidden">
      {/* WebGL Smokey Background */}
      <SmokeyBackground
        color="#1d4ed8"
        backdropBlurAmount="none"
        className="absolute inset-0"
      />

      {/* Dark overlay for depth */}
      <div className="absolute inset-0 bg-gray-950/60" />

      {/* Centered card */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        <div className="w-full max-w-sm">
            {/* Glass card */}
            <div className="p-8 space-y-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
              {/* Brand */}
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/80 backdrop-blur-sm shadow-lg shadow-blue-600/30">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h2>
                  <p className="mt-1 text-sm text-gray-300">Sign in to manage MediProofDocs</p>
                </div>
              </div>

              {/* Login form */}
              <form onSubmit={handleLogin} className="space-y-5">
                  {/* Email */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Mail size={15} />
                    </div>
                    <input
                      type="email"
                      id="admin_email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-gray-400 pl-9 pr-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                      placeholder="Email address"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Lock size={15} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="admin_password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder-gray-400 pl-9 pr-10 py-3 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition"
                      placeholder="Password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group w-full flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 shadow-lg shadow-blue-600/30"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>


            </div>
        </div>
      </div>
    </main>
  );
}
