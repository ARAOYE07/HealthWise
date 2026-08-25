import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BadgeCheck, Flag, MessageSquare, AlertCircle } from 'lucide-react';

export const AdminAIReview: React.FC = () => {
  const [activeReview, setActiveReview] = useState(true);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">AI Advice Review</h1>
          <p className="text-gray-500 text-sm">Audit AI-generated advice for clinical safety and accuracy.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-lg">
           <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-white shadow-sm text-gray-900">Queue (12)</button>
           <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900">Reviewed</button>
        </div>
      </div>

      {activeReview ? (
        <Card className="border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review ID: REV-8842-A</span>
              <h2 className="text-lg font-medium text-gray-900 mt-1">Assessment asm_9909</h2>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                Safety: URGENT
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            {/* User Input Side */}
            <div className="p-6 space-y-6 bg-white">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">User Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Age:</span> <span className="font-medium">34</span></div>
                  <div className="flex justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Gender:</span> <span className="font-medium">Male</span></div>
                  <div className="flex justify-between py-1 border-b border-gray-50"><span className="text-gray-500">Conditions:</span> <span className="font-medium">None</span></div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">User Query</h3>
                <div className="bg-gray-50 p-4 rounded-xl text-gray-900 italic border border-gray-100">
                  "I've had a high fever (103F) for 3 days now. Tylenol brings it down a little bit but it goes right back up. I have a bad cough too."
                </div>
              </div>
            </div>

            {/* AI Output Side */}
            <div className="p-6 space-y-6 bg-gray-50/50">
               <div>
                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-3 flex items-center">
                   <MessageSquare className="w-4 h-4 mr-2" /> Generated AI Response
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-bold text-gray-800 mb-1">Summary:</p>
                    <p className="text-gray-700 text-sm">You are experiencing a persistent high fever and cough that is not fully responding to over-the-counter medication.</p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
                    <div className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-red-900 mb-1">Safety Warning (Triggered):</p>
                        <p className="text-red-800 text-sm">A fever of 103°F lasting for 3 days, especially combined with a cough, requires medical evaluation. Seek medical attention promptly.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-bold text-gray-800 mb-1">Recommendations:</p>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      <li>Contact a healthcare provider or visit urgent care today.</li>
                      <li>Stay hydrated by drinking plenty of fluids.</li>
                      <li>Continue taking fever reducers exactly as directed until you see a doctor.</li>
                      <li>Monitor for difficulty breathing or chest pain.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 border-t border-gray-200 p-4 px-6 flex justify-between items-center">
            <Button variant="outline" className="text-gray-600 border-gray-300">Skip for now</Button>
            <div className="flex gap-3">
               <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50 gap-2">
                 <Flag className="w-4 h-4" /> Flag as Unsafe
               </Button>
               <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                 <BadgeCheck className="w-4 h-4" /> Approve Advice
               </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="text-center py-20">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
            <BadgeCheck className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Review Queue Empty</h3>
          <p className="text-gray-500 mt-1">All AI generated advice has been reviewed.</p>
        </div>
      )}
    </div>
  );
};
