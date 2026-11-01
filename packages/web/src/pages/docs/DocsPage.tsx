import React, { useState } from 'react';

const docs = [
  { id: 'index', title: 'Documentation Index', file: 'index.html' },
  { id: 'architecture', title: 'Architecture', file: 'architecture.html' },
  { id: 'api-specification', title: 'API Specification', file: 'api-specification.html' },
  { id: 'component-library', title: 'Component Library', file: 'component-library.html' },
  { id: 'database-schema', title: 'Database Schema', file: 'database-schema.html' },
  { id: 'deployment-plan', title: 'Deployment Plan', file: 'deployment-plan.html' },
  { id: 'development-plan', title: 'Development Plan', file: 'development-plan.html' },
  { id: 'maintenance-plan', title: 'Maintenance Plan', file: 'maintenance-plan.html' },
  { id: 'monitoring-plan', title: 'Monitoring Plan', file: 'monitoring-plan.html' },
  { id: 'monorepo-structure', title: 'Monorepo Structure', file: 'monorepo-structure.html' },
  { id: 'technical-specification', title: 'Technical Specification', file: 'technical-specification.html' },
  { id: 'testing-strategy', title: 'Testing Strategy', file: 'testing-strategy.html' },
  { id: 'training-system', title: 'Training System', file: 'training-system.html' },
  { id: 'user-journeys', title: 'User Journeys', file: 'user-journeys.html' },
  { id: 'wireframes', title: 'Wireframes', file: 'wireframes.html' },
];

const DocsPage: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState(docs[0]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Documentation
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documents
              </h2>
              <ul className="space-y-2">
                {docs.map((doc) => (
                  <li key={doc.id}>
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        selectedDoc.id === doc.id
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {doc.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedDoc.title}
                </h2>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <iframe
                  src={`/docs/${selectedDoc.file}`}
                  title={selectedDoc.title}
                  className="w-full h-[70vh] border-0"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
