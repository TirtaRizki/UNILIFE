import React from 'react';
import { cn } from '@/lib/utils';
import { Cloud, Sun, Smile, Leaf } from 'lucide-react';

const icons = [
  { Icon: Cloud, className: 'w-24 h-24 text-sky-300/30', style: { top: '15%', left: '10%', animationDuration: '10s' } },
  { Icon: Sun, className: 'w-28 h-28 text-yellow-300/30', style: { top: '20%', right: '15%', animationDuration: '12s', animationDelay: '1s' } },
  { Icon: Smile, className: 'w-20 h-20 text-pink-300/30', style: { top: '50%', left: '20%', animationDuration: '8s', animationDelay: '2s' } },
  { Icon: Leaf, className: 'w-24 h-24 text-green-300/30', style: { top: '60%', right: '10%', animationDuration: '13s', animationDelay: '0.5s' } },
  { Icon: Cloud, className: 'w-32 h-32 text-sky-300/20', style: { top: '80%', left: '5%', animationDuration: '15s', animationDelay: '3s' } },
  { Icon: Sun, className: 'w-16 h-16 text-yellow-300/20', style: { top: '85%', right: '25%', animationDuration: '11s', animationDelay: '1.5s' } },
  { Icon: Leaf, className: 'w-14 h-14 text-green-300/20', style: { top: '5%', right: '5%', animationDuration: '12s' } },
  { Icon: Smile, className: 'w-24 h-24 text-pink-300/20', style: { top: '40%', right: '30%', animationDuration: '7s', animationDelay: '2.5s' } },
];

const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {icons.map((item, index) => {
        const { Icon, className, style } = item;
        return (
          <div
            key={index}
            className={cn('fixed animate-subtle-float', className)}
            style={style}
          >
            <Icon strokeWidth={1.2} />
          </div>
        );
      })}
    </div>
  );
};

export default FloatingIcons;
