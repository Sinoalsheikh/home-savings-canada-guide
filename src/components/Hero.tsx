
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface HeroProps {
  onStartAssessment: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartAssessment }) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-canadian-navy via-blue-800 to-canadian-green">
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-canadian-green rounded-lg flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold">{t('site.title')}</h1>
          </div>
        </div>
        <LanguageToggle />
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
            <MapPin className="h-4 w-4 text-canadian-green" />
            <span className="text-white text-sm font-medium">🍁 {t('site.subtitle')}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t('welcome.title')}
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('welcome.description')}
          </p>

          {/* CTA Button */}
          <Button
            onClick={onStartAssessment}
            size="lg"
            className="bg-canadian-green hover:bg-emerald-600 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 mb-8"
          >
            {t('welcome.cta')} →
          </Button>

          {/* Trust Signal */}
          <div className="flex items-center justify-center space-x-2 text-blue-200">
            <Users className="h-5 w-5" />
            <span className="text-sm">{t('welcome.trusted')}</span>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="relative z-10 -mt-16">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-canadian-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-canadian-green" />
                </div>
                <h3 className="text-xl font-semibold text-canadian-navy mb-2">
                  {t('features.rebates.title')}
                </h3>
                <p className="text-gray-600">{t('features.rebates.description')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-canadian-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-canadian-green" />
                </div>
                <h3 className="text-xl font-semibold text-canadian-navy mb-2">
                  {t('features.savings.title')}
                </h3>
                <p className="text-gray-600">{t('features.savings.description')}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-canadian-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-canadian-green" />
                </div>
                <h3 className="text-xl font-semibold text-canadian-navy mb-2">
                  {t('features.support.title')}
                </h3>
                <p className="text-gray-600">{t('features.support.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12"></div>
      </div>
    </div>
  );
};

export default Hero;
