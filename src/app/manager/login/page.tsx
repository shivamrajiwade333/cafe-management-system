'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Lock, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  Store, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-react';
import { useManagerAuth } from '@/context/ManagerAuthContext';
import { defaultCafe } from '@/lib/store';

export default function ManagerLoginPage() {
  const router = useRouter();
  const { login, demoLogin, isAuthenticated } = useManagerAuth();

  const [email, setEmail] = useState('manager@shawarmapalace.com');
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/manager/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const res = await login(email, pin);
    if (res.success) {
      router.push('/manager/dashboard');
    } else {
      setError(res.error || 'Invalid credentials');
      setIsSubmitting(false);
    }
  };

  const handle1ClickDemo = () => {
    demoLogin();
    router.push('/manager/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-coffee-950 via-coffee-900 to-coffee-950 px-4 py-12 text-cream-100">
      <div className="w-full max-w-md space-y-8">
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-2xl border-2 border-amberGold shadow-elevated">
            <Image
              src="/images/cafe/logo_3d.jpeg"
              alt="Cafe Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="rounded-full bg-amberGold/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300 border border-amberGold/30">
              SaaS Admin Suite
            </span>
            <h1 className="font-serif text-3xl font-extrabold text-cream-50 pt-2">
              Manager Portal
            </h1>
            <p className="text-xs text-coffee-300">
              {defaultCafe.name} • Pune HQ
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-coffee-800 bg-coffee-900/90 p-8 shadow-elevated backdrop-blur-md space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-950/50 p-3 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-coffee-200 mb-1.5 uppercase tracking-wider">
                Manager Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-coffee-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@shawarmapalace.com"
                  className="w-full rounded-xl border border-coffee-700 bg-coffee-950/80 pl-10 pr-4 py-2.5 text-xs text-cream-100 placeholder:text-coffee-500 focus:border-amberGold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-coffee-200 uppercase tracking-wider">
                  Manager Security PIN (4 Digits)
                </label>
                <span className="text-[10px] text-amber-300 font-mono">Demo: 1234</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4 w-4 text-coffee-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  required
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full rounded-xl border border-coffee-700 bg-coffee-950/80 pl-10 pr-10 py-2.5 text-xs text-cream-100 font-mono tracking-widest focus:border-amberGold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-3 text-coffee-400 hover:text-coffee-200"
                >
                  {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amberGold to-amber-600 py-3 text-xs font-bold text-white shadow hover:brightness-110 active:scale-98 transition"
            >
              <Lock className="h-4 w-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* 1-CLICK INSTANT DEMO LOGIN BUTTON */}
          <div className="relative border-t border-coffee-800 pt-5">
            <div className="text-center mb-3">
              <span className="bg-coffee-900 px-3 text-[11px] font-bold uppercase tracking-wider text-coffee-400">
                Or Fast-Track Presentation
              </span>
            </div>

            <button
              onClick={handle1ClickDemo}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-amberGold/50 bg-coffee-950 py-3 text-xs font-bold text-amber-300 hover:bg-coffee-800 hover:text-white transition shadow-sm"
            >
              <Sparkles className="h-4 w-4 text-amberGold" />
              <span>1-Click Instant Demo Login</span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center text-xs text-coffee-400">
          <Link href="/" className="hover:text-amberGold transition">
            ← Return to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
}
