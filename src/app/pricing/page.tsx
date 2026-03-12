"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AccountModal from '@/components/AccountModal';

export default function PricingPage() {
  const { user, isLoggedIn, isPremium, isBasic } = useAuth();
  const router = useRouter();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<'basic' | 'premium' | null>(null);

  const handleGetStarted = () => {
    if (!isLoggedIn) {
      setShowAccountModal(true);
    } else {
      router.push('/generator');
    }
  };

  const handleCheckout = async (plan: 'basic' | 'premium') => {
    if (!user?.email) return;
    try {
      setLoadingPlan(plan);
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to start checkout process. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleGetBasic = () => {
    if (!isLoggedIn) {
      setShowAccountModal(true);
    } else if (!isAlreadyBasic && !isAlreadyPremium) {
      handleCheckout('basic');
    }
  };

  const handleGetPremium = () => {
    if (!isLoggedIn) {
      setShowAccountModal(true);
    } else if (!isAlreadyPremium) {
      handleCheckout('premium');
    }
  };

  const handleModalSuccess = () => {
    setShowAccountModal(false);
    router.push('/generator');
  };

  const isAlreadyBasic = isBasic && !isPremium;
  const isAlreadyPremium = isPremium;

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Simple, transparent pricing.
          <span className="block text-indigo-600">No subscriptions. Ever.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Pay once, own it forever. Generate unlimited free QR codes or unlock 
          premium features with a one-time payment.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">$0</p>
            <p className="text-gray-500 mb-6">Forever free</p>
            <ul className="space-y-3 mb-8">
              {[
                'Unlimited QR code generation',
                'URL QR codes',
                'PNG download with watermark',
                'High error correction',
                'No account required',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleGetStarted} className="w-full px-6 py-3 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition">
              Get Started Free
            </button>
          </div>

          {/* Basic Plan */}
          <div className="bg-indigo-600 rounded-2xl shadow-xl p-8 relative transform scale-105">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-400 text-white text-sm font-bold rounded-full">
              BEST VALUE
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
            <p className="text-4xl font-bold text-white mb-2">$3</p>
            <p className="text-indigo-200 mb-6">One-time payment</p>
            <ul className="space-y-3 mb-8">
              {[
                'Everything in Free',
                '1 clean PNG download (no watermark)',
                'URL QR codes',
                'Perfect for simple use cases',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-indigo-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            {isAlreadyPremium ? (
              <button disabled className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-bold cursor-default">
                Already Premium
              </button>
            ) : isAlreadyBasic ? (
              <button disabled className="w-full px-6 py-3 bg-green-500 text-white rounded-lg font-bold cursor-default">
                Current Plan
              </button>
            ) : (
              <button onClick={handleGetBasic} disabled={loadingPlan === 'basic'} className="w-full px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition disabled:opacity-75 disabled:cursor-not-allowed">
                {loadingPlan === 'basic' ? 'Processing...' : 'Get Basic for $3'}
              </button>
            )}
          </div>

          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-900 text-yellow-100 text-sm font-bold rounded-full">
              ALL FEATURES
            </div>
            <h3 className="text-2xl font-bold text-yellow-900 mb-2">Premium</h3>
            <p className="text-4xl font-bold text-yellow-900 mb-2">$9</p>
            <p className="text-yellow-800 mb-6">One-time payment, yours forever</p>
            <ul className="space-y-3 mb-8">
              {[
                'Everything in Free & Basic',
                'Unlimited clean downloads',
                'All QR code types (WiFi, vCard, Email, SMS, Phone, Crypto)',
                'Custom colors & logos',
                'Custom QR frame templates',
                'Batch generation',
                'Vector export (SVG)',
                'QR code design studio',
                'Priority support',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-yellow-900 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-yellow-900 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            {isAlreadyPremium ? (
              <button disabled className="w-full px-6 py-3 bg-yellow-900 text-white rounded-lg font-bold cursor-default">
                Current Plan
              </button>
            ) : (
              <button onClick={handleGetPremium} disabled={loadingPlan === 'premium'} className="w-full px-6 py-3 bg-yellow-900 text-white rounded-lg font-bold hover:bg-yellow-800 transition disabled:opacity-75 disabled:cursor-not-allowed">
                {loadingPlan === 'premium' ? 'Processing...' : 'Get Premium for $9'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Compare features
        </h2>
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-gray-900 font-bold">Feature</th>
                <th className="px-6 py-4 text-center text-gray-900 font-bold">Free</th>
                <th className="px-6 py-4 text-center text-indigo-600 font-bold">Basic</th>
                <th className="px-6 py-4 text-center text-yellow-600 font-bold">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Unlimited QR code generation', free: true, basic: true, premium: true },
                { name: 'URL QR codes', free: true, basic: true, premium: true },
                { name: 'PNG download', free: 'Watermarked', basic: '1 clean', premium: 'Unlimited' },
                { name: 'SVG export', free: false, basic: false, premium: true },
                { name: 'WiFi QR codes', free: false, basic: false, premium: true },
                { name: 'vCard QR codes', free: false, basic: false, premium: true },
                { name: 'Email QR codes', free: false, basic: false, premium: true },
                { name: 'SMS QR codes', free: false, basic: false, premium: true },
                { name: 'Phone QR codes', free: false, basic: false, premium: true },
                { name: 'Crypto QR codes', free: false, basic: false, premium: true },
                { name: 'Custom colors', free: false, basic: false, premium: true },
                { name: 'Custom logos', free: false, basic: false, premium: true },
                { name: 'QR frame templates', free: false, basic: false, premium: true },
                { name: 'Batch generation', free: false, basic: false, premium: true },
                { name: 'Design studio', free: false, basic: false, premium: true },
                { name: 'Priority support', free: false, basic: false, premium: true },
              ].map((feature, idx) => (
                <tr key={feature.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-gray-700 text-sm">{feature.name}</td>
                  <td className="px-6 py-4 text-center">
                    {typeof feature.free === 'boolean' ? (
                      feature.free ? (
                        <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )
                    ) : (
                      <span className="text-xs text-gray-500">{feature.free}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof feature.basic === 'boolean' ? (
                      feature.basic ? (
                        <svg className="w-5 h-5 text-indigo-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )
                    ) : (
                      <span className="text-xs text-indigo-600 font-medium">{feature.basic}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof feature.premium === 'boolean' ? (
                      feature.premium ? (
                        <svg className="w-5 h-5 text-yellow-600 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )
                    ) : (
                      <span className="text-xs text-yellow-600 font-medium">{feature.premium}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Still have questions?
        </h2>
        <p className="text-gray-600 mb-8">
          Check out our <a href="/support" className="text-indigo-600 hover:underline">FAQ</a> or contact support.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button onClick={handleGetStarted} className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl">
            Start Generating Free
          </button>
          <button onClick={handleGetBasic} disabled={loadingPlan === 'basic'} className="px-8 py-4 bg-indigo-100 text-indigo-700 text-lg rounded-xl font-bold hover:bg-indigo-200 transition shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed">
            {loadingPlan === 'basic' ? 'Processing...' : 'Get Basic for $3'}
          </button>
          <button onClick={handleGetPremium} disabled={loadingPlan === 'premium'} className="px-8 py-4 bg-yellow-400 text-yellow-900 text-lg rounded-xl font-bold hover:bg-yellow-300 transition shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed">
            {loadingPlan === 'premium' ? 'Processing...' : 'Get Premium for $9'}
          </button>
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
