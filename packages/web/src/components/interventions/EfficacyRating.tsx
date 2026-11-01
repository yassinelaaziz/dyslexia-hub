import React from 'react';

interface EfficacyRatingProps {
  rating: number; // 1-5
  evidenceTier: 'established' | 'emerging' | 'experimental';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Visual efficacy rating with evidence tier badge
 * Displays star rating and evidence tier color-coding
 */
export const EfficacyRating: React.FC<EfficacyRatingProps> = ({
  rating,
  evidenceTier,
  size = 'medium'
}) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const tierColors = {
    established: 'bg-green-100 text-green-800 border-green-300',
    emerging: 'bg-amber-100 text-amber-800 border-amber-300',
    experimental: 'bg-orange-100 text-orange-800 border-orange-300'
  };

  const tierLabels = {
    established: 'Established',
    emerging: 'Emerging',
    experimental: 'Experimental'
  };

  // Generate star icons
  const stars = Array.from({ length: 5 }, (_, i) => {
    const isFilled = i < rating;
    return (
      <span
        key={i}
        className={`text-xl ${isFilled ? 'text-yellow-500' : 'text-gray-300'}`}
        aria-hidden="true"
      >
        ★
      </span>
    );
  });

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center"
        role="img"
        aria-label={`Efficacy rating: ${rating} out of 5 stars`}
      >
        {stars}
      </div>
      <span
        className={`px-2 py-1 rounded border text-xs font-medium ${tierColors[evidenceTier]} ${sizeClasses[size]}`}
        role="status"
        aria-live="polite"
      >
        {tierLabels[evidenceTier]}
      </span>
    </div>
  );
};
