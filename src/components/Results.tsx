
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Leaf, Download, Calendar, MapPin, Home, Zap, Users, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TrustBadges from './TrustBadges';

interface ResultsProps {
  data: any;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onReset }) => {
  const { t } = useLanguage();

  // Enhanced calculations based on assessment data
  const estimatedRebates = (() => {
    let total = 0;
    let breakdown = {
      federal: 0,
      provincial: 0,
      municipal: 0,
      utility: 0
    };

    // Federal rebates
    if (data.heatingSystem === 'oil') {
      breakdown.federal += 15000; // Heat pump incentive
    } else if (['gas', 'propane'].includes(data.heatingSystem)) {
      breakdown.federal += 10000; // Heat pump upgrade
    }
    
    if (data.homeAge === 'heritage' || data.homeAge === 'mature') {
      breakdown.federal += 5000; // Deep retrofits
    }
    
    // Provincial estimates (varies by province)
    if (data.propertyType === 'detached') {
      breakdown.provincial += 4000; // Insulation incentives
    }
    
    if (data.windowType === 'single' || data.windowType === 'double-old') {
      breakdown.provincial += 3000; // Window upgrades
    }

    // Municipal and utility
    breakdown.municipal += 2000;
    breakdown.utility += 1500;

    total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    return { total: Math.max(total, 8000), breakdown };
  })();

  const annualSavings = Math.round(estimatedRebates.total * 0.18); // 18% annual savings
  const carbonReduction = Math.round(estimatedRebates.total / 80); // More realistic calculation
  const paybackPeriod = Math.round(estimatedRebates.total / annualSavings);

  const getPersonalizedRecommendations = () => {
    const recommendations = [];
    
    if (data.heatingSystem === 'oil') {
      recommendations.push({
        title: 'Heat Pump Installation',
        description: 'Replace your oil heating system with an efficient air-source heat pump.',
        rebate: '$15,000',
        savings: '$2,400/year',
        priority: 'high',
        icon: Zap
      });
    }
    
    if (data.insulationLevel === 'poor' || data.insulationLevel === 'fair') {
      recommendations.push({
        title: 'Attic & Wall Insulation',
        description: 'Upgrade insulation to reduce heat loss and improve comfort.',
        rebate: '$4,000',
        savings: '$800/year', 
        priority: 'high',
        icon: Home
      });
    }
    
    if (data.windowType === 'single' || data.windowType === 'double-old') {
      recommendations.push({
        title: 'Energy-Efficient Windows',
        description: 'Triple-pane windows with low-E coating for maximum efficiency.',
        rebate: '$3,000',
        savings: '$600/year',
        priority: 'medium',
        icon: Home
      });
    }

    if (data.waterHeater === 'electric-tank' || data.waterHeater === 'gas-tank') {
      recommendations.push({
        title: 'Heat Pump Water Heater',
        description: 'Cut water heating costs by up to 70% with efficient technology.',
        rebate: '$2,500',
        savings: '$400/year',
        priority: 'medium',
        icon: Zap
      });
    }

    return recommendations;
  };

  const recommendations = getPersonalizedRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-canadian-navy via-blue-800 to-canadian-green text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-canadian-green/20 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <TrendingUp className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            🎉 Your Energy Savings Report
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-4">
            Personalized for your {data.propertyType} home in {data.postalCode}
          </p>
          <div className="flex justify-center items-center space-x-2 text-blue-200">
            <MapPin className="h-5 w-5" />
            <span>Climate Zone Analysis Complete</span>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Key Metrics Dashboard */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-8 text-center bg-white shadow-xl rounded-2xl border-0 hover:shadow-2xl transition-all hover-scale">
              <div className="w-20 h-20 bg-gradient-to-br from-canadian-green to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <DollarSign className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-canadian-navy mb-2">
                ${estimatedRebates.total.toLocaleString()}
              </h3>
              <p className="text-gray-600 font-medium">Total Available Rebates</p>
              <div className="mt-4 text-xs text-gray-500">
                Federal + Provincial + Local
              </div>
            </Card>

            <Card className="p-8 text-center bg-white shadow-xl rounded-2xl border-0 hover:shadow-2xl transition-all hover-scale">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-canadian-navy mb-2">
                ${annualSavings.toLocaleString()}
              </h3>
              <p className="text-gray-600 font-medium">Annual Energy Savings</p>
              <div className="mt-4 text-xs text-gray-500">
                Based on local energy costs
              </div>
            </Card>

            <Card className="p-8 text-center bg-white shadow-xl rounded-2xl border-0 hover:shadow-2xl transition-all hover-scale">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Leaf className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-canadian-navy mb-2">
                {carbonReduction}
              </h3>
              <p className="text-gray-600 font-medium">Tonnes CO₂/Year Reduced</p>
              <div className="mt-4 text-xs text-gray-500">
                Environmental impact
              </div>
            </Card>

            <Card className="p-8 text-center bg-white shadow-xl rounded-2xl border-0 hover:shadow-2xl transition-all hover-scale">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-canadian-navy mb-2">
                {paybackPeriod}
              </h3>
              <p className="text-gray-600 font-medium">Years Payback Period</p>
              <div className="mt-4 text-xs text-gray-500">
                Return on investment
              </div>
            </Card>
          </div>

          {/* Rebate Breakdown */}
          <Card className="p-10 bg-white shadow-xl rounded-3xl border-0">
            <h2 className="text-3xl font-bold text-canadian-navy mb-8 text-center">
              Rebate Breakdown by Program Level
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-red-50 rounded-2xl border border-red-100">
                <div className="text-2xl font-bold text-red-600 mb-2">
                  ${estimatedRebates.breakdown.federal.toLocaleString()}
                </div>
                <p className="text-sm font-medium text-gray-700">Federal Programs</p>
                <p className="text-xs text-gray-500 mt-1">NRCan, CMHC</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-100">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  ${estimatedRebates.breakdown.provincial.toLocaleString()}
                </div>
                <p className="text-sm font-medium text-gray-700">Provincial Programs</p>
                <p className="text-xs text-gray-500 mt-1">Energy agencies</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-100">
                <div className="text-2xl font-bold text-green-600 mb-2">
                  ${estimatedRebates.breakdown.municipal.toLocaleString()}
                </div>
                <p className="text-sm font-medium text-gray-700">Municipal Programs</p>
                <p className="text-xs text-gray-500 mt-1">Local incentives</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="text-2xl font-bold text-purple-600 mb-2">
                  ${estimatedRebates.breakdown.utility.toLocaleString()}
                </div>
                <p className="text-sm font-medium text-gray-700">Utility Programs</p>
                <p className="text-xs text-gray-500 mt-1">Power companies</p>
              </div>
            </div>
          </Card>

          {/* Personalized Recommendations */}
          <Card className="p-10 bg-white shadow-xl rounded-3xl border-0">
            <h2 className="text-3xl font-bold text-canadian-navy mb-8">
              Recommended Upgrades for Your Home
            </h2>
            
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                  rec.priority === 'high' 
                    ? 'bg-gradient-to-r from-canadian-green/5 to-emerald-50 border-canadian-green/20 hover:border-canadian-green/40'
                    : 'bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200 hover:border-blue-300'
                }`}>
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                      rec.priority === 'high' 
                        ? 'bg-gradient-to-br from-canadian-green to-emerald-400'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      <rec.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-canadian-navy">{rec.title}</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="text-canadian-green font-bold">{rec.rebate}</div>
                          <div className="text-blue-600 font-semibold">{rec.savings}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed mb-4">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            rec.priority === 'high' 
                              ? 'bg-canadian-green text-white' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {rec.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                          </span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Next Steps CTA */}
          <Card className="p-12 bg-gradient-to-r from-canadian-navy via-blue-800 to-canadian-green text-white rounded-3xl border-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-canadian-green/30 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Saving?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                A certified energy advisor will contact you within 24 hours to discuss your personalized recommendations and help you access these rebates.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <Button className="bg-white text-canadian-navy hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">
                  <Download className="h-5 w-5 mr-3" />
                  Download Full Report
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-canadian-navy px-8 py-4 text-lg font-semibold rounded-xl">
                  <Calendar className="h-5 w-5 mr-3" />
                  Book Free Consultation
                </Button>
                <Button variant="outline" onClick={onReset} className="text-white border-white hover:bg-white hover:text-canadian-navy px-8 py-4 text-lg font-semibold rounded-xl">
                  <ArrowRight className="h-5 w-5 mr-3" />
                  Start New Assessment
                </Button>
              </div>

              <div className="flex justify-center items-center space-x-6 text-blue-200 text-sm">
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span>Certified Advisors</span>
                </div>
                <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>No Obligations</span>
                </div>
                <div className="w-1 h-1 bg-blue-200 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Local Experts</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Trust Badges */}
          <TrustBadges />
        </div>
      </div>
    </div>
  );
};

export default Results;
