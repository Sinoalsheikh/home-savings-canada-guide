
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'fr';
  setLanguage: (lang: 'en' | 'fr') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'site.title': 'Smart Home Savings',
    'site.subtitle': 'Your Trusted Canadian Partner for Energy Efficiency',
    'site.tagline': 'Save Money, Reduce Your Carbon Footprint',
    'nav.home': 'Home',
    'nav.assessment': 'Assessment',
    'nav.contact': 'Contact',
    
    // Welcome Section
    'welcome.title': 'Unlock Energy Rebates Across Canada',
    'welcome.description': 'Discover thousands in government rebates available for your home. Our AI-powered assessment connects you with federal, provincial, and local incentives.',
    'welcome.cta': 'Start Your Free Assessment',
    'welcome.trusted': 'Trusted by 50,000+ Canadian homeowners',
    
    // Features
    'features.rebates.title': 'Comprehensive Rebate Matching',
    'features.rebates.description': 'Access federal, provincial, and municipal rebates worth up to $40,000',
    'features.savings.title': 'Personalized Savings Analysis',
    'features.savings.description': 'Get detailed cost projections based on your climate zone and home',
    'features.support.title': '100% Canadian Support',
    'features.support.description': 'Bilingual support team and certified contractor network',
    
    // Assessment
    'assessment.title': 'Energy Efficiency Assessment',
    'assessment.progress': 'Progress',
    'assessment.step': 'Step',
    'assessment.of': 'of',
    'assessment.next': 'Next',
    'assessment.previous': 'Previous',
    'assessment.save': 'Save & Continue Later',
    
    // Questions
    'question.postal.title': 'What\'s your postal code?',
    'question.postal.help': 'We use this to find rebates available in your area',
    'question.property.title': 'What type of property do you live in?',
    'question.heating.title': 'What\'s your primary heating system?',
    'question.age.title': 'When was your home built?',
    
    // Contact
    'contact.title': 'Get Your Personalized Results',
    'contact.subtitle': 'Enter your details to receive your rebate analysis and connect with certified professionals',
    'contact.name': 'Full Name',
    'contact.email': 'Email Address',
    'contact.phone': 'Phone Number',
    'contact.privacy': 'I consent to receive information about energy efficiency programs',
    'contact.canadian': 'Data Stored in Canada',
    'contact.pipeda': 'PIPEDA Compliant',
    'contact.submit': 'Get My Results',
    
    // Trust Signals
    'trust.energystar': 'ENERGY STAR Canada Partner',
    'trust.nrcan': 'Natural Resources Canada',
    'trust.secure': 'Secure & Private'
  },
  fr: {
    // Header
    'site.title': 'Smart Home Savings',
    'site.subtitle': 'Votre Partenaire Canadien de Confiance en Efficacité Énergétique',
    'site.tagline': 'Économisez, Réduisez Votre Empreinte Carbone',
    'nav.home': 'Accueil',
    'nav.assessment': 'Évaluation',
    'nav.contact': 'Contact',
    
    // Welcome Section
    'welcome.title': 'Débloquez les Rabais Énergétiques au Canada',
    'welcome.description': 'Découvrez des milliers de dollars en rabais gouvernementaux disponibles pour votre maison. Notre évaluation alimentée par IA vous connecte aux incitatifs fédéraux, provinciaux et locaux.',
    'welcome.cta': 'Commencer Votre Évaluation Gratuite',
    'welcome.trusted': 'Approuvé par plus de 50 000 propriétaires canadiens',
    
    // Features
    'features.rebates.title': 'Jumelage Complet de Rabais',
    'features.rebates.description': 'Accédez aux rabais fédéraux, provinciaux et municipaux valant jusqu\'à 40 000 $',
    'features.savings.title': 'Analyse Personnalisée des Économies',
    'features.savings.description': 'Obtenez des projections de coûts détaillées basées sur votre zone climatique',
    'features.support.title': 'Support 100% Canadien',
    'features.support.description': 'Équipe de support bilingue et réseau d\'entrepreneurs certifiés',
    
    // Assessment
    'assessment.title': 'Évaluation de l\'Efficacité Énergétique',
    'assessment.progress': 'Progrès',
    'assessment.step': 'Étape',
    'assessment.of': 'de',
    'assessment.next': 'Suivant',
    'assessment.previous': 'Précédent',
    'assessment.save': 'Sauvegarder et Continuer Plus Tard',
    
    // Questions
    'question.postal.title': 'Quel est votre code postal?',
    'question.postal.help': 'Nous utilisons ceci pour trouver les rabais disponibles dans votre région',
    'question.property.title': 'Dans quel type de propriété habitez-vous?',
    'question.heating.title': 'Quel est votre système de chauffage principal?',
    'question.age.title': 'Quand votre maison a-t-elle été construite?',
    
    // Contact
    'contact.title': 'Obtenez Vos Résultats Personnalisés',
    'contact.subtitle': 'Entrez vos détails pour recevoir votre analyse de rabais et vous connecter avec des professionnels certifiés',
    'contact.name': 'Nom Complet',
    'contact.email': 'Adresse Courriel',
    'contact.phone': 'Numéro de Téléphone',
    'contact.privacy': 'Je consens à recevoir des informations sur les programmes d\'efficacité énergétique',
    'contact.canadian': 'Données Stockées au Canada',
    'contact.pipeda': 'Conforme PIPEDA',
    'contact.submit': 'Obtenir Mes Résultats',
    
    // Trust Signals
    'trust.energystar': 'Partenaire ENERGY STAR Canada',
    'trust.nrcan': 'Ressources Naturelles Canada',
    'trust.secure': 'Sécurisé et Privé'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'fr'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
