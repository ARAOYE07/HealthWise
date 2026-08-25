import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Search, Filter, MoreVertical, ShieldAlert, CheckCircle2, UserX } from 'lucide-react';

const MOCK_USERS = [
  { id: '1', name: 'Alex Doe', email: 'alex@example.com', role: 'user', status: 'active', joined: '2026-01-15', lastActive: '2 hrs ago' },
  { id: '2', name: 'Sarah Jenkins', email: 'sarah.j@healthwise.app', role: 'super_admin', status: 'active', joined: '2025-11-02', lastActive: '10 mins ago' },
  { id: '3', name: 'Michael Chen', email: 'mchen99@test.com', role: 'user', status: 'suspended', joined: '2026-03-22', lastActive: '5 days ago' },
  { id: '4', name: 'Emma Wilson', email: 'emma.w@gmail.com', role: 'user', status: 'active', joined: '2026-08-01', lastActive: 'Just now' },
  { id: '5', name: 'David Kim', email: 'dkim@healthwise.app', role: 'content_manager', status: 'active', joined: '2025-12-10', lastActive: '1 day ago' },
];

export const AdminUsers: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">User Management</h1>
          <p className="text-gray-500 text-sm">Manage accounts, roles, and platform access.</p>
        </div>
        <Button>Export Users</Button>
      </div>

      <Card>
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Search by name, email, or ID..." 
                className="pl-9 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" className="h-10 gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50/80">
                <tr>
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Joined</th>
                  <th className="px-6 py-4 font-medium hidden sm:table-cell">Last Active</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_USERS.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-600 font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-gray-500 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${
                        user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'content_manager' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.status === 'active' ? (
                          <>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></div>
                            <span className="text-gray-700 capitalize">{user.status}</span>
                          </>
                        ) : (
                          <>
                            <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                            <span className="text-red-700 font-medium capitalize">{user.status}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 hidden md:table-cell">{user.joined}</td>
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell">{user.lastActive}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
             <span>Showing 1 to 5 of 8,432 users</span>
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
