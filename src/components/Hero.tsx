
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, Users, Zap, Shield, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

interface HeroProps {
  onStartAssessment: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartAssessment }) => {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-canadian-navy via-blue-800 to-canadian-green overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-96 h-96 bg-canadian-green/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-canadian-green to-emerald-400 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
          <div className="text-white">
            <h1 className="text-xl font-bold tracking-tight">{t('site.title')}</h1>
            <p className="text-xs text-blue-200 opacity-90">🍁 Certified Canadian Partner</p>
          </div>
        </div>
        <LanguageToggle />
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Enhanced Badge */}
          <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 mb-8 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-canadian-green animate-pulse" />
              <span className="text-white text-sm font-medium">🍁 {t('site.subtitle')}</span>
            </div>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4 text-blue-200" />
              <span className="text-blue-200 text-xs">PIPEDA Compliant</span>
            </div>
          </div>

          {/* Enhanced Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              {t('welcome.title')}
            </span>
          </h1>

          {/* Value Proposition */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-canadian-green">$40K+</div>
              <div className="text-sm text-blue-200">Max Rebates</div>
            </div>
            <div className="w-1 h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-canadian-green">50K+</div>
              <div className="text-sm text-blue-200">Homeowners</div>
            </div>
            <div className="w-1 h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-canadian-green">2 Min</div>
              <div className="text-sm text-blue-200">Assessment</div>
            </div>
          </div>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-4xl mx-auto leading-relaxed">
            {t('welcome.description')}
          </p>

          {/* Enhanced CTA */}
          <div className="space-y-4">
            <Button
              onClick={onStartAssessment}
              size="lg"
              className="bg-gradient-to-r from-canadian-green to-emerald-500 hover:from-emerald-600 hover:to-emerald-700 text-white px-12 py-6 text-xl font-semibold rounded-xl shadow-2xl hover:shadow-canadian-green/25 transform hover:scale-105 transition-all duration-300 border-2 border-emerald-400/20"
            >
              <Zap className="h-6 w-6 mr-3" />
              {t('welcome.cta')} →
            </Button>
            <div className="flex items-center justify-center space-x-6 text-blue-200 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Free Assessment</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-300"></div>
                <span>No Obligations</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-600"></div>
                <span>Instant Results</span>
              </div>
            </div>
          </div>

          {/* Trust Signal */}
          <div className="flex items-center justify-center space-x-3 text-blue-200 mt-8">
            <Users className="h-5 w-5" />
            <span className="text-sm">{t('welcome.trusted')}</span>
            <Award className="h-4 w-4 text-canadian-green ml-2" />
          </div>
        </div>
      </div>

      {/* Enhanced Features Preview */}
      <div className="relative z-10 -mt-20">
        <div className="container mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-white/20">
            <div className="grid md:grid-cols-3 gap-10">
              <div className="text-center group hover:bg-canadian-green/5 p-6 rounded-2xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-canadian-green/10 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <TrendingUp className="h-10 w-10 text-canadian-green" />
                </div>
                <h3 className="text-2xl font-bold text-canadian-navy mb-3">
                  {t('features.rebates.title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">{t('features.rebates.description')}</p>
                <div className="mt-4 inline-flex items-center text-canadian-green font-semibold">
                  <span className="text-sm">Learn More</span>
                  <span className="ml-1">→</span>
                </div>
              </div>
              
              <div className="text-center group hover:bg-blue-50 p-6 rounded-2xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <MapPin className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-canadian-navy mb-3">
                  {t('features.savings.title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">{t('features.savings.description')}</p>
                <div className="mt-4 inline-flex items-center text-blue-600 font-semibold">
                  <span className="text-sm">Learn More</span>
                  <span className="ml-1">→</span>
                </div>
              </div>
              
              <div className="text-center group hover:bg-purple-50 p-6 rounded-2xl transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-canadian-navy mb-3">
                  {t('features.support.title')}
                </h3>
                <p className="text-gray-600 leading-relaxed">{t('features.support.description')}</p>
                <div className="mt-4 inline-flex items-center text-purple-600 font-semibold">
                  <span className="text-sm">Learn More</span>
                  <span className="ml-1">→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 right-20 opacity-20">
          <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
        </div>
        <div className="absolute bottom-40 left-20 opacity-20">
          <div className="w-2 h-2 bg-canadian-green rounded-full animate-ping delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
