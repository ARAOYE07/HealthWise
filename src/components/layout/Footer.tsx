import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-xl font-semibold tracking-tight text-gray-900">HealthWise</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-500 leading-relaxed">
              Understand your health. Make better everyday choices with personalized wellness guidance.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Product</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-500">
              <li><Link to="/how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</Link></li>
              <li><Link to="/topics" className="hover:text-emerald-600 transition-colors">Health Topics</Link></li>
              <li><Link to="/about" className="hover:text-emerald-600 transition-colors">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-500">
              <li><Link to="/privacy" className="hover:text-emerald-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="hover:text-emerald-600 transition-colors">Medical Disclaimer</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Connect</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-500">
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 border-t border-gray-200 pt-8">
          <p className="text-xs text-gray-400 text-center">
            HealthWise provides general health information and does not replace professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <p className="mt-4 text-xs text-gray-400 text-center">
            &copy; {new Date().getFullYear()} HealthWise Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
