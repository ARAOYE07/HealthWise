import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Plus, Edit2, Trash2, Library, CheckCircle2, XCircle } from 'lucide-react';

const MOCK_TOPICS = [
  { id: '1', title: 'Nutrition', status: 'published', updated: '2 days ago', assessments: 1420 },
  { id: '2', title: 'Exercise', status: 'published', updated: '1 week ago', assessments: 980 },
  { id: '3', title: 'Mental Wellness', status: 'published', updated: '3 days ago', assessments: 2150 },
  { id: '4', title: 'Sleep Hygiene', status: 'published', updated: '2 weeks ago', assessments: 840 },
  { id: '5', title: 'Preventive Health', status: 'draft', updated: '1 hour ago', assessments: 0 },
];

export const AdminTopics: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Health Topics</h1>
          <p className="text-gray-500 text-sm">Manage educational health categories and overarching topics.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Topic
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search topics..." 
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
                  <th className="px-6 py-4 font-medium">Topic Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Assessments</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Last Updated</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_TOPICS.map((topic) => (
                  <tr key={topic.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mr-3">
                          <Library className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900">{topic.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        topic.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {topic.status === 'published' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {topic.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {topic.assessments.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{topic.updated}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button className="text-gray-400 hover:text-indigo-600 p-1 rounded-md transition-colors"><Edit2 className="h-4 w-4" /></button>
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
