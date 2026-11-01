import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ui';
import HomePage from './pages/home/HomePage';
import ScreeningPage from './pages/screening/ScreeningPage';
import InterventionsPage from './pages/interventions/InterventionsPage';
import ResearchPage from './pages/research/ResearchPage';
import UnderstandDyslexiaPage from './pages/understand/UnderstandDyslexiaPage';
import UnderstandDetailPage from './pages/understand/UnderstandDetailPage';
import NotFoundPage from './pages/not-found/NotFoundPage';
import TrainingDashboardPage from './pages/training/TrainingDashboardPage';
import TrainingSessionPage from './pages/training/TrainingSessionPage';
import TrainingHistoryPage from './pages/training/TrainingHistoryPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          {/* Navigation */}
          <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dyslexia Grand Hub
                </Link>
                <div className="flex items-center space-x-4">
                  <Link to="/" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                    Home
                  </Link>
                  <Link to="/understand" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                    Understand Dyslexia
                  </Link>
                  <Link to="/screening" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                    Screening
                  </Link>
                  <Link to="/training" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                    Training
                  </Link>
                  <Link to="/research" className="px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">
                    Research
                  </Link>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/understand" element={<UnderstandDyslexiaPage />} />
            <Route path="/understand/:sectionId" element={<UnderstandDetailPage />} />
            <Route path="/screening" element={<ScreeningPage />} />
            <Route path="/training" element={<TrainingDashboardPage />} />
            <Route path="/training/session/:moduleId" element={<TrainingSessionPage />} />
            <Route path="/training/history" element={<TrainingHistoryPage />} />
            <Route path="/interventions" element={<Navigate to="/training" replace />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>

          {/* Footer */}
          <footer className="bg-gray-800 dark:bg-gray-900 text-white py-12 mt-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Dyslexia Grand Hub</h3>
                  <p className="text-gray-400 text-sm">
                    Evidence-based support for dyslexia, built on rigorous research and scientific literature.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Resources</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><Link to="/understand" className="hover:text-white transition-colors">Understand Dyslexia</Link></li>
                    <li><Link to="/screening" className="hover:text-white transition-colors">Screening Tools</Link></li>
                    <li><Link to="/training" className="hover:text-white transition-colors">Training & Interventions</Link></li>
                    <li><Link to="/research" className="hover:text-white transition-colors">Research Database</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">About</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Our Methodology</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Research Sources</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="mailto:info@dyslexiahub.org" className="hover:text-white transition-colors">info@dyslexiahub.org</a></li>
                    <li className="hover:text-white transition-colors">Research Inquiries</li>
                    <li className="hover:text-white transition-colors">Feedback</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-8 text-center">
                <p className="text-base text-gray-400">
                  Dyslexia Grand Hub - Evidence-based support for dyslexia
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  © 2026 | Built with research-backed knowledge | 460 papers | 335 verified claims
                </p>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
