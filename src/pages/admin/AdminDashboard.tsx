import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Users, FileText, BrainCircuit, ShieldAlert, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const userGrowthData = [
  { name: 'Jan', users: 400 },
  { name: 'Feb', users: 600 },
  { name: 'Mar', users: 1100 },
  { name: 'Apr', users: 1500 },
  { name: 'May', users: 2200 },
  { name: 'Jun', users: 2800 },
];

const categoryData = [
  { name: 'Symptoms', count: 450 },
  { name: 'Nutrition', count: 320 },
  { name: 'Mental', count: 280 },
  { name: 'Sleep', count: 210 },
  { name: 'Fitness', count: 180 },
];

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Platform Overview</h1>
          <p className="text-gray-500 text-sm">Monitor HealthWise system performance and usage.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
          <span className="relative flex h-2.5 w-2.5 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          System Operational
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">8,432</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 font-medium">+12%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Assessments</p>
                <h3 className="text-2xl font-bold text-gray-900">24,192</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 font-medium">+18%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">AI Requests</p>
                <h3 className="text-2xl font-bold text-gray-900">45.2k</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <BrainCircuit className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-emerald-600 font-medium">+8%</span>
              <span className="text-gray-500 ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Flagged (Safety)</p>
                <h3 className="text-2xl font-bold text-gray-900">142</h3>
              </div>
              <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <span className="font-medium text-gray-700">0.58%</span>
              <span className="ml-2">of total assessments</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">User Growth (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={userGrowthData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-gray-800">Assessments by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} width={80} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table Stub */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg text-gray-800">Recent System Activity</CardTitle>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Action</th>
                  <th className="px-4 py-3">Admin</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { action: 'Updated Safety Rule', admin: 'Sarah Jenkins', resource: 'Emergency Keywords v2', time: '10 mins ago' },
                  { action: 'Suspended User', admin: 'Mike Ross', resource: 'usr_849201', time: '1 hour ago' },
                  { action: 'Published Tip', admin: 'Emily Chen', resource: 'Heart Health Basics', time: '3 hours ago' },
                  { action: 'System Backup', admin: 'System', resource: 'Database automated snapshot', time: '12 hours ago' },
                ].map((log, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{log.action}</td>
                    <td className="px-4 py-3 text-gray-600">{log.admin}</td>
                    <td className="px-4 py-3 text-gray-500">{log.resource}</td>
                    <td className="px-4 py-3 text-right text-gray-400">{log.time}</td>
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
