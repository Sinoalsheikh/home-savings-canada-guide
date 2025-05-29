
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import QuestionRenderer from './QuestionRenderer';
import ContactCapture from './ContactCapture';

interface AssessmentData {
  postalCode: string;
  propertyType: string;
  heatingSystem: string;
  homeAge: string;
  [key: string]: string;
}

interface AssessmentOrchestratorProps {
  onComplete: (data: AssessmentData) => void;
  onBack: () => void;
}

const AssessmentOrchestrator: React.FC<AssessmentOrchestratorProps> = ({ onComplete, onBack }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    postalCode: '',
    propertyType: '',
    heatingSystem: '',
    homeAge: ''
  });

  const questions = [
    {
      id: 'postalCode',
      type: 'text' as const,
      title: t('question.postal.title'),
      help: t('question.postal.help'),
      placeholder: 'K1A 0A6',
      validation: (value: string) => /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/.test(value)
    },
    {
      id: 'propertyType',
      type: 'select' as const,
      title: t('question.property.title'),
      options: [
        { value: 'detached', label: 'Detached House / Maison Détachée' },
        { value: 'semi', label: 'Semi-detached / Jumelée' },
        { value: 'townhouse', label: 'Townhouse / Maison en Rangée' },
        { value: 'condo', label: 'Condominium / Copropriété' },
        { value: 'apartment', label: 'Apartment / Appartement' }
      ]
    },
    {
      id: 'heatingSystem',
      type: 'select' as const,
      title: t('question.heating.title'),
      options: [
        { value: 'gas', label: 'Natural Gas / Gaz Naturel' },
        { value: 'electric', label: 'Electric / Électrique' },
        { value: 'oil', label: 'Oil / Mazout' },
        { value: 'propane', label: 'Propane' },
        { value: 'wood', label: 'Wood / Bois' },
        { value: 'heatpump', label: 'Heat Pump / Thermopompe' }
      ]
    },
    {
      id: 'homeAge',
      type: 'select' as const,
      title: t('question.age.title'),
      options: [
        { value: 'new', label: '2010 or newer / 2010 ou plus récent' },
        { value: 'modern', label: '1990-2009' },
        { value: 'established', label: '1970-1989' },
        { value: 'mature', label: '1950-1969' },
        { value: 'heritage', label: 'Before 1950 / Avant 1950' }
      ]
    }
  ];

  const totalSteps = questions.length + 1; // +1 for contact capture
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    setAssessmentData(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(questions.length); // Move to contact capture
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSave = () => {
    localStorage.setItem('smartHomeSavingsAssessment', JSON.stringify({
      data: assessmentData,
      step: currentStep,
      timestamp: new Date().toISOString()
    }));
    // Show toast notification here
    console.log('Progress saved!');
  };

  const handleContactSubmit = (contactData: any) => {
    const completeData = { ...assessmentData, ...contactData };
    onComplete(completeData);
  };

  const canProceed = () => {
    if (currentStep >= questions.length) return true;
    const currentQuestion = questions[currentStep];
    const value = assessmentData[currentQuestion.id];
    
    if (currentQuestion.validation) {
      return currentQuestion.validation(value);
    }
    return value.trim() !== '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-canadian-navy">
                {t('assessment.title')}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {t('assessment.step')} {currentStep + 1} {t('assessment.of')} {totalSteps}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{t('assessment.save')}</span>
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{t('assessment.progress')}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {currentStep < questions.length ? (
            <QuestionRenderer
              question={questions[currentStep]}
              value={assessmentData[questions[currentStep].id]}
              onChange={(value) => handleAnswerChange(questions[currentStep].id, value)}
            />
          ) : (
            <ContactCapture onSubmit={handleContactSubmit} />
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{t('assessment.previous')}</span>
            </Button>

            {currentStep < questions.length && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-2 bg-canadian-green hover:bg-emerald-600"
              >
                <span>{t('assessment.next')}</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentOrchestrator;
