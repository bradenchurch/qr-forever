"use client";

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import QRCodeStyling from 'qr-code-styling';

function DashboardQRPreview({ qr, isPremium }: { qr: any; isPremium: boolean }) {
  const qrRef = useRef<HTMLDivElement>(null);
  const styling = JSON.parse(qr.styling || '{}');

  useEffect(() => {
    if (!qrRef.current) return;
    qrRef.current.innerHTML = '';

    const qrCode = new QRCodeStyling({
      width: 160,
      height: 160,
      type: 'svg',
      data: qr.content,
      image: isPremium && styling.logoUrl ? styling.logoUrl : undefined,
      dotsOptions: {
        type: (isPremium ? styling.dotStyle : 'square') as any,
        color: isPremium && !styling.isGradient ? styling.fgColor : undefined,
        gradient: isPremium && styling.isGradient ? {
          type: 'linear',
          rotation: (styling.fgGradientRotation * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: styling.fgColor },
            { offset: 1, color: styling.fgGradientEnd }
          ]
        } : undefined
      },
      backgroundOptions: {
        color: isPremium ? styling.bgColor : '#ffffff',
      },
      cornersSquareOptions: {
        type: (isPremium ? styling.markerStyle : 'square') as any,
        color: isPremium && !styling.isGradient ? styling.fgColor : undefined,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
        imageSize: styling.logoSize || 0.4,
      }
    });

    qrCode.append(qrRef.current);
  }, [qr.content, isPremium, styling.logoUrl, styling.dotStyle, styling.isGradient, styling.fgColor, styling.fgGradientRotation, styling.fgGradientEnd, styling.bgColor, styling.markerStyle, styling.logoSize]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div ref={qrRef} style={{ pointerEvents: 'none' }} className="flex items-center justify-center scale-90 transform origin-center" />
    </div>
  );
}

export default function DashboardPage() {
  const { isLoggedIn, isPremium } = useAuth();
  const router = useRouter();
  const [qrs, setQrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and Sort states
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
      return;
    }

    const fetchQrs = async () => {
      try {
        const response = await fetch('/api/qr');
        if (!response.ok) throw new Error('Failed to fetch QR codes');
        const data = await response.json();
        setQrs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQrs();
  }, [isLoggedIn, router]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this QR code?')) return;

    try {
      const response = await fetch(`/api/qr/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setQrs(qrs.filter(qr => qr.id !== id));
      } else {
        alert('Failed to delete QR code');
      }
    } catch (err) {
      alert('An error occurred while deleting');
    }
  };

  const handleDownload = async (qr: { styling: string; content: string; name: string }) => {
    const styling = JSON.parse(qr.styling);
    const downloadFormat = 'png';

    const exportQr = new QRCodeStyling({
      width: 1000,
      height: 1000,
      type: 'canvas',
      data: qr.content,
      image: isPremium && styling.logoUrl ? styling.logoUrl : undefined,
      dotsOptions: {
        type: (isPremium ? styling.dotStyle : 'square') as any,
        color: isPremium && !styling.isGradient ? styling.fgColor : undefined,
        gradient: isPremium && styling.isGradient ? {
          type: 'linear',
          rotation: (styling.fgGradientRotation * Math.PI) / 180,
          colorStops: [
            { offset: 0, color: styling.fgColor },
            { offset: 1, color: styling.fgGradientEnd }
          ]
        } : undefined
      },
      backgroundOptions: {
        color: isPremium ? styling.bgColor : '#ffffff',
      },
      cornersSquareOptions: {
        type: (isPremium ? styling.markerStyle : 'square') as any,
        color: isPremium && !styling.isGradient ? styling.fgColor : undefined,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 20,
        imageSize: styling.logoSize,
      }
    });

    try {
      const blob = await exportQr.getRawData(downloadFormat);
      if (!blob) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const originalData = e.target?.result as string;
        const newCanvas = document.createElement('canvas');
        newCanvas.width = 1000;
        newCanvas.height = 1000;
        const newCtx = newCanvas.getContext('2d');
        if (!newCtx) return;

        const img = new Image();
        img.onload = () => {
          // Add Frame if selected and premium
          if (isPremium && styling.frame !== 'none') {
            newCtx.strokeStyle = '#1f2937';
            if (styling.frame === 'scan-me' || styling.frame === 'phone') {
              newCtx.lineWidth = 24;
              newCtx.strokeRect(50, 50, 900, 900);
              newCtx.fillStyle = 'white';
              newCtx.fillRect(350, 35, 300, 60);
              newCtx.fillStyle = '#1f2937';
              newCtx.font = 'black 40px Arial, sans-serif';
              newCtx.textAlign = 'center';
              newCtx.fillText(styling.frame === 'scan-me' ? 'SCAN ME' : 'CALL US', 500, 80);
            } else if (styling.frame === 'simple') {
              newCtx.lineWidth = 16;
              newCtx.strokeStyle = '#d1d5db';
              newCtx.strokeRect(20, 20, 960, 960);
            } else if (styling.frame === 'rounded') {
              newCtx.lineWidth = 20;
              newCtx.strokeStyle = '#c7d2fe';
              newCtx.beginPath();
              newCtx.roundRect(20, 20, 960, 960, 120);
              newCtx.stroke();
            } else if (styling.frame === 'fancy') {
              newCtx.lineWidth = 20;
              newCtx.strokeStyle = '#f472b6';
              newCtx.setLineDash([40, 20]);
              newCtx.strokeRect(30, 30, 940, 940);
              newCtx.setLineDash([]);
            }
          }

          newCtx.drawImage(img, isPremium && styling.frame !== 'none' ? 100 : 0, isPremium && styling.frame !== 'none' ? 100 : 0, isPremium && styling.frame !== 'none' ? 800 : 1000, isPremium && styling.frame !== 'none' ? 800 : 1000);

          if (!isPremium) {
            newCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            newCtx.beginPath();
            newCtx.arc(500, 500, 160, 0, 2 * Math.PI);
            newCtx.fill();
            newCtx.strokeStyle = '#e5e7eb';
            newCtx.lineWidth = 6;
            newCtx.stroke();
            newCtx.fillStyle = '#6b7280';
            newCtx.font = 'bold 36px Arial, sans-serif';
            newCtx.textAlign = 'center';
            newCtx.fillText('qrforever', 500, 490);
            newCtx.font = 'bold 28px Arial, sans-serif';
            newCtx.fillText('.com', 500, 530);
          }

          const link = document.createElement('a');
          link.download = `${qr.name.replace(/\s+/g, '_')}.png`;
          link.href = newCanvas.toDataURL('image/png', 0.9);
          link.click();
        };
        img.src = originalData;
      };
      const dataBlob = blob instanceof Blob ? blob : new Blob([blob as BlobPart]);
      reader.readAsDataURL(dataBlob);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  const handleCopyLink = (content: string) => {
    navigator.clipboard.writeText(content);
    alert('QR content copied to clipboard!');
  };

  const filteredAndSortedQrs = qrs
    .filter((qr: { type: string }) => filterType === 'all' || qr.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const qrTypes = Array.from(new Set(qrs.map((qr: { type: string }) => qr.type)));

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My QR Codes</h1>
            <p className="text-gray-600 mt-1">Manage and track your generated QR codes</p>
          </div>
          <Link
            href="/generator"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New QR
          </Link>
        </div>

        {qrs.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Filter by:</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All Types</option>
                {qrTypes.map(type => (
                  <option key={type} value={type}>{type.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
            <div className="ml-auto text-sm text-gray-400 font-medium">
              {filteredAndSortedQrs.length} {filteredAndSortedQrs.length === 1 ? 'QR code' : 'QR codes'}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            {error}
          </div>
        ) : qrs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No QR codes yet</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              You haven't generated any QR codes yet. Start now and they will appear here.
            </p>
            <Link
              href="/generator"
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition inline-block"
            >
              Generate your first QR
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {filteredAndSortedQrs.map((qr) => {
               return (
                 <div key={qr.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                   <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center justify-center aspect-square relative group">
                     <DashboardQRPreview qr={qr} isPremium={isPremium} />
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center justify-between mb-1">
                       <h3 className="font-bold text-gray-900 truncate pr-2" title={qr.name}>{qr.name}</h3>
                       <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                         {qr.type}
                       </span>
                     </div>
                     <p className="text-xs text-gray-400 mb-4">
                       Created {new Date(qr.createdAt).toLocaleDateString()}
                     </p>
                   </div>
                   <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => handleDownload(qr)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => router.push(`/generator?id=${qr.id}`)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleCopyLink(qr.content)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Copy
                      </button>
                      <button
                        onClick={() => handleDelete(qr.id)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                   </div>
                 </div>
               );
             })}
          </div>
        )}
      </div>
    </div>
  );
}
