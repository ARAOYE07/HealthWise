import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, LayoutDashboard, Stethoscope, Lightbulb, Clock, User as UserIcon, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export const DashboardLayout: React.FC = () => {
  const { user, isLoading, signOut } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><Activity className="h-8 w-8 text-emerald-500 animate-pulse" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Health Advice', href: '/assessment', icon: Stethoscope },
    { name: 'Health Tips', href: '/tips', icon: Lightbulb },
    { name: 'My History', href: '/history', icon: Clock },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex h-16 shrink-0 items-center px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Activity className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900">HealthWise</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-100 p-4">
          <button
            onClick={() => signOut()}
            className="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 pb-12">
        {/* Mobile header area could go here, but for now we'll just have the content */}
        <div className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between sticky top-0 z-10">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-600" />
            <span className="text-lg font-semibold text-gray-900">HealthWise</span>
          </Link>
          <Link to="/profile" className="p-2 text-gray-500 hover:text-emerald-600">
            <UserIcon className="h-6 w-6" />
          </Link>
        </div>
        
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navigation.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex flex-col items-center justify-center w-full h-full space-y-1',
                  isActive ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-900'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
