import React, { useState, useEffect } from 'react';

const LoadingPage: React.FC = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const dyslexiaTips = [
    "Dyslexia affects 5-17.5% of the population worldwide",
    "Dyslexia is neurobiological in origin - it's brain-based, not related to intelligence",
    "Early intervention can significantly improve reading outcomes",
    "The brain remains plastic throughout life - intervention works at any age",
    "Dyslexia often runs in families, with heritability estimates of 40-80%",
    "Many successful people have dyslexia, including entrepreneurs, scientists, and artists",
    "Phonological awareness is a key predictor of reading success",
    "Multisensory learning approaches can be particularly effective for dyslexia",
    "Assistive technology can help individuals with dyslexia succeed in school and work",
    "Dyslexia is different in every language - orthographic depth matters"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % dyslexiaTips.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center max-w-lg">
        {/* Loading Spinner */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🧠</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Loading...
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Preparing your dyslexia resources
        </p>

        {/* Dyslexia Facts */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-8">
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Did you know?
          </p>
          <p className="text-base text-blue-800 dark:text-blue-200 leading-relaxed">
            {dyslexiaTips[currentTip]}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          This should only take a moment...
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
