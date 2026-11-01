import React from 'react';

export interface StatisticCardProps {
  value: string | number;
  label: string;
  description?: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-700',
    value: 'text-blue-600 dark:text-blue-300',
    label: 'text-blue-900 dark:text-blue-100'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-700',
    value: 'text-green-600 dark:text-green-300',
    label: 'text-green-900 dark:text-green-100'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-700',
    value: 'text-purple-600 dark:text-purple-300',
    label: 'text-purple-900 dark:text-purple-100'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-700',
    value: 'text-orange-600 dark:text-orange-300',
    label: 'text-orange-900 dark:text-orange-100'
  }
};

export const StatisticCard: React.FC<StatisticCardProps> = ({
  value,
  label,
  description,
  icon,
  color = 'blue'
}) => {
  const styles = colorStyles[color];

  return (
    <div className={`${styles.bg} ${styles.border} border-2 rounded-xl p-6 text-center`}>
      {icon && (
        <div className={`text-4xl mb-3 ${styles.value}`}>
          {icon}
        </div>
      )}
      <div className={`text-4xl md:text-5xl font-bold ${styles.value} mb-2`}>
        {value}
      </div>
      <div className={`text-lg font-semibold ${styles.label} mb-2`}>
        {label}
      </div>
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatisticCard;
