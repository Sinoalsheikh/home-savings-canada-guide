
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Shield, Lock, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactData {
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

interface ContactCaptureProps {
  onSubmit: (data: ContactData) => void;
}

const ContactCapture: React.FC<ContactCaptureProps> = ({ onSubmit }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ContactData>({
    name: '',
    email: '',
    phone: '',
    consent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData);
    }
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.email.includes('@') && 
           formData.phone.trim() !== '' && 
           formData.consent;
  };

  const handleInputChange = (field: keyof ContactData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="p-8 bg-white shadow-lg border-0 rounded-xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-canadian-navy mb-2">
            {t('contact.title')}
          </h2>
          <p className="text-gray-600">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Trust Signals */}
        <div className="flex justify-center items-center space-x-6 py-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Lock className="h-4 w-4 text-canadian-green" />
            <span>{t('contact.canadian')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="h-4 w-4 text-canadian-green" />
            <span>{t('contact.pipeda')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Award className="h-4 w-4 text-canadian-green" />
            <span>SSL Secured</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-base font-medium text-canadian-navy">
              {t('contact.name')}
            </Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="mt-2 text-base py-3 border-2 border-gray-200 focus:border-canadian-green rounded-lg"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-medium text-canadian-navy">
              {t('contact.email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-2 text-base py-3 border-2 border-gray-200 focus:border-canadian-green rounded-lg"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-base font-medium text-canadian-navy">
              {t('contact.phone')}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(xxx) xxx-xxxx"
              className="mt-2 text-base py-3 border-2 border-gray-200 focus:border-canadian-green rounded-lg"
              required
            />
          </div>

          {/* Consent */}
          <div className="flex items-start space-x-3 py-4">
            <Checkbox
              id="consent"
              checked={formData.consent}
              onCheckedChange={(checked) => handleInputChange('consent', checked === true)}
              className="mt-1"
            />
            <Label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
              {t('contact.privacy')}
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid()}
            className="w-full bg-canadian-green hover:bg-emerald-600 text-white py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {t('contact.submit')} →
          </Button>
        </form>

        {/* Additional Trust Signals */}
        <div className="text-center text-xs text-gray-500 pt-4 border-t">
          <p>🍁 Proudly Canadian • 100% Secure • PIPEDA Compliant</p>
        </div>
      </div>
    </Card>
  );
};

export default ContactCapture;
