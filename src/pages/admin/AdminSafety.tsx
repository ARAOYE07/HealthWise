import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, AlertTriangle, ShieldCheck, Settings, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const safetyData = [
  { name: 'Low', count: 21000, fill: '#10b981' },
  { name: 'Moderate', count: 2800, fill: '#f59e0b' },
  { name: 'Urgent', count: 250, fill: '#f97316' },
  { name: 'Emergency', count: 142, fill: '#ef4444' },
];

export const AdminSafety: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Safety Monitoring</h1>
          <p className="text-gray-500 text-sm">Review safety classifications and manage global moderation rules.</p>
        </div>
        <Button variant="outline" className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50">
          <Settings className="h-4 w-4" /> Manage Safety Rules
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Assessment Safety Classifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safetyData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={48}>
                    {safetyData.map((entry, index) => (
                      <cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">Unresolved Emergencies</p>
                  <h3 className="text-3xl font-bold text-red-900">3</h3>
                  <p className="text-xs text-red-700 mt-2">Requires manual review</p>
                </div>
                <div className="p-3 bg-red-100 rounded-xl text-red-600">
                  <ShieldAlert className="h-6 w-6" />
                </div>
              </div>
              <Button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white border-none">Review Queue</Button>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-800 mb-1">AI Rule Compliance</p>
                  <h3 className="text-3xl font-bold text-emerald-900">99.9%</h3>
                  <p className="text-xs text-emerald-700 mt-2">Pass rate for disclaimers</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 pt-4">Recent Critical Flags</h2>
      <Card>
        <CardContent className="p-0">
           <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Trigger</th>
                  <th className="px-6 py-4 font-medium max-w-[200px]">Context</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-gray-500">10 mins ago</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Keyword: "chest pain"</span></td>
                  <td className="px-6 py-4 text-gray-700 truncate max-w-[200px]">"Severe chest pain radiating..."</td>
                  <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm">Review</Button></td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-gray-500">45 mins ago</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">Keyword: "suicidal"</span></td>
                  <td className="px-6 py-4 text-gray-700 truncate max-w-[200px]">"I am feeling completely hopeless..."</td>
                  <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm">Review</Button></td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 text-gray-500">2 hours ago</td>
                  <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Keyword: "104 fever"</span></td>
                  <td className="px-6 py-4 text-gray-700 truncate max-w-[200px]">"My child has a 104F fever..."</td>
                  <td className="px-6 py-4 text-right"><Button variant="ghost" size="sm">Review</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
