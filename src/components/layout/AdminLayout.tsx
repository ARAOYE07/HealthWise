import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, LayoutDashboard, Users, FileText, ShieldAlert, BrainCircuit, Library, Lightbulb, MessageSquare, BarChart, Settings, LogOut, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

export const AdminLayout: React.FC = () => {
  const { user, profile, isLoading, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Activity className="h-8 w-8 text-emerald-500 animate-pulse" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Basic frontend role check. True security must be in backend RLS.
  const isAdmin = profile?.role && ['admin', 'super_admin', 'content_manager', 'moderator'].includes(profile.role);
  
  if (!isAdmin && !import.meta.env.VITE_SUPABASE_URL) {
      // Allow mock environment bypass for demo
  } else if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Assessments', href: '/admin/assessments', icon: FileText },
    { name: 'AI Advice Review', href: '/admin/ai-review', icon: BrainCircuit },
    { name: 'Safety Monitoring', href: '/admin/safety', icon: ShieldAlert },
    { name: 'Health Topics', href: '/admin/topics', icon: Library },
    { name: 'Health Tips', href: '/admin/tips', icon: Lightbulb },
    { name: 'Feedback', href: '/admin/feedback', icon: MessageSquare },
    { name: 'Reports', href: '/admin/reports', icon: BarChart },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-[#0B1120] text-gray-300 md:flex">
        <div className="flex h-16 shrink-0 items-center px-6 bg-[#0f172a]">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">Admin Panel</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (location.pathname.startsWith(`${item.href}/`) && item.href !== '/admin');
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400' 
                    : 'hover:bg-gray-800 hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-gray-400'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-800 p-4 bg-[#0f172a]">
          <div className="flex items-center mb-4 px-3">
             <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
               <span className="text-xs text-white">{profile?.full_name?.charAt(0) || 'A'}</span>
             </div>
             <div>
               <p className="text-sm font-medium text-white truncate max-w-[120px]">{profile?.full_name || 'Admin User'}</p>
               <p className="text-xs text-gray-400 capitalize">{profile?.role || 'Super Admin'}</p>
             </div>
          </div>
          <button
            onClick={() => signOut()}
            className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-gray-800 hover:text-white transition-colors text-gray-400"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <div className="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 justify-between sticky top-0 z-10 shrink-0">
           <div className="flex items-center">
             <button className="md:hidden mr-4 text-gray-500" onClick={() => setIsMobileMenuOpen(true)}>
               <Menu className="h-6 w-6" />
             </button>
             <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">
               HealthWise Administration
             </h1>
           </div>
           <div className="flex items-center gap-4">
             <Link to="/" target="_blank" className="text-sm text-gray-500 hover:text-emerald-600 font-medium">View App &rarr;</Link>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8 w-full bg-gray-50/50">
          <Outlet />
        </div>
      </main>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
           <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
           <div className="relative flex w-full max-w-xs flex-1 flex-col bg-[#0B1120] text-gray-300">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                <div className="flex shrink-0 items-center px-4 mb-6">
                  <Activity className="h-8 w-8 text-emerald-400 mr-2" />
                  <span className="text-xl font-semibold tracking-tight text-white">Admin Panel</span>
                </div>
                <nav className="space-y-1 px-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'group flex items-center rounded-xl px-3 py-2.5 text-base font-medium transition-colors',
                        (location.pathname === item.href || (location.pathname.startsWith(`${item.href}/`) && item.href !== '/admin'))
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <item.icon className="mr-4 h-6 w-6 flex-shrink-0" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
