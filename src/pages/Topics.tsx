import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Apple, Brain, Moon, Heart, Activity, Leaf, Shield, Flame } from 'lucide-react';

const topics = [
  { name: 'Nutrition', icon: Apple, color: 'text-red-500', bg: 'bg-red-50', count: 24 },
  { name: 'Fitness & Exercise', icon: Activity, color: 'text-orange-500', bg: 'bg-orange-50', count: 18 },
  { name: 'Sleep Hygiene', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50', count: 12 },
  { name: 'Heart Health', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', count: 15 },
  { name: 'Mental Wellness', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-50', count: 32 },
  { name: 'Healthy Habits', icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-50', count: 19 },
  { name: 'Preventive Care', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50', count: 11 },
  { name: 'Stress Management', icon: Flame, color: 'text-amber-500', bg: 'bg-amber-50', count: 22 },
];

export const Topics: React.FC = () => {
  return (
    <div className="space-y-8 py-8 md:py-0">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Health Topics</h1>
        <p className="mt-2 text-lg text-gray-500">Explore our library of evidence-based wellness information and educational resources.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topics.map((topic) => (
          <Card key={topic.name} className="hover:shadow-md transition-all cursor-pointer group hover:border-emerald-200">
            <CardContent className="p-6">
              <div className={`inline-flex p-3 rounded-xl ${topic.bg} ${topic.color} mb-4 group-hover:scale-110 transition-transform`}>
                <topic.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{topic.name}</h3>
              <p className="text-sm text-gray-500">{topic.count} Articles</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 relative">
                <img 
                  src={`https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600&h=400&sig=${i}`} 
                  alt="Wellness" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Nutrition</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">The Science of Hydration</h3>
                <p className="text-sm text-gray-500 line-clamp-2">Discover how optimal water intake affects your cognitive function, physical performance, and overall wellbeing.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
