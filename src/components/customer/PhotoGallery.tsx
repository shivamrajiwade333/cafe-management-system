'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Sparkles, MapPin, Maximize2, X } from 'lucide-react';

interface GalleryPhoto {
  src: string;
  title: string;
  subtitle: string;
  tag: string;
  span?: string;
}

const cafePhotos: GalleryPhoto[] = [
  {
    src: '/images/cafe/storefront.jpeg',
    title: 'Storefront Entrance at Night',
    subtitle: 'Illuminated signage, glass facade & welcoming outdoor greenery',
    tag: 'Storefront',
    span: 'col-span-1 md:col-span-2 row-span-2',
  },
  {
    src: '/images/cafe/interior_main.jpeg',
    title: 'The Dining Lounge & Wave Ceiling',
    subtitle: 'Backlit circular Kyodai emblem, wave architectural ceiling & booth seating',
    tag: 'Interior',
    span: 'col-span-1 md:col-span-2',
  },
  {
    src: '/images/cafe/logo_3d.jpeg',
    title: 'Illuminated 3D Wall Emblem',
    subtitle: 'Symbol of our artisanal flame-grilled shawarma authenticity',
    tag: 'Brand Emblem',
    span: 'col-span-1',
  },
  {
    src: '/images/cafe/dining_lounge.jpeg',
    title: 'Dine-In Atmosphere',
    subtitle: 'Guests savoring hot rolls and freshly baked snacks in comfort',
    tag: 'Guest Experience',
    span: 'col-span-1',
  },
  {
    src: '/images/cafe/dining_friends.jpeg',
    title: 'Friendly Conversations',
    subtitle: 'Perfect ambient lighting for catchups, family dining & coffee breaks',
    tag: 'Ambiance',
    span: 'col-span-1',
  },
  {
    src: '/images/cafe/booth_cozy.jpeg',
    title: 'Cosy Booth Corner & Brick Texture',
    subtitle: 'Custom geometric wall sconces, pendant lamps and cushioned booth tables',
    tag: 'Seating',
    span: 'col-span-1',
  },
  {
    src: '/images/cafe/reception_counter.jpeg',
    title: 'Reception & Smart POS Station',
    subtitle: 'Warm welcome archway, greeting station and contactless QR billing',
    tag: 'Hospitality',
    span: 'col-span-1',
  },
  {
    src: '/images/cafe/accent_wall.jpeg',
    title: 'Heritage Red Accent Wall',
    subtitle: 'Hand-carved red ideogram signs paired with luxury booth loungers',
    tag: 'Decor',
    span: 'col-span-1 md:col-span-2',
  },
  {
    src: '/images/cafe/rose_milk.jpeg',
    title: 'Signature Artisanal Rose Milk',
    subtitle: 'Natural Damascus rose petal infusion chilled to refreshing perfection',
    tag: 'Signature Drink',
    span: 'col-span-1',
  },
  {
    src: '/images/cafe/founder.jpeg',
    title: 'Meet Our Passionate Founder & Host',
    subtitle: 'Committed to delivering authentic culinary joy in every single bite',
    tag: 'Our Team',
    span: 'col-span-1',
  },
];

export const PhotoGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  return (
    <section id="ambiance-gallery" className="py-20 bg-cream-50 text-coffee-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amberGold/30 bg-coffee-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amberGold">
            <Camera className="h-3.5 w-3.5" />
            <span>Authentic Cafe Photography</span>
          </div>
          <h2 className="font-serif text-3xl font-extrabold sm:text-4xl text-coffee-950">
            Step Inside The Palace Ambiance
          </h2>
          <p className="text-sm sm:text-base text-coffee-700 leading-relaxed">
            Every corner of The Shawarma Palace Cafe is designed for comfort, connection, and culinary delight. Take a look at our actual cafe spaces, dining lounge, and authentic atmosphere.
          </p>
        </div>

        {/* Photography Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {cafePhotos.map((photo, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedPhoto(photo)}
              className={`group relative overflow-hidden rounded-2xl border border-coffee-200/60 bg-coffee-100 shadow-soft cursor-pointer transition-all duration-300 hover:shadow-premium hover:-translate-y-1 ${
                photo.span || 'col-span-1'
              } h-64 sm:h-72 md:h-80`}
            >
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-950/85 via-coffee-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="rounded-md bg-coffee-950/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-amber-400/30">
                  {photo.tag}
                </span>
              </div>

              {/* Expand Icon */}
              <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="rounded-full bg-white/80 p-1.5 text-coffee-950 shadow-md">
                  <Maximize2 className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Caption */}
              <div className="absolute bottom-3 left-3 right-3 z-10 text-cream-100 space-y-0.5">
                <h4 className="font-serif text-base font-bold text-cream-50 leading-snug group-hover:text-amber-200 transition-colors">
                  {photo.title}
                </h4>
                <p className="text-[11px] text-coffee-300 line-clamp-1">
                  {photo.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Location & Table Banner */}
        <div className="mt-12 rounded-2xl border border-amberGold/30 bg-gradient-to-r from-coffee-950 via-coffee-900 to-coffee-950 p-6 text-cream-100 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amberGold/20 p-3 text-amberGold border border-amberGold/30">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="font-serif text-base font-bold text-cream-50">
                Visit Us at MG Road, Pune
              </p>
              <p className="text-xs text-coffee-300">
                Experience these spaces in person. Pull up a chair and enjoy freshly served delicacies!
              </p>
            </div>
          </div>
          <a
            href="/menu"
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-amberGold px-5 py-2.5 text-xs font-bold text-white hover:bg-amberGold-hover transition shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>Order at Table Now</span>
          </a>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-coffee-950 rounded-2xl overflow-hidden border border-amberGold/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-black transition"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-5 border-t border-coffee-800 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amberGold">
                {selectedPhoto.tag}
              </span>
              <h3 className="font-serif text-lg font-bold text-cream-50">
                {selectedPhoto.title}
              </h3>
              <p className="text-xs text-coffee-300">
                {selectedPhoto.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
