'use client';

import React from 'react';
import { ICategory } from '@/types';
import { 
  Utensils, 
  Flame, 
  Pizza, 
  Beef, 
  Sandwich, 
  Soup, 
  CupSoda, 
  Cake,
  Sparkles 
} from 'lucide-react';

interface CategorySliderProps {
  categories: ICategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
}) => {
  const getCategoryIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('starter')) return <Utensils className="h-4 w-4" />;
    if (lower.includes('main')) return <Flame className="h-4 w-4" />;
    if (lower.includes('pizza')) return <Pizza className="h-4 w-4" />;
    if (lower.includes('burger')) return <Beef className="h-4 w-4" />;
    if (lower.includes('sandwich')) return <Sandwich className="h-4 w-4" />;
    if (lower.includes('pasta')) return <Soup className="h-4 w-4" />;
    if (lower.includes('beverage') || lower.includes('drink')) return <CupSoda className="h-4 w-4" />;
    if (lower.includes('dessert') || lower.includes('sweet')) return <Cake className="h-4 w-4" />;
    return <Sparkles className="h-4 w-4" />;
  };

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2.5 min-w-max px-1">
        {/* All Items Pill */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-sm ${
            activeCategoryId === 'all'
              ? 'bg-coffee-950 text-cream-100 shadow-md ring-2 ring-amberGold/50 scale-[1.02]'
              : 'border border-coffee-200/80 bg-white text-coffee-800 hover:bg-coffee-50 hover:border-coffee-300'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amberGold" />
          <span>Full Menu (All)</span>
        </button>

        {/* Categories */}
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-sm ${
                isActive
                  ? 'bg-coffee-950 text-cream-100 shadow-md ring-2 ring-amberGold/50 scale-[1.02]'
                  : 'border border-coffee-200/80 bg-white text-coffee-800 hover:bg-coffee-50 hover:border-coffee-300'
              }`}
            >
              <span className={isActive ? 'text-amberGold' : 'text-coffee-600'}>
                {getCategoryIcon(cat.name)}
              </span>
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
