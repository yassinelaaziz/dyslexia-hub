import React from 'react';

interface InterventionFilterProps {
  categories: { id: string; name: string }[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedTier: string | null;
  onTierChange: (tier: string | null) => void;
}

/**
 * Filter component for interventions
 * Allows filtering by category and evidence tier
 */
export const InterventionFilter: React.FC<InterventionFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedTier,
  onTierChange
}) => {
  const tiers = [
    { id: 'established', name: 'Established' },
    { id: 'emerging', name: 'Emerging' },
    { id: 'experimental', name: 'Experimental' }
  ];

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Filter By</h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={selectedCategory || ''}
          onChange={(e) => onCategoryChange(e.target.value || null)}
          className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Evidence Tier
        </label>
        <select
          value={selectedTier || ''}
          onChange={(e) => onTierChange(e.target.value || null)}
          className="w-full p-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by evidence tier"
        >
          <option value="">All Tiers</option>
          {tiers.map((tier) => (
            <option key={tier.id} value={tier.id}>
              {tier.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          onCategoryChange(null);
          onTierChange(null);
        }}
        className="mt-4 w-full p-3 text-base bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Clear all filters"
      >
        Clear Filters
      </button>
    </div>
  );
};
