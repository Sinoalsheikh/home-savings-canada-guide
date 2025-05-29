
import React from 'react';
import { Shield, Lock, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const TrustBadges = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap justify-center items-center gap-6 py-6">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Award className="h-5 w-5 text-canadian-green" />
        <span>{t('trust.energystar')}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Shield className="h-5 w-5 text-canadian-green" />
        <span>{t('trust.nrcan')}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Lock className="h-5 w-5 text-canadian-green" />
        <span>{t('trust.secure')}</span>
      </div>
    </div>
  );
};

export default TrustBadges;
