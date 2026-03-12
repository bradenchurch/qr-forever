"use client";

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PaywallGuardProps {
  children: React.ReactNode;
  showBlur?: boolean;
}

export default function PaywallGuard({ children, showBlur = true }: PaywallGuardProps) {
  const { isPremium } = useAuth();
  const router = useRouter();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {showBlur && (
        <div className="relative">
          {/* Blurred content */}
          <div className="blur-md select-none pointer-events-none opacity-50">
            {children}
          </div>
          
          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md mx-4 text-center border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Premium Feature
              </h3>
              <p className="text-gray-600 mb-6">
                Upgrade to Premium to download your QR code and unlock all features.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Upgrade Now - $9
                </button>
                
                <button
                  onClick={() => {
                    // For free users, show a limited version - just the basic URL QR
                    // The blur stays but they can see the preview
                  }}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Continue Free (Preview Only)
                </button>
              </div>
              
              <p className="mt-4 text-xs text-gray-500">
                One-time payment. No subscription. Ever.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {!showBlur && (
        <>
          {children}
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">Premium required</p>
              <Link 
                href="/pricing"
                className="text-indigo-600 hover:underline text-sm"
              >
                Upgrade to unlock
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Compact version for inline use
export function PaywallBadge({ onClick }: { onClick?: () => void }) {
  const { isPremium } = useAuth();
  
  if (isPremium) return null;
  
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 hover:from-yellow-500 hover:to-orange-600 transition"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      PREMIUM
    </button>
  );
}
