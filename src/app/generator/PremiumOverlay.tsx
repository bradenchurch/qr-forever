import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function PremiumOverlay({ children }: { children: React.ReactNode }) {
  const { isPremium } = useAuth();

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      <div className="opacity-50 pointer-events-none filter blur-[1px]">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm rounded-lg border border-yellow-200">
        <svg className="w-8 h-8 text-yellow-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <p className="font-bold text-gray-900 mb-2">Premium Feature</p>
        <Link href="/pricing" className="px-4 py-2 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full hover:bg-yellow-300">
          Upgrade Now
        </Link>
      </div>
    </div>
  );
}
