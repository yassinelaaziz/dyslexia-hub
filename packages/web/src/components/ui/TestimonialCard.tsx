import React from 'react';

export interface TestimonialCardProps {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  avatar,
  rating
}) => {
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xl ${i < count ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        aria-label={i < count ? 'Filled star' : 'Empty star'}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
      {rating && (
        <div className="flex mb-4" aria-label={`Rating: ${rating} out of 5 stars`}>
          {renderStars(rating)}
        </div>
      )}
      <blockquote className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6 italic">
        "{quote}"
      </blockquote>
      <div className="flex items-center">
        {avatar && (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
            {author.charAt(0)}
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900 dark:text-white text-base">
            {author}
          </div>
          {role && (
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              {role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
