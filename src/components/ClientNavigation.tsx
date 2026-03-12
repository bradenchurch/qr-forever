"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import AccountModal from "@/components/AccountModal";

export default function ClientNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isPremium, user, signOut } = useAuth();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Pages that trigger account modal on CTA click
  const ctaTriggerPages = ['/', '/features', '/about', '/support'];

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
    } else if (!isPremium) {
      router.push('/pricing');
    }
  };

  const handleModalSuccess = () => {
    setShowAccountModal(false);
    router.push('/generator');
  };

  return (
    <>
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">QR Forever</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/features" className={`font-medium transition ${pathname === '/features' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Features</Link>
          <Link href="/pricing" className={`font-medium transition ${pathname === '/pricing' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Pricing</Link>
          <Link href="/about" className={`font-medium transition ${pathname === '/about' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>About</Link>
          <Link href="/support" className={`font-medium transition ${pathname === '/support' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}>Support</Link>
          
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/generator" 
                className={`px-4 py-2 rounded-lg font-medium transition ${pathname === '/generator' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                My QR Codes
              </Link>
              {isPremium && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900">
                  PRO
                </span>
              )}
              <button 
                onClick={signOut}
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGetStarted}
                className="px-4 py-2 text-gray-600 font-medium hover:text-indigo-600 transition"
              >
                Sign In
              </button>
              <button 
                onClick={handleGetPremium}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Go Premium
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {showMobileMenu ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col gap-4">
            <Link href="/features" className="text-gray-600 font-medium" onClick={() => setShowMobileMenu(false)}>Features</Link>
            <Link href="/pricing" className="text-gray-600 font-medium" onClick={() => setShowMobileMenu(false)}>Pricing</Link>
            <Link href="/about" className="text-gray-600 font-medium" onClick={() => setShowMobileMenu(false)}>About</Link>
            <Link href="/support" className="text-gray-600 font-medium" onClick={() => setShowMobileMenu(false)}>Support</Link>
            <hr className="border-gray-200" />
            {isLoggedIn ? (
              <>
                <Link href="/generator" className="text-gray-600 font-medium" onClick={() => setShowMobileMenu(false)}>My QR Codes</Link>
                <button onClick={signOut} className="text-left text-gray-500">Sign out</button>
              </>
            ) : (
              <button 
                onClick={handleGetStarted}
                className="text-left text-indigo-600 font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      <AccountModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}
