import React, { useState, useEffect } from 'react';
import { InterventionCard, InterventionFilter, InterventionGuide, EfficacyRating } from '../../components/interventions';
import TrainingExercise from '../../components/interventions/TrainingExercise';
import interventionsData from '../../data/interventions.json';
import trainingExercisesData from '../../data/training-exercises.json';

interface Intervention {
  id: string;
  name: string;
  category: string;
  description: string;
  evidenceTier: 'established' | 'emerging' | 'experimental';
  efficacyRating: number;
  ageGroups: string[];
  duration: string;
  frequency: string;
  difficultyLevel: string;
  costConsiderations: string;
  timeCommitmentDetails: string;
  ageSpecificRecommendations: string;
  successRates: string;
  contraindications: string;
  researchEvidenceSummary: string;
  source: {
    title: string;
    authors: string;
    year: number;
    journal: string;
    doi: string;
    confidence: number;
  };
  guide: {
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  notes: string;
}

const InterventionsPage: React.FC = () => {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [trainingMode, setTrainingMode] = useState<boolean>(false);

  useEffect(() => {
    // Load interventions from JSON data
    setInterventions(interventionsData.interventions as Intervention[]);
  }, []);

  // Filter interventions based on selected filters and search query
  const filteredInterventions = interventions.filter((intervention) => {
    const matchesCategory = !selectedCategory || intervention.category === selectedCategory;
    const matchesTier = !selectedTier || intervention.evidenceTier === selectedTier;
    const matchesSearch =
      !searchQuery ||
      intervention.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intervention.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesTier && matchesSearch;
  });

  const categories = interventionsData.categories;

  const handleBackToList = () => {
    setSelectedIntervention(null);
    setTrainingMode(false);
  };

  const handleStartTraining = () => {
    setTrainingMode(true);
  };

  const handleBackToDetail = () => {
    setTrainingMode(false);
  };

  // Detail view
  if (selectedIntervention) {
    // Training mode
    if (trainingMode) {
      const trainingData = trainingExercisesData.exercises[selectedIntervention.id as keyof typeof trainingExercisesData.exercises] as any;
      if (trainingData) {
        return (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button
              onClick={handleBackToDetail}
              className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Back to intervention details"
            >
              ← Back to Details
            </button>

            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {trainingData.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {trainingData.description}
              </p>
            </div>

            <TrainingExercise
              interventionId={selectedIntervention.id}
              trainingData={trainingData}
              onComplete={(score) => {
                console.log('Training complete with score:', score);
              }}
            />
          </div>
        );
      } else {
        return (
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button
              onClick={handleBackToDetail}
              className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Back to intervention details"
            >
              ← Back to Details
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Training Not Available</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Interactive training exercises are not yet available for this intervention.
              </p>
            </div>
          </div>
        );
      }
    }

    // Details mode
    const hasTraining = (selectedIntervention.id as keyof typeof trainingExercisesData.exercises) in trainingExercisesData.exercises;

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={handleBackToList}
          className="mb-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Back to intervention list"
        >
          ← Back to List
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {selectedIntervention.name}
          </h1>

          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {selectedIntervention.description}
          </p>

          <div className="mb-6">
            <EfficacyRating
              rating={selectedIntervention.efficacyRating}
              evidenceTier={selectedIntervention.evidenceTier}
              size="large"
            />
          </div>

          {hasTraining && (
            <div className="mb-6">
              <button
                onClick={handleStartTraining}
                className="w-full px-6 py-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-semibold"
                aria-label="Start interactive training exercises"
              >
                🎯 Start Training Exercises
              </button>
              <p className="text-sm text-gray-600 mt-2 text-center">
                Practice this intervention with interactive exercises
              </p>
            </div>
          )}

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Evidence Source
            </h3>
            <p className="text-base text-gray-700 dark:text-gray-300">
              <strong>{selectedIntervention.source.authors}</strong> ({selectedIntervention.source.year}). {selectedIntervention.source.title}. <em>{selectedIntervention.source.journal}</em>.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              DOI: <a href={`https://doi.org/${selectedIntervention.source.doi}`} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                {selectedIntervention.source.doi}
              </a>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Confidence: {(selectedIntervention.source.confidence * 100).toFixed(0)}%
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Implementation Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-gray-700 dark:text-gray-300">
              <div>
                <span className="font-medium">Category:</span> {selectedIntervention.category}
              </div>
              <div>
                <span className="font-medium">Difficulty:</span> {selectedIntervention.difficultyLevel}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {selectedIntervention.duration}
              </div>
              <div>
                <span className="font-medium">Frequency:</span> {selectedIntervention.frequency}
              </div>
              <div>
                <span className="font-medium">Age Groups:</span> {selectedIntervention.ageGroups.join(', ')}
              </div>
              <div>
                <span className="font-medium">Time Commitment:</span> {selectedIntervention.timeCommitmentDetails}
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Cost Considerations
            </h3>
            <p className="text-base text-blue-800 dark:text-blue-200">
              {selectedIntervention.costConsiderations}
            </p>
          </div>

          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
              Success Rates
            </h3>
            <p className="text-base text-green-800 dark:text-green-200">
              {selectedIntervention.successRates}
            </p>
          </div>

          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Age-Specific Recommendations
            </h3>
            <p className="text-base text-purple-800 dark:text-purple-200">
              {selectedIntervention.ageSpecificRecommendations}
            </p>
          </div>

          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
              Contraindications & Considerations
            </h3>
            <p className="text-base text-red-800 dark:text-red-200">
              {selectedIntervention.contraindications}
            </p>
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Research Evidence Summary
            </h3>
            <p className="text-base text-gray-700 dark:text-gray-300">
              {selectedIntervention.researchEvidenceSummary}
            </p>
          </div>

          <InterventionGuide steps={selectedIntervention.guide.steps} />

          {selectedIntervention.notes && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
              <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Important Notes
              </h3>
              <p className="text-base text-amber-800 dark:text-amber-200">
                {selectedIntervention.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Intervention Explorer
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Explore evidence-based interventions for dyslexia
      </p>

      <div className="flex gap-6">
        {/* Filter sidebar */}
        <aside className="w-64 flex-shrink-0">
          <InterventionFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedTier={selectedTier}
            onTierChange={setSelectedTier}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Search bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search interventions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search interventions"
            />
          </div>

          {/* Results count */}
          <p className="text-base text-gray-600 dark:text-gray-300 mb-4">
            Showing {filteredInterventions.length} intervention{filteredInterventions.length !== 1 ? 's' : ''}
          </p>

          {/* Intervention cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInterventions.map((intervention) => (
              <InterventionCard
                key={intervention.id}
                intervention={intervention}
                onClick={() => setSelectedIntervention(intervention)}
              />
            ))}
          </div>

          {filteredInterventions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                No interventions match your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedTier(null);
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default InterventionsPage;
