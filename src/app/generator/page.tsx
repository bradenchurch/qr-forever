"use client";

import { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import QRCodeStyling from 'qr-code-styling';
import { useAuth } from '@/contexts/AuthContext';
import AccountModal from '@/components/AccountModal';
import PremiumBadge from './PremiumBadge';
import PremiumOverlay from './PremiumOverlay';
import QRCodeForm from './QRCodeForm';
import { buildQrValue } from './utils';

const QR_TYPES = [
  { id: 'url', label: 'Website URL', isPremium: false },
  { id: 'vcard', label: 'vCard', isPremium: false },
  { id: 'wifi', label: 'Wi-Fi', isPremium: false },
  { id: 'email', label: 'Email', isPremium: false },
  { id: 'sms', label: 'SMS', isPremium: false },
  { id: 'phone', label: 'Phone', isPremium: false },
  { id: 'crypto', label: 'Crypto', isPremium: true },
];

function GeneratorContent() {
  const { isPremium } = useAuth();
  const searchParams = useSearchParams();
  const initialUrl = searchParams.get('url') || '';
  const [qrType, setQrType] = useState('url');
  const [formData, setFormData] = useState<Record<string, unknown>>({ url: initialUrl });
  const { isLoggedIn } = useAuth();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [qrValue, setQrValue] = useState(initialUrl);

  // Customization state
  const [fgColor, setFgColor] = useState('#000000');
  const [isGradient, setIsGradient] = useState(false);
  const [fgGradientEnd, setFgGradientEnd] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoUrl, setLogoUrl] = useState('');
  const [dotStyle, setDotStyle] = useState('square');
  const [markerStyle, setMarkerStyle] = useState('square');
  const [frame, setFrame] = useState('none');
  const [batchCsv, setBatchCsv] = useState<File | null>(null);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateQRCode = async () => {
    setError(null);

    const typeObj = QR_TYPES.find(t => t.id === qrType);
    if (typeObj?.isPremium && !isPremium) {
      setError('This is a Premium feature. Please upgrade to use it.');
      return;
    }

    const value = buildQrValue(qrType, formData);
    if (!value.trim()) {
      setError('Please fill in the required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok && !isPremium) {
        setError(data.error || 'Failed to generate QR code');
        setQrValue('');
      } else {
        setQrValue(value);
        setCanvasReady(false);
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = buildQrValue(qrType, formData);
    if (!value.trim()) return;

    if (!isLoggedIn) {
      setShowAccountModal(true);
      return;
    }

    await generateQRCode();
  };

  const handleModalSuccess = async () => {
    setShowAccountModal(false);
    await generateQRCode();
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      qrCodeRef.current = new QRCodeStyling({
        width: 220,
        height: 220,
        type: 'canvas',
        data: 'https://qrforever.com',
      });
    }
  }, []);

  useEffect(() => {
    if (!qrCodeRef.current || !qrRef.current) return;

    qrCodeRef.current.append(qrRef.current);
  }, [qrRef.current]);

  useEffect(() => {
    if (!qrCodeRef.current) return;

    const usePremium = isPremium;

    qrCodeRef.current.update({
      data: qrValue || 'https://qrforever.com',
      width: 220,
      height: 220,
      image: usePremium && logoUrl ? logoUrl : undefined,
      dotsOptions: {
        type: (usePremium ? dotStyle : 'square') as import('qr-code-styling').DotType,
        color: usePremium && !isGradient ? fgColor : undefined,
        gradient: usePremium && isGradient ? {
          type: 'linear',
          rotation: Math.PI / 4,
          colorStops: [
            { offset: 0, color: fgColor },
            { offset: 1, color: fgGradientEnd }
          ]
        } : undefined
      },
      backgroundOptions: {
        color: usePremium ? bgColor : '#ffffff',
      },
      cornersSquareOptions: {
        type: (usePremium ? markerStyle : 'square') as import('qr-code-styling').CornerSquareType,
        color: usePremium && !isGradient ? fgColor : undefined,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 5,
      }
    });

    if (qrValue) {
      setCanvasReady(true);
    }
  }, [qrValue, isPremium, fgColor, isGradient, fgGradientEnd, bgColor, logoUrl, dotStyle, markerStyle]);

  const handleDownload = async () => {
    if (!qrCodeRef.current) return;
    
    // We need to render it at high res for download
    const exportQr = new QRCodeStyling({
      width: 500,
      height: 500,
      type: 'canvas',
      data: qrValue || 'https://qrforever.com',
      image: isPremium && logoUrl ? logoUrl : undefined,
      dotsOptions: {
        type: (isPremium ? dotStyle : 'square') as import('qr-code-styling').DotType,
        color: isPremium && !isGradient ? fgColor : undefined,
        gradient: isPremium && isGradient ? {
          type: 'linear',
          rotation: Math.PI / 4,
          colorStops: [
            { offset: 0, color: fgColor },
            { offset: 1, color: fgGradientEnd }
          ]
        } : undefined
      },
      backgroundOptions: {
        color: isPremium ? bgColor : '#ffffff',
      },
      cornersSquareOptions: {
        type: (isPremium ? markerStyle : 'square') as import('qr-code-styling').CornerSquareType,
        color: isPremium && !isGradient ? fgColor : undefined,
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 10,
      }
    });

    try {
      const blob = await exportQr.getRawData('png');
      if (!blob) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const originalData = e.target?.result as string;

        // Create a new canvas with watermark
        const newCanvas = document.createElement('canvas');
        newCanvas.width = 500;
        newCanvas.height = 500;
        const newCtx = newCanvas.getContext('2d');
        if (!newCtx) return;

        // Draw original QR
        const img = new Image();
        img.onload = () => {
          newCtx.drawImage(img, 0, 0, 500, 500);

          if (!isPremium) {
            // Add watermark - semi-transparent white circle in center
            newCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            newCtx.beginPath();
            newCtx.arc(250, 250, 80, 0, 2 * Math.PI);
            newCtx.fill();

            // Border
            newCtx.strokeStyle = '#e5e7eb';
            newCtx.lineWidth = 3;
            newCtx.stroke();

            // Watermark text
            newCtx.fillStyle = '#6b7280';
            newCtx.font = 'bold 18px Arial, sans-serif';
            newCtx.textAlign = 'center';
            newCtx.fillText('qrforever', 250, 245);
            newCtx.font = 'bold 14px Arial, sans-serif';
            newCtx.fillText('.com', 250, 265);
          }

          // Download
          const link = document.createElement('a');
          link.download = 'qrcode.png';
          link.href = newCanvas.toDataURL('image/png');
          link.click();
        };
        img.src = originalData;
      };
      // If it's a Buffer in Node environment (shouldn't be on client but types say it could be)
      const dataBlob = blob instanceof Blob ? blob : new Blob([blob as BlobPart]);
      reader.readAsDataURL(dataBlob);
    } catch (e) {
      console.error('Download failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        
        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">QR Code Generator</h1>

            <div className="flex flex-wrap gap-2 mb-6">
              {QR_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setQrType(type.id)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors border flex items-center gap-1
                    ${qrType === type.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                    }
                  `}
                >
                  {type.label}
                  {type.isPremium && <PremiumBadge />}
                </button>
              ))}
            </div>

            <form onSubmit={handleGenerate} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <QRCodeForm type={qrType} data={formData} onChange={setFormData} />
              <button
                type="submit"
                className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </button>
            </form>

            <PremiumOverlay>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  Design Studio <PremiumBadge />
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Foreground Color</label>
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    id="isGradient"
                    checked={isGradient}
                    onChange={(e) => setIsGradient(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="isGradient" className="text-sm font-medium text-gray-700">Use Gradient for Foreground</label>
                </div>

                {isGradient && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gradient End Color</label>
                    <input
                      type="color"
                      value={fgGradientEnd}
                      onChange={(e) => setFgGradientEnd(e.target.value)}
                      className="w-full h-10 p-1 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dot Style</label>
                    <select
                      value={dotStyle}
                      onChange={(e) => setDotStyle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="square">Square</option>
                      <option value="dots">Dots</option>
                      <option value="rounded">Rounded</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marker Style</label>
                    <select
                      value={markerStyle}
                      onChange={(e) => setMarkerStyle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                      <option value="square">Square</option>
                      <option value="dot">Dot</option>
                      <option value="extra-rounded">Rounded</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Logo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setLogoUrl(URL.createObjectURL(e.target.files[0]));
                      } else {
                        setLogoUrl('');
                      }
                    }}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100 cursor-pointer mb-2"
                  />
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Or enter URL:</span>
                    <input
                      type="url"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frame Template</label>
                  <div className="flex flex-wrap gap-2">
                    {['none', 'scan-me', 'phone', 'simple', 'rounded', 'fancy'].map(f => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFrame(f)}
                        className={`px-3 py-1.5 rounded text-sm font-medium capitalize border ${
                          frame === f
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
                        }`}
                      >
                        {f.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </PremiumOverlay>

            <PremiumOverlay>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4 mt-6">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  Batch Generation <PremiumBadge />
                </h3>
                <p className="text-sm text-gray-600">Upload a CSV to generate multiple QR codes at once.</p>
                <div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setBatchCsv(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>
                {batchCsv && (
                  <button
                    type="button"
                    onClick={() => {
                      alert("Batch generation started! (Simulated download)");
                    }}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition"
                  >
                    Generate & Download All
                  </button>
                )}
              </div>
            </PremiumOverlay>

          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-center font-medium">
              {error}
            </div>
          )}
        </div>

        <div className="w-full md:w-80 flex flex-col items-center">
          <div className="sticky top-8 w-full flex flex-col items-center bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            {qrValue && !error ? (
              <>
                <div className="p-4 border-2 border-gray-100 rounded-2xl mb-6 bg-white shadow-inner">
                  <div className={`relative ${frame !== 'none' && isPremium ? 'p-4 flex flex-col items-center justify-center' : ''}
                    ${frame === 'scan-me' || frame === 'phone' ? 'border-[6px] rounded-xl border-gray-800' : ''}
                    ${frame === 'simple' ? 'border-4 border-gray-300' : ''}
                    ${frame === 'rounded' ? 'border-4 border-indigo-200 rounded-3xl' : ''}
                    ${frame === 'fancy' ? 'border-4 border-double border-pink-400 rounded-xl shadow-lg' : ''}
                  `}>
                    {(frame === 'scan-me' || frame === 'phone') && isPremium && (
                      <div className="absolute top-[-14px] bg-white px-2 font-black text-gray-800 uppercase tracking-widest text-sm">
                        {frame === 'scan-me' ? 'SCAN ME' : 'CALL US'}
                      </div>
                    )}
                    <div ref={qrRef} />
                  </div>
                </div>
                <button
                  onClick={handleDownload}
                  disabled={!canvasReady}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-md disabled:opacity-50"
                >
                  Download {isPremium ? 'Clean PNG' : 'PNG (watermarked)'}
                </button>
                {!isPremium && <p className="mt-3 text-xs text-gray-500 font-medium">Free downloads include watermark</p>}
              </>
            ) : (
              <div className="w-[220px] h-[220px] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 font-medium mb-6">
                Preview Area
              </div>
            )}
          </div>
        </div>
      </div>
      <AccountModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        onSuccess={handleModalSuccess}
        title="Sign in to generate"
        message="Create a free account to generate and save your QR codes."
      />
    </div>
  );
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <GeneratorContent />
    </Suspense>
  );
}
