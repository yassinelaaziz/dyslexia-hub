import React from 'react';

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  link?: string;
  onClick?: () => void;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}

const colorStyles = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    iconBg: 'bg-blue-100 dark:bg-blue-800',
    iconText: 'text-blue-600 dark:text-blue-300',
    title: 'text-blue-900 dark:text-blue-100',
    border: 'border-blue-200 dark:border-blue-700',
    hover: 'hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-blue-200 dark:hover:shadow-blue-900/20'
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    iconBg: 'bg-green-100 dark:bg-green-800',
    iconText: 'text-green-600 dark:text-green-300',
    title: 'text-green-900 dark:text-green-100',
    border: 'border-green-200 dark:border-green-700',
    hover: 'hover:border-green-400 dark:hover:border-green-500 hover:shadow-green-200 dark:hover:shadow-green-900/20'
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    iconBg: 'bg-purple-100 dark:bg-purple-800',
    iconText: 'text-purple-600 dark:text-purple-300',
    title: 'text-purple-900 dark:text-purple-100',
    border: 'border-purple-200 dark:border-purple-700',
    hover: 'hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-purple-200 dark:hover:shadow-purple-900/20'
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    iconBg: 'bg-orange-100 dark:bg-orange-800',
    iconText: 'text-orange-600 dark:text-orange-300',
    title: 'text-orange-900 dark:text-orange-100',
    border: 'border-orange-200 dark:border-orange-700',
    hover: 'hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-orange-200 dark:hover:shadow-orange-900/20'
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    iconBg: 'bg-red-100 dark:bg-red-800',
    iconText: 'text-red-600 dark:text-red-300',
    title: 'text-red-900 dark:text-red-100',
    border: 'border-red-200 dark:border-red-700',
    hover: 'hover:border-red-400 dark:hover:border-red-500 hover:shadow-red-200 dark:hover:shadow-red-900/20'
  }
};

export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  link,
  onClick,
  color = 'blue'
}) => {
  const styles = colorStyles[color];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (link) {
      window.location.href = link;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`${styles.bg} ${styles.border} border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${styles.hover} hover:shadow-lg`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      aria-label={`Learn more about ${title}`}
    >
      <div className={`${styles.iconBg} ${styles.iconText} w-16 h-16 rounded-lg flex items-center justify-center mb-4 text-3xl`}>
        {icon}
      </div>
      <h3 className={`text-xl font-bold ${styles.title} mb-3`}>
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
