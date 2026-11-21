import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { ManagerAuthProvider } from '@/context/ManagerAuthContext';

export const metadata: Metadata = {
  title: 'The Shawarma Palace Cafe • Smart QR Dine-In Ordering',
  description: 'Premium QR-based cafe food ordering and restaurant management platform for modern cafes across India.',
  icons: {
    icon: '/images/cafe/logo_3d.jpeg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-cream-100 font-sans text-coffee-950 antialiased selection:bg-amberGold/20 selection:text-coffee-950">
        <ManagerAuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ManagerAuthProvider>
      </body>
    </html>
  );
}
