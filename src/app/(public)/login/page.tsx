"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas";
import { z } from "zod";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setError("Invalid email address or password.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-24 flex items-center justify-center animate-enter-fade font-sans">
      <div className="border border-border p-10 max-w-md w-full bg-stone-50/50 space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <img 
            src="/images/logo_c.png" 
            alt="PureSweep Cleaning" 
            className="h-16 w-auto object-contain" 
          />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Admin Console</span>
            <p className="text-[11px] text-stone-400 mt-1">Authorized personnel only.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-800 border border-red-200 p-3 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Email Address</label>
            <input 
              type="email" 
              {...register("email")} 
              placeholder="admin@puresweep.co.nz"
              className="border border-border p-3.5 text-sm bg-surface outline-none focus:border-primary transition-colors duration-hover"
            />
            {errors.email && <p className="text-xs text-red-700 font-semibold">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500">Password</label>
            <input 
              type="password" 
              {...register("password")} 
              placeholder="••••••••"
              className="border border-border p-3.5 text-sm bg-surface outline-none focus:border-primary transition-colors duration-hover"
            />
            {errors.password && <p className="text-xs text-red-700 font-semibold">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-4 uppercase tracking-widest text-xs"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-24 text-center text-xs font-mono text-muted-text animate-pulse">Loading authorization console...</div>}>
      <LoginForm />
    </Suspense>
  );
}
