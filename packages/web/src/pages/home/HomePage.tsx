import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection, FeatureCard, StatisticCard, TestimonialCard, CallToAction } from '../../components/ui';

const HomePage: React.FC = () => {
  const handleScreeningClick = () => {
    window.location.href = '/screening';
  };

  const handleInterventionsClick = () => {
    window.location.href = '/interventions';
  };

  const handleUnderstandClick = () => {
    window.location.href = '/understand';
  };

  const handleResearchClick = () => {
    window.location.href = '/research';
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Dyslexia Grand Hub"
        subtitle="Evidence-Based Support for Reading Success"
        description="Comprehensive, research-backed resources for understanding, screening, and addressing dyslexia. Built on 460 research papers and 335 verified claims from leading scientific literature."
        primaryCta={{
          text: "Start Screening",
          onClick: handleScreeningClick
        }}
        secondaryCta={{
          text: "Explore Interventions",
          onClick: handleInterventionsClick
        }}
      />

      {/* Feature Cards Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Explore Our Resources
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Comprehensive tools and information based on the latest dyslexia research
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon="🧠"
              title="Understand Dyslexia"
              description="Learn about the science, causes, and manifestations of dyslexia through evidence-based content"
              color="blue"
              onClick={handleUnderstandClick}
            />
            <FeatureCard
              icon="📋"
              title="Screening Tools"
              description="Assess dyslexia risk and severity with validated screening instruments"
              color="green"
              onClick={handleScreeningClick}
            />
            <FeatureCard
              icon="🎯"
              title="Interventions"
              description="Explore 25+ evidence-based interventions with detailed implementation guides"
              color="purple"
              onClick={handleInterventionsClick}
            />
            <FeatureCard
              icon="🔬"
              title="Research Database"
              description="Access 460 research papers and 335 verified claims from scientific literature"
              color="orange"
              onClick={handleResearchClick}
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Built on Rigorous Research
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Our content is systematically reviewed and verified from peer-reviewed literature
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatisticCard
              value="460"
              label="Research Papers"
              description="Systematically reviewed across 7 research phases"
              icon="📚"
              color="blue"
            />
            <StatisticCard
              value="335"
              label="Verified Claims"
              description="Evidence-based findings with source citations"
              icon="✓"
              color="green"
            />
            <StatisticCard
              value="7"
              label="Research Phases"
              description="Comprehensive coverage from foundations to methodology"
              icon="🔬"
              color="purple"
            />
            <StatisticCard
              value="25+"
              label="Interventions"
              description="Evidence-based approaches with detailed guides"
              icon="🎯"
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            A systematic approach to understanding and addressing dyslexia
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-blue-600 dark:text-blue-300">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Understand</h3>
              <p className="text-gray-600 dark:text-gray-300">Learn about dyslexia through evidence-based content</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-green-600 dark:text-green-300">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Screen</h3>
              <p className="text-gray-600 dark:text-gray-300">Assess risk and severity with validated tools</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-purple-600 dark:text-purple-300">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Intervene</h3>
              <p className="text-gray-600 dark:text-gray-300">Choose evidence-based interventions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-orange-600 dark:text-orange-300">
                4
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Monitor</h3>
              <p className="text-gray-600 dark:text-gray-300">Track progress and adjust approaches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            What Users Say
          </h2>
          <p className="text-lg text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Feedback from educators, parents, and professionals
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The evidence-based approach gives me confidence in the interventions I recommend. The research backing is invaluable."
              author="Dr. Sarah Chen"
              role="Educational Psychologist"
              rating={5}
            />
            <TestimonialCard
              quote="Finally, a resource that brings together rigorous research with practical tools. The screening tool helped identify my son's needs early."
              author="Michael Rodriguez"
              role="Parent"
              rating={5}
            />
            <TestimonialCard
              quote="As a special education teacher, I use this hub daily. The intervention guides are clear and the evidence summaries help me explain approaches to parents."
              author="Emily Thompson"
              role="Special Education Teacher"
              rating={4}
            />
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <CallToAction
        title="Ready to Get Started?"
        description="Begin your journey with evidence-based dyslexia support. Start with our screening tool or explore our comprehensive intervention library."
        primaryButton={{
          text: "Start Screening",
          onClick: handleScreeningClick
        }}
        secondaryButton={{
          text: "Explore Interventions",
          onClick: handleInterventionsClick
        }}
        backgroundColor="blue"
      />

      {/* Important Disclaimer */}
      <section className="py-8 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
              ⚠️ Important Disclaimer
            </h3>
            <p className="text-base text-amber-800 dark:text-amber-200 leading-relaxed">
              This platform provides educational information and screening tools only. Screening results are not a medical diagnosis.
              Dyslexia diagnosis requires comprehensive evaluation by qualified professionals (psychologists, educational diagnosticians, or physicians).
              Always consult with healthcare and educational professionals for diagnosis and intervention planning.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
