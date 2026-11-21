import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ShieldCheck, QrCode } from 'lucide-react';
import { defaultCafe } from '@/lib/store';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-coffee-200/50 bg-coffee-950 text-cream-200 pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-amberGold/30">
                <Image
                  src="/images/cafe/logo_3d.jpeg"
                  alt="Cafe Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-cream-50">
                  {defaultCafe.name}
                </h3>
                <p className="text-xs text-amberGold font-medium">
                  {defaultCafe.tagline}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-coffee-300 max-w-md">
              {defaultCafe.description}
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-coffee-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>FSSAI Certified • Highest Standards of Hygiene & Quality</span>
            </div>
          </div>

          {/* Quick Contact & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amberGold">
              Visit & Contact
            </h4>
            <div className="space-y-2 text-xs text-coffee-300">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-amberGold mt-0.5" />
                <span>{defaultCafe.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-amberGold" />
                <span>{defaultCafe.phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-amberGold" />
                <span>{defaultCafe.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0 text-amberGold" />
                <span>Open Daily: 11:00 AM – 11:30 PM</span>
              </p>
            </div>
          </div>

          {/* SaaS & QR Management Link */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amberGold">
              Cafe Management
            </h4>
            <p className="text-xs text-coffee-300">
              QR-powered dining experience for modern cafes across India.
            </p>
            <div className="pt-2 space-y-2">
              <Link
                href="/manager/login"
                className="flex items-center justify-center gap-2 rounded-lg bg-coffee-800/80 px-3.5 py-2 text-xs font-medium text-cream-100 hover:bg-coffee-700 transition"
              >
                <ShieldCheck className="h-4 w-4 text-amberGold" />
                <span>Manager Portal Login</span>
              </Link>
              <Link
                href="/menu"
                className="flex items-center justify-center gap-2 rounded-lg border border-coffee-800 px-3.5 py-2 text-xs font-medium text-coffee-300 hover:bg-coffee-900 transition"
              >
                <QrCode className="h-4 w-4 text-coffee-400" />
                <span>Table QR Ordering</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-coffee-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-coffee-400 gap-3">
          <p>© {new Date().getFullYear()} {defaultCafe.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Powered by Smart Cafe OS SaaS Platform</span>
            <span>•</span>
            <span>Multi-Tenant Architecture</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
