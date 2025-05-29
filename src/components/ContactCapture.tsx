import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Shield, Lock, Award, Phone, Mail, User, CheckCircle, Star, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  sanitizeInput, 
  validateEmail, 
  validateCanadianPhone, 
  checkRateLimit, 
  trackConsent 
} from '@/utils/security';

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
  const [errors, setErrors] = useState<Partial<ContactData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);

  const validateField = (field: keyof ContactData, value: string | boolean): string | null => {
    switch (field) {
      case 'name':
        const nameStr = value as string;
        if (!nameStr || nameStr.trim().length < 2) {
          return 'Name must be at least 2 characters long';
        }
        if (nameStr.length > 100) {
          return 'Name must be less than 100 characters';
        }
        if (!/^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(nameStr)) {
          return 'Name contains invalid characters';
        }
        return null;
      
      case 'email':
        const emailStr = value as string;
        if (!emailStr || !validateEmail(emailStr)) {
          return 'Please enter a valid email address';
        }
        return null;
      
      case 'phone':
        const phoneStr = value as string;
        if (!phoneStr || !validateCanadianPhone(phoneStr)) {
          return 'Please enter a valid Canadian phone number (10 digits)';
        }
        return null;
      
      case 'consent':
        if (!value) {
          return 'You must agree to the privacy policy to continue';
        }
        return null;
      
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkRateLimit()) {
      setRateLimitExceeded(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Validate all fields
    const newErrors: Partial<ContactData> = {};
    let hasErrors = false;
    
    Object.keys(formData).forEach(key => {
      const field = key as keyof ContactData;
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });
    
    setErrors(newErrors);
    
    if (!hasErrors) {
      // Track consent
      trackConsent('contact-form-submission');
      
      // Sanitize data before submission
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        phone: sanitizeInput(formData.phone),
        consent: formData.consent
      };
      
      onSubmit(sanitizedData);
    }
    
    setIsSubmitting(false);
  };

  const handleInputChange = (field: keyof ContactData, value: string | boolean) => {
    // Sanitize string inputs
    const sanitizedValue = typeof value === 'string' ? sanitizeInput(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
    
    // Real-time validation for better UX
    const error = validateField(field, sanitizedValue);
    if (error) {
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  };

  const isEmailValid = validateEmail(formData.email);
  const isPhoneValid = validateCanadianPhone(formData.phone);
  const isNameValid = formData.name.trim().length >= 2 && /^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(formData.name);

  const isFormValid = () => {
    return isNameValid && isEmailValid && isPhoneValid && formData.consent && Object.keys(errors).length === 0;
  };

  if (rateLimitExceeded) {
    return (
      <Card className="p-10 bg-white shadow-2xl border-0 rounded-3xl">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600">Too Many Attempts</h2>
          <p className="text-gray-600">
            For security reasons, please wait 15 minutes before submitting the form again.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="scale-in">
      <Card className="p-10 bg-white shadow-2xl border-0 rounded-3xl overflow-hidden relative">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-canadian-green/3 via-transparent to-blue-500/3"></div>
        
        <div className="space-y-8 relative z-10">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-canadian-green to-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-canadian-navy">
              {t('contact.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('contact.subtitle')}
            </p>
          </div>

          {/* Trust Signals */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-2xl border border-blue-100">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 text-center md:text-left">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-canadian-navy">{t('contact.canadian')}</p>
                  <p className="text-sm text-gray-600">Secure servers</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-center md:text-left">
                <div className="w-12 h-12 bg-canadian-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-canadian-green" />
                </div>
                <div>
                  <p className="font-semibold text-canadian-navy">{t('contact.pipeda')}</p>
                  <p className="text-sm text-gray-600">Privacy protected</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-center md:text-left">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="font-semibold text-canadian-navy">SSL Secured</p>
                  <p className="text-sm text-gray-600">Bank-level encryption</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="relative">
                <Label htmlFor="name" className="text-lg font-semibold text-canadian-navy flex items-center space-x-2 mb-3">
                  <User className="h-5 w-5" />
                  <span>{t('contact.name')}</span>
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`text-lg py-4 px-5 border-2 rounded-xl transition-all ${
                      errors.name
                        ? 'border-red-400 bg-red-50/50'
                        : isNameValid && formData.name.length > 0
                        ? 'border-canadian-green bg-green-50/50' 
                        : 'border-gray-200 focus:border-canadian-green'
                    }`}
                    maxLength={100}
                    required
                  />
                  {isNameValid && formData.name.length > 0 && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-canadian-green" />
                  )}
                </div>
                {errors.name && (
                  <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="email" className="text-lg font-semibold text-canadian-navy flex items-center space-x-2 mb-3">
                  <Mail className="h-5 w-5" />
                  <span>{t('contact.email')}</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`text-lg py-4 px-5 border-2 rounded-xl transition-all ${
                      errors.email
                        ? 'border-red-400 bg-red-50/50'
                        : isEmailValid && formData.email.length > 0
                        ? 'border-canadian-green bg-green-50/50' 
                        : 'border-gray-200 focus:border-canadian-green'
                    }`}
                    maxLength={254}
                    required
                  />
                  {isEmailValid && formData.email.length > 0 && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-canadian-green" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="phone" className="text-lg font-semibold text-canadian-navy flex items-center space-x-2 mb-3">
                  <Phone className="h-5 w-5" />
                  <span>{t('contact.phone')}</span>
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(xxx) xxx-xxxx"
                    className={`text-lg py-4 px-5 border-2 rounded-xl transition-all ${
                      errors.phone
                        ? 'border-red-400 bg-red-50/50'
                        : isPhoneValid && formData.phone.length > 0
                        ? 'border-canadian-green bg-green-50/50' 
                        : 'border-gray-200 focus:border-canadian-green'
                    }`}
                    maxLength={15}
                    required
                  />
                  {isPhoneValid && formData.phone.length > 0 && (
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-canadian-green" />
                  )}
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-2 flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Enhanced Consent */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <div className="flex items-start space-x-4">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => handleInputChange('consent', checked === true)}
                  className="mt-1 data-[state=checked]:bg-canadian-green data-[state=checked]:border-canadian-green"
                />
                <div className="flex-1">
                  <Label htmlFor="consent" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                    {t('contact.privacy')}
                  </Label>
                  <p className="text-xs text-gray-500 mt-2">
                    🍁 Your information stays in Canada and is never sold to third parties. 
                    Data is encrypted and automatically deleted after 7 days unless you opt-in for follow-up.
                  </p>
                  {errors.consent && (
                    <p className="text-red-600 text-xs mt-2 flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>{errors.consent}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="w-full bg-gradient-to-r from-canadian-green to-emerald-500 hover:from-emerald-600 hover:to-emerald-700 text-white py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-canadian-green/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <span className="flex items-center justify-center space-x-3">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-6 w-6" />
                    <span>{t('contact.submit')}</span>
                    <span>→</span>
                  </>
                )}
              </span>
            </Button>

            {/* Progress Indicator */}
            <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
              <div className="flex space-x-1">
                {[1,2,3,4].map((step) => (
                  <div 
                    key={step}
                    className={`w-2 h-2 rounded-full ${
                      step <= (Object.values(formData).filter(v => v && v !== false).length)
                        ? 'bg-canadian-green' 
                        : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
              <span>Form completion</span>
            </div>
          </form>

          {/* Social Proof */}
          <div className="text-center pt-6 border-t border-gray-100">
            <div className="flex justify-center items-center space-x-1 mb-2">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-sm text-gray-600">
              🍁 Trusted by 50,000+ Canadian homeowners • 4.9/5 rating
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContactCapture;
