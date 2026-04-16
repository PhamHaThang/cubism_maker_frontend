import React from 'react';
import { getDifficultyColor } from '../../utils/helpers';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'difficulty';
  difficulty?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  difficulty,
  className = '',
}) => {
  if (variant === 'difficulty' && difficulty) {
    const color = getDifficultyColor(difficulty);
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${className}`}
        style={{
          backgroundColor: `${color}18`,
          color: color,
          border: `1px solid ${color}30`,
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200 ${className}`}
    >
      {children}
    </span>
  );
};
