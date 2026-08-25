import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Textarea } from '../components/ui/Textarea';
import { healthService } from '../services/healthService';
import { AssessmentData, AssessmentResult } from '../types';
import { Activity, Sparkles, Send, ShieldAlert, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const Assessment: React.FC = () => {
  const { profile } = useAuth();
  const [concern, setConcern] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const handleSubmit = async () => {
    if (!profile?.id || !concern.trim()) return;
    
    setIsSubmitting(true);
    try {
      const dataToSubmit: AssessmentData = {
        concern,
        category: 'General Search', // Defaulting since we removed category step
        age: profile.age,
      };
      const aiResponse = await healthService.processAssessment(dataToSubmit);
      const saved = await healthService.saveAssessmentResult(profile.id, dataToSubmit, aiResponse);
      
      setResult(saved);
    } catch (error) {
      console.error('Submission failed', error);
      // In a real app, handle error UI here
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setConcern('');
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'EMERGENCY':
        return { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: ShieldAlert, iconColor: 'text-red-600', title: 'Seek emergency medical assistance immediately.' };
      case 'URGENT':
        return { color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle, iconColor: 'text-orange-600', title: 'Seek medical attention promptly.' };
      case 'MODERATE':
        return { color: 'text-amber-800', bg: 'bg-amber-50', border: 'border-amber-200', icon: Info, iconColor: 'text-amber-600', title: 'Consider speaking with a healthcare professional.' };
      case 'LOW':
      default:
        return { color: 'text-emerald-800', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-600', title: 'General wellness information may be appropriate.' };
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {!result ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">How are you feeling today?</h1>
            <p className="text-gray-500 text-lg">Describe your health status, symptoms, or any wellness questions you have, and get instant, personalized guidance.</p>
          </div>
          
          <Card className="border-emerald-100 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Textarea 
                placeholder="e.g., I've been having mild headaches for the past two days and feeling a bit more tired than usual..."
                className="min-h-[160px] text-lg border-none focus-visible:ring-0 px-0 resize-none"
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
              />
              
              <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Sparkles className="h-4 w-4 mr-2 text-emerald-500" />
                  AI-powered wellness analysis
                </div>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!concern.trim() || isSubmitting}
                  className="gap-2 rounded-full px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Activity className="h-4 w-4 animate-spin" /> Analyzing...
                    </>
                  ) : (
                    <>
                      Get Advice <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-start bg-gray-50 p-4 rounded-xl text-sm text-gray-500">
            <Info className="h-5 w-5 mr-3 flex-shrink-0 text-gray-400" />
            <p>Your inputs are analyzed to provide general educational information. This service is not a substitute for professional medical diagnosis or treatment.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Wellness Insights</h2>
            <Button variant="outline" size="sm" onClick={resetForm}>
              Ask another question
            </Button>
          </div>

          {/* User's Input Reflection */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">You asked about</h3>
            <p className="text-gray-900 text-lg italic">"{result.concern}"</p>
          </div>

          {/* Safety Warning */}
          {(result.severity === 'EMERGENCY' || result.severity === 'URGENT') && (
            (() => {
              const config = getSeverityConfig(result.severity);
              const Icon = config.icon;
              return (
                <div className={`rounded-2xl p-6 border ${config.border} ${config.bg}`}>
                  <div className="flex items-start">
                    <Icon className={`h-8 w-8 ${config.iconColor} mr-4 flex-shrink-0`} />
                    <div>
                      <h2 className={`text-xl font-bold ${config.color} mb-2`}>Safety Warning</h2>
                      <p className={`text-lg font-medium ${config.color}`}>
                        Some information you've provided may require prompt medical attention. {config.title}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          {/* Core Insights */}
          <div className="grid gap-6">
            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Summary</h3>
                <p className="text-xl font-medium text-gray-900 leading-relaxed">
                  {result.summary}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-2">
                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">What It Could Mean</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {result.explanation}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Recommended Healthy Practices</h3>
                <ul className="space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-6 w-6 text-emerald-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
