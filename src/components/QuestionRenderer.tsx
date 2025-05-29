
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Question {
  id: string;
  type: 'text' | 'select';
  title: string;
  help?: string;
  placeholder?: string;
  options?: { value: string; label: string; }[];
  validation?: (value: string) => boolean;
}

interface QuestionRendererProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, value, onChange }) => {
  const isValid = question.validation ? question.validation(value) : value.trim() !== '';
  const hasValue = value.trim() !== '';

  return (
    <div className="scale-in">
      <Card className="p-10 bg-white shadow-xl border-0 rounded-3xl overflow-hidden relative">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-canadian-green/5 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-tr-full"></div>
        
        <div className="space-y-8 relative z-10">
          {/* Question Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-3">
                <Label className="text-2xl md:text-3xl font-bold text-canadian-navy leading-relaxed block">
                  {question.title}
                </Label>
                
                {question.help && (
                  <div className="flex items-start space-x-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-sm">
                          <p>{question.help}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <p className="text-sm text-blue-700 leading-relaxed">{question.help}</p>
                  </div>
                )}
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center space-x-2 ml-4">
                {hasValue && (
                  <div className="flex items-center space-x-2 text-canadian-green">
                    <CheckCircle className="h-6 w-6" />
                    <span className="text-sm font-medium">Complete</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Question Input */}
          <div className="space-y-4">
            {question.type === 'text' && (
              <div className="relative">
                <Input
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={question.placeholder}
                  className={`text-xl py-6 px-6 border-2 rounded-2xl transition-all duration-200 ${
                    hasValue && isValid 
                      ? 'border-canadian-green bg-green-50/50 focus:border-canadian-green' 
                      : hasValue && !isValid
                      ? 'border-red-400 bg-red-50/50 focus:border-red-400'
                      : 'border-gray-200 focus:border-canadian-green hover:border-gray-300'
                  }`}
                />
                {hasValue && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {isValid ? (
                      <CheckCircle className="h-6 w-6 text-canadian-green" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            )}

            {question.type === 'select' && question.options && (
              <div className="space-y-3">
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger className={`text-xl py-6 px-6 border-2 rounded-2xl transition-all duration-200 ${
                    hasValue 
                      ? 'border-canadian-green bg-green-50/50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <SelectValue placeholder="Choose an option..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-80">
                    {question.options.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-lg py-4 px-6 hover:bg-canadian-green/10 focus:bg-canadian-green/10 rounded-xl mx-2 my-1 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          {value === option.value && (
                            <CheckCircle className="h-5 w-5 text-canadian-green ml-3" />
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* Option Preview */}
                {hasValue && question.options && (
                  <div className="bg-gradient-to-r from-canadian-green/5 to-emerald-50 p-4 rounded-xl border border-canadian-green/20">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-canadian-green flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-canadian-navy">Selected:</p>
                        <p className="text-canadian-green font-semibold">
                          {question.options.find(opt => opt.value === value)?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Validation Feedback */}
            {question.validation && hasValue && !isValid && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  {question.id === 'postalCode' 
                    ? 'Please enter a valid Canadian postal code (e.g., K1A 0A6)'
                    : 'Please enter a valid value'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuestionRenderer;
