"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authClient } from '@/lib/client-auth';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { upgrade, isLoggedIn } = useAuth();
  const [upgraded, setUpgraded] = useState(false);
  const [error, setError] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    let isMounted = true;
    const sessionId = searchParams.get('session_id');
    const plan = searchParams.get('plan');

    const handleSuccess = async () => {
      if (magicLinkSent) return;

      if (sessionId && plan && (plan === 'basic' || plan === 'premium')) {
        try {
          if (!isLoggedIn) {
            const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
            const data = await res.json();

            if (data.email) {
              setEmail(data.email);
              await authClient.signIn.magicLink({
                email: data.email,
                callbackURL: '/generator'
              });
              if (isMounted) setMagicLinkSent(true);
              return;
            } else {
               throw new Error("No email found in session");
            }
          }

          // Upgrade the user locally
          upgrade(plan as 'basic' | 'premium');
          if (isMounted) setUpgraded(true);
          // Clear query params to prevent re-triggering
          window.history.replaceState({}, document.title, '/success');
        } catch (err) {
          console.error(err);
          if (isMounted) setError(true);
        }
      } else if (!upgraded && !magicLinkSent) {
        // Missing parameters, redirect to pricing
        router.push('/pricing');
      }
    };

    handleSuccess();

    return () => {
      isMounted = false;
    };
  }, [searchParams, upgrade, isLoggedIn, router, upgraded, magicLinkSent]);

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
          We couldn&apos;t automatically create your account. Please log in first to apply your purchase, or contact support if the issue persists.
        </p>
        <Link href="/pricing" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
          Go back to Pricing
        </Link>
      </div>
    );
  }

  if (magicLinkSent) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-6 mx-auto">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Check Your Email</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          We&apos;ve sent a magic link to <strong>{email}</strong> to securely complete your account setup and access your premium features.
        </p>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          You can safely close this window and click the link in your email to continue.
        </p>
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
