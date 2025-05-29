
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
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
  return (
    <Card className="p-8 bg-white shadow-lg border-0 rounded-xl">
      <div className="space-y-6">
        {/* Question Title */}
        <div className="flex items-start space-x-3">
          <div className="flex-1">
            <Label className="text-xl font-semibold text-canadian-navy leading-relaxed">
              {question.title}
            </Label>
            {question.help && (
              <div className="flex items-center space-x-2 mt-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400 hover:text-canadian-navy transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{question.help}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="text-sm text-gray-600">{question.help}</span>
              </div>
            )}
          </div>
        </div>

        {/* Question Input */}
        <div className="space-y-3">
          {question.type === 'text' && (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder}
              className="text-lg py-3 px-4 border-2 border-gray-200 focus:border-canadian-green rounded-lg"
            />
          )}

          {question.type === 'select' && question.options && (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger className="text-lg py-3 px-4 border-2 border-gray-200 focus:border-canadian-green rounded-lg">
                <SelectValue placeholder="Select an option..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-lg">
                {question.options.map((option) => (
                  <SelectItem 
                    key={option.value} 
                    value={option.value}
                    className="text-base py-3 px-4 hover:bg-canadian-green/10 focus:bg-canadian-green/10"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Validation Feedback */}
        {question.validation && value && !question.validation(value) && (
          <p className="text-sm text-red-500 mt-2">
            Please enter a valid {question.id === 'postalCode' ? 'Canadian postal code' : 'value'}
          </p>
        )}
      </div>
    </Card>
  );
};

export default QuestionRenderer;
