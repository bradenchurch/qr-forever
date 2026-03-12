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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
          QR Forever is now live
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight">
          QR codes that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">never expire.</span>
          <span className="block mt-2 text-4xl md:text-5xl text-gray-500 font-bold">No subscription. No catches.</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
          Generate unlimited static QR codes for free. No branded links, no expiration dates, 
          no account required.
        </p>
        
        {/* Key Benefits */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <span className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 shadow-sm font-medium">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            100% Free
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 shadow-sm font-medium">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            No Account Required
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 shadow-sm font-medium">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Never Expire
          </span>
        </div>

        <button 
          onClick={handleGetStarted} 
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:scale-105 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)]"
        >
          Start Generating Free
          <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </section>

      {/* Features Overview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Everything you need. <span className="text-indigo-600">Nothing you don&apos;t.</span></h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Built for simplicity and longevity. Our QR codes are designed to just work, forever.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Generation</h3>
            <p className="text-gray-600 leading-relaxed">Create QR codes in seconds. No processing time, no delays, no fuss.</p>
          </div>

          {/* Card 2 */}
          <div className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-violet-50 rounded-2xl flex items-center justify-center flex-shrink-0 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Permanent Links</h3>
            <p className="text-gray-600 leading-relaxed">Your QR codes work forever. No expiration dates means no broken links.</p>
          </div>

          {/* Card 3 */}
          <div className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Free PNG Download</h3>
            <p className="text-gray-600 leading-relaxed">Download high-resolution, print-ready QR codes instantly at no cost.</p>
          </div>

          {/* Card 4 */}
          <div className="group bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">High Error Correction</h3>
            <p className="text-gray-600 leading-relaxed">Scan even with 30% damage. Built to last in any real-world condition.</p>
          </div>
        </div>
      </section>

      {/* Marketing Copy / Feature Descriptions */}
      <section className="relative z-10 bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Powerful features for every need.
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From simple URL QR codes to complex custom designs. QR Forever has the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">URL QR Codes</h3>
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">Free</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Generate QR codes for any website URL. Just paste your link and get an instant QR code that works forever.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">WiFi QR Codes</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Let guests connect to your WiFi instantly by scanning a QR code. No more typing complex passwords.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">vCard QR Codes</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Create digital business cards. Scan to instantly add contact info to phone contacts.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">Email QR Codes</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Start an email with pre-filled recipient, subject, and body. Perfect for contact pages.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">SMS QR Codes</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Pre-fill SMS messages with recipient and text. Great for marketing campaigns and promotions.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">Phone QR Codes</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">One-tap calling. Scan to instantly dial a phone number. Simple as that.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">Crypto QR Codes</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Accept cryptocurrency payments. Generate QR codes for Bitcoin, Ethereum, wallet addresses.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">Custom Colors</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Match your brand. Choose any color for your QR code while maintaining scannability.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">Custom Logos</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Add your logo to the center of QR codes. Perfect for business branding.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">Frame Templates</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Choose from professional QR code frames with built-in call-to-actions.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">Batch Generation</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Generate hundreds of QR codes at once. Upload a CSV and get them all.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-bold text-gray-900">Design Studio</h3>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full uppercase">Premium</span>
              </div>
              <p className="text-gray-600 leading-relaxed">Full control over QR code appearance. Adjust dots, corners, and more.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4 tracking-tight">
          Simple pricing. No subscriptions.
        </h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Start free, upgrade when you need more. Pay once, use forever.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-center">
          {/* Free */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold text-gray-900">$0</span>
              <span className="text-gray-500 font-medium">/ forever</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Unlimited QR codes
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                PNG download
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                QR code with watermark
              </li>
            </ul>
            <button onClick={handleGetStarted} className="w-full px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl font-bold transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Basic */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-indigo-600 relative z-10 transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-full tracking-wide shadow-md">
              POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold text-gray-900">$3</span>
              <span className="text-gray-500 font-medium">/ one-time</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-gray-900">1 clean download</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                No watermark
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                PNG & SVG export
              </li>
            </ul>
            <button onClick={handleGetPremium} className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200">
              Get Basic
            </button>
          </div>

          {/* Premium */}
          <div className="bg-gray-900 rounded-3xl p-8 shadow-xl relative text-white hover:shadow-2xl transition-shadow">
            <h3 className="text-2xl font-bold mb-2">Premium</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-5xl font-extrabold">$9</span>
              <span className="text-gray-400 font-medium">/ one-time</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium text-white">Unlimited downloads</span>
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Custom colors & logos
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Design studio
              </li>
            </ul>
            <button onClick={handleGetPremium} className="w-full px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 rounded-xl font-bold transition-colors">
              Get Premium
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="relative bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-center overflow-hidden shadow-2xl">
          {/* Decorative background blurs */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Ready to create QR codes<br className="hidden md:block" /> that last forever?
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of users generating free, permanent QR codes every day. No sign-up required.
            </p>
            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-indigo-900 transition-all duration-200 bg-white rounded-full hover:bg-indigo-50 hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Start Generating Free
              <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <AccountModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
