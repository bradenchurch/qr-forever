"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import AccountModal from '@/components/AccountModal';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  
  const [showAccountModal, setShowAccountModal] = useState(false);

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      setShowAccountModal(true);
    } else {
      router.push('/generator');
    }
  };

  const handleGetPremium = () => {
    if (!isLoggedIn) {
      setShowAccountModal(true);
    } else {
      router.push('/pricing');
    }
  };

  const handleModalSuccess = () => {
    setShowAccountModal(false);
    router.push('/generator');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          QR codes that never expire.
          <span className="block text-indigo-600">No subscription. No catches.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Generate unlimited static QR codes for free. No branded links, no expiration dates, 
          no account required.
        </p>
        
        {/* Key Benefits */}
        <div className="flex items-center justify-center gap-8 mb-10">
          <span className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            100% Free
          </span>
          <span className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            No Account Required
          </span>
          <span className="flex items-center gap-2 text-gray-600">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Never Expire
          </span>
        </div>

        <button 
          onClick={handleGetStarted} 
          className="px-8 py-4 bg-indigo-600 text-lg text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
        >
          Start Generating Free
        </button>
      </section>

      {/* Features Overview */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why QR Forever?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Instant Generation</h3>
                <p className="text-sm text-gray-600">Create QR codes in seconds. No processing time, no delays.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Permanent Links</h3>
                <p className="text-sm text-gray-600">Your QR codes work forever. No expiration means no broken links.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Free PNG Download</h3>
                <p className="text-sm text-gray-600">Download high-resolution QR codes instantly at no cost.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">High Error Correction</h3>
                <p className="text-sm text-gray-600">Scan even with 30% damage. Built to last in any condition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Simple pricing. No subscriptions.
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Start free, upgrade when you need more.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-3xl font-bold text-gray-900 mb-4">$0</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited QR codes
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                PNG download
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                QR code with watermark
              </li>
            </ul>
            <button onClick={handleGetStarted} className="w-full px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition">
              Get Started
            </button>
          </div>

          {/* Basic */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
              POPULAR
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
            <p className="text-3xl font-bold text-gray-900 mb-4">$3</p>
            <p className="text-xs text-gray-500 mb-4">One-time payment</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                1 clean download
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No watermark
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                PNG & SVG export
              </li>
            </ul>
            <button onClick={handleGetPremium} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
              Get Basic for $3
            </button>
          </div>

          {/* Premium */}
          <div className="bg-indigo-600 rounded-2xl shadow-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
              BEST VALUE
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
            <p className="text-3xl font-bold text-white mb-4">$9</p>
            <p className="text-xs text-indigo-200 mb-4">One-time payment</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-white">
                <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unlimited downloads
              </li>
              <li className="flex items-center gap-2 text-sm text-white">
                <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Custom colors & logos
              </li>
              <li className="flex items-center gap-2 text-sm text-white">
                <svg className="w-4 h-4 text-yellow-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Design studio
              </li>
            </ul>
            <button onClick={handleGetPremium} className="w-full px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg font-bold hover:bg-yellow-300 transition">
              Get Premium for $9
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to create QR codes that last forever?
        </h2>
        <p className="text-gray-600 mb-8">
          Join thousands of users generating free QR codes every day.
        </p>
        <button onClick={handleGetStarted} className="px-8 py-4 bg-indigo-600 text-lg text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl">
          Start Generating Free
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2026 QR Forever. Built for longevity.</p>
        </div>
      </footer>

      <AccountModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
