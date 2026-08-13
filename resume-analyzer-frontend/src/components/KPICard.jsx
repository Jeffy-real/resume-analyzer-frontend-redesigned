import React from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';

const iconColors = {
  primary: 'text-primary',
  success: 'text-tertiary',
  warning: 'text-secondary',
  danger: 'text-error',
  info: 'text-primary',
};

const iconBgColors = {
  primary: 'bg-primary/10',
  success: 'bg-tertiary/10',
  warning: 'bg-secondary/10',
  danger: 'bg-error/10',
  info: 'bg-primary/10',
};

export function KPICard({
  icon,
  value,
  label,
  description,
  trend,
  color = 'primary',
  isText = false,
  suffix = '',
}) {
  const iconColor = iconColors[color] || iconColors.primary;
  const iconBgColor = iconBgColors[color] || iconBgColors.primary;

  return (
    <div className="card group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${iconBgColor} ${iconColor}`}>
            <Icon name={icon} size={20} />
          </div>
          <div className="mt-4 space-y-1">
            {isText ? (
              <p className="text-xl font-semibold text-on-surface truncate">{value}</p>
            ) : (
              <div className="flex items-baseline gap-1">
                <motion.span
                  className="text-2xl md:text-3xl font-bold text-on-surface tabular-nums"
                >
                  {value}
                </motion.span>
                {suffix && <span className="text-outline tabular-nums text-sm">{suffix}</span>}
              </div>
            )}
            <p className="text-sm font-medium text-on-surface">{label}</p>
            <p className="text-[11px] text-outline">{description}</p>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 shrink-0 ${trend.direction === 'up' ? 'text-tertiary' : 'text-error'}`}>
            <Icon name={trend.direction === 'up' ? 'chevron-up' : 'chevron-down'} size={12} />
            <span className="text-sm font-semibold tabular-nums">{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
}
