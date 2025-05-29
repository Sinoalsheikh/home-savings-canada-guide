
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-canadian-navy" />
      <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('en')}
          className={`rounded-none px-3 py-1 text-xs font-medium ${
            language === 'en' 
              ? 'bg-canadian-navy text-white' 
              : 'bg-white text-canadian-navy hover:bg-gray-50'
          }`}
        >
          EN
        </Button>
        <Button
          variant={language === 'fr' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('fr')}
          className={`rounded-none px-3 py-1 text-xs font-medium ${
            language === 'fr' 
              ? 'bg-canadian-navy text-white' 
              : 'bg-white text-canadian-navy hover:bg-gray-50'
          }`}
        >
          FR
        </Button>
      </div>
    </div>
  );
};

export default LanguageToggle;
