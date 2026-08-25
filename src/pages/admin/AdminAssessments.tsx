import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Filter, ShieldAlert, AlertTriangle, Info, CheckCircle2, MoreVertical, Eye } from 'lucide-react';

const MOCK_ASSESSMENTS = [
  { id: 'asm_9912', user: 'Alex Doe', category: 'General Search', concern: 'Mild headaches for two days...', safety: 'LOW', date: '2026-08-25 10:42', aiStatus: 'Completed' },
  { id: 'asm_9911', user: 'Sarah Jenkins', category: 'General Search', concern: 'Severe chest pain radiating to arm', safety: 'EMERGENCY', date: '2026-08-25 09:15', aiStatus: 'Flagged' },
  { id: 'asm_9910', user: 'Emma Wilson', category: 'General Search', concern: 'Feeling very fatigued and dizzy when standing up', safety: 'MODERATE', date: '2026-08-24 16:30', aiStatus: 'Completed' },
  { id: 'asm_9909', user: 'Michael Chen', category: 'General Search', concern: 'High fever 103F for 3 days', safety: 'URGENT', date: '2026-08-24 14:20', aiStatus: 'Completed' },
  { id: 'asm_9908', user: 'David Kim', category: 'General Search', concern: 'Tips for better sleep hygiene', safety: 'LOW', date: '2026-08-23 20:10', aiStatus: 'Completed' },
];

export const AdminAssessments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getSafetyBadge = (level: string) => {
    switch(level) {
      case 'EMERGENCY': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"><ShieldAlert className="w-3 h-3 mr-1" /> Emergency</span>;
      case 'URGENT': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800"><AlertTriangle className="w-3 h-3 mr-1" /> Urgent</span>;
      case 'MODERATE': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800"><Info className="w-3 h-3 mr-1" /> Moderate</span>;
      case 'LOW': default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Assessment Logs</h1>
          <p className="text-gray-500 text-sm">Monitor AI-generated health advice and system interactions.</p>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search queries, IDs, or users..." 
                className="pl-9 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" className="h-10 gap-2">
                <ShieldAlert className="h-4 w-4" /> Emergencies
              </Button>
              <Button variant="outline" className="h-10 gap-2">
                <Filter className="h-4 w-4" /> All Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 font-medium">ID & User</th>
                  <th className="px-6 py-4 font-medium max-w-[200px]">Concern (Truncated)</th>
                  <th className="px-6 py-4 font-medium">Safety Level</th>
                  <th className="px-6 py-4 font-medium">AI Status</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Review</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_ASSESSMENTS.map((asm) => (
                  <tr key={asm.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{asm.id}</div>
                      <div className="text-gray-500 text-xs">{asm.user}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="truncate max-w-[200px] text-gray-700" title={asm.concern}>"{asm.concern}"</div>
                    </td>
                    <td className="px-6 py-4">
                      {getSafetyBadge(asm.safety)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-medium ${asm.aiStatus === 'Flagged' ? 'text-red-600' : 'text-emerald-600'}`}>
                        {asm.aiStatus === 'Flagged' && <ShieldAlert className="h-3 w-3 mr-1" />}
                        {asm.aiStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{asm.date}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4 text-gray-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
             <span>Showing 1 to 5 of 24,192 assessments</span>
             <div className="flex gap-2">
               <Button variant="outline" size="sm" disabled>Previous</Button>
               <Button variant="outline" size="sm">Next</Button>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
