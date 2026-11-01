import React from 'react';

export interface CallToActionProps {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    onClick: () => void;
    link?: string;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
    link?: string;
  };
  backgroundColor?: 'blue' | 'green' | 'purple' | 'gray';
}

const backgroundStyles = {
  blue: 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900',
  green: 'bg-gradient-to-r from-green-600 to-green-700 dark:from-green-800 dark:to-green-900',
  purple: 'bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-800 dark:to-purple-900',
  gray: 'bg-gradient-to-r from-gray-700 to-gray-800 dark:from-gray-800 dark:to-gray-900'
};

export const CallToAction: React.FC<CallToActionProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  backgroundColor = 'blue'
}) => {
  const bgStyle = backgroundStyles[backgroundColor];

  const handlePrimaryClick = () => {
    if (primaryButton.onClick) {
      primaryButton.onClick();
    } else if (primaryButton.link) {
      window.location.href = primaryButton.link;
    }
  };

  const handleSecondaryClick = () => {
    if (secondaryButton?.onClick) {
      secondaryButton.onClick();
    } else if (secondaryButton?.link) {
      window.location.href = secondaryButton.link;
    }
  };

  return (
    <section className={`${bgStyle} py-16`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-blue-100 dark:text-blue-200 mb-8 leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handlePrimaryClick}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-white transition-all duration-200 text-lg font-semibold shadow-lg"
              aria-label={primaryButton.text}
            >
              {primaryButton.text}
            </button>
            {secondaryButton && (
              <button
                onClick={handleSecondaryClick}
                className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg hover:bg-white hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-white transition-all duration-200 text-lg font-semibold"
                aria-label={secondaryButton.text}
              >
                {secondaryButton.text}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
