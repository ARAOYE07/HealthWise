import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Activity, ShieldCheck, HeartPulse, Brain, Leaf, ArrowRight, UserCircle2 } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            Your Personal Wellness Guide
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
            Understand Your Health. <br className="hidden md:block" />
            Make Better Everyday Choices.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-500 mb-10 leading-relaxed">
            Provide information about your symptoms, lifestyle, habits, and wellness goals to receive personalized general health guidance and education.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Get Health Advice <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-24 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">Simple steps to get the wellness information you need.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: 'Tell us about yourself', icon: UserCircle2, desc: 'Share your basic profile securely.' },
              { title: "Describe how you're feeling", icon: Activity, desc: 'Input your symptoms or goals.' },
              { title: 'Receive guidance', icon: Brain, desc: 'Get personalized educational info.' },
              { title: 'Follow next steps', icon: ArrowRight, desc: 'Actionable healthy practices.' },
            ].map((step, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 mb-6">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                
                {/* Connector line for md+ */}
                {i !== 3 && (
                  <div className="hidden md:block absolute top-14 left-[60%] w-[80%] h-[2px] bg-gray-100 -z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                Comprehensive Wellness Support
              </h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                HealthWise offers a range of tools and educational resources designed to empower you on your health journey.
              </p>
              
              <ul className="space-y-6">
                {[
                  { title: 'Personalized Wellness Guidance', icon: ShieldCheck, desc: 'Information tailored to your specific inputs.' },
                  { title: 'Symptom Education', icon: HeartPulse, desc: 'Learn about possible associations with what you are experiencing.' },
                  { title: 'Healthy Habits', icon: Leaf, desc: 'Actionable tips to improve your daily routine.' },
                ].map((feature, i) => (
                  <li key={i} className="flex">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                        <feature.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">{feature.title}</h4>
                      <p className="mt-1 text-gray-500">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-sky-100 rounded-[2rem] transform rotate-3 scale-105 opacity-50"></div>
              <img 
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1000&auto=format&fit=crop" 
                alt="Wellness concept" 
                className="relative rounded-[2rem] shadow-xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section className="bg-emerald-900 py-16 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <ShieldCheck className="h-12 w-12 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">Important Safety Information</h2>
          <p className="text-emerald-100 text-lg leading-relaxed">
            HealthWise provides general health information and does not replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
        </div>
      </section>
    </div>
  );
};
