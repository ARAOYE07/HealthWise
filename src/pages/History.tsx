import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { healthService } from '../services/healthService';
import { AssessmentResult } from '../types';
import { Activity, Clock, ChevronRight, Search, Filter } from 'lucide-react';

export const History: React.FC = () => {
  const { profile } = useAuth();
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (profile?.id) {
        try {
          const data = await healthService.getHistory(profile.id);
          setHistory(data);
        } catch (error) {
          console.error('Failed to load history', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchHistory();
  }, [profile]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Health Advice</h1>
          <p className="mt-2 text-gray-500">Review your past consultations and personalized guidance.</p>
        </div>
        <Link to="/assessment">
          <Button>New Consultation</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Activity className="h-8 w-8 text-emerald-500 animate-pulse" />
        </div>
      ) : history.length > 0 ? (
        <div className="grid gap-4">
          {history.map((item) => (
            <Link key={item.id} to={`/results`} state={{ result: item }}>
              <Card className="hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group">
                <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                        {item.category}
                      </span>
                      <span className="flex items-center text-xs text-gray-500">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      {item.severity === 'URGENT' || item.severity === 'EMERGENCY' ? (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                          Important
                        </span>
                      ) : null}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {item.concern.length > 80 ? item.concern.substring(0, 80) + '...' : item.concern}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{item.summary}</p>
                  </div>
                  <div className="hidden sm:flex shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm mb-4">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No history yet</h3>
            <p className="mt-2 text-gray-500 max-w-sm mx-auto">
              Your previous health consultations will appear here. Start a new assessment to get personalized wellness guidance.
            </p>
            <div className="mt-8">
              <Link to="/assessment">
                <Button>Get Health Advice</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
