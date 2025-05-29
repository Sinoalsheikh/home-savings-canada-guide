
import React, { useState } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Hero from '@/components/Hero';
import AssessmentOrchestrator from '@/components/AssessmentOrchestrator';
import Results from '@/components/Results';

type AppState = 'welcome' | 'assessment' | 'results';

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [assessmentData, setAssessmentData] = useState(null);

  const handleStartAssessment = () => {
    setCurrentState('assessment');
  };

  const handleAssessmentComplete = (data: any) => {
    setAssessmentData(data);
    setCurrentState('results');
  };

  const handleBackToWelcome = () => {
    setCurrentState('welcome');
  };

  const handleReset = () => {
    setAssessmentData(null);
    setCurrentState('welcome');
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen">
        {currentState === 'welcome' && (
          <Hero onStartAssessment={handleStartAssessment} />
        )}
        
        {currentState === 'assessment' && (
          <AssessmentOrchestrator 
            onComplete={handleAssessmentComplete}
            onBack={handleBackToWelcome}
          />
        )}
        
        {currentState === 'results' && assessmentData && (
          <Results 
            data={assessmentData}
            onReset={handleReset}
          />
        )}
      </div>
    </LanguageProvider>
  );
};

export default Index;
