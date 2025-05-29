
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Leaf, Download } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import TrustBadges from './TrustBadges';

interface ResultsProps {
  data: any;
  onReset: () => void;
}

const Results: React.FC<ResultsProps> = ({ data, onReset }) => {
  const { t } = useLanguage();

  // Mock calculations based on assessment data
  const estimatedRebates = (() => {
    let total = 0;
    if (data.heatingSystem === 'oil') total += 15000; // Heat pump incentive
    if (data.homeAge === 'heritage') total += 5000; // Deep retrofits
    if (data.propertyType === 'detached') total += 3000; // Insulation
    return Math.max(total, 8000); // Minimum baseline
  })();

  const annualSavings = Math.round(estimatedRebates * 0.15); // Rough 15% annual savings
  const carbonReduction = Math.round(estimatedRebates / 100); // Rough estimation

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-canadian-navy to-canadian-green text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            🎉 Your Personalized Energy Efficiency Report
          </h1>
          <p className="text-lg opacity-90">
            Based on your {data.propertyType} home in {data.postalCode}
          </p>
        </div>
      </div>

      {/* Results Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center bg-white shadow-lg rounded-xl">
              <div className="w-16 h-16 bg-canadian-green/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-canadian-green" />
              </div>
              <h3 className="text-2xl font-bold text-canadian-navy mb-2">
                ${estimatedRebates.toLocaleString()}
              </h3>
              <p className="text-gray-600">Available Rebates</p>
            </Card>

            <Card className="p-6 text-center bg-white shadow-lg rounded-xl">
              <div className="w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-canadian-navy mb-2">
                ${annualSavings}
              </h3>
              <p className="text-gray-600">Annual Savings</p>
            </Card>

            <Card className="p-6 text-center bg-white shadow-lg rounded-xl">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-canadian-navy mb-2">
                {carbonReduction} tons
              </h3>
              <p className="text-gray-600">CO₂ Reduction/Year</p>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-8 bg-white shadow-lg rounded-xl">
            <h2 className="text-2xl font-bold text-canadian-navy mb-6">
              Recommended Upgrades for Your Home
            </h2>
            
            <div className="space-y-4">
              {data.heatingSystem === 'oil' && (
                <div className="flex items-start space-x-4 p-4 bg-canadian-green/5 rounded-lg">
                  <div className="w-2 h-2 bg-canadian-green rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-canadian-navy">Heat Pump Installation</h3>
                    <p className="text-gray-600">Replace your oil heating with an efficient heat pump. Up to $15,000 in rebates available.</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-canadian-navy">Insulation Upgrade</h3>
                  <p className="text-gray-600">Improve your home's thermal envelope. Rebates up to $3,000 available.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-emerald-50 rounded-lg">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-canadian-navy">Windows & Doors</h3>
                  <p className="text-gray-600">Energy-efficient windows can save 10-15% on energy bills.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-8 bg-gradient-to-r from-canadian-navy to-blue-800 text-white rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 opacity-90">
              A certified energy advisor will contact you within 24 hours to discuss your options and help you access these rebates.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-canadian-green hover:bg-emerald-600 text-white">
                <Download className="h-4 w-4 mr-2" />
                Download Full Report
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-canadian-navy">
                Book Consultation
              </Button>
              <Button variant="outline" onClick={onReset} className="text-white border-white hover:bg-white hover:text-canadian-navy">
                Start New Assessment
              </Button>
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
