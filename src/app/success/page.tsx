"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { upgrade, isLoggedIn } = useAuth();
  const [upgraded, setUpgraded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const sessionId = searchParams.get('session_id');
    const plan = searchParams.get('plan');

    const handleSuccess = async () => {
      if (sessionId && plan && (plan === 'basic' || plan === 'premium')) {
        if (isLoggedIn) {
          // Upgrade the user locally
          upgrade(plan);
          if (isMounted) setUpgraded(true);
          // Clear query params to prevent re-triggering
          window.history.replaceState({}, document.title, '/success');
        } else {
          // If they somehow got here without being logged in
          if (isMounted) setError(true);
        }
      } else if (!upgraded) {
        // Missing parameters, redirect to pricing
        router.push('/pricing');
      }
    };

    handleSuccess();

    return () => {
      isMounted = false;
    };
  }, [searchParams, upgrade, isLoggedIn, router, upgraded]);

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          You appear to not be logged in. Please log in first to apply your purchase.
        </p>
        <Link href="/pricing" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
          Go back to Pricing
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 mx-auto">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
        Thank you for your purchase. Your account has been upgraded and you now have access to premium features.
      </p>
      <Link href="/generator" className="px-8 py-4 bg-indigo-600 text-white text-lg rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-xl">
        Go to QR Generator
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><p>Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
