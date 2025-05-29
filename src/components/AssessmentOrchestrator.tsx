import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Save, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import QuestionRenderer from './QuestionRenderer';
import ContactCapture from './ContactCapture';
import { 
  encryptData, 
  decryptData, 
  validateCanadianPostalCode, 
  sanitizeInput,
  secureDataCleanup 
} from '@/utils/security';

interface AssessmentData {
  postalCode: string;
  propertyType: string;
  heatingSystem: string;
  homeAge: string;
  homeSize: string;
  occupancy: string;
  currentBills: string;
  insulationLevel: string;
  windowType: string;
  waterHeater: string;
  ventilationSystem: string;
  mainGoal: string;
  timeline: string;
  budget: string;
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
    homeAge: '',
    homeSize: '',
    occupancy: '',
    currentBills: '',
    insulationLevel: '',
    windowType: '',
    waterHeater: '',
    ventilationSystem: '',
    mainGoal: '',
    timeline: '',
    budget: ''
  });

  // Load saved progress on mount
  useEffect(() => {
    const loadSavedProgress = async () => {
      try {
        const savedData = localStorage.getItem('smartHomeSavingsAssessment');
        if (savedData) {
          const decryptedData = await decryptData(savedData);
          if (decryptedData && decryptedData.data) {
            setAssessmentData(decryptedData.data);
            setCurrentStep(decryptedData.step || 0);
          }
        }
      } catch (error) {
        // If decryption fails, clear corrupted data
        localStorage.removeItem('smartHomeSavingsAssessment');
      }
    };
    
    loadSavedProgress();
    
    // Cleanup on unmount
    return () => {
      // Optional: Clear sensitive data when component unmounts
      // secureDataCleanup();
    };
  }, []);

  const questions = [
    {
      id: 'postalCode',
      type: 'text' as const,
      title: t('question.postal.title'),
      help: t('question.postal.help'),
      placeholder: 'K1A 0A6',
      validation: (value: string) => validateCanadianPostalCode(value)
    },
    {
      id: 'propertyType',
      type: 'select' as const,
      title: 'What type of home do you live in?',
      help: 'This helps us identify the most relevant rebates and energy efficiency measures for your property type.',
      options: [
        { value: 'detached', label: 'Detached House / Maison Détachée' },
        { value: 'semi', label: 'Semi-detached / Jumelée' },
        { value: 'townhouse', label: 'Townhouse / Maison en Rangée' },
        { value: 'condo', label: 'Condominium / Copropriété' },
        { value: 'apartment', label: 'Apartment / Appartement' },
        { value: 'duplex', label: 'Duplex' },
        { value: 'mobile', label: 'Mobile Home / Maison Mobile' }
      ]
    },
    {
      id: 'homeSize',
      type: 'select' as const,
      title: 'What is the approximate size of your home?',
      help: 'Home size affects heating costs and potential savings from efficiency upgrades.',
      options: [
        { value: 'small', label: 'Under 1,000 sq ft / Moins de 93 m²' },
        { value: 'medium', label: '1,000-1,999 sq ft / 93-186 m²' },
        { value: 'large', label: '2,000-2,999 sq ft / 186-279 m²' },
        { value: 'xlarge', label: '3,000+ sq ft / 279+ m²' }
      ]
    },
    {
      id: 'heatingSystem',
      type: 'select' as const,
      title: t('question.heating.title'),
      help: 'Your heating system is a key factor in determining rebate eligibility, especially for heat pump incentives.',
      options: [
        { value: 'gas', label: 'Natural Gas Furnace / Fournaise au Gaz Naturel' },
        { value: 'electric', label: 'Electric Baseboard / Plinthes Électriques' },
        { value: 'oil', label: 'Oil Furnace / Fournaise au Mazout' },
        { value: 'propane', label: 'Propane Furnace / Fournaise au Propane' },
        { value: 'wood', label: 'Wood Stove / Poêle à Bois' },
        { value: 'heatpump', label: 'Heat Pump / Thermopompe' },
        { value: 'electric-furnace', label: 'Electric Furnace / Fournaise Électrique' },
        { value: 'geothermal', label: 'Geothermal / Géothermique' },
        { value: 'other', label: 'Other / Autre' }
      ]
    },
    {
      id: 'homeAge',
      type: 'select' as const,
      title: t('question.age.title'),
      help: 'Home age helps determine insulation standards and potential for deep energy retrofits.',
      options: [
        { value: 'new', label: '2015 or newer / 2015 ou plus récent' },
        { value: 'recent', label: '2000-2014' },
        { value: 'modern', label: '1990-1999' },
        { value: 'established', label: '1970-1989' },
        { value: 'mature', label: '1950-1969' },
        { value: 'heritage', label: 'Before 1950 / Avant 1950' }
      ]
    },
    {
      id: 'occupancy',
      type: 'select' as const,
      title: 'How many people live in your home?',
      help: 'Household size affects energy consumption patterns and some rebate calculations.',
      options: [
        { value: '1', label: '1 person / 1 personne' },
        { value: '2', label: '2 people / 2 personnes' },
        { value: '3-4', label: '3-4 people / 3-4 personnes' },
        { value: '5+', label: '5+ people / 5+ personnes' }
      ]
    },
    {
      id: 'currentBills',
      type: 'select' as const,
      title: 'What are your approximate monthly energy bills?',
      help: 'This helps us calculate potential savings and payback periods for efficiency upgrades.',
      options: [
        { value: 'low', label: 'Under $100 / Moins de 100 $' },
        { value: 'medium', label: '$100-200 / 100-200 $' },
        { value: 'high', label: '$200-300 / 200-300 $' },
        { value: 'very-high', label: 'Over $300 / Plus de 300 $' }
      ]
    },
    {
      id: 'insulationLevel',
      type: 'select' as const,
      title: 'How would you rate your home\'s insulation?',
      help: 'Insulation quality affects heating costs and rebate opportunities.',
      options: [
        { value: 'excellent', label: 'Excellent - Recently upgraded' },
        { value: 'good', label: 'Good - Adequate for climate' },
        { value: 'fair', label: 'Fair - Some cold spots/drafts' },
        { value: 'poor', label: 'Poor - Very drafty/cold areas' },
        { value: 'unknown', label: 'Not sure / Je ne sais pas' }
      ]
    },
    {
      id: 'windowType',
      type: 'select' as const,
      title: 'What type of windows do you have?',
      help: 'Window efficiency impacts heating costs and rebate eligibility.',
      options: [
        { value: 'triple', label: 'Triple-pane / Triple vitrage' },
        { value: 'double-new', label: 'Double-pane (newer) / Double vitrage (récent)' },
        { value: 'double-old', label: 'Double-pane (older) / Double vitrage (ancien)' },
        { value: 'single', label: 'Single-pane / Simple vitrage' },
        { value: 'mixed', label: 'Mixed types / Types mixtes' }
      ]
    },
    {
      id: 'waterHeater',
      type: 'select' as const,
      title: 'What type of water heater do you have?',
      help: 'Water heating rebates are available for high-efficiency models.',
      options: [
        { value: 'gas-tank', label: 'Gas Tank / Réservoir au Gaz' },
        { value: 'electric-tank', label: 'Electric Tank / Réservoir Électrique' },
        { value: 'gas-tankless', label: 'Gas Tankless / Sans Réservoir au Gaz' },
        { value: 'electric-tankless', label: 'Electric Tankless / Sans Réservoir Électrique' },
        { value: 'heat-pump-wh', label: 'Heat Pump Water Heater / Chauffe-eau Thermopompe' },
        { value: 'solar', label: 'Solar / Solaire' },
        { value: 'unknown', label: 'Not sure / Je ne sais pas' }
      ]
    },
    {
      id: 'mainGoal',
      type: 'select' as const,
      title: 'What is your main goal for home energy improvements?',
      help: 'This helps us prioritize the most relevant recommendations for you.',
      options: [
        { value: 'bills', label: 'Reduce energy bills / Réduire les factures' },
        { value: 'comfort', label: 'Improve comfort / Améliorer le confort' },
        { value: 'environment', label: 'Environmental impact / Impact environnemental' },
        { value: 'value', label: 'Increase home value / Augmenter la valeur' },
        { value: 'rebates', label: 'Maximize rebates / Maximiser les rabais' },
        { value: 'all', label: 'All of the above / Tout ce qui précède' }
      ]
    },
    {
      id: 'timeline',
      type: 'select' as const,
      title: 'When are you planning to make improvements?',
      help: 'Some rebates have deadlines or limited funding periods.',
      options: [
        { value: 'immediate', label: 'Within 3 months / Dans les 3 mois' },
        { value: 'soon', label: '3-6 months / 3-6 mois' },
        { value: 'year', label: 'Within a year / Dans l\'année' },
        { value: 'exploring', label: 'Just exploring / J\'explore seulement' }
      ]
    },
    {
      id: 'budget',
      type: 'select' as const,
      title: 'What is your approximate budget for energy improvements?',
      help: 'This helps us recommend upgrades that fit your financial situation.',
      options: [
        { value: 'low', label: 'Under $5,000 / Moins de 5 000 $' },
        { value: 'medium', label: '$5,000-15,000 / 5 000-15 000 $' },
        { value: 'high', label: '$15,000-30,000 / 15 000-30 000 $' },
        { value: 'premium', label: 'Over $30,000 / Plus de 30 000 $' },
        { value: 'flexible', label: 'Depends on rebates / Selon les rabais' }
      ]
    }
  ];

  const totalSteps = questions.length + 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleAnswerChange = (questionId: string, value: string) => {
    // Sanitize input
    const sanitizedValue = sanitizeInput(value);
    
    setAssessmentData(prev => ({
      ...prev,
      [questionId]: sanitizedValue
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(questions.length);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSave = async () => {
    try {
      const dataToSave = {
        data: assessmentData,
        step: currentStep,
        timestamp: new Date().toISOString()
      };
      
      const encryptedData = await encryptData(dataToSave);
      localStorage.setItem('smartHomeSavingsAssessment', encryptedData);
      
      // Show success feedback (could use toast in production)
      console.log('Progress saved securely!');
    } catch (error) {
      console.error('Failed to save progress:', error);
      // Fallback to unencrypted storage for critical user experience
      localStorage.setItem('smartHomeSavingsAssessment', JSON.stringify({
        data: assessmentData,
        step: currentStep,
        timestamp: new Date().toISOString()
      }));
    }
  };

  const handleContactSubmit = (contactData: any) => {
    const completeData = { ...assessmentData, ...contactData };
    
    // Clear saved progress after successful submission
    localStorage.removeItem('smartHomeSavingsAssessment');
    
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

  const completedSteps = Object.values(assessmentData).filter(value => value.trim() !== '').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-canadian-green to-emerald-400 rounded-xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-canadian-navy">
                  {t('assessment.title')}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>~2 minutes remaining</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>{completedSteps} questions completed</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className="flex items-center space-x-2 hover:bg-canadian-green/5 border-canadian-green/20"
            >
              <Save className="h-4 w-4" />
              <span>{t('assessment.save')}</span>
            </Button>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className="font-medium">{t('assessment.progress')}</span>
              <span className="font-bold text-canadian-green">{Math.round(progress)}% Complete</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 bg-gray-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-canadian-green to-emerald-400 rounded-full" 
                   style={{ width: `${progress}%` }}></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Started</span>
              <span>{currentStep < questions.length ? 'Assessment' : 'Contact Info'}</span>
              <span>Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="fade-in">
            {currentStep < questions.length ? (
              <QuestionRenderer
                question={questions[currentStep]}
                value={assessmentData[questions[currentStep].id]}
                onChange={(value) => handleAnswerChange(questions[currentStep].id, value)}
              />
            ) : (
              <ContactCapture onSubmit={handleContactSubmit} />
            )}
          </div>

          {/* Enhanced Navigation */}
          <div className="flex justify-between items-center mt-10 pt-8 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-50"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>{t('assessment.previous')}</span>
            </Button>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Step {currentStep + 1} of {totalSteps}</span>
            </div>

            {currentStep < questions.length && (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-2 bg-gradient-to-r from-canadian-green to-emerald-500 hover:from-emerald-600 hover:to-emerald-700 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
              >
                <span>{t('assessment.next')}</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentOrchestrator;
