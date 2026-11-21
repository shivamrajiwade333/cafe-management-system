import React from 'react';

interface VegBadgeProps {
  isVeg: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const VegBadge: React.FC<VegBadgeProps> = ({ isVeg, size = 'md', showLabel = false }) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5 border-[1.5px] p-[1.5px]',
    md: 'w-4 h-4 border-2 p-0.5',
    lg: 'w-5 h-5 border-2 p-0.5',
  };

  const innerSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  if (isVeg) {
    return (
      <div className="inline-flex items-center gap-1.5" title="Pure Vegetarian (FSSAI)">
        <div
          className={`flex items-center justify-center rounded-sm border-emerald-600 bg-white ${sizeClasses[size]}`}
        >
          <div className={`rounded-full bg-emerald-600 ${innerSize[size]}`} />
        </div>
        {showLabel && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">
            Veg
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5" title="Non-Vegetarian (FSSAI)">
      <div
        className={`flex items-center justify-center rounded-sm border-red-600 bg-white ${sizeClasses[size]}`}
      >
        <div
          className={`h-0 w-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-red-600`}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
          Non-Veg
        </span>
      )}
    </div>
  );
};
