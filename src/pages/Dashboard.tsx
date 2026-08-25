import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Stethoscope, Lightbulb, Clock, User, ArrowRight, ShieldAlert, CheckCircle2, Activity } from 'lucide-react';
import { healthService } from '../services/healthService';
import { AssessmentResult } from '../types';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [recentHistory, setRecentHistory] = useState<AssessmentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (profile?.id) {
        try {
          const history = await healthService.getHistory(profile.id);
          setRecentHistory(history.slice(0, 3)); // Just show recent 3
        } catch (error) {
          console.error('Failed to load history', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchDashboardData();
  }, [profile]);

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Good morning, {firstName}</h1>
        <p className="mt-2 text-gray-500">Here's an overview of your health and wellness journey.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link to="/assessment" className="block group">
          <Card className="h-full border-emerald-100 bg-emerald-50 hover:bg-emerald-100/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-3 bg-emerald-100 rounded-full text-emerald-600 group-hover:scale-110 transition-transform">
                <Stethoscope className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">Get Health Advice</h3>
                <p className="text-sm text-emerald-700 mt-1">Check symptoms or ask questions</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/tips" className="block group">
          <Card className="h-full hover:border-emerald-200 transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-3 bg-sky-100 rounded-full text-sky-600 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Health Tips</h3>
                <p className="text-sm text-gray-500 mt-1">Daily wellness practices</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/history" className="block group">
          <Card className="h-full hover:border-emerald-200 transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-3 bg-amber-100 rounded-full text-amber-600 group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My History</h3>
                <p className="text-sm text-gray-500 mt-1">Review past advice</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        
        <Link to="/profile" className="block group">
          <Card className="h-full hover:border-emerald-200 transition-colors cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600 group-hover:scale-110 transition-transform">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-500 mt-1">Update your information</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Advice */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Consultations</h2>
            <Link to="/history" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <Card>
              <CardContent className="p-8 flex justify-center">
                <Activity className="h-6 w-6 text-emerald-500 animate-pulse" />
              </CardContent>
            </Card>
          ) : recentHistory.length > 0 ? (
            <div className="space-y-4">
              {recentHistory.map((item) => (
                <Card key={item.id} className="hover:border-emerald-100 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="mt-2 text-lg font-medium text-gray-900 truncate max-w-md">{item.concern}</h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.summary}</p>
                      </div>
                      <Link to={`/results/${item.id}`}>
                        <Button variant="ghost" size="sm">View details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 mb-4">
                  <Stethoscope className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No recent advice</h3>
                <p className="mt-1 text-gray-500">You haven't requested any health advice yet.</p>
                <div className="mt-6">
                  <Link to="/assessment">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Health Goals</CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.health_goals && profile.health_goals.length > 0 ? (
                <ul className="space-y-3">
                  {profile.health_goals.map((goal, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-4">You haven't set any specific health goals yet.</p>
                  <Link to="/profile">
                    <Button variant="outline" size="sm">Update Profile</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-2xl bg-amber-50 p-6 border border-amber-100">
            <div className="flex items-start">
              <ShieldAlert className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-amber-900">Medical Disclaimer</h3>
                <p className="mt-2 text-xs text-amber-700 leading-relaxed">
                  HealthWise is an educational tool. It does not provide medical diagnoses, treatment, or prescribe medication. Always consult a healthcare professional for medical concerns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
