import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Edit2, Trash2, Lightbulb, CheckCircle2, Calendar } from 'lucide-react';

const MOCK_TIPS = [
  { id: '1', title: 'Hydration Basics', category: 'Nutrition', status: 'published', author: 'Dr. Smith', date: '2026-08-20' },
  { id: '2', title: '10 Min Daily Stretch', category: 'Exercise', status: 'published', author: 'Emma W.', date: '2026-08-22' },
  { id: '3', title: 'Managing Screen Time', category: 'Mental Wellness', status: 'scheduled', author: 'Dr. Jones', date: '2026-08-28' },
  { id: '4', title: 'Deep Breathing 101', category: 'Stress', status: 'draft', author: 'Sarah J.', date: '-' },
];

export const AdminTips: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Health Tips Management</h1>
          <p className="text-gray-500 text-sm">Create and schedule bite-sized health tips for users.</p>
        </div>
        <Button className="gap-2 bg-sky-600 hover:bg-sky-700">
          <Plus className="h-4 w-4" /> Create Tip
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search tips..." 
                className="pl-9 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 font-medium">Tip Title</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Author</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Publish Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_TIPS.map((tip) => (
                  <tr key={tip.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mr-3">
                          <Lightbulb className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900">{tip.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{tip.category}</td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        tip.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 
                        tip.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {tip.status === 'published' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {tip.status === 'scheduled' && <Calendar className="w-3 h-3 mr-1" />}
                        {tip.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{tip.author}</td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{tip.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button className="text-gray-400 hover:text-sky-600 p-1 rounded-md transition-colors"><Edit2 className="h-4 w-4" /></button>
                         <button className="text-gray-400 hover:text-rose-600 p-1 rounded-md transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
