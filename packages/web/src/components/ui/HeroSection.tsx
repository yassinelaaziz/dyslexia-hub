import React from 'react';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  primaryCta?: {
    text: string;
    onClick: () => void;
    link?: string;
  };
  secondaryCta?: {
    text: string;
    onClick: () => void;
    link?: string;
  };
  backgroundColor?: string;
  textColor?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryCta,
  secondaryCta,
  backgroundColor = 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900',
  textColor = 'text-gray-900 dark:text-white'
}) => {
  return (
    <section className={`${backgroundColor} py-16 md:py-24`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold ${textColor} mb-6 leading-tight`}>
            {title}
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
            {subtitle}
          </p>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {primaryCta && (
              <button
                onClick={primaryCta.onClick}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl"
                aria-label={primaryCta.text}
              >
                {primaryCta.text}
              </button>
            )}
            {secondaryCta && (
              <button
                onClick={secondaryCta.onClick}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 border-2 border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 text-lg font-semibold"
                aria-label={secondaryCta.text}
              >
                {secondaryCta.text}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
