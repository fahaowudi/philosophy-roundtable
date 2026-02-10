'use client';

import { Philosopher } from '@/types/discussion';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface PhilosopherCardProps {
  philosopher: Philosopher;
  isSelected: boolean;
  onSelect: (philosopher: Philosopher) => void;
  disabled?: boolean;
}

export function PhilosopherCard({
  philosopher,
  isSelected,
  onSelect,
  disabled = false,
}: PhilosopherCardProps) {
  return (
    <div
      className={`p-8 cursor-pointer transition-all relative border-2 rounded-3xl ${
        isSelected
          ? 'shadow-md'
          : 'hover:shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{
        borderColor: isSelected ? '#2D5A3A' : '#E0E0E0',
        backgroundColor: isSelected ? '#F0F5F2' : '#FFFFFF'
      }}
      onClick={() => !disabled && onSelect(philosopher)}
    >
      {isSelected && (
        <div className="absolute top-6 right-6 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#2D5A3A' }}>
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        <div className="text-6xl mb-4">{philosopher.avatar}</div>
        <h3 className="font-normal text-2xl mb-2" style={{ color: '#000000' }}>{philosopher.name}</h3>
        <p className="text-sm mb-4" style={{ color: '#666666' }}>{philosopher.era}</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {philosopher.coreIdeas.slice(0, 2).map((idea, index) => (
            <span
              key={index}
              className="text-xs px-3 py-1.5 rounded-full font-normal"
              style={{ backgroundColor: '#A3B18A', color: '#FFFFFF' }}
            >
              {idea}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
