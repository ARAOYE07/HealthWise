import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShieldAlert, AlertTriangle, Info, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { AssessmentResult } from '../types';

export const Results: React.FC = () => {
  const location = useLocation();
  const result = location.state?.result as AssessmentResult;

  if (!result) {
    return <Navigate to="/dashboard" replace />;
  }

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'EMERGENCY':
        return {
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: ShieldAlert,
          title: 'Seek emergency medical assistance immediately.',
          iconColor: 'text-red-600'
        };
      case 'URGENT':
        return {
          color: 'text-orange-700',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          icon: AlertTriangle,
          title: 'Seek medical attention promptly.',
          iconColor: 'text-orange-600'
        };
      case 'MODERATE':
        return {
          color: 'text-amber-800',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: Info,
          title: 'Consider speaking with a healthcare professional.',
          iconColor: 'text-amber-600'
        };
      case 'LOW':
      default:
        return {
          color: 'text-emerald-800',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          icon: CheckCircle2,
          title: 'General wellness information may be appropriate.',
          iconColor: 'text-emerald-600'
        };
    }
  };

  const severityConfig = getSeverityConfig(result.severity);
  const SeverityIcon = severityConfig.icon;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
        <div className="text-sm text-gray-500">
          Generated on {new Date(result.created_at || new Date()).toLocaleDateString()}
        </div>
      </div>

      {/* Emergency/Safety Warning */}
      {(result.severity === 'EMERGENCY' || result.severity === 'URGENT') && (
        <div className={`rounded-2xl p-6 border ${severityConfig.border} ${severityConfig.bg}`}>
          <div className="flex items-start">
            <SeverityIcon className={`h-8 w-8 ${severityConfig.iconColor} mr-4 flex-shrink-0`} />
            <div>
              <h2 className={`text-xl font-bold ${severityConfig.color} mb-2`}>Safety Warning</h2>
              <p className={`text-lg font-medium ${severityConfig.color}`}>
                Some information you've provided may require prompt medical attention. {severityConfig.title}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <Card>
        <CardContent className="p-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Summary</h2>
          <p className="text-xl font-medium text-gray-900 leading-relaxed">
            {result.summary}
          </p>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>What It Could Mean</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed text-lg">
            {result.explanation}
          </p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Healthy Practices</CardTitle>
        </CardHeader>
        <CardContent>
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

      {/* Action / Disclaimer */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between border-t border-gray-200 pt-8 mt-12">
        <div className="text-sm text-gray-500 max-w-lg">
          <span className="font-semibold text-gray-700 block mb-1">Medical Disclaimer</span>
          This information is for educational purposes and does not replace professional medical advice, diagnosis, or treatment.
        </div>
        <div className="flex gap-4">
          <Link to="/assessment">
            <Button variant="outline">New Assessment</Button>
          </Link>
          <Link to="/topics">
            <Button>Explore Topics <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </div>

    </div>
  );
};
